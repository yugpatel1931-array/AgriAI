# AgriSmart AI — Proposed Frontend ↔ Backend API

These contracts are **proposals**. They can change when the backend and ML services are finalized. The current UI talks to `js/mock-api.js` instead of the network.

Base URL (example):

```text
https://api.example.com
```

All JSON request bodies use UTF-8. Multipart is used only for image upload.

---

## POST `/api/analyze`

**Purpose:** Run crop-health analysis on an uploaded leaf image.

**Request:** `multipart/form-data`

| Field | Type | Notes |
| --- | --- | --- |
| `image` | file | JPG, JPEG, PNG, or WEBP. Suggested max 10 MB. |
| `cropHint` | string, optional | Farmer-selected crop from the scan form dropdown (e.g. `Tomato`, `Potato`, `Corn`, `Chilli`, `Wheat`, `Cotton`, `Rice`, `Other`). Optional — omitting it just returns the model's raw top prediction. |

**Crop hint behavior:** the model is only trained on Tomato, Potato, Corn (maize), Apple, Grape, Cherry, and bell Pepper (PlantVillage classes). When `cropHint` is one of those, the backend cross-checks it against the model's own top-k candidates: if the top guess already matches, nothing changes; if a lower-ranked candidate matches, that one is promoted instead; if none match, the model's real top prediction is kept but flagged as a mismatch. `Wheat`, `Cotton`, and `Rice` aren't in the training data at all, so those always come back flagged as unsupported rather than silently mislabeled. `Chilli` is matched against bell pepper as the closest available class (not a species-exact match).

**Success response:** `200`

```json
{
  "id": "scan_01HXYZ",
  "crop": "Tomato",
  "disease": "Early Blight",
  "confidence": 0.92,
  "risk": "Moderate",
  "explanation": "The analysis indicates visual patterns commonly associated with Early Blight.",
  "symptoms": [
    "Dark circular lesions",
    "Yellowing around affected areas"
  ],
  "recommendations": [
    "Remove severely affected leaves.",
    "Improve airflow between plants."
  ],
  "scannedAt": "2026-09-11T12:00:00.000Z",
  "imageUrl": "/api/scans/scan_01HXYZ/image",
  "cropHint": "Tomato",
  "cropHintSupported": true,
  "cropHintMatched": true,
  "cropMismatch": false,
  "cropMismatchMessage": null
}
```

`confidence` is a 0–1 float. `risk` is one of `Low`, `Moderate`, `High`.

The `cropHint*` / `cropMismatch*` fields are only meaningful when `cropHint` was sent in the request; they're `null`/`false` when it wasn't.

| Field | Type | Notes |
| --- | --- | --- |
| `cropHint` | string or null | Echoes the hint sent in the request. |
| `cropHintSupported` | bool or null | Whether the model has any classes for that crop at all. `null` when no hint was sent. |
| `cropHintMatched` | bool | Whether a class for the hinted crop was found among the model's top-k candidates. |
| `cropMismatch` | bool | `true` if the hint and the model's result disagree in any way (unsupported crop, promoted a lower-ranked candidate, or no match found at all). |
| `cropMismatchMessage` | string or null | Farmer-facing explanation when `cropMismatch` is `true`. |

**Errors**

| Status | Example |
| --- | --- |
| `400` | `{ "error": "UNSUPPORTED_TYPE", "message": "Use JPG, PNG, or WEBP." }` |
| `413` | `{ "error": "FILE_TOO_LARGE", "message": "Image exceeds 10 MB." }` |
| `422` | `{ "error": "UNREADABLE_IMAGE", "message": "The file could not be decoded." }` |
| `503` | `{ "error": "ANALYSIS_FAILED", "message": "Model is unavailable. Retry shortly." }` |

---

## GET `/api/scans`

**Purpose:** List scan history for the current user/device.

**Request:** query params

| Param | Notes |
| --- | --- |
| `q` | Search crop or diagnosis |
| `crop` | Exact crop filter |
| `risk` | `Low` \| `Moderate` \| `High` |
| `from` / `to` | ISO dates |

**Success response:** `200`

```json
{
  "items": [
    {
      "id": "scan_01HXYZ",
      "crop": "Tomato",
      "disease": "Early Blight",
      "confidence": 0.92,
      "risk": "Moderate",
      "scannedAt": "2026-09-11T12:00:00.000Z"
    }
  ]
}
```

**Errors:** `401` if auth is added later; `500` on server failure.

---

## GET `/api/scans/:id`

**Purpose:** Fetch one scan, including explanation and recommendations.

**Success response:** `200` — same object as analyze, plus `saved: true`.

**Errors:** `404` `{ "error": "NOT_FOUND", "message": "Scan does not exist." }`

---

## DELETE `/api/scans/:id`

**Purpose:** Remove a saved scan.

**Success response:** `204` empty body, or `200` `{ "ok": true }`.

**Errors:** `404` not found; `401` if protected.

---

## GET `/api/dashboard`

**Purpose:** Farmer dashboard KPIs and recent scans.

**Success response:** `200`

```json
{
  "totalScans": 12,
  "healthyCrops": 7,
  "issuesDetected": 5,
  "cropsMonitored": 4,
  "recent": [],
  "weekly": [2, 4, 3, 5, 6, 4, 3]
}
```

**Errors:** `500` on aggregation failure.

---

## GET `/api/insights`

**Purpose:** Aggregated farm insights.

**Success response:** `200`

```json
{
  "healthyPct": 68,
  "attentionPct": 22,
  "highPct": 10,
  "common": [
    { "name": "Early Blight", "count": 3 }
  ],
  "cards": [
    "Tomato crops showed the highest number of recent alerts."
  ],
  "trend": [62, 64, 66, 63, 68, 70, 68]
}
```

**Errors:** `500` on aggregation failure.

---

## Suggested extra endpoints

These are optional and can wait:

- `PUT /api/settings` — profile and preferences (currently localStorage only)
- `GET /api/scans/:id/image` — original or thumbnail image
- `POST /api/scans/:id/save` — persist an unsaved analysis

---

## Frontend adapter

Today:

```text
UI → js/*.js → AgriAPI in mock-api.js → localStorage
```

Later:

```javascript
function analyzeCrop(payload) {
  var body = new FormData();
  body.append("image", payload.file);
  return fetch(BACKEND_API_URL + "/api/analyze", {
    method: "POST",
    body: body
  }).then(function (res) {
    if (!res.ok) throw new Error("Analysis failed");
    return res.json();
  });
}
```

Keep `AgriAPI` as the only network boundary so pages do not call `fetch` directly.
