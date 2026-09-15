"""
Kaggle entry point. Edit DATA_DIR below, then in a Kaggle notebook cell run:

    !python kaggle_train.py

(after uploading/unzipping this project into /kaggle/working/ — see the
notebook cell instructions provided alongside this file).

Kaggle specifics handled here:
  - Your dataset lives under /kaggle/input/<dataset-name>/... which is
    READ-ONLY. DATA_DIR must point inside it, but never as OUTPUT_DIR.
  - All outputs (checkpoints, logs, best_model.pt) are written to
    /kaggle/working/outputs, the only writable location whose contents
    Kaggle keeps after the session ends.
  - GPU is used automatically if you turned on an accelerator
    (Notebook settings -> Accelerator -> GPU) before running this.
"""
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------------
# EDIT THESE
# ---------------------------------------------------------------------

# Point this at the folder INSIDE /kaggle/input/... that actually
# contains your class folders (or train/val/test folders). Find the
# exact path by running, in a notebook cell:  !ls /kaggle/input
DATA_DIR = "/kaggle/input/datasets/yugpatel3011/finaldataset2/Dataset"

ARCH = "efficientnet_b0"
COMPARE = None              # e.g. ["efficientnet_b0", "resnet50", "mobilenet_v3_large"]
                             # NOTE: comparing archs multiplies training time — leave as None
                             # (single arch) unless you actually need the comparison, for speed.
EPOCHS = 45
BATCH_SIZE = None           # None = auto-pick: 64 on GPU, 16 on CPU (src/config.py)
LR = 3e-4
PATIENCE = 8
NUM_WORKERS = 4             # Kaggle notebooks give 4 CPU cores; use them all for data loading
SEED = 42
SPLIT_MODE = "auto"

# Always under /kaggle/working -- the only writable, persisted location.
OUTPUT_DIR = "/kaggle/working/outputs"

# ---------------------------------------------------------------------
# Nothing below this line needs editing
# ---------------------------------------------------------------------

from src import config
from src.train import train_one_arch
from src.utils import seed_everything, save_json
import torch


def main():
    if not os.path.exists(DATA_DIR):
        raise FileNotFoundError(
            f"DATA_DIR does not exist:\n    {DATA_DIR}\n\n"
            "Run `!ls /kaggle/input` in a notebook cell to see the exact "
            "dataset folder name Kaggle mounted it under, then run "
            "`!find /kaggle/input/<that-name> -maxdepth 3` to see the "
            "internal folder layout and update DATA_DIR to match."
        )
    if DATA_DIR.startswith("/kaggle/input"):
        print("[kaggle_train] Reading data from read-only /kaggle/input — OK, no writes go there.")

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    seed_everything(SEED)
    batch_size = BATCH_SIZE or (config.DEFAULT_BATCH_SIZE_GPU if config.IS_GPU else config.DEFAULT_BATCH_SIZE_CPU)

    print(f"Device: {config.DEVICE} | Batch size: {batch_size} | Epoch budget: {EPOCHS} "
          f"(early stop patience {PATIENCE})")
    if not config.IS_GPU:
        print("[kaggle_train] WARNING: no GPU detected. In the Kaggle notebook side panel, "
              "set Accelerator -> GPU T4 x2 (or similar) and restart the session for a "
              "much faster run.")

    archs_to_run = COMPARE if COMPARE else [ARCH]
    results = []
    for arch in archs_to_run:
        ckpt_path, best_f1, splits, class_names = train_one_arch(
            arch, DATA_DIR, OUTPUT_DIR, EPOCHS, batch_size,
            NUM_WORKERS, LR, PATIENCE, split_mode=SPLIT_MODE
        )
        results.append({"arch": arch, "checkpoint": ckpt_path, "val_macro_f1": best_f1})

    results.sort(key=lambda r: r["val_macro_f1"], reverse=True)
    print(f"\n{'=' * 70}\nModel comparison (selected on VALIDATION Macro-F1 only):")
    for r in results:
        print(f"  {r['arch']:20s}  val_macro_f1={r['val_macro_f1']:.4f}  ckpt={r['checkpoint']}")

    best = results[0]
    final_path = os.path.join(OUTPUT_DIR, "best_model.pt")
    payload = torch.load(best["checkpoint"], map_location="cpu")
    torch.save(payload, final_path)
    save_json(os.path.join(OUTPUT_DIR, "model_selection.json"), {"results": results, "selected": best})
    print(f"\nSelected best model: {best['arch']} -> saved as {final_path}")

    # Bundle everything into one zip under /kaggle/working so there's a single
    # downloadable output file (Output tab -> Download, after Save Version/commit),
    # in addition to the individual files already in OUTPUT_DIR.
    zip_base = "/kaggle/working/agrismart_outputs"
    zip_path = shutil.make_archive(zip_base, "zip", OUTPUT_DIR)
    print(f"Zipped all outputs -> {zip_path}")
    print(f"Everything under {OUTPUT_DIR} (and the zip above) will persist when you "
          "Save Version / commit this Kaggle notebook — download from the Output tab.")


if __name__ == "__main__":
    main()
