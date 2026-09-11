# AgriSmart AI Frontend

Vanilla HTML, CSS, and JavaScript interface for the AgriSmart AI crop health assistant.

## Technology

HTML5 + CSS3 + Vanilla JavaScript

No React, Vite, Tailwind, npm, or other frontend packages.

## Why

Zero dependencies and fast loading. The app can be opened as static files, which keeps the Smart India Hackathon demo reliable on machines where Node installs fail.

## Run

The frontend can be opened directly through:

```text
index.html
```

Double-click `frontend/index.html`, or open it from the browser.

For local development, optionally use:

```text
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

Python is optional. It is not an installation dependency of this frontend.

A local static server is useful if a browser blocks `localStorage` or camera capture on `file://`.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Marketing landing page |
| `dashboard.html` | Farmer overview, KPIs, recent scans |
| `scan.html` | Image upload, camera, analysis loading |
| `result.html` | Diagnosis, recommendations, print/save |
| `history.html` | Searchable scan history |
| `insights.html` | Health mix, common issues, trends |
| `settings.html` | Profile and preferences |
| `404.html` | Friendly missing-page screen |

## Architecture

```text
HTML
 ↓
CSS
 ↓
Vanilla JS
 ↓
Mock API (`js/mock-api.js`)
 ↓
localStorage
```

Shared chrome (navigation, footer, theme) lives in `js/app.js`.
Each page has a dedicated script. All data access goes through `AgriAPI` in `js/mock-api.js`.

localStorage keys:

- `agrismart_scan_history`
- `agrismart_settings`
- `agrismart_last_result`

## Future Backend Integration

`mock-api.js` currently returns demonstration results so the full farmer flow works without a live model.

When the backend is ready, keep the same function names (`analyzeCrop`, `getScanHistory`, `getDashboardStats`, `getInsights`, `saveScan`) and switch the implementations to `fetch()` against the API documented in `docs/frontend-backend-api.md`.

Page scripts should not need a rewrite if those contracts stay stable.

## Design notes

- Green is an accent on neutral surfaces, not a full-page theme.
- Results are labeled as demonstration output.
- Recommendations are informational guidance, not prescriptions.
