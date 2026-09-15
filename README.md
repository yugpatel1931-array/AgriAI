# AgriSmart AI

*SIH 2026 — Internal Hackathon, L. J. Institute of Engineering and
Technology [C-433] — Problem Statement 1: AgriSmart AI.*

AI-powered crop leaf disease detection (the mandatory core task), plus five
optional bonus modules: crop recommendation, smart irrigation, weather
intelligence, a sustainability score, and a multi-provider farmer chat
assistant ("Khedut Mitr").

## 1. Modules built

| # | Module | Status | Where |
|---|---|---|---|
| Core | Crop Disease Detection (Computer Vision) | ✅ Built | `backend/src/model.py`, `train.py`, `infer.py`; entry point at [`predict.py`](predict.py) |
| A | Crop Recommendation | ✅ Built | `backend/src/crop_recommend.py` |
| B | Smart Irrigation | ✅ Built | `backend/src/irrigation.py` |
| C | Weather-Based Intelligence | ✅ Built | `backend/src/weather.py` |
| D | Sustainability Score | ✅ Built | `backend/src/sustainability.py` |
| E | Farmer Assistant (GenAI) | ✅ Built | `backend/src/khedut_mitr.py`, `genai_assistant.py`, `gemini_assistant.py`, `assistant.py` (offline templates) |
| F | IoT Integration | ❌ Not attempted | — |
| G | Agentic Advisor | ❌ Not attempted | — |

Bonus modules B (Smart Irrigation) and D (Sustainability Score) each
publish their exact decision logic / scoring formula in their module
docstring, per Section 3.2's requirement to state how they work — read
[`backend/src/irrigation.py`](backend/src/irrigation.py) and
[`backend/src/sustainability.py`](backend/src/sustainability.py) directly.
They're reachable via CLI (`python -m src.irrigation`, `python -m
src.sustainability`), the `/api/irrigation` and `/api/sustainability`
endpoints in `backend/api_server.py`, and the illustrative demo UI at
`frontend/irrigation.html` / `sustainability.html` (which currently render
their own client-side copy of the same logic for an instant, offline-first
demo — see `frontend/js/irrigation.js` / `sustainability.js`).

This repo has two independent parts:

| Folder | What it is | Setup |
|---|---|---|
| [`backend/`](backend/README.md) | Flask API — leaf disease classifier (PyTorch/EfficientNet-B0), crop/irrigation recommendations, weather, chat assistant, and optional MongoDB persistence for accounts & history | `cd backend && pip install -r requirements.txt && python api_server.py` |
| [`frontend/`](frontend/README.md) | Static HTML/CSS/vanilla JS client — no build step, no npm | `cd frontend && python -m http.server 5500` |

## Quick start

**Windows — one command:** double-click `start.bat` (or run it from a terminal)
in this folder. It installs backend dependencies, starts the API server, finds
a free port for the frontend (5500 is often already taken by VS Code's Live
Server, so it tries 5500 → 5501 → 5502 → 5173 → 8080 → 3000 and uses the first
one that's open), waits for the backend to respond, then opens the app in your
browser automatically. Set `MONGODB_URI` in `backend/.env` first if you want
account/history persistence — see `backend/README.md`.

**Manual / any OS:**

1. Start the backend first (it serves the API the frontend calls):
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env   # then fill in any provider keys / MONGODB_URI you want
   python api_server.py
   ```
2. In a second terminal, serve the frontend:
   ```bash
   cd frontend
   python -m http.server 5500
   ```
3. Open `http://localhost:5500` in a browser. The backend runs at
   `http://127.0.0.1:8000` — check `http://127.0.0.1:8000/api/health` to
   confirm it's up.

See each folder's own README for full details: dataset setup and training
(`backend/README.md`), the Khedut Mitr multi-provider chat assistant
(`backend/README.md` and `backend/README_GEMINI.md`), and data persistence
setup for MongoDB (local or Atlas cloud) — also in `backend/README.md`.

## Dataset used and its source / licence

- **Core task training/validation:** [PlantVillage](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)
  (lab-condition leaf images), as specified by Section 4.1 for the
  train/validation side of the core task — ~54,303 images, 38
  species-disease classes at source (we train on the 29 that had usable
  per-class volume; see the model report). Originally published by Hughes &
  Salathé, 2015 ([arXiv:1511.08060](https://arxiv.org/abs/1511.08060)).
  **Licence note:** PlantVillage is widely mirrored on Kaggle under
  varying licence tags per uploader (commonly CC0/public-domain); we did
  not find one single canonical licence from the original project page.
  Confirm the licence on whichever specific Kaggle listing you download
  before any redistribution beyond this hackathon.
- **Core task held-out evaluation:** the organizers' own field-condition,
  PlantDoc-style set (Section 4.1) — never trained or validated on here.
- **Crop Recommendation (Bonus A):** `backend/data/reference/crop_requirements.csv`,
  a small hand-compiled reference table (see `src/reference_data.py`'s
  honesty note in that file for exactly what it is and isn't).
- **Weather (Bonus C):** live data from [Open-Meteo](https://open-meteo.com)
  (free, no API key), with a clearly-labelled deterministic mock fallback
  when offline — see `backend/src/weather.py`.
- **Smart Irrigation (Bonus B) / Sustainability (Bonus D):** rule-based,
  not trained on external data — see the "exact formula/rules" published in
  each module's docstring.

## Architecture overview

```
Leaf image ──► Flask API (backend/api_server.py) ──► LeafPredictor (backend/src/infer.py)
                     │                                   loads backend/outputs/best_model.pt
                     │                                   (EfficientNet-B0, transfer-learned)
                     ├──► src/crop_recommend.py   (Bonus A — rule-based / optional RF model)
                     ├──► src/irrigation.py       (Bonus B — decision tree; see docstring)
                     ├──► src/weather.py          (Bonus C — Open-Meteo + fallback)
                     ├──► src/sustainability.py   (Bonus D — weighted formula; see docstring)
                     └──► src/khedut_mitr.py      (Bonus E — multi-provider LLM router)
                                                        │
Static HTML/CSS/JS frontend (frontend/) ◄────────────── fetch() over CORS
```

The Flask API is the single source of truth for the ML pipeline; the
frontend is a build-free static client that calls it (core `/api/analyze`,
auth) and, for a couple of bonus pages, also renders an equivalent
client-side copy of the same published logic so the demo works instantly
offline (see `frontend/js/*.js`).

## Reported metrics

**Core task (EfficientNet-B0, PlantVillage internal test split, 9,968
images / 29 classes):**

| Metric | Value |
| --- | --- |
| Test accuracy | 99.97% |
| **Test macro-F1** | **99.97%** |
| Test weighted-F1 | 99.97% |

⚠️ Measured on our own PlantVillage (lab-condition) split, **not** the
organizers' field-condition held-out set that the core score is actually
judged on — see Limitations below and the full
[model report](report/model-report.md) for the confusion matrix and
per-class breakdown.

Bonus modules B and D don't have a single accuracy number (they're
rule-based, not trained) — instead each publishes its exact formula in its
module docstring, and B additionally ships a decision-grid consistency
check (`python -m src.irrigation --validate`) as its validation method.

## Known limitations

- **Lab-to-field gap (by design):** the core model has only ever trained
  on PlantVillage's clean lab photos. The real, scored macro-F1 comes from
  the organizers' field-condition held-out set, which this model has not
  yet been evaluated against — expect a meaningful score drop there.
- **Class list reconciliation:** the model currently ships PlantVillage's
  full 29-class label set; it has not yet been reconciled against the
  organizers' official ~15–20-class shared list published at kickoff.
- Bonus B/D thresholds and weights (moisture cutoffs, equal 0.20 formula
  weights) are principled defaults grounded in standard agronomic ranges,
  not fit to any measured dataset — see each module's docstring for the
  exact reasoning.
- Full details, per-class numbers, and failure cases: see
  [`report/model-report.md`](report/model-report.md).

## Demo video

*Add the unlisted demo-video link here before submission (Section 7.4 —
3–5 minutes, must show the core task running on a new image plus any
bonus modules).*

## Originality declaration

All code in this repository was written during the 10–15 September 2026
hackathon window. Third-party components used:
- **Datasets:** PlantVillage (core task training data, cited above).
- **Pretrained backbone:** torchvision's ImageNet-pretrained
  EfficientNet-B0, fine-tuned here via transfer learning.
- **Libraries:** PyTorch/torchvision, scikit-learn, Flask, pandas — see
  `backend/requirements.txt` for the full list; none of them contain
  challenge-specific logic.
- **Weather data:** Open-Meteo API (no code copied, only its HTTP API).
- **LLM providers (Bonus E):** Google Gemini / OpenRouter / Mistral /
  Groq, called through their official APIs for the Khedut Mitr assistant;
  offline template fallback in `src/assistant.py` is original.
No public notebook or end-to-end solution for this challenge was copied.

## Repository layout

```
AgriAI/
├── predict.py        Top-level predict interface (Section 4.1) — predict(image_path) / CLI
├── requirements.txt  Root-level pointer to backend/requirements.txt (see file)
├── model/             Required /model entry point — see model/README.md
├── backend/           Flask API, ML pipeline (train/evaluate/infer), src/
├── frontend/          Static HTML/CSS/JS client
├── report/            One-page model report (SIH submission requirement) + confusion matrix
└── start.bat          Windows one-command launcher (backend + frontend + auto-open)
```

## Model report

The one-page model report required for submission (task, dataset & split,
architecture, metrics, confusion matrix, baseline comparison, limitations)
is at [`report/model-report.md`](report/model-report.md).
