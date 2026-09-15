# /model

Required entry point per Section 7.1 ("`/model` — training/inference code
and the required predict interface from Section 4.1").

## Where the code actually lives, and why

The training/inference implementation is in **`backend/src/`**, not
duplicated here — it's shared with the Flask API (`backend/api_server.py`)
that serves the frontend, and shares its config/env/dependencies with
`backend/requirements.txt`. Splitting or duplicating it would risk the two
copies drifting apart. This folder is the documented pointer the
submission contract asks for:

| What | File |
| --- | --- |
| Model architecture (EfficientNet-B0 + classifier head) | [`backend/src/model.py`](../backend/src/model.py) |
| Training loop | [`backend/src/train.py`](../backend/src/train.py) |
| Evaluation (macro-F1, confusion matrix) | [`backend/src/evaluate.py`](../backend/src/evaluate.py) |
| Inference (`LeafPredictor`, used by both the API and `predict.py`) | [`backend/src/infer.py`](../backend/src/infer.py) |
| Explainability (Grad-CAM) | [`backend/src/gradcam.py`](../backend/src/gradcam.py) |
| **Required predict interface (Section 4.1)** | [`/predict.py`](../predict.py) at the repo root |

## Trained weights

`backend/outputs/best_model.pt` — checked into this repo directly (small
enough not to need a release/link, per Section 7.1's "weights via
release/link if large" allowance). `backend/outputs/` also has the
confusion matrix, per-class evaluation JSON, and training history that back
the numbers in [`report/model-report.md`](../report/model-report.md).

## Reproduce a prediction in under 10 minutes

```bash
pip install -r requirements.txt      # from the repo root
python predict.py --image path/to/leaf.jpg
```

This loads `backend/outputs/best_model.pt` and prints the predicted class
label — no manual steps, no training required.
