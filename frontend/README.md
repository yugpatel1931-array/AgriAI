# AgriSmart AI Frontend

Vanilla HTML, CSS, and JavaScript interface for AgriSmart AI.

## Technology

HTML5 + CSS3 + Vanilla JavaScript. No React, Vite, Tailwind, npm, or frontend package installation is required.

## Run

From this `frontend` directory:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

The backend should be running separately at:

```text
http://127.0.0.1:8000
```

The Analyze Crop flow sends the selected image to `POST /api/analyze`. Khedut Mitr sends farmer questions and the latest scan context to `POST /api/chat`.

If the backend is hosted somewhere else, set `window.AGRI_API_BASE` before `js/mock-api.js` loads, and/or set `window.AGRI_GEMINI_API_BASE` before `js/gemini-api.js` loads.

## Architecture

```text
HTML / CSS
    ↓
Vanilla JavaScript
    ↓
AgriAPI (`js/mock-api.js`)
    ├── Analyze Crop → backend `/api/analyze`
    ├── local UI state/history → localStorage
    └── bonus-module demo adapters

Khedut Mitr (`js/gemini-api.js`)
    ↓
backend `/api/chat`
    ↓
Google Gemini (API key stays server-side)
```

## Real scan behavior

The Analyze Crop page no longer selects a hard-coded disease result. The uploaded file is sent as multipart form data to the backend and the result is stored with the backend scan ID.

The result page uses the backend's real model class, confidence, advisory fields, and optional Grad-CAM explanation. The Grad-CAM view explains classifier focus; it is not a lesion detector. Thermal imagery is not fabricated when no thermal sensor data exists.

## localStorage

- `agrismart_scan_history`
- `agrismart_settings`
- `agrismart_last_result`
- `agrismart_farm_context`

## Important

- Keep the backend running while using Analyze Crop or Khedut Mitr.
- Do not put the Gemini API key in frontend files.
- The frontend must not present demo/mock results as real model predictions.
