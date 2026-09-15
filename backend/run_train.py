"""
Run training by editing the variables below and pressing Run — no
terminal, no command-line arguments, no path-quoting issues.

Usage:
    1. Set DATA_DIR to your dataset folder below (plain Python string,
       no quoting tricks needed even with spaces or parentheses).
    2. Adjust the other settings if you want.
    3. Run this file directly (Run button in VS Code, or `python run_train.py`
       from the project root — the plain filename works fine, no -m needed).
"""
import os

# ---------------------------------------------------------------------
# EDIT THESE
# ---------------------------------------------------------------------

# Just a normal Python string. Raw string (r"...") is safest on Windows
# so backslashes are never misread — spaces and parentheses are fine as-is.
if os.path.exists("/kaggle/input/datasets/yugpatel3011/finaldataset2/Dataset"):
    DATA_DIR = "/kaggle/input/datasets/yugpatel3011/finaldataset2/Dataset"
else:
    DATA_DIR = r"/kaggle/input/datasets/yugpatel3011/dataset12/dataset_split1"

OUTPUT_DIR = None          # None = use the project's default outputs/ folder
ARCH = "efficientnet_b0"   # one model, OR set COMPARE below to try several
COMPARE = None             # e.g. ["efficientnet_b0", "resnet50", "mobilenet_v3_large"]
EPOCHS = 40
BATCH_SIZE = None          # None = auto-pick based on CPU/GPU
LR = 3e-4
PATIENCE = 7
NUM_WORKERS = min(4, os.cpu_count() or 1)
SEED = 42
SPLIT_MODE = "auto"        # "auto", "presplit", or "flat"

# ---------------------------------------------------------------------
# Nothing below this line needs editing
# ---------------------------------------------------------------------

import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src import config
from src.dataset import build_splits  # noqa: F401  (import kept for early failure on bad DATA_DIR)
from src.train import train_one_arch
from src.utils import seed_everything, save_json
import torch


def main():
    if not os.path.exists(DATA_DIR):
        raise FileNotFoundError(
            f"DATA_DIR does not exist:\n    {DATA_DIR}\n"
            "Double check the folder path above — copy it straight from File "
            "Explorer's address bar."
        )

    output_dir = OUTPUT_DIR or config.DEFAULT_OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)

    seed_everything(SEED)
    batch_size = BATCH_SIZE or (config.DEFAULT_BATCH_SIZE_GPU if config.IS_GPU else config.DEFAULT_BATCH_SIZE_CPU)

    print(f"Device: {config.DEVICE} | Batch size: {batch_size} | Epoch budget: {EPOCHS} "
          f"(early stop patience {PATIENCE})")

    archs_to_run = COMPARE if COMPARE else [ARCH]
    results = []
    for arch in archs_to_run:
        ckpt_path, best_f1, splits, class_names = train_one_arch(
            arch, DATA_DIR, output_dir, EPOCHS, batch_size,
            NUM_WORKERS, LR, PATIENCE, split_mode=SPLIT_MODE
        )
        results.append({"arch": arch, "checkpoint": ckpt_path, "val_macro_f1": best_f1})

    results.sort(key=lambda r: r["val_macro_f1"], reverse=True)
    print(f"\n{'=' * 70}\nModel comparison (selected on VALIDATION Macro-F1 only):")
    for r in results:
        print(f"  {r['arch']:20s}  val_macro_f1={r['val_macro_f1']:.4f}  ckpt={r['checkpoint']}")

    best = results[0]
    final_path = os.path.join(output_dir, "best_model.pt")
    payload = torch.load(best["checkpoint"], map_location="cpu")
    torch.save(payload, final_path)
    save_json(os.path.join(output_dir, "model_selection.json"), {"results": results, "selected": best})
    print(f"\nSelected best model: {best['arch']} -> saved as {final_path}")
    print("Run evaluate.py against the held-out test set next.")


if __name__ == "__main__":
    main()
