"""
Run this file directly (Run button in your IDE, or `python run_evaluate.py`)
instead of using the command line. Just edit the settings below.
"""
import sys
import runpy

# ============================ EDIT THESE ============================
CHECKPOINT_PATH = "outputs/best_model.pt"
DATA_DIR = r"/kaggle/input/datasets/yugpatel3011/dataset12/dataset_split1"
OUTPUT_DIR = "outputs"
BATCH_SIZE = 32
SPLIT_MODE = "presplit"           # "auto" | "presplit" | "flat"
# ======================================================================

sys.argv = [
    "evaluate.py",
    "--checkpoint", CHECKPOINT_PATH,
    "--data_dir", DATA_DIR,
    "--output_dir", OUTPUT_DIR,
    "--batch_size", str(BATCH_SIZE),
    "--split_mode", SPLIT_MODE,
]
runpy.run_module("src.evaluate", run_name="__main__")
