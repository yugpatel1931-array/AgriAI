"""
Final evaluation on the held-out TEST set only.

The test split is reconstructed deterministically (same seed, same
data_dir) rather than stored, so this must be run against the same
--data_dir used for training. It was never seen during training or
model selection.

Usage:
    python -m src.evaluate --checkpoint outputs/best_model.pt --data_dir data/raw
"""
import argparse
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import torch
from sklearn.metrics import (
    classification_report, confusion_matrix, accuracy_score,
    precision_recall_fscore_support, f1_score,
)
from torch.utils.data import DataLoader

from . import config
from .dataset import build_splits, LeafDataset
from .model import build_model
from .utils import get_eval_transforms, load_checkpoint, save_json


@torch.no_grad()
def predict_all(model, loader, device):
    model.eval()
    all_preds, all_labels, all_confs = [], [], []
    for images, labels in loader:
        images = images.to(device)
        outputs = model(images)
        probs = torch.softmax(outputs, dim=1)
        confs, preds = probs.max(dim=1)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.numpy())
        all_confs.extend(confs.cpu().numpy())
    return np.array(all_labels), np.array(all_preds), np.array(all_confs)


def plot_confusion_matrix(cm, class_names, out_path):
    fig_size = max(6, 0.5 * len(class_names))
    fig, ax = plt.subplots(figsize=(fig_size, fig_size))
    im = ax.imshow(cm, cmap="Blues")
    ax.set_xticks(range(len(class_names)))
    ax.set_yticks(range(len(class_names)))
    ax.set_xticklabels(class_names, rotation=90, fontsize=7)
    ax.set_yticklabels(class_names, fontsize=7)
    ax.set_xlabel("Predicted")
    ax.set_ylabel("True")
    ax.set_title("Confusion Matrix (Test Set)")
    fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    thresh = cm.max() / 2.0 if cm.max() > 0 else 1
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            if cm[i, j] > 0:
                ax.text(j, i, str(cm[i, j]), ha="center", va="center",
                        fontsize=6, color="white" if cm[i, j] > thresh else "black")
    fig.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint", required=True)
    parser.add_argument("--data_dir", default=config.DEFAULT_DATA_DIR)
    parser.add_argument("--output_dir", default=config.DEFAULT_OUTPUT_DIR)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--split_mode", default="auto", choices=["auto", "presplit", "flat"],
                         help="Must match what was used for --data_dir at training time.")
    args = parser.parse_args()

    ckpt = load_checkpoint(args.checkpoint)
    class_names = ckpt["class_names"]
    arch = ckpt["arch"]
    image_size = ckpt["image_size"]

    device = config.DEVICE
    model = build_model(arch, len(class_names), pretrained=False).to(device)
    model.load_state_dict(ckpt["model_state_dict"])

    # Rebuild the exact same splits used at training time (same seed/data_dir/split_mode).
    _, _, _, test_split = build_splits(args.data_dir, split_mode=args.split_mode)
    test_ds = LeafDataset(test_split, transform=get_eval_transforms(image_size))
    test_loader = DataLoader(test_ds, batch_size=args.batch_size, shuffle=False)

    y_true, y_pred, confs = predict_all(model, test_loader, device)

    acc = accuracy_score(y_true, y_pred)
    macro_f1 = f1_score(y_true, y_pred, average="macro", zero_division=0)
    weighted_f1 = f1_score(y_true, y_pred, average="weighted", zero_division=0)
    precision, recall, f1, support = precision_recall_fscore_support(
        y_true, y_pred, average=None, labels=range(len(class_names)), zero_division=0
    )
    report_txt = classification_report(y_true, y_pred, labels=sorted(set(y_true)),
target_names=[class_names[i] for i in sorted(set(y_true))], zero_division=0)
    cm = confusion_matrix(y_true, y_pred, labels=range(len(class_names)))

    print("=" * 70)
    print(f"TEST SET RESULTS  (arch={arch}, n={len(y_true)})")
    print("=" * 70)
    print(f"Accuracy:      {acc:.4f}")
    print(f"Macro-F1:      {macro_f1:.4f}   <-- primary hackathon metric")
    print(f"Weighted-F1:   {weighted_f1:.4f}")
    print(f"Mean confidence on predictions: {confs.mean():.4f}")
    print("-" * 70)
    print(report_txt)

    per_class = sorted(
        zip(class_names, precision, recall, f1, support), key=lambda x: x[3]
    )
    print("-" * 70)
    print("Weakest classes by F1 (top 5) — investigate these first:")
    for cls, p, r, f, s in per_class[:5]:
        print(f"  {cls:30s} precision={p:.3f} recall={r:.3f} f1={f:.3f} n={s}")

    os.makedirs(args.output_dir, exist_ok=True)
    cm_path = os.path.join(args.output_dir, "confusion_matrix.png")
    plot_confusion_matrix(cm, class_names, cm_path)

    results = {
        "arch": arch,
        "test_accuracy": acc,
        "test_macro_f1": macro_f1,
        "test_weighted_f1": weighted_f1,
        "per_class": [
            {"class": c, "precision": float(p), "recall": float(r), "f1": float(f), "support": int(s)}
            for c, p, r, f, s in zip(class_names, precision, recall, f1, support)
        ],
        "confusion_matrix": cm.tolist(),
        "class_names": class_names,
    }
    save_json(os.path.join(args.output_dir, "test_evaluation.json"), results)
    print(f"\nSaved confusion matrix -> {cm_path}")
    print(f"Saved full metrics -> {os.path.join(args.output_dir, 'test_evaluation.json')}")


if __name__ == "__main__":
    main()
