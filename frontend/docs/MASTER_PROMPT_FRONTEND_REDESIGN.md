# MASTER PROMPT — AgriSmart AI Frontend Redesign

Paste this entire document into a new Cursor agent chat as the implementation brief.

Repository: https://github.com/yugpatel1931-array/AgriAI  
Working directory: `frontend/`  
Architecture to preserve: HTML → CSS → Vanilla JavaScript → `AgriAPI` (`js/mock-api.js`) → localStorage  
Do **not** migrate to React, Next.js, Vue, Angular, Tailwind, Vite, or npm packages unless a file cannot be saved without it.

---

## ROLE

You are a senior product designer, UX architect, UI engineer, frontend engineer, and accessibility specialist.

You are transforming an **existing, working** Smart India Hackathon frontend for **AgriSmart AI** into a polished, distinctive, production-quality AgriTech + AI experience.

The product must feel: modern, trustworthy, premium, agricultural, AI-powered, practical, farmer-simple, judge-impressive, mobile-first, fast, accessible, and visually memorable.

This is **not** a generic AI dashboard. Scan Crop is the heart of the product.

---

## 0. CRITICAL WORKFLOW (DO THIS IN ORDER)

1. Re-read this prompt and inspect the live files listed below. Do not assume this summary is stale if files have changed — verify.
2. Do **not** rewrite the whole frontend in one giant edit.
3. Establish the design system in CSS first (`:root` tokens, components).
4. Implement page-by-page (phases below). After each phase, verify functionality, responsiveness, accessibility, and visual consistency.
5. Prefer CSS for visual change. Only touch JavaScript when markup/UX requires it, and **preserve behavior**.
6. Do not invent weather, satellite, GPS maps, IoT sensors, fake farmer stats, or fake model metrics.
7. Do not present mock/demo data as live real-world farm data. Keep honest demo labeling where results are mock.

When you start, briefly report: architecture, UX problems, visual problems, what to preserve, design-system plan, then begin Phase 1.

---

## 1. CURRENT ARCHITECTURE (AS OF INSPECTION)

### File map (keep this structure)

```text
frontend/
├── index.html
├── dashboard.html
├── scan.html
├── result.html
├── history.html
├── insights.html
├── settings.html
├── 404.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── dashboard.js
│   ├── scan.js
│   ├── result.js
│   ├── history.js
│   ├── insights.js
│   ├── settings.js
│   └── mock-api.js
├── assets/
│   ├── icons/favicon.svg
│   └── images/hero-field.svg
└── docs/
    ├── frontend-backend-api.md
    └── MASTER_PROMPT_FRONTEND_REDESIGN.md
```

Do not create unnecessary files. If you need a small extra CSS partial or one auth/onboarding HTML page, justify it. Prefer extending existing CSS/JS.

### How the app is wired

| Concern | Implementation |
| --- | --- |
| Shared chrome | `js/app.js` injects `#site-header` and `#site-footer` on every page |
| Theme | `AgriAPI.getSettings().theme` → `document.documentElement[data-theme=light\|dark]` |
| Data | All pages must keep using `window.AgriAPI` — never `fetch` from page scripts |
| Helpers | `window.AgriApp`: `$`, `$$`, `applyTheme`, `greeting`, `relativeTime`, `formatDate`, `confidenceLabel`, `riskClass`, `toast`, `queryParam`, `escapeHtml` |
| Script order | `mock-api.js` then `app.js` then page script, all `defer` |
| Run | Static files; optional `python -m http.server`. No build step |

### Navigation today (`NAV_ITEMS` in `app.js`)

Home (`index.html`), Dashboard, Scan, History, Insights, Settings.  
Header CTA: “Start Scanning” → `scan.html`.  
Mobile: hamburger `#menu-toggle` toggles `#nav.is-open`. Skip link to `#main` exists.

### Scan flow today (`scan.html` + `scan.js`)

IDs that **must keep working** (you may wrap/restyle them, but do not drop the contracts):

- `#scan-alert`, `#upload-panel`, `#dropzone`, `#choose-btn`, `#camera-btn`
- `#file-input` (`accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"`)
- `#camera-input` (`accept="image/*"` `capture="environment"`)
- `#preview-panel`, `#preview-image`, `#file-name`, `#file-size`, `#analyze-btn`, `#remove-btn`
- `#loading-panel`, `#progress-steps`

Behavior to preserve:

- Click dropzone / Choose Image → file picker
- Use Camera → capture input
- Drag/drop with `.is-dragover`
- Keyboard Enter/Space on dropzone
- Validation: type (JPG/JPEG/PNG/WEBP), max **10 MB**
- Preview via `URL.createObjectURL`; revoke on remove
- Analyze: hide upload+preview, show loading, step timers, `compressImage` (max width 900, JPEG 0.72), `AgriAPI.analyzeCrop({ fileName, fileSize, imageDataUrl })`, then `location.href = "result.html"`
- On error: restore upload+preview, farmer-friendly `#scan-alert`

### Result flow today (`result.html` + `result.js`)

- Load `?id=` via `AgriAPI.getScanById(id)` else `AgriAPI.getLastResult()`
- Missing → empty state + Scan CTA
- Renders: image (`imageDataUrl` or SVG placeholder), crop, disease, confidence, risk badge, explanation, symptoms, recommendations, disclaimer, metadata, Save / Scan Another / Print / Dashboard
- Save → `AgriAPI.saveScan(result)` + toast (including storage-full trimmed image case)
- Print → `window.print()` (CSS already hides chrome)

### History (`history.js`)

Filters: `#search`, `#crop-filter`, `#risk-filter` (values `Low|Moderate|High`), `#date-filter` (`24h|7d|30d`).  
Rows link to `result.html?id=...`. Crop options built from history.

### Dashboard (`dashboard.js`)

- Greeting uses `AgriApp.greeting()` + `settings.farmerName` (currently appends a waving emoji — **remove emoji UI**)
- KPIs from `AgriAPI.getDashboardStats()`: `totalScans`, `healthyCrops`, `issuesDetected`, `cropsMonitored`, `recent` (4), `weekly` (7 numbers)
- Recent rows → `result.html?id=`
- CSS bar chart from `stats.weekly`

### Insights (`insights.js`)

`AgriAPI.getInsights()`: `healthyPct`, `attentionPct`, `highPct`, `common[]`, `cards[]`, `trend[]`. Empty history has empty state.

### Settings (`settings.js`)

Fields: `#farmerName`, `#farmName`, `#location`, `#language`, `#theme`, `#notifications`.  
Save form → `AgriAPI.saveSettings`. Theme change applies immediately. `#clear-history` uses `window.confirm` then `AgriAPI.clearHistory()`.

### Mock API (`mock-api.js`) — DO NOT BREAK

**localStorage keys (required):**

- `agrismart_scan_history`
- `agrismart_settings`
- `agrismart_last_result`
- `agrismart_demo_seeded` (internal seed flag — keep)

**Public `AgriAPI` methods to keep:**  
`analyzeCrop`, `getScanHistory`, `getScanById`, `getDashboardStats`, `getInsights`, `saveScan`, `deleteScan`, `clearHistory`, `getLastResult`, `setLastResult`, `getSettings`, `saveSettings`, `KEYS`

**Result object shape (UI mapping must stay compatible):**

```text
id, crop, disease, confidence (0–1 float), risk ("Low"|"Moderate"|"High"),
explanation, symptoms[], recommendations[], scannedAt (ISO),
fileName, imageDataUrl, demo, saved
```

**Demo catalog (preserve these examples; hashing still picks among them):**

- Tomato / Early Blight / 0.92 / Moderate
- Cotton / Healthy / 0.96 / Low
- Chilli / Leaf Spot / 0.88 / Moderate
- Wheat / Healthy / 0.94 / Low
- Potato / Late Blight / 0.90 / High
- Rice / Healthy / 0.91 / Low
- Tomato / Powdery Mildew / 0.86 / Moderate
- Wheat / Rust / 0.87 / High

Seed history on first visit (6 demo scans). `analyzeCrop` delays ~1.7–2.6s then hashes `fileName+fileSize` into catalog. Storage overflow strips `imageDataUrl`.

**Future backend:** `docs/frontend-backend-api.md` — POST `/api/analyze`, GET `/api/scans`, GET `/api/scans/:id`, DELETE `/api/scans/:id`, GET `/api/dashboard`, GET `/api/insights`. Keep `AgriAPI` as the only data boundary.

**Settings object:** `farmerName`, `farmName`, `location`, `language`, `notifications`, `theme`

Default seed settings: Farmer / Greenfield Farm / India / en / notifications true / light.

### Assets today

Only `assets/icons/favicon.svg` and `assets/images/hero-field.svg` (abstract field + leaf, not photography). Reuse and evolve these; do not dump random stock photos. Do not fill every section with images.

### CSS today

Tokens in `:root` / `[data-theme="dark"]`. Components: `.btn`, `.card`, `.badge-*`, `.dropzone`, `.scan-row`, `.kpis`, `.toast`, `.empty`, `.meter-*`, sticky header, print styles. Breakpoints in `responsive.css`: 1024, 768, 425, 320.

---

## 2. WHAT TO PRESERVE (NON-NEGOTIABLE)

- Vanilla HTML/CSS/JS architecture and file layout
- Working upload, camera, preview, remove, analyze, result, save, history filters, dashboard stats, insights, settings, theme, 404
- `AgriAPI` contracts, result shape, risk values `Low|Moderate|High` in **data**
- localStorage keys above
- Demo catalog outcomes
- Guest can scan without login (there is **no auth today** — do not add a login wall on scan)
- Informational disclaimer on recommendations
- Dark theme capability
- Print report on result
- Skip link, 44px-ish touch targets, focus-visible
- Image compression before storing data URLs
- Farmer-friendly error copy (never `ERR_UPLOAD_413`)

---

## 3. CURRENT UX PROBLEMS TO FIX

1. **Scan is not the product center.** Landing secondary CTA is “Explore Dashboard”. Nav treats Scan as one equal item. Dashboard is a generic KPI board.
2. **No guest-save auth story.** Save writes straight to localStorage. Need Save → auth **UI** (mock/placeholder for future Supabase), without blocking the scan itself.
3. **No login, signup, or onboarding screens.** Settings already collect farmer/farm/location — reuse those fields; do not duplicate conflicting sources of truth.
4. **Scan loading is a generic spinner + checklist**, not a signature analysis moment. Image disappears during loading.
5. **No optional crop details** (progressive disclosure) before analyze.
6. **Result is four stat boxes**, not an “AI Health Assessment” answering what / how serious / what next.
7. **Risk is color-ish badges** labeled Low/Moderate/High, not Healthy / Moderate Risk / High Risk with icon + text.
8. **No confidence visualization** (plain percentage).
9. **Recommendations are a flat list**, not Immediate / Monitor / Care. Disclaimer exists — keep and make visible but not alarming.
10. **History/dashboard rows have no thumbnails** even when `imageDataUrl` exists; no timeline feel.
11. **Insights feel like leftover analytics** (“Insight” twice, demo weekly bars that are not real farm activity). Do not imply `weekly` is live field telemetry. Relabel honestly (e.g. scan activity from **this device’s records**).
12. **Clear history** uses native `confirm` — replace with in-UI confirmation. Do not clear without confirm.
13. **Empty vs filtered-empty** history uses the same “No scans yet” copy — distinguish “no history” vs “no matches”.
14. **Emoji in dashboard greeting** — remove.
15. **`result.js` concatenates unescaped fields** into HTML. Use `AgriApp.escapeHtml` (and escape list items).
16. **No `prefers-reduced-motion`.**
17. **Auth-related nav missing.** Do not invent real Google OAuth; provide UI hooks.

---

## 4. CURRENT VISUAL PROBLEMS TO FIX

1. Looks like a competent student template: white cards, dashed dropzone, pill buttons (`border-radius: 999px`), 6 identical icon cards, Segoe UI system stack.
2. Palette is generic green (`#1f7a4d`) + gold accent — close to “AI farming dashboard” cliché. Move to the specified identity (below) without painting the whole UI green.
3. Too many equal cards; weak hierarchy; landing has no trust strip, no analysis preview, no farmer-benefits, no closing CTA, thin footer.
4. Hero SVG is usable but decorative; add a subtle analysis overlay language (scan line / markers) without sci-fi HUD.
5. Dropzone drag state is only background/border — add restrained scale/glow.
6. Dashboard KPIs are four equal numbers — not a Farm Health overview.
7. Scan-row grids break awkwardly on tablet (2-col scramble).
8. `--muted: #6b645c` may be weak outdoors — raise contrast.
9. Full-width buttons at 425px can be OK for primary actions; don’t make every ghost button a full-width stack that feels like a form dump.
10. No skeletons; layout can jump on JS inject of header/KPIs.

---

## 5. PRIMARY PRODUCT GOAL

AgriSmart AI helps farmers understand crop health using AI-powered crop image analysis.

**Main action: SCAN CROP.** Understandable in seconds.

Story: Take a photo → AI analyzes → understand health → get useful recommendations.

Do not make the dashboard the center.

---

## 6. DESIGN PHILOSOPHY — “LIVING FARM”

**Do not create:** generic SaaS dashboard, ChatGPT clone, generic green farming site, crypto/banking UI, cyberpunk, excessive glass/gradients/rounded cards, childish illustrations, template look, clutter, animation for its own sake, walls of text.

**Create:** Premium AgriTech + Natural Agriculture + Modern AI + Farmer-friendly simplicity. Real startup product, not an AI-generated template.

Visual story: Farm → Crop → Scan → AI → Health → Action.

Use Farm Health, crop health zones, scan timeline, confidence viz, risk indicators, recommendation cards — **clarity first**. No fake geographic farm maps.

---

## 7. CORE VISUAL IDENTITY

| Token | Hex | Role |
| --- | --- | --- |
| Warm white | `#FAFAF7` | ~70% surfaces |
| Deep forest | `#1B4332` | headers, emphasis |
| Primary green | `#2F5D3A` | primary actions |
| Leaf | `#5E8C45` | growth, secondary green |
| Fresh | `#52B788` | healthy / AI accent (sparingly) |
| Earth brown | `#8B6B4A` | ~7% agriculture accents |
| Soft sand | `#F0EBE0` | alt surfaces |
| Charcoal | `#243024` | text |
| Success | `#3F7D45` | healthy |
| Warning | `#C58A32` | moderate |
| Disease / high risk | `#B94A48` | high risk |

Map into CSS variables, example:

```css
:root {
  --color-warm-white: #FAFAF7;
  --color-forest: #1B4332;
  --color-green: #2F5D3A;
  --color-leaf: #5E8C45;
  --color-fresh: #52B788;
  --color-brown: #8B6B4A;
  --color-sand: #F0EBE0;
  --color-charcoal: #243024;
  --color-success: #3F7D45;
  --color-warning: #C58A32;
  --color-danger: #B94A48;
  /* keep existing semantic aliases working: --primary, --text, --muted, --border, --surface, --background */
}
```

Green = primary actions, healthy, AI, growth, trust. Brown = soil/earth secondary. **Do not make the entire interface green.**

Typography: max **2 families**. Suggested: **Sora** or **Plus Jakarta Sans** for display + **Inter** or **Source Sans 3** for body. Load from Google Fonts **or** self-host if you add files; keep it lightweight. Clear Display / H1–H3 / Body / Caption / Label hierarchy. Outdoor readability: avoid tiny or low-contrast text.

Radius: moderate (not every control a pill). Soft shadows, subtle borders, generous whitespace.

Dark theme: remap the new tokens; keep charcoal/forest logic, not neon.

---

## 8. HEALTH STATUS SYSTEM (DISPLAY VS DATA)

**Stored `risk` stays** `Low` | `Moderate` | `High` (API + filters).

**UI labels:**

| Data `risk` | UI label | Meaning |
| --- | --- | --- |
| Low (or `disease === "Healthy"`) | Healthy | Green + icon + text |
| Moderate | Moderate Risk | Amber/brown + icon + text |
| High | High Risk | Red + icon + text |

Never communicate status by color alone. Update `AgriApp.riskClass` if needed but keep history filter values as `Low|Moderate|High`.

Confidence microcopy (short):  
“AI confidence indicates how strongly the model matched the image to this condition.”  
Do not imply certainty.

Disclaimer (keep):  
“AI-generated guidance is informational and should be verified with a qualified agricultural expert when needed.”

---

## 9. LANGUAGE (FARMER-FRIENDLY)

Use: Scan Crop, Crop Health, Needs Attention, AI Confidence.  
Avoid: Initiate Computer Vision Assessment, Biological Health Classification, Classification Probability Distribution, AI MAGIC.

Loading copy (UX feedback, not model claims):

- Preparing image...
- Detecting crop...
- Examining leaf patterns...
- Checking for signs of disease...
- Generating crop health assessment...
- Analysis complete

---

## 10. AUTH + ONBOARDING (UI ONLY)

**Do not implement real Google OAuth, phone OTP, or a live Supabase client** unless already in the repo (it is not).

**Do not require login to scan.**

Guest path: Landing → Scan → Upload → Analyze → Result.  
**Save Result** may request authentication.

Auth UI (clean, trustworthy):

- Continue with Google (button that shows a clear “Coming soon / will connect to Google” toast or disabled-with-explanation — **do not fake a successful Google login**)
- Email + password fields

Signup: Name, Email, Password only. Then **short** onboarding: farmer name, farm name, location, primary crops — map into existing `agrismart_settings` where possible.

Prepare DOM/`data-` hooks so Supabase Auth can attach later (e.g. `#auth-google`, `#auth-form`, `#auth-email`, `#auth-password`). Optional local flag `agrismart_auth_ui` is allowed if it does not break existing keys; default guest.

If you add `login.html`, link it from nav as Login; after “session” mock, show Profile → settings. Keep it obviously a demo session if you simulate one with localStorage.

---

## 11. PAGE REQUIREMENTS

### 11.1 Landing — `index.html`

Nav: Logo / AgriSmart AI, Scan Crop, Dashboard, Insights, Login (History/Settings can live in footer or overflow menu on mobile). **Scan Crop is visually dominant.**

Hero: “Smarter Crop Health with AI” + simple supporting line. Primary CTA **Scan Crop**. Secondary **Login** (not Dashboard). Premium agricultural hero using existing `hero-field.svg` + subtle analysis overlay (scan line / small markers). Not a sci-fi HUD.

Sections (scannable, short copy): Nav, Hero, Trust/value indicators, How it works, Core features, AI analysis preview, Benefits for farmers, CTA, Footer.

### 11.2 Scan — `scan.html` (highest UX priority)

Headline: “Check your crop health”  
Support: “Upload a clear photo of a crop leaf or plant.”  
Actions: Choose Image, Use Camera. Formats + 10 MB visible.

Drag-over: subtle scale, border, green accent — no carnival motion.

After upload: prominent real preview, remove/change, metadata, **“Ready for AI Analysis”**, Analyze as strongest action.

Optional details behind “Add crop details (optional)” (`<details>` or equivalent). Fields if useful: Crop, Variety, Growth Stage, Location, Notes. Analyze must work with details empty. If you pass hints into `analyzeCrop`, keep them optional extras; mock API may ignore them until backend exists.

**Signature analysis:** keep the uploaded image visible with overlay scan animation (vertical line and/or soft region markers). Progress text as in §9. Honor `prefers-reduced-motion` (static image + text steps, no looping scan). This is the most impressive loading state in the app.

### 11.3 Result — `result.html`

Visual **AI Health Assessment**:

1. Crop image  
2. Overall health status (Healthy / Moderate Risk / High Risk)  
3. Detected condition  
4. Confidence (animated bar + % + microcopy)  
5. Key observations (map from `symptoms` + `explanation`)  
6. Recommendations grouped: Immediate attention, What to monitor, General care — you may **split the existing `recommendations[]` heuristically** (e.g. first item immediate, last general) without inventing new agronomy  
7. Save Result, Scan Another Crop (keep Print as secondary)

Must answer: What is wrong? How serious? What next?

Save: guest → auth panel/modal, then `saveScan`. Logged-in/demo-session → save + button → saved/check state.

### 11.4 Dashboard — `dashboard.html`

**Farm Health Dashboard**, not corporate KPIs.

Hierarchy: Header → Farm Health overview (Good / Needs attention derived from existing stats — honest about “based on scans on this device”) → Scan New Crop CTA → Recent assessments (clickable, thumbnails if `imageDataUrl`) → Crop health overview → Insights teaser.

Farm Health example language: Healthy crops / Needs attention / High risk counts. Subtle ring or distribution — **no fake map**. Count-up OK if `prefers-reduced-motion` respected.

Remove emoji. Keep greeting + farm name from settings.

Do not treat `weekly` as real weather/season analytics; label as scan activity from stored records or replace with a health mix using real `getDashboardStats` / history.

### 11.5 History — `history.html`

Keep search, crop, risk, date filters. Improve to timeline/list with status, thumbnail, condition, confidence, date. Distinct empty and no-match states. Primary empty CTA: “Scan Your First Crop”.

### 11.6 Insights — `insights.html`

Title: Farm Insights. Patterns: most scanned crop, common issue, health mix, crops needing attention. Simple mobile-friendly visuals. No decorative charts. Empty state with Scan CTA.

### 11.7 Settings — `settings.html`

Group: Profile, Farm, Preferences, Notifications, Appearance, Data, About. Keep existing fields. Dangerous **Clear Scan History** needs in-page confirmation (not only `window.confirm`).

### 11.8 404

Useful recovery: Home + Scan Crop (Dashboard secondary).

---

## 12. COMPONENT SYSTEM (CSS)

Reusable classes for: buttons, cards, badges, status indicators, navigation, forms, inputs, modals, alerts, empty states, loading/skeletons, crop cards, result sections, confidence bars, scan controls.

Use CSS variables and consistent spacing scale. Avoid duplicated one-off CSS and inline styles (today several `style=` on HTML — clean those up as you touch pages).

Micro-interactions: hover/active/focus/disabled buttons; card hover elevation; nav active indicator; dropzone drag; analyze loading; confidence reveal; save → saved; optional KPI count-up. Fast, natural, purposeful.

Page transitions: light CSS only. Never delay users for decoration.

---

## 13. ACCESSIBILITY, MOBILE, PERFORMANCE

- Semantic HTML, keyboard, visible focus, labels, alt text, ARIA only where needed
- Contrast for outdoor/sunlight: no glass fog, no tiny gray text
- Touch targets ≥ 44px; Scan reachable on mobile (sticky CTA on scan if it helps)
- Breakpoints to verify: 320, 360, 375, 390, 414, 768, 1024, 1440+
- No horizontal scroll, no overlapping, no clipped text
- `prefers-reduced-motion: reduce`
- No new large libraries; optimize images/CSS/JS; avoid layout shift (reserve header height)

---

## 14. IMPLEMENTATION PHASES

**Phase 1 — Design system** in `css/style.css` (+ responsive): tokens, type, buttons, badges, status, forms, empty/error, motion. Update `app.js` header/footer/nav (Scan Crop dominant, Login, mobile menu). Keep `NAV_ITEMS` working with `aria-current`.

**Phase 2 — Landing** `index.html`

**Phase 3 — Scan** `scan.html` + `scan.js` (highest care)

**Phase 4 — Result** `result.html` + `result.js` (escape HTML)

**Phase 5 — Dashboard** `dashboard.html` + `dashboard.js`

**Phase 6 — History, Insights, Settings, 404**

**Phase 7 — Responsive pass**

**Phase 8 — Motion / micro-interactions**

**Phase 9 — Accessibility pass**

**Phase 10 — QA** using the checklist below

After each major phase: functionality + responsiveness + accessibility + visual consistency.

---

## 15. QA CHECKLIST

**Landing:** nav, Scan Crop, Login, CTA dominance, responsive, no fluff walls.

**Scan:** file select, camera, drag/drop, invalid type, oversized, preview, remove, optional details don’t block analyze, loading overlay, reduced motion, error restore, navigates to result.

**Result:** missing result empty state, health label mapping, confidence viz, observations, grouped recommendations, disclaimer, save (guest vs saved state), scan again, print still works, escaped text.

**History:** search, crop, risk (`Low|Moderate|High`), date, empty vs no matches, open result.

**Dashboard:** farm health from real `getDashboardStats`/history, recent scans clickable, Scan CTA, no fake satellite/weather.

**Insights:** useful patterns, empty state, honest demo labeling.

**Settings:** save, theme, confirm clear history, about.

**404:** recovery links.

**Cross-cutting:** localStorage keys intact, seed still works, demo diagnoses still appear, dark theme, keyboard, focus, 320–1440 layouts.

**SIH bar:** Does it look like a real AgriTech startup, not a student template or AI green-card dashboard? Can a farmer start scanning in 10 seconds? Is the analysis moment memorable? Readable outdoors?

---

## 16. CODE QUALITY

- Semantic HTML, clean CSS variables, reusable classes
- Modular JS; keep IIFE + `AgriAPI` / `AgriApp` globals
- Meaningful names; comments only where behavior is non-obvious
- No inline JS; minimize inline CSS
- Use `escapeHtml` for all dynamic strings in innerHTML
- Do not delete `deleteScan` from API even if UI doesn’t expose it yet

---

## 17. SIH DIFFERENTIATORS (DESIGN TOWARD THESE)

1. Exceptional crop scanning  
2. Signature AI analysis animation  
3. Visual AI Health Assessment  
4. Farm Health Dashboard  
5. Excellent mobile-first UX  
6. Farmer-friendly language  
7. Natural + premium identity (not all-green cards)  
8. Useful scan history  
9. Insightful health trends from **actual stored scans**  
10. Guest-first scanning  

Judges should understand WHAT IT DOES in 5 seconds. Users start scanning in 10. Analysis feels fast, trustworthy, intelligent. Result answers what / how serious / what next.

Prioritize: UX > decoration. Usability > effects. Clarity > complexity. Originality > templates. Usefulness > flashy fake features.

---

## 18. START NOW

Inspect `frontend/` completely. Confirm the contracts in this prompt against the files. Then implement Phase 1 (design system + global nav) and continue through Phase 10 without stopping for permission after each phase unless a product decision is blocked.

Do not finish with a superficial restyle of the same six cards. Build a competition-ready AgriTech product on the existing foundation.
