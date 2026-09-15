"""
Run this file directly (Run button in your IDE, or `python run_inspect_data.py`)
instead of using the command line. Just edit the settings below.
"""
import sys
import runpy

# ============================ EDIT THESE ============================
DATA_DIR = "data/raw"
CHECK_DUPLICATES = True       # set False to skip (faster on huge datasets)
# ======================================================================

sys.argv = ["data_inspect.py", "--data_dir", DATA_DIR]
if not CHECK_DUPLICATES:
    sys.argv.append("--no_duplicate_check")

runpy.run_module("src.data_inspect", run_name="__main__")
