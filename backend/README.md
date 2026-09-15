# AgriSmart AI — Leaf Disease Classification

A complete, production-quality pipeline for classifying crop leaf images as
healthy or diseased, built for hackathon evaluation on **Macro-F1** with a
specific focus on **real-world field-image generalization** (not just clean
lab-photo accuracy).


## Khedut Mitr — multi-provider free-tier fallback

The `/api/chat` endpoint is provider-independent. It can automatically fall through configured providers when one returns a quota/rate-limit, server, timeout, or other provider error. The current order is **OpenRouter Free → Mistral Free → Groq → Google Gemini**. Only providers with a configured API key are attempted.

The OpenRouter Free Models Router is a zero-cost router to currently available free models; its free models have limited rate limits and availability. Mistral provides a Free mode with API access and rate limits. Groq has a free tier with rate limits; its model pricing/availability can change, so keep it as a fallback. Gemini remains supported as another fallback.

Add whichever keys you have to `.env` (never commit `.env`):

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/free
MISTRAL_API_KEY=
MISTRAL_MODEL=mistral-small-latest
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-20b
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash
```

No frontend change is required: the existing frontend continues to call `POST /api/chat`. The response now also reports the provider/model that successfully answered.

After editing `.env`, restart `python api_server.py` and run:

```bash
curl http://127.0.0.1:8000/api/health
```

The health response shows which providers are configured.

## 1. Setup

```bash
pip install -r requirements.txt
```

Put your dataset in `data/raw/`. Two layouts are supported and
**auto-detected** — you don't need to tell the pipeline which one you have:

**Already split** (what you have):
```
data/raw/
  train/
    Healthy/img001.jpg ...
    Tomato_Early_Blight/img001.jpg ...
  val/            <- optional; if missing, one is carved out of train/ only
    Healthy/...
    Tomato_Early_Blight/...
  test/
    Healthy/...
    Tomato_Early_Blight/...
```
`train`/`training`, `val`/`valid`/`validation`/`dev`, and `test`/`testing`
are all recognized. Your existing splits are used exactly as given — the
pipeline never reshuffles images between them. It does run a hash check
across your folders and **warns you if the same image file appears in more
than one split** (a common accidental-leakage bug), without silently
altering your test set.

**Not split — one folder per class**:
```
data/raw/
  Healthy/img001.jpg ...
  Tomato_Early_Blight/img001.jpg ...
```
In this case the pipeline deduplicates and performs a stratified
train/val/test split itself.

Class names are always taken from the folder names — nothing is hard-coded.
If detection ever picks the wrong mode, force it with `--split_mode presplit`
or `--split_mode flat` on `train.py` / `evaluate.py`.

## 2. Inspect the dataset (do this first)

```bash
python -m src.data_inspect --data_dir data/raw
```

If it detects a train/val/test layout it inspects each split separately
and runs a cross-split duplicate/leakage check. Reports class list,
per-class counts, imbalance ratio, image dimensions/formats, corrupted
files, and exact duplicates. Corrupted images are automatically skipped
and duplicates automatically deduped (flat mode) or flagged (pre-split
mode) by every downstream step — you don't need to clean the folder by
hand.

## 3.1 Imbalance + real-world robustness

The training pipeline uses inverse-square-root balanced sampling and matching loss weights so a crop with many more images (for example, Tomato) does not dominate optimization. It also uses stronger but leaf-safe field augmentations and a two-view inference ensemble (original + horizontal flip).

**Important:** high confidence is not proof of correctness. For phone/field photos, evaluate on a separate set of real-world images that were not taken from the training dataset.

## 3. Train

Single architecture (default: EfficientNet-B0):

```bash
python -m src.train --data_dir data/raw --epochs 40
```

Compare multiple architectures and auto-select the best by **validation**
Macro-F1 (the test set is never used for this decision):

```bash
python -m src.train --data_dir data/raw --compare efficientnet_b0 resnet50 mobilenet_v3_large
```

Batch size, mixed precision, and device all auto-adapt to whatever hardware
is available (GPU or CPU) — no manual tuning required. Training uses:
class-weighted loss (handles imbalance), cosine LR schedule with warmup,
early stopping on val Macro-F1, and checkpointing of the best epoch only.

Output: `outputs/best_model.pt` (plus per-arch checkpoints/history if you
used `--compare`, and `outputs/model_selection.json` showing the comparison
table).

## 4. Evaluate on the held-out test set

```bash
python -m src.evaluate --checkpoint outputs/best_model.pt --data_dir data/raw
```

Prints accuracy, precision/recall/F1 per class, Macro-F1, weighted-F1, and
flags the weakest classes. Saves `outputs/confusion_matrix.png` and
`outputs/test_evaluation.json`. This test set was held out from both
training and model selection — it is only touched here, once.

## 5. Predict on a new image

```bash
python -m src.infer --image path/to/leaf.jpg --checkpoint outputs/best_model.pt
```

With a Grad-CAM heatmap showing which region drove the prediction:

```bash
python -m src.infer --image path/to/leaf.jpg --checkpoint outputs/best_model.pt --gradcam
```

Explain a specific candidate instead of just the top prediction (useful
when you want to see why the model considered a class it *didn't* pick):

```bash
python -m src.infer --image path/to/leaf.jpg --checkpoint outputs/best_model.pt \
  --gradcam --target_class Tomato_Late_Blight
```

Or generate a separate heatmap for every one of the top-k candidates at
once — most useful when the top-2 confidences are close and you want to
see what visual evidence supports each:

```bash
python -m src.infer --image path/to/leaf.jpg --checkpoint outputs/best_model.pt --gradcam_topk 3
```

Each Grad-CAM result also reports `heat_coverage_pct` — the fraction of
the image the model weighted heavily for that class. A small, localized
percentage suggests a specific lesion drove the call; a very large one
suggests the model may be keying off something diffuse (background,
overall color cast) rather than a lesion — useful context alongside the
heatmap image itself, not a correctness guarantee.

For a web backend, import directly instead of shelling out:

```python
from src.infer import LeafPredictor
predictor = LeafPredictor("outputs/best_model.pt")
result = predictor.predict("uploaded_leaf.jpg")
# {"predicted_class": "...", "confidence": 0.97, "top_k": [...]}
```

`LeafPredictor` loads the class list, architecture, and image size straight
from the checkpoint, so the backend never needs to know these — one object,
one `.predict()` call, ready for a Flask/FastAPI endpoint.

## 6. Treatment feedback loop

A one-shot prediction throws away the most valuable signal there is: what
actually happened afterwards. `src/feedback.py` closes that loop.

Log a prediction to get a short ID you can follow up on later:

```bash
python -m src.infer --image path/to/leaf.jpg --checkpoint outputs/best_model.pt --log_feedback
# -> Feedback ID: a1b2c3d4
```

Once you (or the farmer) know the real outcome, log it against that ID:

```bash
python -m src.feedback log-feedback --id a1b2c3d4 --correct \
  --treatment_applied "removed affected leaves" --treatment_helped

python -m src.feedback log-feedback --id a1b2c3d4 --incorrect --actual_class Tomato_Late_Blight
```

See the running history, or a rolled-up report:

```bash
python -m src.feedback history --limit 20
python -m src.feedback report
```

`report` returns confirmed accuracy for the most recent N predictions vs.
all earlier ones, and flags possible **model drift** if recent accuracy
drops sharply (default: 15 percentage points) versus the historical
baseline — a real early-warning signal that the model is seeing field
conditions it wasn't trained for, without waiting for a full re-evaluation.
It also breaks down **treatment effectiveness per predicted class** (what
% of confirmed cases reported the applied treatment actually helped),
which is a genuinely new signal the core pipeline has no other way to see.

Storage is a single append-only JSONL file (`outputs/feedback_log.jsonl`
by default) — safe to write to from a web backend with no read-modify-write
race, and trivial to inspect or back up.

## 7. Crop recommendation (Bonus Module A)

Recommends suitable crops from soil type, pH, temperature, humidity,
rainfall, water availability, and previous crop (for rotation).

Rule-based (default, no extra data needed) — scores every crop in
`data/reference/crop_requirements.csv` with a published, reproducible
formula (see the docstring in `src/crop_recommend.py`):

```bash
python -m src.crop_recommend --soil "Loamy" --ph 6.4 --temperature 27 \
  --humidity 55 --rainfall 550 --water_availability medium --previous_crop Rice
```

Or edit and run `run_crop_recommend.py` if you prefer not to use the
terminal at all.

**Note on the reference data:** the agronomic ranges in
`data/reference/crop_requirements.csv` are typical/illustrative values
compiled for this demo, not verified market or agricultural-extension
data — stated plainly rather than presented as ground truth.

**Optional ML mode** — if you have the Kaggle "Crop Recommendation
Dataset" (columns: `N, P, K, temperature, humidity, ph, rainfall, label`),
train a real classifier and report genuine accuracy/macro-F1:
```bash
python -m src.crop_recommend train --train_csv path/to/Crop_recommendation.csv
```

## 8. Farmer Assistant — offline templates (Bonus Module E)

Turns a raw prediction into a short, actionable message a farmer can read
— in English, Hindi, or Gujarati. Fully offline, no API key, no internet.

```bash
python -m src.infer --image leaf.jpg --checkpoint outputs/best_model.pt --explain --language hi
```
Standalone: `python -m src.assistant --predicted_class Tomato_Early_blight --confidence 0.91 --language gu`,
or edit and run `run_assistant.py`.

Every sentence is built directly from the model's own output fields (no
LLM involved here) — grounded by construction. Below 60% confidence it
automatically adds a caution note suggesting a retake or second opinion.

The Hindi/Gujarati text is romanized transliteration, not native
Devanagari/Gujarati script (see `src/assistant.py` for exactly where to
swap in native-script strings if needed).

## 9. Farmer Assistant — multi-provider Khedut Mitr

The web integration uses the same `POST /api/chat` endpoint, but the backend can automatically fail over across configured AI providers. The current order is:

1. OpenRouter Free Models Router (`openrouter/free`)
2. Mistral Free mode (`mistral-small-latest`)
3. Groq (`openai/gpt-oss-20b` by default)
4. Google Gemini (`gemini-3.6-flash` by default)

A provider is attempted only when its API key is configured. Provider errors such as quota/rate-limit responses, 5xx responses, network failures, and timeouts fall through to the next configured provider. The browser never receives any provider API key.

### Configure providers

Copy `.env.example` to `.env` and add as many provider keys as you have:

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/free
MISTRAL_API_KEY=
MISTRAL_MODEL=mistral-small-latest
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-20b
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash
```

You only need one key for Khedut Mitr to work, but **two or more keys are recommended** for hackathon reliability.

### Health check

```bash
curl http://127.0.0.1:8000/api/health
```

The response includes `openrouter_configured`, `mistral_configured`, `groq_configured`, `gemini_configured`, and `khedut_mitr_providers`.

### Security

Never put any AI provider API key in frontend JavaScript or commit `.env`. Keep all keys server-side.

## Web API

Run from this `backend` directory:

```bash
python -m pip install -r requirements.txt
python api_server.py
```

Health check:

```text
GET http://127.0.0.1:8000/api/health
```

Crop analysis:

```text
POST http://127.0.0.1:8000/api/analyze
multipart/form-data: image=<leaf image>
```

The analysis endpoint loads `outputs/best_model.pt` through `src.infer.LeafPredictor`, returns the model class/confidence/top-k results, disease-specific conservative advisory fields, and an optional Grad-CAM model-focus image. Grad-CAM is an explanation of classifier focus; it is not a lesion detector or thermal sensor.

Khedut Mitr:

```text
POST http://127.0.0.1:8000/api/chat
```

Set at least one Khedut Mitr provider API key in a local `.env` file. Do not commit `.env` or expose the key to the frontend.

### Data persistence (MongoDB, optional)

By default nothing is saved anywhere — `/api/analyze` and `/api/chat` just
return their result. To persist predictions and chat history, set
`MONGODB_URI` in `.env` (see `.env.example`):

- **Local**: `MONGODB_URI=mongodb://localhost:27017/` (requires MongoDB
  running locally).
- **Cloud**: create a free [MongoDB Atlas](https://www.mongodb.com/atlas)
  cluster and use its connection string, e.g.
  `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/`.

With `MONGODB_URI` unset, the app behaves exactly as before — no
connection is attempted, so there's no startup delay or timeout. With it
set, `api_server.py` creates the `agrismart_ai` database (override the
name with `MONGODB_DB`) on startup, and writes a document to the
`predictions` collection on every successful `/api/analyze` call and to
`chat_history` on every successful `/api/chat` call. Check
`GET /api/health` for `database_configured` and `database_connected` to
confirm it's wired up. Schemas live in `src/database/models.py`; the
connection/collection helpers live in `src/database/connection.py`.

Offline API contract smoke test:

```bash
python test_api_contract.py
```
