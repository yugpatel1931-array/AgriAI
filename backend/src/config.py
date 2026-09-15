"""
Central configuration for AgriSmart AI.

Everything here has a sensible default so the pipeline runs with zero
manual tuning. All values can still be overridden via CLI flags in
train.py / evaluate.py / infer.py.
"""
import os
import torch


def get_device() -> torch.device:
    """Auto-detect the best available compute device."""
    if torch.cuda.is_available():
        return torch.device("cuda")
    if getattr(torch.backends, "mps", None) is not None and torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


DEVICE = get_device()
IS_GPU = DEVICE.type in ("cuda", "mps")

# ---- Image / model ----
IMAGE_SIZE = 224              # matches ImageNet-pretrained backbones
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

# ---- Data split ----
VAL_FRACTION = 0.15
TEST_FRACTION = 0.15
SEED = 42

# ---- Training defaults (auto-scaled by hardware in train.py) ----
DEFAULT_BATCH_SIZE_GPU = 64    # T4/P100 on Kaggle handle this fine for B0/MobileNet at 224px; effnet+AMP
DEFAULT_BATCH_SIZE_CPU = 16
DEFAULT_EPOCHS = 40
EARLY_STOP_PATIENCE = 7
LR = 3e-4
WEIGHT_DECAY = 1e-4
LABEL_SMOOTHING = 0.05
WARMUP_EPOCHS = 2

# ---- Perf knobs (safe to leave on; auto-disabled where unsupported) ----
USE_CHANNELS_LAST = True   # NHWC memory format — free speedup for conv nets on Tensor Core GPUs
USE_TORCH_COMPILE = True   # torch.compile() when available; silently skipped if it fails

# ---- Paths ----
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DATA_DIR = os.path.join(PROJECT_ROOT, "data", "raw")
DEFAULT_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "outputs")

VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"}
