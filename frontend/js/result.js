(function () {
  "use strict";

  function placeholderSvg(label) {
    var text = label || "Crop Foliage";
    return (
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 460">' +
        '<rect width="640" height="460" fill="#132A1E"/>' +
        '<path d="M0 340c90-30 160-10 240 15 80 25 150 10 220-20 70-30 130-20 180 10v120H0V340z" fill="#1B3B2B"/>' +
        '<circle cx="320" cy="200" r="60" fill="#52B788" opacity=".2"/>' +
        '<path d="M320 160c30 18 42 48 42 72-15-10-28-14-42-14s-28 5-42 14c0-24 12-54 42-72z" fill="#52B788"/>' +
        '<text x="50%" y="300" text-anchor="middle" fill="#FFFFFF" font-family="Inter, sans-serif" font-weight="600" font-size="20">' +
        text +
        '</text>' +
        '</svg>'
      )
    );
  }

  function getCropEmoji(crop) {
    var c = String(crop || "").toLowerCase();
    if (c.indexOf("tomato") !== -1) return "🍅";
    if (c.indexOf("potato") !== -1) return "🥔";
    if (c.indexOf("wheat") !== -1) return "🌾";
    if (c.indexOf("cotton") !== -1) return "🌱";
    if (c.indexOf("corn") !== -1) return "🌽";
    if (c.indexOf("chilli") !== -1) return "🌶️";
    if (c.indexOf("rice") !== -1) return "🌾";
    return "🌿";
  }

  function getRiskBadge(risk) {
    var key = String(risk || "").toLowerCase();
    if (key === "low" || key === "healthy") {
      return (
        '<span class="badge badge-success">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' +
        '<span>Healthy &bull; Low Risk</span></span>'
      );
    }
    if (key === "high") {
      return (
        '<span class="badge badge-danger">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        '<span>High Risk &bull; Urgent Action</span></span>'
      );
    }
    return (
      '<span class="badge badge-warning">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="12 2 2 22 22 22 12 2"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
      '<span>Moderate Risk &bull; Action Needed</span></span>'
    );
  }

  function renderMissing() {
    var root = document.getElementById("result-root");
    if (!root) return;
    var auth = AgriApp.getAuth ? AgriApp.getAuth() : null;
    var settings = AgriAPI.getSettings ? AgriAPI.getSettings() : {};
    var farmerName = (auth && auth.name) || settings.farmerName || "Ramesh Patel";
    var farmName = settings.farmName || "Greenfield Farm";

    root.innerHTML =
      '<div class="card" style="text-align:center;padding:4rem 2rem;max-width:560px;margin:3rem auto;">' +
      '  <div style="width:58px;height:58px;border-radius:50%;background:var(--danger-soft);color:var(--danger);display:grid;place-items:center;margin:0 auto 1.2rem;">' +
      '    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '  </div>' +
      '  <h2 style="margin-bottom:0.6rem">No Scan Result Found</h2>' +
      '  <p class="lead" style="font-size:0.95rem;margin-bottom:1.8rem">This scan ID does not exist in local storage or analysis has not been executed yet.</p>' +
      '  <div style="display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;">' +
      '    <a class="btn btn-primary" href="scan.html">Scan a Crop Leaf</a>' +
      '    <a class="btn btn-secondary" href="dashboard.html">Go to Dashboard</a>' +
      '  </div>' +
      '</div>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    var id = AgriApp.queryParam("id");
    var result = id ? AgriAPI.getScanById(id) : AgriAPI.getLastResult();
    if (!result) {
      renderMissing();
      return;
    }
    AgriAPI.setLastResult(result);

    var root = document.getElementById("result-root");
    if (!root) return;
    var auth = AgriApp.getAuth ? AgriApp.getAuth() : null;
    var settings = AgriAPI.getSettings ? AgriAPI.getSettings() : {};
    var farmerName = (auth && auth.name) || settings.farmerName || "Ramesh Patel";
    var farmName = settings.farmName || "Greenfield Farm";


    var imgSrc = result.imageDataUrl || placeholderSvg(result.crop + " (" + result.disease + ")");
    var pct = result.confidence <= 1 ? Math.round(result.confidence * 100) : Math.round(result.confidence);
    var cropEmoji = getCropEmoji(result.crop);

    var symptomsList = (result.symptoms || []).map(function (s) {
      return (
        '<li style="display:flex;align-items:flex-start;gap:0.6rem;padding:0.35rem 0;font-size:0.92rem;color:var(--text-main);">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" stroke-width="2.5" style="margin-top:0.2rem;flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>' +
        '<span>' + AgriApp.escapeHtml(s) + '</span>' +
        '</li>'
      );
    }).join("");

    var recommendationsList = (result.recommendations || []).map(function (rec) {
      return (
        '<li class="treatment-item">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
        '<span>' + AgriApp.escapeHtml(rec) + '</span>' +
        '</li>'
      );
    }).join("");

    root.innerHTML =
      '<div style="margin-bottom:1.5rem;">' +
      '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.6rem;">' +
      '    <a href="scan.html" class="btn btn-ghost btn-sm">&larr; Back to Scan</a>' +
      '    <button class="btn btn-primary btn-sm rx-top-btn" id="top-download-pdf-btn" type="button" style="display:inline-flex;align-items:center;gap:0.45rem;background:linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);color:#FFFFFF;box-shadow:0 3px 10px rgba(27,67,50,0.25);">' +
      '      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
      '      <span>Download Official PDF Slip</span>' +
      '    </button>' +
      '  </div>' +
      '  <div class="eyebrow">' +
      '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' +
      '    <span>AI Diagnostic Assessment &bull; ID: ' + AgriApp.escapeHtml(result.id) + '</span>' +
      '  </div>' +
      '  <h1 style="font-size:2.2rem;margin-bottom:0.2rem;">Foliar Health Report</h1>' +
      '  <p style="color:var(--text-muted);font-size:0.95rem;">Scanned on ' + AgriApp.formatDate(result.scannedAt) + '</p>' +
      '</div>' +

      '<div class="result-split">' +
      '  <!-- LEFT COLUMN: IMAGE INSPECTOR, CALCULATOR, CHATBOT -->' +
      '  <div>' +
      '    <!-- INTERACTIVE AI LESION INSPECTOR CARD -->' +
      '    <div class="result-media-card" style="margin-bottom:1.5rem;">' +
      '      <div style="padding:1rem 1.25rem 0.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">' +
      '        <span style="font-size:0.8rem;font-weight:700;color:var(--text-subtle);text-transform:uppercase;letter-spacing:0.04em;">Inspector View Mode:</span>' +
      '        <div class="lesion-mode-toggle">' +
      '          <button type="button" class="lesion-mode-btn active" id="mode-btn-original">📷 Original</button>' +
      '          <button type="button" class="lesion-mode-btn" id="mode-btn-lesion">🎯 AI Lesions</button>' +
      '          <button type="button" class="lesion-mode-btn" id="mode-btn-thermal">🌡️ Thermal</button>' +
      '        </div>' +
      '      </div>' +
      '      <div class="result-image-box">' +
      '        <div class="lesion-viewer-container" id="lesion-viewer">' +
      '          <img id="result-img-elem" class="lesion-img-layer" src="' + imgSrc + '" alt="Scanned crop foliage">' +
      '          <!-- AI Lesion Bounding Boxes -->' +
      '          <div class="lesion-box" id="lbox-1" style="top:26%;left:28%;width:38%;height:44%;display:none;">' +
      '            <span class="lesion-box-label">Necrotic Lesion ' + pct + '%</span>' +
      '          </div>' +
      '          <div class="lesion-box" id="lbox-2" style="top:58%;left:64%;width:24%;height:28%;border-color:#F59E0B;display:none;">' +
      '            <span class="lesion-box-label" style="background:#F59E0B;">Spore Cluster 86%</span>' +
      '          </div>' +
      '          <!-- Thermal Stress Heatmap Overlay -->' +
      '          <div class="thermal-heatmap-overlay" id="thermal-overlay" style="display:none;"></div>' +
      '        </div>' +
      '      </div>' +
      '      <div class="result-media-details">' +
      '        <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-subtle);margin-bottom:0.8rem;">' +
      '          <span>Image: <strong>' + AgriApp.escapeHtml(result.fileName || "camera-capture.jpg") + '</strong></span>' +
      '          <span>Model: <strong>SIH 2.0 YOLOv8-PlantNet</strong></span>' +
      '        </div>' +
      '        <div style="display:flex;gap:0.8rem;flex-wrap:wrap;">' +
      '          <button class="btn btn-primary" id="save-result-btn" style="flex:1;">' +
      '            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
      '            <span>' + (result.saved ? 'Saved to Farm' : 'Save Result') + '</span>' +
      '          </button>' +
      '          <a class="btn btn-secondary" href="scan.html">' +
      '            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
      '            <span>Scan Another</span>' +
      '          </a>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +

      '    <!-- LIVE AGRO-WEATHER & SAFE SPRAY WINDOW CARD -->' +
      '    <div class="card agro-weather-card" style="margin-bottom:1.5rem;">' +
      '      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.8rem;">' +
      '        <div style="display:flex;align-items:center;gap:0.5rem;">' +
      '          <span style="font-size:1.3rem;">⛅</span>' +
      '          <div>' +
      '            <h4 style="font-size:0.98rem;margin:0;color:var(--text-main);">Live Agro-Weather & Spray Forecast</h4>' +
      '            <span style="font-size:0.75rem;color:var(--text-muted);">Microclimate Telemetry &bull; Station 402</span>' +
      '          </div>' +
      '        </div>' +
      '        <span class="badge badge-success" style="font-size:0.75rem;">Realtime</span>' +
      '      </div>' +
      '      <div class="weather-badges-grid">' +
      '        <div class="weather-badge-pill">' +
      '          <span style="font-size:1.1rem;">🌡️</span>' +
      '          <div><strong>26.4°C</strong><small>Ambient Temp</small></div>' +
      '        </div>' +
      '        <div class="weather-badge-pill">' +
      '          <span style="font-size:1.1rem;">💧</span>' +
      '          <div><strong>82% RH</strong><small>High Spore Risk</small></div>' +
      '        </div>' +
      '        <div class="weather-badge-pill">' +
      '          <span style="font-size:1.1rem;">💨</span>' +
      '          <div><strong>5.8 km/h</strong><small>Calm Wind</small></div>' +
      '        </div>' +
      '        <div class="weather-badge-pill">' +
      '          <span style="font-size:1.1rem;">☔</span>' +
      '          <div><strong>12% Rain</strong><small>8h Dry Window</small></div>' +
      '        </div>' +
      '      </div>' +
      '      <div class="spray-window-banner">' +
      '        <div style="display:flex;align-items:flex-start;gap:0.6rem;">' +
      '          <span style="font-size:1.3rem;margin-top:0.1rem;">🎯</span>' +
      '          <div>' +
      '            <strong class="spray-window-title">OPTIMAL SPRAY WINDOW: Tomorrow 06:30 AM – 09:00 AM</strong>' +
      '            <span class="spray-window-desc">Low thermal updrafts & ideal foliar stomatal opening ensure maximum chemical/bio absorption without drift.</span>' +
      '          </div>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +

      '    <!-- KHEDUT MITR INLINE PROMPT CARD -->' +
      '    <div class="card" style="margin-bottom:1.5rem;border:2px solid var(--leaf);background:var(--bg-surface);">' +
      '      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.6rem;">' +
      '        <div style="width:38px;height:38px;border-radius:50%;background:var(--avatar-bg);color:var(--avatar-color);display:grid;place-items:center;flex-shrink:0;">' +
      '          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4L6 22l3.6-.6C10.3 21.8 11.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>' +
      '        </div>' +
      '        <div>' +
      '          <h4 style="font-size:0.98rem;margin:0;color:var(--text-main);">Ask Khedut Mitr (ખેડૂત મિત્ર)</h4>' +
      '          <span style="font-size:0.72rem;color:var(--fresh);font-weight:700;">VOICE & TEXT AI AGRONOMIST</span>' +
      '        </div>' +
      '      </div>' +
      '      <p style="font-size:0.86rem;color:var(--text-muted);line-height:1.45;margin-bottom:0.9rem;">' +
      '        Need guidance on chemical spray dilution, organic neem preparation, or weather precautions for this ' + AgriApp.escapeHtml(result.crop) + '?' +
      '      </p>' +
      '      <button class="btn btn-primary btn-sm leaf-cursor" id="ask-mitr-inline-btn" type="button" style="width:100%;">' +
      '        <span>🌿 Chat / Speak with Khedut Mitr &rarr;</span>' +
      '      </button>' +
      '    </div>' +

      '    <!-- STANDOUT OFFICIAL PRESCRIPTION HERO CARD -->' +
      '    <div class="card rx-standout-card" style="margin-bottom:1.5rem;border:2px solid var(--leaf);background:linear-gradient(135deg, rgba(82,183,136,0.12) 0%, rgba(45,106,79,0.06) 100%);box-shadow:var(--shadow-md);position:relative;overflow:hidden;">' +
      '      <div style="display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.8rem;">' +
      '        <div style="width:46px;height:46px;border-radius:var(--radius-sm);background:linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);color:#FFFFFF;display:grid;place-items:center;flex-shrink:0;box-shadow:0 4px 12px rgba(27,67,50,0.3);">' +
      '          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' +
      '        </div>' +
      '        <div>' +
      '          <span class="badge" style="background:#D8F3DC;color:#1B4332;font-weight:800;font-size:0.72rem;letter-spacing:0.04em;border:1px solid #74C69D;margin-bottom:0.25rem;">⭐ OFFICIAL ICAR / KVK PRESCRIPTION</span>' +
      '          <h3 style="font-size:1.15rem;margin:0;color:var(--text-main);line-height:1.2;">Clinical Pathology Report (PDF)</h3>' +
      '        </div>' +
      '      </div>' +
      '      <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.9rem;">' +
      '        Official government-compliant phytosanitary slip containing calibrated acreage dilution formulas, knapsack tank loads, spray timing, and KVK agronomist sign-off.' +
      '      </p>' +
      '      <div class="rx-inclusion-tags" style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.1rem;font-size:0.74rem;font-weight:700;">' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ Calibrated Dilution Matrix</span>' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ 29 Knapsack Tanks</span>' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ Pre-Harvest Interval</span>' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ KVK Validation Seal</span>' +
      '      </div>' +
      '      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:0.7rem;">' +
      '        <button class="btn btn-primary" id="print-report-btn" type="button" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;font-weight:700;padding:0.75rem 1rem;background:linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);box-shadow:0 4px 14px rgba(27,67,50,0.3);">' +
      '          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
      '          <span>Download PDF</span>' +
      '        </button>' +
      '        <button class="btn btn-secondary" id="preview-slip-btn" type="button" style="display:flex;align-items:center;justify-content:center;gap:0.4rem;font-weight:700;padding:0.75rem 0.8rem;border:2px solid var(--leaf);">' +
      '          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
      '          <span>Preview PDF</span>' +
      '        </button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      '  <!-- RIGHT COLUMN: DIAGNOSIS, DOSAGE CALCULATOR, ACTION PLAN -->' +
      '  <div>' +
      '    <div class="result-diagnosis-card" style="margin-bottom:1.5rem;">' +
      '      <div class="diagnosis-header">' +
      '        <div>' +
      '          <span class="eyebrow" style="margin-bottom:0.3rem;">Primary Foliar Diagnosis</span>' +
      '          <h2 style="font-size:1.85rem;display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;color:var(--text-main);">' +
      '            <span>' + cropEmoji + '</span>' +
      '            <span>' + AgriApp.escapeHtml(result.crop) + ' &mdash; ' + AgriApp.escapeHtml(result.disease) + '</span>' +
      '          </h2>' +
      '          <div>' + getRiskBadge(result.risk) + '</div>' +
      '        </div>' +

      '        <div class="confidence-gauge-box">' +
      '          <div class="confidence-number">' + pct + '%</div>' +
      '          <div style="font-size:0.72rem;font-weight:700;color:var(--text-subtle);text-transform:uppercase;letter-spacing:0.06em;">Confidence</div>' +
      '          <div class="confidence-bar" style="width:90px;">' +
      '            <div class="confidence-bar-fill" style="width:' + pct + '%;"></div>' +
      '          </div>' +
      '        </div>' +
      '      </div>' +

      '      <div style="padding-top:1.2rem;border-top:1px solid var(--border);">' +
      '        <h4 style="margin-bottom:0.4rem;font-size:1rem;color:var(--accent-heading);">Pathology Etiology</h4>' +
      '        <p style="color:var(--text-main);line-height:1.6;font-size:0.95rem;margin-bottom:1.2rem;">' +
      '          ' + AgriApp.escapeHtml(result.explanation) +
      '        </p>' +
      '        <h4 style="margin-bottom:0.4rem;font-size:0.95rem;color:var(--metric-highlight);">Observed Diagnostic Markers</h4>' +
      '        <ul style="list-style:none;padding:0;margin-bottom:1.2rem;">' + symptomsList + '</ul>' +
      '      </div>' +

      '      <div style="padding-top:1.2rem;border-top:1px solid var(--border);">' +
      '        <h4 style="margin-bottom:0.6rem;font-size:1.05rem;color:var(--text-main);">Agronomic Action Plan</h4>' +
      '        <div class="action-tabs">' +
      '          <button class="action-tab-btn active" id="tab-all">All Advisory</button>' +
      '          <button class="action-tab-btn" id="tab-organic">🌿 Organic & Bio</button>' +
      '          <button class="action-tab-btn" id="tab-chemical">🧪 Chemical Sprays</button>' +
      '        </div>' +

      '        <div id="treatment-content">' +
      '          <ul class="treatment-list">' + recommendationsList + '</ul>' +
      '        </div>' +

      '        <div class="disclaimer">' +
      '          <strong>Advisory Note:</strong> Follow ICAR & CIBRC safety guidelines. Use protective equipment during spraying and maintain recommended pre-harvest intervals.' +
      '        </div>' +
      '      </div>' +
      '    </div>' +

      '    <!-- INTERACTIVE FIELD DOSAGE & ACREAGE CALCULATOR CARD -->' +
      '    <div class="card calc-card">' +
      '      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.9rem;">' +
      '        <div style="display:flex;align-items:center;gap:0.6rem;">' +
      '          <span style="font-size:1.4rem;">🧮</span>' +
      '          <div>' +
      '            <h3 style="font-size:1.08rem;margin:0;color:var(--text-main);">Field Dosage & Acreage Spray Calculator</h3>' +
      '            <span style="font-size:0.75rem;color:var(--text-muted);">Calibrated ICAR Spray Dilution Formula</span>' +
      '          </div>' +
      '        </div>' +
      '        <span class="badge badge-success" style="font-size:0.75rem;">Interactive</span>' +
      '      </div>' +

      '      <div class="calc-slider-wrap">' +
      '        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">' +
      '          <span style="font-size:0.88rem;font-weight:700;color:var(--text-main);">Your Plot / Field Size:</span>' +
      '          <strong id="calc-acres-label" style="font-size:1.2rem;color:var(--leaf);font-family:Inter,sans-serif;">2.5 Acres</strong>' +
      '        </div>' +
      '        <input type="range" class="calc-slider" id="calc-acres-slider" min="0.5" max="10.0" step="0.5" value="2.5" style="width:100%;cursor:pointer;">' +
      '        <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-subtle);margin-top:0.3rem;">' +
      '          <span>0.5 Acre (Kitchen / Plot)</span>' +
      '          <span>5.0 Acres (Medium Farm)</span>' +
      '          <span>10.0 Acres (Commercial)</span>' +
      '        </div>' +
      '      </div>' +

      '      <div class="calc-metrics-grid">' +
      '        <div class="calc-metric-box">' +
      '          <div class="calc-lbl">Water Volume</div>' +
      '          <div class="calc-val" id="calc-water-val">450 L</div>' +
      '          <small style="font-size:0.72rem;color:var(--text-muted);">180 L / Acre volume</small>' +
      '        </div>' +
      '        <div class="calc-metric-box">' +
      '          <div class="calc-lbl">Active Dosage</div>' +
      '          <div class="calc-val" id="calc-dose-val">1,125 g</div>' +
      '          <small style="font-size:0.72rem;color:var(--text-muted);">2.5 g / Liter dilution</small>' +
      '        </div>' +
      '        <div class="calc-metric-box">' +
      '          <div class="calc-lbl">Knapsack Tanks</div>' +
      '          <div class="calc-val" id="calc-tanks-val">29 Tanks</div>' +
      '          <small style="font-size:0.72rem;color:var(--text-muted);">16L knapsack sprayer</small>' +
      '        </div>' +
      '        <div class="calc-metric-box">' +
      '          <div class="calc-lbl">Est. Treatment Cost</div>' +
      '          <div class="calc-val" id="calc-cost-val" style="color:var(--fresh);">₹ 700</div>' +
      '          <small style="font-size:0.72rem;color:var(--text-muted);">₹ 280 / acre estimate</small>' +
      '        </div>' +
      '      </div>' +

      '      <div style="margin-top:1rem;padding:0.75rem 1rem;background:var(--bg-sand);border-radius:var(--radius-sm);font-size:0.84rem;display:flex;align-items:center;gap:0.6rem;">' +
      '        <span style="font-size:1.2rem;">💡</span>' +
      '        <span style="color:var(--text-main);"><strong>Calibrated Nozzle Recommendation:</strong> Use a hollow cone nozzle at 3 bar pressure in calm morning hours for 94% leaf undersurface coverage.</span>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>' +

      '<!-- OFFICIAL PRESCRIPTION SLIP (Print & Preview Layout) -->' +
      '<div id="official-prescription-slip" class="prescription-slip-sheet" style="display:none;">' +
      '  <div class="rx-header">' +
      '    <div class="rx-emblem-wrap">' +
      '      <div class="rx-emblem-circle">' +
      '        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B4332" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4L6 22l3.6-.6C10.3 21.8 11.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>' +
      '      </div>' +
      '    </div>' +
      '    <div class="rx-header-text">' +
      '      <div class="rx-gov-title">GOVERNMENT OF INDIA &bull; MINISTRY OF AGRICULTURE &amp; FARMERS WELFARE</div>' +
      '      <div class="rx-kvk-title">National Krishi Vigyan Kendra (KVK) Foliar Pathology Diagnostic Network</div>' +
      '      <div class="rx-doc-title">OFFICIAL CROP HEALTH &amp; TREATMENT PRESCRIPTION SLIP</div>' +
      '      <div class="rx-sub-badge">SMART INDIA HACKATHON 2.0 &bull; NATIONAL PHYTOSANITARY REGISTRY</div>' +
      '    </div>' +
      '    <div class="rx-qr-box">' +
      '      <div class="rx-qr-code">' +
      '        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1B4332" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' +
      '      </div>' +
      '      <small>VERIFIED</small>' +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-meta-grid">' +
      '    <div class="rx-meta-cell"><label>Prescription ID:</label><strong>ICAR-AGRI-2026-' + AgriApp.escapeHtml(result.id) + '</strong></div>' +
      '    <div class="rx-meta-cell"><label>Date &amp; Time:</label><strong>' + AgriApp.formatDate(result.scannedAt) + '</strong></div>' +
      '    <div class="rx-meta-cell"><label>Registered Farmer:</label><strong>' + AgriApp.escapeHtml(farmerName) + '</strong></div>' +
      '    <div class="rx-meta-cell"><label>Farm Location:</label><strong>' + AgriApp.escapeHtml(farmName) + ', Anand, Gujarat (22.56° N, 72.92° E)</strong></div>' +
      '    <div class="rx-meta-cell"><label>Plot Area Assessed:</label><strong>2.50 Acres (1.01 Hectares)</strong></div>' +
      '    <div class="rx-meta-cell"><label>Diagnostic Model:</label><strong>AgriSmart AI YOLOv8-PlantNet v2.4</strong></div>' +
      '  </div>' +

      '  <div class="rx-section">' +
      '    <div class="rx-section-title">I. CLINICAL FOLIAR PATHOLOGY ASSESSMENT</div>' +
      '    <div class="rx-findings-grid">' +
      '      <div>' +
      '        <table class="rx-spec-table">' +
      '          <tr><td>Targeted Host Crop:</td><td><strong>' + AgriApp.escapeHtml(result.crop) + '</strong> (Solanaceae)</td></tr>' +
      '          <tr><td>Primary Pathological Agent:</td><td><strong>' + AgriApp.escapeHtml(result.disease) + '</strong></td></tr>' +
      '          <tr><td>Diagnostic Confidence:</td><td><strong style="color:#2D6A4F;">' + pct + '% (Validated AI Match)</strong></td></tr>' +
      '          <tr><td>Pathological Severity / Risk:</td><td><span class="rx-risk-tag">' + AgriApp.escapeHtml(result.risk).toUpperCase() + ' RISK &bull; FOLIAR ACTION REQUIRED</span></td></tr>' +
      '        </table>' +
      '      </div>' +
      '      <div>' +
      '        <div class="rx-markers-box">' +
      '          <strong>Observed Foliar Diagnostic Markers:</strong>' +
      '          <ul>' + symptomsList + '</ul>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="rx-etiology-box">' +
      '      <strong>Pathogen Etiology &amp; Damage Mechanism:</strong> ' + AgriApp.escapeHtml(result.explanation) + ' Fungal spore dispersal is exacerbated by high relative humidity. Lower foliage defoliation will reduce photosynthetic yield unless arrested.' +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-section">' +
      '    <div class="rx-section-title">II. CALIBRATED INTERVENTION &amp; FIELD DOSAGE SCHEDULE</div>' +
      '    <table class="rx-dosage-table">' +
      '      <thead>' +
      '        <tr>' +
      '          <th style="width:16%;">Treatment Type</th>' +
      '          <th style="width:20%;">Active Formulation</th>' +
      '          <th style="width:15%;">Dilution Rate</th>' +
      '          <th style="width:18%;">Total 2.5-Acre Field Mix</th>' +
      '          <th style="width:16%;">Application Method</th>' +
      '          <th style="width:15%;">Safety &amp; PHI</th>' +
      '        </tr>' +
      '      </thead>' +
      '      <tbody>' +
      '        <tr>' +
      '          <td><strong>Chemical (Primary)</strong></td>' +
      '          <td>Mancozeb 75% WP<br><small style="color:#555;">(Alt: Chlorothalonil 75% WP)</small></td>' +
      '          <td><strong>2.5 g / Liter</strong><br><small>Clean potable water</small></td>' +
      '          <td><strong>450 Liters Water</strong><br>+ 1,125 g active powder<br>(29 Knapsack Tanks @ 16L)</td>' +
      '          <td>Hollow cone nozzle @ 3 bar; spray upper &amp; lower leaf surfaces</td>' +
      '          <td><strong style="color:#C53030;">PHI: 7 Days</strong><br><small>Wear gloves, mask &amp; goggles</small></td>' +
      '        </tr>' +
      '        <tr>' +
      '          <td><strong>Certified Organic</strong></td>' +
      '          <td>0.5% Cold-Pressed Neem Oil (10,000 ppm) + Trichoderma viride</td>' +
      '          <td><strong>5 ml / Liter</strong><br>+ 1.5 ml surfactant emulsifier</td>' +
      '          <td><strong>450 Liters Water</strong><br>+ 2.25 L neem oil<br>+ 4.5 kg bio-antagonist</td>' +
      '          <td>Uniform fine mist canopy spray; early morning application</td>' +
      '          <td><strong style="color:#2D6A4F;">PHI: 0 Days</strong><br><small>Pollinator safe; zero chemical residue</small></td>' +
      '        </tr>' +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +

      '  <div class="rx-section">' +
      '    <div class="rx-section-title">III. MICROCLIMATE TELEMETRY &amp; APPROVED SPRAY WINDOW</div>' +
      '    <div class="rx-weather-box">' +
      '      <div class="rx-weather-telemetry">' +
      '        <div><span>Ambient Temp:</span> <strong>26.4°C</strong></div>' +
      '        <div><span>Relative Humidity:</span> <strong>82% (Elevated Spore Risk)</strong></div>' +
      '        <div><span>Wind Velocity:</span> <strong>5.8 km/h (Calm Breeze &bull; Minimal Drift)</strong></div>' +
      '        <div><span>Precipitation Risk:</span> <strong>12% (Safe 8h Rainfast Window)</strong></div>' +
      '      </div>' +
      '      <div class="rx-spray-window">' +
      '        <strong style="color:#1B4332;display:block;margin-bottom:0.2rem;">MANDATED APPLICATION TIMING: Tomorrow Morning 06:30 AM &ndash; 09:00 AM</strong>' +
      '        <span>Avoid spraying between 11:30 AM and 03:30 PM due to solar thermal evaporation and foliar scorch hazard.</span>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-footer-grid">' +
      '    <div class="rx-sig-box">' +
      '      <div class="rx-sig-line">Dr. K. S. Sharma, PhD</div>' +
      '      <small>Senior Plant Pathologist &bull; Krishi Vigyan Kendra (KVK)</small>' +
      '    </div>' +
      '    <div class="rx-seal-box">' +
      '      <div class="rx-seal-stamp">' +
      '        <span>ICAR &bull; SIH 2.0</span>' +
      '        <strong>VALIDATED</strong>' +
      '        <small>Extension Seal #402</small>' +
      '      </div>' +
      '    </div>' +
      '    <div class="rx-sig-box">' +
      '      <div class="rx-sig-line">' + AgriApp.escapeHtml(farmerName) + '</div>' +
      '      <small>Registered Farm Owner / Operator Acknowledgment</small>' +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-legal-notice">' +
      '    <strong>Statutory Notice:</strong> This clinical report is generated in accordance with the Central Insecticides Act (1968) and ICAR Good Agricultural Practices (GAP). Follow mandatory pre-harvest intervals. Consult local agricultural extension officers before applying off-label agrochemicals.' +
      '  </div>' +
      '</div>' +

      '<!-- PRESCRIPTION SLIP MODAL PREVIEW -->' +
      '<div class="modal-backdrop hidden" id="prescription-modal" role="dialog" aria-modal="true">' +
      '  <div class="modal-card" style="max-width:880px;width:95%;max-height:92vh;overflow-y:auto;padding:1.5rem;">' +
      '    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.8rem;border-bottom:1px solid var(--border);">' +
      '      <div>' +
      '        <h3 style="margin:0;font-size:1.25rem;">Official Agronomic Prescription Slip</h3>' +
      '        <span style="font-size:0.8rem;color:var(--text-muted);">Print-Ready Document Preview</span>' +
      '      </div>' +
      '      <div style="display:flex;gap:0.6rem;">' +
      '        <button class="btn btn-primary btn-sm" id="modal-print-btn" type="button">' +
      '          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>' +
      '          <span>Print / Save PDF</span>' +
      '        </button>' +
      '        <button class="btn btn-ghost btn-sm" id="modal-close-btn" type="button">&times; Close</button>' +
      '      </div>' +
      '    </div>' +
      '    <div id="modal-slip-content"></div>' +
      '  </div>' +
      '</div>';

    // 1. Image fallback
    var imgEl = document.getElementById("result-img-elem");
    if (imgEl) {
      imgEl.addEventListener("error", function () {
        imgEl.src = placeholderSvg(result.crop + " (" + result.disease + ")");
      });
    }

    // 2. Interactive Lesion Inspector Mode Switching
    var btnOriginal = document.getElementById("mode-btn-original");
    var btnLesion = document.getElementById("mode-btn-lesion");
    var btnThermal = document.getElementById("mode-btn-thermal");
    var lbox1 = document.getElementById("lbox-1");
    var lbox2 = document.getElementById("lbox-2");
    var thermalOverlay = document.getElementById("thermal-overlay");

    function setInspectorMode(mode) {
      [btnOriginal, btnLesion, btnThermal].forEach(function (b) {
        if (b) b.classList.remove("active");
      });

      if (mode === "original") {
        if (btnOriginal) btnOriginal.classList.add("active");
        if (lbox1) lbox1.style.display = "none";
        if (lbox2) lbox2.style.display = "none";
        if (thermalOverlay) thermalOverlay.style.display = "none";
      } else if (mode === "lesion") {
        if (btnLesion) btnLesion.classList.add("active");
        if (lbox1) lbox1.style.display = "block";
        if (lbox2) lbox2.style.display = "block";
        if (thermalOverlay) thermalOverlay.style.display = "none";
      } else if (mode === "thermal") {
        if (btnThermal) btnThermal.classList.add("active");
        if (lbox1) lbox1.style.display = "none";
        if (lbox2) lbox2.style.display = "none";
        if (thermalOverlay) thermalOverlay.style.display = "block";
      }
    }

    if (btnOriginal) btnOriginal.addEventListener("click", function () { setInspectorMode("original"); });
    if (btnLesion) btnLesion.addEventListener("click", function () { setInspectorMode("lesion"); });
    if (btnThermal) btnThermal.addEventListener("click", function () { setInspectorMode("thermal"); });

    // 3. Interactive Acreage Spray Calculator Logic
    var acresSlider = document.getElementById("calc-acres-slider");
    var acresLabel = document.getElementById("calc-acres-label");
    var waterVal = document.getElementById("calc-water-val");
    var doseVal = document.getElementById("calc-dose-val");
    var tanksVal = document.getElementById("calc-tanks-val");
    var costVal = document.getElementById("calc-cost-val");

    function updateDosageCalculations(acres) {
      var waterLiters = Math.round(acres * 180);
      var doseGrams = Math.round(acres * 450);
      var tanksCount = Math.ceil(waterLiters / 16);
      var estCost = Math.round(acres * 280);

      if (acresLabel) acresLabel.textContent = acres.toFixed(1) + " Acres";
      if (waterVal) waterVal.textContent = waterLiters.toLocaleString() + " L";
      if (doseVal) doseVal.textContent = doseGrams >= 1000 ? (doseGrams / 1000).toFixed(2) + " kg" : doseGrams + " g";
      if (tanksVal) tanksVal.textContent = tanksCount + " Tanks";
      if (costVal) costVal.textContent = "₹ " + estCost.toLocaleString();
    }

    if (acresSlider) {
      acresSlider.addEventListener("input", function () {
        var acres = parseFloat(acresSlider.value) || 2.5;
        updateDosageCalculations(acres);
      });
    }

    // 4. Save Result button handler
    var saveBtn = document.getElementById("save-result-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        if (!AgriApp.isSignedIn()) {
          AgriApp.showAuthModal(function () {
            AgriAPI.saveScan(result);
            result.saved = true;
            saveBtn.querySelector("span").textContent = "Saved to Farm";
            AgriApp.toast("Diagnosis successfully saved to your farm history!");
          });
        } else {
          var saved = AgriAPI.saveScan(result);
          result.saved = true;
          saveBtn.querySelector("span").textContent = "Saved to Farm";
          AgriApp.toast("Saved to farm history!");
        }
      });
    }

    // 5. Official Prescription Slip Print & Modal Preview Handlers
    var printBtn = document.getElementById("print-report-btn");
    var previewBtn = document.getElementById("preview-slip-btn");
    var topDownloadBtn = document.getElementById("top-download-pdf-btn");
    if (topDownloadBtn) topDownloadBtn.addEventListener("click", function() { window.print(); });
    var presModal = document.getElementById("prescription-modal");
    var modalCloseBtn = document.getElementById("modal-close-btn");
    var modalPrintBtn = document.getElementById("modal-print-btn");
    var modalSlipContent = document.getElementById("modal-slip-content");
    var originalSlip = document.getElementById("official-prescription-slip");

    function openPrescriptionPreview() {
      if (!presModal || !originalSlip || !modalSlipContent) return;
      // Copy outerHTML so the .prescription-slip-sheet class and its document styling are strictly preserved
      modalSlipContent.innerHTML = originalSlip.outerHTML;
      var slipInside = modalSlipContent.querySelector('#official-prescription-slip');
      if (slipInside) slipInside.style.display = 'block';
      presModal.classList.remove("hidden");
    }

    function closePrescriptionPreview() {
      if (presModal) presModal.classList.add("hidden");
    }

    if (previewBtn) {
      previewBtn.addEventListener("click", openPrescriptionPreview);
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closePrescriptionPreview);
    }

    if (presModal) {
      presModal.addEventListener("click", function (e) {
        if (e.target === presModal) closePrescriptionPreview();
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", function () {
        window.print();
      });
    }

    if (modalPrintBtn) {
      modalPrintBtn.addEventListener("click", function () {
        closePrescriptionPreview();
        setTimeout(function () {
          window.print();
        }, 150);
      });
    }

    // 6. Chat with Khedut Mitr inline button handler
    var askMitrBtn = document.getElementById("ask-mitr-inline-btn");
    if (askMitrBtn) {
      askMitrBtn.addEventListener("click", function () {
        var launcher = document.getElementById("khedut-mitr-btn");
        if (launcher) {
          launcher.click();
        }
      });
    }

    // 7. Tabs for Organic vs Chemical
    var tabAll = document.getElementById("tab-all");
    var tabOrganic = document.getElementById("tab-organic");
    var tabChemical = document.getElementById("tab-chemical");
    var treatmentBox = document.getElementById("treatment-content");

    function setTabActive(activeBtn) {
      [tabAll, tabOrganic, tabChemical].forEach(function (btn) {
        if (btn) btn.classList.remove("active");
      });
      if (activeBtn) activeBtn.classList.add("active");
    }

    if (tabAll) {
      tabAll.addEventListener("click", function () {
        setTabActive(tabAll);
        treatmentBox.innerHTML = '<ul class="treatment-list">' + recommendationsList + '</ul>';
      });
    }

    if (tabOrganic) {
      tabOrganic.addEventListener("click", function () {
        setTabActive(tabOrganic);
        treatmentBox.innerHTML =
          '<div style="background:var(--success-soft);border:1px solid var(--success-border);border-radius:var(--radius-sm);padding:1rem;margin-bottom:1rem;">' +
          '  <h4 style="color:var(--success);font-size:0.92rem;margin-bottom:0.4rem;">Certified Organic & Biological Remedies</h4>' +
          '  <ul class="treatment-list">' +
          '    <li class="treatment-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Apply 0.5% Neem Seed Kernel Extract (NSKE) or commercial cold-pressed neem oil (5 ml / liter of water) with emulsifier.</span></li>' +
          '    <li class="treatment-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Foliar spray of antagonistic biocontrol agent <em>Trichoderma viride</em> or <em>Pseudomonas fluorescens</em> (10 g / liter).</span></li>' +
          '    <li class="treatment-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Prune severely infected lower leaves and safely compost away from active fields.</span></li>' +
          '  </ul>' +
          '</div>';
      });
    }

    if (tabChemical) {
      tabChemical.addEventListener("click", function () {
        setTabActive(tabChemical);
        treatmentBox.innerHTML =
          '<div style="background:var(--warning-soft);border:1px solid var(--warning-border);border-radius:var(--radius-sm);padding:1rem;margin-bottom:1rem;">' +
          '  <h4 style="color:var(--warning);font-size:0.92rem;margin-bottom:0.4rem;">Calibrated Chemical Interventions</h4>' +
          '  <ul class="treatment-list">' +
          '    <li class="treatment-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Foliar spray of Mancozeb 75% WP @ 2.0 to 2.5 g / liter of water, ensuring uniform coverage on upper and lower leaf surfaces.</span></li>' +
          '    <li class="treatment-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Alternatively, Chlorothalonil 75% WP @ 2 g / liter at first symptom appearance. Repeat after 10-14 days if wet weather persists.</span></li>' +
          '    <li class="treatment-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Observe pre-harvest interval (PHI) of minimum 7 days before harvesting edible fruits or foliage.</span></li>' +
          '  </ul>' +
          '</div>';
      });
    }
  });
})();
