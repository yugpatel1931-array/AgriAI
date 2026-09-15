"""
Run this file directly (Run button in your IDE, or `python run_predict.py`)
instead of using the command line. Just edit the settings below.

IMPORTANT: run it with this file's own folder (the one containing `src/`)
as the working directory — that's the default when you hit Run in
VS Code / PyCharm, so normally you don't need to do anything extra.
"""
import sys
import runpy

# ============================ EDIT THESE ============================
IMAGE_PATH = r"/kaggle/input/datasets/yugpatel3011/finaltest/Apple_scab.jpeg"                     # <- your leaf photo
CHECKPOINT_PATH = "outputs/best_model.pt"           # <- trained model from run_train.py

TOPK = 3                     # how many candidate classes to show

# Explainability options — leave both False for a plain prediction.
USE_GRADCAM = True          # heatmap for the top prediction
GRADCAM_OUT = "outputs/gradcam_result.png"
TARGET_CLASS = None          # e.g. "Tomato_Late_Blight" to explain a specific class instead

USE_GRADCAM_TOPK = False     # one heatmap per top-K candidate, side by side
GRADCAM_TOPK_DIR = "outputs/gradcam_topk"

# Treatment feedback loop — log this prediction so you can record the real
# outcome later with run_feedback.py.
LOG_FEEDBACK = False

# Plain-language explanation for the farmer (English/Hindi/Gujarati).
EXPLAIN = True
LANGUAGE = "en"          # "en" | "hi" | "gu"
# ======================================================================

argv = ["infer.py", "--image", IMAGE_PATH, "--checkpoint", CHECKPOINT_PATH, "--topk", str(TOPK)]

if USE_GRADCAM_TOPK:
    argv += ["--gradcam_topk", str(TOPK), "--gradcam_topk_dir", GRADCAM_TOPK_DIR]
elif USE_GRADCAM:
    argv += ["--gradcam", "--gradcam_out", GRADCAM_OUT]
    if TARGET_CLASS:
        argv += ["--target_class", TARGET_CLASS]

if LOG_FEEDBACK:
    argv.append("--log_feedback")

if EXPLAIN:
    argv += ["--explain", "--language", LANGUAGE]

sys.argv = argv
runpy.run_module("src.infer", run_name="__main__")
