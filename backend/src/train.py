"""
End-to-end training pipeline.

Single model:
    python -m src.train --data_dir data/raw --epochs 40

Compare multiple architectures and auto-pick the best by validation
Macro-F1 (test set is never touched here):
    python -m src.train --data_dir data/raw --compare efficientnet_b0 resnet50 mobilenet_v3_large

Everything (batch size, epochs budget, device, mixed precision) auto-
adapts to whatever hardware is available. You do not need to configure
anything to get a reasonable run.
"""
import argparse
import os
import time

import numpy as np
import torch
import torch.nn as nn
from sklearn.metrics import f1_score, accuracy_score
from torch.utils.data import DataLoader, WeightedRandomSampler

from . import config
from .dataset import build_splits, LeafDataset
from .model import build_model, SUPPORTED_ARCHS
from .utils import (
    seed_everything, get_train_transforms, get_eval_transforms,
    compute_class_weights, save_checkpoint, save_json,
)


def make_loaders(data_dir, image_size, batch_size, num_workers, split_mode="auto"):
    class_names, train_split, val_split, test_split = build_splits(data_dir, split_mode=split_mode)

    train_ds = LeafDataset(train_split, transform=get_train_transforms(image_size))
    val_ds = LeafDataset(val_split, transform=get_eval_transforms(image_size))

    # persistent_workers + prefetch_factor keep worker processes warm between epochs
    # and pipeline batch prep ahead of the GPU — meaningful wall-clock win when the
    # GPU step is fast (small models like these) and data loading would otherwise stall it.
    loader_kwargs = dict(num_workers=num_workers, pin_memory=config.IS_GPU)
    if num_workers > 0:
        loader_kwargs.update(persistent_workers=True, prefetch_factor=4)

    # Imbalance handling: use a tempered class-balanced sampler.
    # A full inverse-frequency sampler would repeat tiny classes hundreds of
    # times (your smallest class can be only a few dozen images), which can
    # overfit. Power=0.75 strongly reduces the Tomato bias while keeping
    # oversampling of very small classes bounded.
    counts = np.bincount(train_split.labels, minlength=len(class_names)).astype(np.float64)
    safe_counts = np.maximum(counts, 1.0)
    BALANCE_POWER = 0.75
    MAX_OVERSAMPLE = 30.0
    median_count = np.median(safe_counts[safe_counts > 0])
    class_sample_weights = (median_count / safe_counts) ** BALANCE_POWER
    class_sample_weights = np.clip(class_sample_weights, 1.0 / MAX_OVERSAMPLE, MAX_OVERSAMPLE)
    sample_weights = torch.as_tensor(
        [class_sample_weights[label] for label in train_split.labels], dtype=torch.double
    )
    sampler = WeightedRandomSampler(
        weights=sample_weights,
        num_samples=len(sample_weights),
        replacement=True,
    )

    train_loader = DataLoader(train_ds, batch_size=batch_size, sampler=sampler,
                               drop_last=True, **loader_kwargs)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False,
                             **loader_kwargs)

    # Do not apply another large inverse-frequency multiplier in the loss.
    # The sampler already corrects the class distribution; adding strong loss
    # weights on top of it can make the rarest classes dominate the gradients.
    # Keep equal loss weights so the sampler is the single balancing mechanism.
    class_weights = torch.ones(len(class_names), dtype=torch.float32)
    print("[dataset] Training class counts:")
    for i, name in enumerate(class_names):
        print(f"  {name:35s} {int(counts[i]):6d}")
    if counts.max() > 0 and counts.min() > 0:
        print(f"[dataset] Raw train imbalance ratio: {counts.max() / counts.min():.2f}x")
    print(f"[dataset] Enabled tempered balanced sampling (power={BALANCE_POWER}, cap={MAX_OVERSAMPLE}x) with uniform loss weights.")
    return class_names, train_loader, val_loader, class_weights, (train_split, val_split, test_split)


def run_epoch(model, loader, criterion, optimizer, device, scaler, train: bool):
    model.train() if train else model.eval()
    total_loss, all_preds, all_labels = 0.0, [], []

    torch.set_grad_enabled(train)
    channels_last = config.IS_GPU and config.USE_CHANNELS_LAST and device.type == "cuda"
    for images, labels in loader:
        images = images.to(device, non_blocking=True)
        if channels_last:
            images = images.to(memory_format=torch.channels_last)
        labels = labels.to(device, non_blocking=True)

        if train:
            optimizer.zero_grad(set_to_none=True)

        if scaler is not None:
            with torch.autocast(device_type="cuda", dtype=torch.float16):
                outputs = model(images)
                loss = criterion(outputs, labels)
            if train:
                scaler.scale(loss).backward()
                scaler.step(optimizer)
                scaler.update()
        else:
            outputs = model(images)
            loss = criterion(outputs, labels)
            if train:
                loss.backward()
                optimizer.step()

        total_loss += loss.item() * images.size(0)
        preds = outputs.argmax(dim=1).detach().cpu().numpy()
        all_preds.extend(preds)
        all_labels.extend(labels.detach().cpu().numpy())

    torch.set_grad_enabled(True)
    avg_loss = total_loss / len(loader.dataset)
    acc = accuracy_score(all_labels, all_preds)
    macro_f1 = f1_score(all_labels, all_preds, average="macro", zero_division=0)
    return avg_loss, acc, macro_f1


def train_one_arch(arch, data_dir, output_dir, epochs, batch_size, num_workers, lr, patience, split_mode="auto"):
    device = config.DEVICE
    print(f"\n{'=' * 70}\nTraining arch: {arch}  |  device: {device}\n{'=' * 70}")

    class_names, train_loader, val_loader, class_weights, splits = make_loaders(
        data_dir, config.IMAGE_SIZE, batch_size, num_workers, split_mode=split_mode
    )
    num_classes = len(class_names)

    model = build_model(arch, num_classes, pretrained=True).to(device)
    if device.type == "cuda" and config.USE_CHANNELS_LAST:
        model = model.to(memory_format=torch.channels_last)
    if device.type == "cuda" and config.USE_TORCH_COMPILE:
        try:
            model = torch.compile(model)
            print(f"[{arch}] torch.compile enabled.")
        except Exception as e:
            print(f"[{arch}] torch.compile unavailable ({e}); continuing without it.")

    criterion = nn.CrossEntropyLoss(weight=class_weights.to(device), label_smoothing=config.LABEL_SMOOTHING)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=config.WEIGHT_DECAY)

    def lr_lambda(epoch):
        if epoch < config.WARMUP_EPOCHS:
            return (epoch + 1) / config.WARMUP_EPOCHS
        progress = (epoch - config.WARMUP_EPOCHS) / max(1, epochs - config.WARMUP_EPOCHS)
        return 0.5 * (1 + np.cos(np.pi * progress))

    scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda=lr_lambda)
    scaler = torch.cuda.amp.GradScaler() if device.type == "cuda" else None

    best_macro_f1 = -1.0
    epochs_no_improve = 0
    ckpt_path = os.path.join(output_dir, f"best_{arch}.pt")
    history = []

    for epoch in range(epochs):
        t0 = time.time()
        train_loss, train_acc, train_f1 = run_epoch(model, train_loader, criterion, optimizer, device, scaler, train=True)
        val_loss, val_acc, val_f1 = run_epoch(model, val_loader, criterion, optimizer, device, scaler, train=False)
        scheduler.step()
        dt = time.time() - t0

        print(f"[{arch}] epoch {epoch + 1:03d}/{epochs} | "
              f"train_loss {train_loss:.4f} acc {train_acc:.4f} f1 {train_f1:.4f} | "
              f"val_loss {val_loss:.4f} acc {val_acc:.4f} macro_f1 {val_f1:.4f} | {dt:.1f}s")

        history.append({"epoch": epoch + 1, "train_loss": train_loss, "train_acc": train_acc,
                         "train_macro_f1": train_f1, "val_loss": val_loss, "val_acc": val_acc,
                         "val_macro_f1": val_f1})

        if val_f1 > best_macro_f1:
            best_macro_f1 = val_f1
            epochs_no_improve = 0
            # Unwrap torch.compile's OptimizedModule so the saved state_dict has plain
            # layer names and loads cleanly in evaluate.py/infer.py without compile.
            save_model = getattr(model, "_orig_mod", model)
            save_checkpoint(ckpt_path, save_model, class_names, config.IMAGE_SIZE, arch,
                             extra={"val_macro_f1": val_f1, "val_acc": val_acc, "epoch": epoch + 1})
        else:
            epochs_no_improve += 1
            if epochs_no_improve >= patience:
                print(f"[{arch}] Early stopping at epoch {epoch + 1} "
                      f"(no val Macro-F1 improvement for {patience} epochs).")
                break

    save_json(os.path.join(output_dir, f"history_{arch}.json"), {"history": history, "best_val_macro_f1": best_macro_f1})
    return ckpt_path, best_macro_f1, splits, class_names


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", default=config.DEFAULT_DATA_DIR)
    parser.add_argument("--output_dir", default=config.DEFAULT_OUTPUT_DIR)
    parser.add_argument("--arch", default="efficientnet_b0", choices=SUPPORTED_ARCHS)
    parser.add_argument("--compare", nargs="+", choices=SUPPORTED_ARCHS, default=None,
                         help="Train several architectures and keep the best by val Macro-F1.")
    parser.add_argument("--epochs", type=int, default=config.DEFAULT_EPOCHS)
    parser.add_argument("--batch_size", type=int, default=None)
    parser.add_argument("--lr", type=float, default=config.LR)
    parser.add_argument("--patience", type=int, default=config.EARLY_STOP_PATIENCE)
    parser.add_argument("--num_workers", type=int, default=min(4, os.cpu_count() or 1))
    parser.add_argument("--seed", type=int, default=config.SEED)
    parser.add_argument("--split_mode", default="auto", choices=["auto", "presplit", "flat"],
                         help="'auto' detects an existing train/val/test layout under --data_dir "
                              "and uses it as-is; 'flat' forces a class-per-folder re-split.")
    args = parser.parse_args()

    if not os.path.exists(args.data_dir):
        parser.error(
            f"--data_dir does not exist: {args.data_dir!r}\n"
            "If the path has spaces or parentheses, wrap it in quotes on the command line, e.g.\n"
            '  --data_dir "C:\\Users\\me\\Downloads\\archive (1)\\image data"'
        )

    seed_everything(args.seed)
    os.makedirs(args.output_dir, exist_ok=True)

    batch_size = args.batch_size or (config.DEFAULT_BATCH_SIZE_GPU if config.IS_GPU else config.DEFAULT_BATCH_SIZE_CPU)
    print(f"Device: {config.DEVICE} | Batch size: {batch_size} | Epoch budget: {args.epochs} "
          f"(early stop patience {args.patience})")

    archs_to_run = args.compare if args.compare else [args.arch]
    results = []
    for arch in archs_to_run:
        ckpt_path, best_f1, splits, class_names = train_one_arch(
            arch, args.data_dir, args.output_dir, args.epochs, batch_size,
            args.num_workers, args.lr, args.patience, split_mode=args.split_mode
        )
        results.append({"arch": arch, "checkpoint": ckpt_path, "val_macro_f1": best_f1})

    results.sort(key=lambda r: r["val_macro_f1"], reverse=True)
    print(f"\n{'=' * 70}\nModel comparison (selected on VALIDATION Macro-F1 only):")
    for r in results:
        print(f"  {r['arch']:20s}  val_macro_f1={r['val_macro_f1']:.4f}  ckpt={r['checkpoint']}")

    best = results[0]
    final_path = os.path.join(args.output_dir, "best_model.pt")
    payload = torch.load(best["checkpoint"], map_location="cpu")
    torch.save(payload, final_path)
    save_json(os.path.join(args.output_dir, "model_selection.json"), {"results": results, "selected": best})
    print(f"\nSelected best model: {best['arch']} -> saved as {final_path}")
    print("Run evaluate.py against the held-out test set next.")


if __name__ == "__main__":
    main()
