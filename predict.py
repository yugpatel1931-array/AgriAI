"""
Top-level predict interface required by Section 4.1 of the challenge brief:

    "Expose a predict(image_path) -> class_label function (Python) OR a
    documented CLI (python predict.py --image path) that prints the
    predicted class. It must load your trained weights and run on a single
    new image with no manual steps."

Usage
-----
CLI (from the repo root):
    python predict.py --image path/to/leaf.jpg

Python:
    from predict import predict
    label = predict("path/to/leaf.jpg")

Implementation note
--------------------
This is a thin wrapper, not a reimplementation: it loads the trained
checkpoint at backend/outputs/best_model.pt through backend/src/infer.py's
LeafPredictor (the same code the Flask API uses at
backend/api_server.py's /api/analyze). See model/README.md for why the
model code itself lives under backend/src instead of being duplicated here.
"""
import argparse
import os
import sys

_REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.join(_REPO_ROOT, "backend")
if _BACKEND_DIR not in sys.path:
    sys.path.insert(0, _BACKEND_DIR)

DEFAULT_CHECKPOINT = os.path.join(_BACKEND_DIR, "outputs", "best_model.pt")

_predictor = None


def _get_predictor(checkpoint_path: str = DEFAULT_CHECKPOINT):
    global _predictor
    if _predictor is None or getattr(_predictor, "_checkpoint_path", None) != checkpoint_path:
        from src.infer import LeafPredictor
        _predictor = LeafPredictor(checkpoint_path)
        _predictor._checkpoint_path = checkpoint_path
    return _predictor


def predict(image_path: str, checkpoint_path: str = DEFAULT_CHECKPOINT) -> str:
    """Loads the trained model (cached after the first call) and returns
    the predicted class label for a single leaf/crop image."""
    predictor = _get_predictor(checkpoint_path)
    return predictor.predict(image_path)["predicted_class"]


def main():
    parser = argparse.ArgumentParser(description="AgriSmart AI — core task predict interface")
    parser.add_argument("--image", required=True, help="Path to a leaf/crop image")
    parser.add_argument("--checkpoint", default=DEFAULT_CHECKPOINT, help="Path to a trained .pt checkpoint")
    args = parser.parse_args()
    print(predict(args.image, args.checkpoint))


if __name__ == "__main__":
    main()
