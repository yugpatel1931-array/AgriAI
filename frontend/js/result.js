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
    var cropParam = AgriApp.queryParam("crop");
    var result = null;

    if (id) {
      result = AgriAPI.getScanById(id);
    } else if (cropParam) {
      var recent = AgriAPI.getRecentScans ? AgriAPI.getRecentScans() : [];
      result = recent.find(function (s) {
        return (s.crop || "").toLowerCase() === cropParam.toLowerCase();
      });
      if (!result) {
        var cp = cropParam.toLowerCase();
        if (cp === "potato") {
          result = {
            id: "AGRI-GJ-2026-72814",
            crop: "Potato",
            disease: "Late Blight",
            confidence: 0.90,
            risk: "high",
            scannedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            symptoms: [
              "Water-soaked dark lesions on foliage",
              "Rapid spore spread in high humidity",
              "Lower stem blackening"
            ],
            recommendations: [
              "Isolate and safely remove severely infected foliage",
              "Spray Metalaxyl + Mancozeb (Ridomil MZ @ 2.5g/L)",
              "Hold off irrigation until topsoil dries"
            ]
          };
        } else if (cp === "chilli") {
          result = {
            id: "AGRI-GJ-2026-63952",
            crop: "Chilli",
            disease: "Leaf Spot",
            confidence: 0.88,
            risk: "medium",
            scannedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
            symptoms: [
              "Small circular spots with lighter centers",
              "Premature yellowing of lower foliage",
              "Defoliation under humid microclimate"
            ],
            recommendations: [
              "Clear fallen spotted leaves beneath plants",
              "Foliar spray of Copper Oxychloride @ 2.5g/L",
              "Thin crowded center canopy for sunlight penetration"
            ]
          };
        } else {
          result = {
            id: "AGRI-GJ-2026-84921",
            crop: "Tomato",
            disease: "Early Blight",
            confidence: 0.92,
            risk: "medium",
            scannedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            symptoms: [
              "Concentric ring dark lesions on lower leaves",
              "Foliar chlorosis around spots",
              "Lower canopy blight spread"
            ],
            recommendations: [
              "Remove lower diseased leaves and dispose safely",
              "Apply cold-pressed Neem oil (5ml/L) + Trichoderma viride",
              "Water directly at root zone; avoid leaf splash"
            ]
          };
        }
      }
    }

    if (!result) {
      var lastResult = AgriAPI.getLastResult();
      if (!id || (lastResult && String(lastResult.id) === String(id))) {
        result = lastResult;
      }
    }

    // Only legacy/demo URLs may fall back to recent scans. A real scan ID must
    // never silently turn into an unrelated demo prediction.
    if (!result && !id) {
      var allScans = AgriAPI.getRecentScans ? AgriAPI.getRecentScans() : [];
      if (allScans && allScans.length > 0) {
        result = allScans[0];
      }
    }

    // Ultimate demo fallback is retained only for direct legacy result-page
    // visits without a scan ID. The real Analyze Crop flow always supplies an ID.
    if (!result && !id) {
      result = {
        id: "AGRI-GJ-2026-84921",
        crop: "Tomato",
        disease: "Early Blight",
        confidence: 0.92,
        risk: "medium",
        scannedAt: new Date(Date.now() - 86400000).toISOString(),
        symptoms: [
          "Concentric dark spots on lower leaves with yellow halo",
          "Foliar blight spreading from soil splash",
          "Target-board ring pattern on mature leaves"
        ],
        recommendations: [
          "Remove lower spotted leaves and burn or bury away from field",
          "Apply cold-pressed Neem oil (5ml/L) + Trichoderma viride",
          "Water directly at root zone; avoid leaf splash"
        ]
      };
    }

    // Standardize Report ID into guaranteed clean, professional AGRI-GJ-2026-XXXXX format
    var reportId = (window.AgriApp && AgriApp.formatReportId)
      ? AgriApp.formatReportId(result.id, result.crop, result.scannedAt)
      : (result.id || "AGRI-GJ-2026-84921");
    // Keep the backend scan ID stable for history/refresh. reportId is display-only.
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

    var organicRecommendations = result.organicRecommendations || [];
    var chemicalRecommendations = result.chemicalRecommendations || [];
    var preventionItems = result.prevention || [];
    var monitoringItems = result.monitoring || [];

    function renderSimpleList(items) {
      if (!items || !items.length) return '<p style="color:var(--text-muted);font-size:0.88rem;margin:0;">No additional guidance was returned for this scan.</p>';
      return '<ul style="margin:0;padding-left:1.2rem;color:var(--text-main);line-height:1.55;font-size:0.88rem;">' + items.map(function (item) { return '<li style="margin:0.35rem 0;">' + AgriApp.escapeHtml(item) + '</li>'; }).join('') + '</ul>';
    }

    root.innerHTML =
      '<div style="margin-bottom:1.5rem;">' +
      '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.6rem;">' +
      '    <a href="scan.html" class="btn btn-ghost btn-sm">&larr; Back to Scan</a>' +
      '    <button class="btn btn-primary btn-sm rx-top-btn" id="top-download-pdf-btn" type="button" style="display:inline-flex;align-items:center;gap:0.45rem;background:linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);color:#FFFFFF;box-shadow:0 3px 10px rgba(27,67,50,0.25);">' +
      '      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
      '      <span>Download Official PDF Slip</span>' +
      '    </button>' +
      '  </div>' +
      '  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.6rem;margin-bottom:0.6rem;">' +
      '    <div style="display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg, rgba(82,183,136,0.14) 0%, rgba(45,106,79,0.08) 100%);border:1.5px solid #52B788;padding:0.32rem 0.85rem;border-radius:24px;box-shadow:0 2px 6px rgba(27,67,50,0.06);">' +
      '      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--forest-dark);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' +
      '      <span style="font-size:0.86rem;color:var(--text-main);font-weight:600;">Report ID: <strong id="report-id-badge" style="font-family:ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:0.04em;color:var(--forest-dark);">' + AgriApp.escapeHtml(reportId) + '</strong></span>' +
      '      <button type="button" id="copy-report-id-btn" class="btn btn-ghost btn-sm" style="padding:2px 8px;font-size:0.75rem;height:auto;font-weight:700;border:1px solid rgba(82,183,136,0.6);border-radius:12px;display:inline-flex;align-items:center;gap:0.3rem;" title="Copy Report ID to clipboard">' +
      '        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
      '        <span id="copy-btn-label">Copy</span>' +
      '      </button>' +
      '    </div>' +
      '    <div style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.8rem;color:var(--forest-dark);font-weight:700;">' +
      '      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--leaf);"></span>' +
      '      <span>AI Screening Record</span>' +
      '    </div>' +
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
      '          <button type="button" class="lesion-mode-btn" id="mode-btn-lesion">🎯 AI Focus</button>' +
      '          <button type="button" class="lesion-mode-btn" id="mode-btn-thermal">🌡️ Thermal</button>' +
      '        </div>' +
      '      </div>' +
      '      <div class="result-image-box">' +
      '        <div class="lesion-viewer-container" id="lesion-viewer">' +
      '          <img id="result-img-elem" class="lesion-img-layer" src="' + imgSrc + '" alt="Scanned crop foliage">' +
      '          <!-- Real Grad-CAM model-focus layer; not a lesion detector. -->' +
      '          <img id="gradcam-img-elem" class="lesion-img-layer" src="" alt="Grad-CAM model focus explanation" style="display:none;">' +
      '          <div id="inspector-notice" style="display:none;position:absolute;left:1rem;right:1rem;bottom:1rem;background:rgba(27,67,50,0.92);color:#fff;padding:0.65rem 0.8rem;border-radius:0.5rem;font-size:0.78rem;line-height:1.35;text-align:center;z-index:5;"></div>' +
      '        </div>' +
      '      </div>' +
      '      <div class="result-media-details">' +
      '        <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-subtle);margin-bottom:0.8rem;">' +
      '          <span>Image: <strong>' + AgriApp.escapeHtml(result.fileName || "camera-capture.jpg") + '</strong></span>' +
      '          <span>Model: <strong>' + AgriApp.escapeHtml(result.modelArchitecture || "EfficientNet-B0") + '</strong></span>' +
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
      '            <span style="font-size:0.75rem;color:var(--text-muted);">Check current conditions in the Weather module before spraying.</span>' +
      '          </div>' +
      '        </div>' +
      '        <span class="badge badge-success" style="font-size:0.75rem;">Guidance</span>' +
      '      </div>' +
      '      <div class="weather-badges-grid">' +
      '        <div class="weather-badge-pill">' +
      '          <span style="font-size:1.1rem;">🌡️</span>' +
      '          <div><strong>Live check</strong><small>Ambient Temp</small></div>' +
      '        </div>' +
      '        <div class="weather-badge-pill">' +
      '          <span style="font-size:1.1rem;">💧</span>' +
      '          <div><strong>Live check</strong><small>Humidity</small></div>' +
      '        </div>' +
      '        <div class="weather-badge-pill">' +
      '          <span style="font-size:1.1rem;">💨</span>' +
      '          <div><strong>Live check</strong><small>Wind</small></div>' +
      '        </div>' +
      '        <div class="weather-badge-pill">' +
      '          <span style="font-size:1.1rem;">☔</span>' +
      '          <div><strong>Live check</strong><small>Rain</small></div>' +
      '        </div>' +
      '      </div>' +
      '      <div class="spray-window-banner">' +
      '        <div style="display:flex;align-items:flex-start;gap:0.6rem;">' +
      '          <span style="font-size:1.3rem;margin-top:0.1rem;">🎯</span>' +
      '          <div>' +
      '            <strong class="spray-window-title">CHECK WEATHER BEFORE SPRAYING</strong>' +
      '            <span class="spray-window-desc">Do not rely on a static spray time. Check current rain, wind, temperature and label requirements in the Weather module before application.</span>' +
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

      '    <!-- SMART FIELD REPORT HERO CARD -->' +
      '    <div class="card rx-standout-card" style="margin-bottom:1.5rem;border:2px solid var(--leaf);background:linear-gradient(135deg, rgba(82,183,136,0.12) 0%, rgba(45,106,79,0.06) 100%);box-shadow:var(--shadow-md);position:relative;overflow:hidden;">' +
      '      <div style="display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.8rem;">' +
      '        <div style="width:46px;height:46px;border-radius:var(--radius-sm);background:linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);color:#FFFFFF;display:grid;place-items:center;flex-shrink:0;box-shadow:0 4px 12px rgba(27,67,50,0.3);">' +
      '          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' +
      '        </div>' +
      '        <div>' +
      '          <span class="badge" style="background:var(--sage);color:var(--forest-dark);font-weight:800;font-size:0.72rem;letter-spacing:0.04em;border:1px solid var(--leaf-light);margin-bottom:0.25rem;">📋 SMART FIELD REPORT &amp; ACTION PLAN</span>' +
      '          <h3 style="font-size:1.15rem;margin:0;color:var(--text-main);line-height:1.2;">Crop Health &amp; Treatment Report (PDF)</h3>' +
      '        </div>' +
      '      </div>' +
      '      <div style="margin-top:0.35rem;margin-bottom:0.75rem;padding:0.4rem 0.75rem;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;">' +
      '        <span style="color:var(--text-muted);font-weight:600;">Official Slip Ref:</span>' +
      '        <strong style="font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:0.88rem;letter-spacing:0.04em;color:var(--forest-dark);">' + AgriApp.escapeHtml(reportId) + '</strong>' +
      '      </div>' +
      '      <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.9rem;">' +
      '        Print-ready screening report containing the model result, confidence, advisory guidance, and scan record.' +
      '      </p>' +
      '      <div class="rx-inclusion-tags" style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.1rem;font-size:0.74rem;font-weight:700;">' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ AI Image Classification</span>' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ Disease Advisory</span>' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ Safety Guidance</span>' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ Weather Check</span>' +
      '        <span style="background:var(--bg-surface);border:1px solid var(--border);padding:0.25rem 0.55rem;border-radius:var(--radius-full);color:var(--text-main);">✓ Digital Record</span>' +
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
      '        <h4 style="margin-bottom:0.4rem;font-size:0.95rem;color:var(--metric-highlight);">Diagnostic Markers to Check</h4>' +
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
      '          <strong>Advisory Note:</strong> Follow recommended agricultural safety guidelines. Use protective equipment during spraying and maintain recommended pre-harvest intervals.' +
      '        </div>' +
      '      </div>' +
      '    </div>' +

      '    <!-- INTERACTIVE FIELD DOSAGE & ACREAGE CALCULATOR CARD -->' +
      '    <div class="card calc-card">' +
      '      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.9rem;">' +
      '        <div style="display:flex;align-items:center;gap:0.6rem;">' +
      '          <span style="font-size:1.4rem;">🧮</span>' +
      '          <div>' +
      '            <h3 style="font-size:1.08rem;margin:0;color:var(--text-main);">Field Planning Calculator</h3>' +
      '            <span style="font-size:0.75rem;color:var(--text-muted);">Use the confirmed product label for application rates</span>' +
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
      '          <div class="calc-val" id="calc-water-val">Label</div>' +
      '          <small style="font-size:0.72rem;color:var(--text-muted);">Follow sprayer/product label</small>' +
      '        </div>' +
      '        <div class="calc-metric-box">' +
      '          <div class="calc-lbl">Product Dose</div>' +
      '          <div class="calc-val" id="calc-dose-val">Label</div>' +
      '          <small style="font-size:0.72rem;color:var(--text-muted);">No dose is inferred by the AI scan</small>' +
      '        </div>' +
      '        <div class="calc-metric-box">' +
      '          <div class="calc-lbl">Tank Count</div>' +
      '          <div class="calc-val" id="calc-tanks-val">Capacity</div>' +
      '          <small style="font-size:0.72rem;color:var(--text-muted);">Depends on your sprayer</small>' +
      '        </div>' +
      '        <div class="calc-metric-box">' +
      '          <div class="calc-lbl">Treatment Cost</div>' +
      '          <div class="calc-val" id="calc-cost-val" style="color:var(--fresh);">Not set</div>' +
      '          <small style="font-size:0.72rem;color:var(--text-muted);">Requires local product/price data</small>' +
      '        </div>' +
      '      </div>' +

      '      <div style="margin-top:1rem;padding:0.75rem 1rem;background:var(--bg-sand);border-radius:var(--radius-sm);font-size:0.84rem;display:flex;align-items:center;gap:0.6rem;">' +
      '        <span style="font-size:1.2rem;">💡</span>' +
      '        <span style="color:var(--text-main);"><strong>Safety reminder:</strong> Use the nozzle, pressure, dilution, PPE and spray interval specified on the locally registered product label.</span>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>' +

      '<!-- OFFICIAL FIELD REPORT (Print & Preview Layout) -->' +
      '<div id="official-prescription-slip" class="prescription-slip-sheet" style="display:none;">' +
      '  <div class="rx-header">' +
      '    <div class="rx-emblem-wrap">' +
      '      <div class="rx-emblem-circle">' +
      '        <svg width="34" height="34" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#1B4332"/><path d="M16 6C21.6 9 24.5 13.5 24.5 19.5C21.9 17.8 18.9 17 16 17C13.1 17 10.1 17.8 7.5 19.5C7.5 13.5 10.4 9 16 6Z" fill="#52B788"/><path d="M16 17.5V25" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="10" r="2" fill="#FFFFFF"/></svg>' +
      '      </div>' +
      '    </div>' +
      '    <div class="rx-header-text">' +
      '      <div class="rx-gov-title" style="letter-spacing:0.06em;color:#1B4332;font-weight:800;">AGRISMART AI &bull; INTELLIGENT CROP HEALTH PLATFORM</div>' +
      '      <div class="rx-kvk-title" style="color:#4B5563;font-weight:600;">Field Diagnostic &amp; Agronomic Advisory System</div>' +
      '      <div class="rx-doc-title" style="color:#1B4332;font-size:1.35rem;font-weight:900;">CROP HEALTH &amp; FIELD TREATMENT REPORT</div>' +
      '      <div class="rx-sub-badge" style="color:#2D6A4F;font-weight:700;">DIGITAL REPORT &bull; REAL-TIME FARM INTELLIGENCE</div>' +
      '    </div>' +
      '    <div class="rx-qr-box">' +
      '      <div class="rx-qr-code">' +
      '        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1B4332" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' +
      '      </div>' +
      '      <small style="font-weight:800;letter-spacing:0.06em;color:#1B4332;">AI RECORD</small>' +
      '      <div style="font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:0.68rem;font-weight:700;color:#2D6A4F;letter-spacing:0.02em;">' + AgriApp.escapeHtml(reportId) + '</div>' +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-meta-grid">' +
      '    <div class="rx-meta-cell"><label>Official Report ID:</label><strong style="font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:1.02rem;color:#1B4332;letter-spacing:0.04em;">' + AgriApp.escapeHtml(reportId) + '</strong></div>' +
      '    <div class="rx-meta-cell"><label>Scan Date &amp; Time:</label><strong>' + AgriApp.formatDate(result.scannedAt) + '</strong></div>' +
      '    <div class="rx-meta-cell"><label>Registered Farmer:</label><strong>' + AgriApp.escapeHtml(farmerName) + '</strong></div>' +
      '    <div class="rx-meta-cell"><label>Farm:</label><strong>' + AgriApp.escapeHtml(farmName) + '</strong></div>' +
      '    <div class="rx-meta-cell"><label>Field Measurements:</label><strong>Not supplied by this image scan</strong></div>' +
      '    <div class="rx-meta-cell"><label>AI Vision Model:</label><strong>AgriSmart AI ' + AgriApp.escapeHtml(result.modelArchitecture || 'EfficientNet-B0') + ' (' + pct + '% Confidence)</strong></div>' +
      '  </div>' +

      '  <div class="rx-section">' +
      '    <div class="rx-section-title">I. AI FOLIAR SCAN &amp; HEALTH ASSESSMENT</div>' +
      '    <div class="rx-findings-grid">' +
      '      <div>' +
      '        <table class="rx-spec-table">' +
      '          <tr><td>Target Crop:</td><td><strong>' + AgriApp.escapeHtml(result.crop) + '</strong></td></tr>' +
      '          <tr><td>Detected Condition:</td><td><strong>' + AgriApp.escapeHtml(result.disease) + '</strong></td></tr>' +
      '          <tr><td>Detection Confidence:</td><td><strong style="color:#2D6A4F;">' + pct + '% model confidence</strong></td></tr>' +
      '          <tr><td>Risk &amp; Urgency:</td><td><span class="rx-risk-tag">' + AgriApp.escapeHtml(result.risk).toUpperCase() + ' RISK &bull; ACTION RECOMMENDED</span></td></tr>' +
      '        </table>' +
      '      </div>' +
      '      <div>' +
      '        <div class="rx-markers-box">' +
      '          <strong>Diagnostic Markers to Check:</strong>' +
      '          <ul>' + symptomsList + '</ul>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="rx-etiology-box">' +
      '      <strong>Screening Summary:</strong> ' + AgriApp.escapeHtml(result.explanation) +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-section">' +
      '    <div class="rx-section-title">II. RECOMMENDED FIELD TREATMENT &amp; DOSAGE</div>' +
      '    <table class="rx-dosage-table">' +
      '      <thead>' +
      '        <tr>' +
      '          <th style="width:18%;">Treatment Option</th>' +
      '          <th style="width:22%;">Active Solution</th>' +
      '          <th style="width:16%;">Dilution Rate</th>' +
      '          <th style="width:18%;">Total 2.5-Acre Field Mix</th>' +
      '          <th style="width:14%;">Application</th>' +
      '          <th style="width:12%;">Harvest Safety</th>' +
      '        </tr>' +
      '      </thead>' +
      '      <tbody>' +
      '        <tr>' +
      '          <td><strong>Biological / Organic</strong><br><small style="color:#2D6A4F;font-weight:700;">(Eco-Friendly)</small></td>' +
      '          <td>Cold-Pressed Neem Oil (10,000 ppm) + Trichoderma viride</td>' +
      '          <td><strong>5 ml / Liter</strong><br><small>+ 1 ml soap surfactant</small></td>' +
      '          <td><strong>450 Liters Clean Water</strong><br>+ 2.25 L neem oil<br>(~29 Knapsack Tanks @ 16L)</td>' +
      '          <td>Uniform fine mist; spray upper &amp; lower leaf surfaces</td>' +
      '          <td><strong style="color:#2D6A4F;">0 Days Waiting</strong><br><small>Safe for bees &amp; soil</small></td>' +
      '        </tr>' +
      '        <tr>' +
      '          <td><strong>Curative Fungicide</strong><br><small style="color:#555;">(Chemical Spray)</small></td>' +
      '          <td>Mancozeb 75% WP<br><small style="color:#555;">(Alt: Chlorothalonil 75% WP)</small></td>' +
      '          <td><strong>2.5 g / Liter</strong><br><small>potable water</small></td>' +
      '          <td><strong>450 Liters Clean Water</strong><br>+ 1,125 g active powder<br>(~29 Knapsack Tanks @ 16L)</td>' +
      '          <td>Hollow cone nozzle; thorough leaf canopy coverage</td>' +
      '          <td><strong style="color:#C53030;">7 Days Waiting</strong><br><small>Wear gloves &amp; mask</small></td>' +
      '        </tr>' +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +

      '  <div class="rx-section">' +
      '    <div class="rx-section-title">II. RECOMMENDED FIELD GUIDANCE</div>' +
      '    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">' +
      '      <div class="rx-markers-box">' +
      '        <strong>Organic &amp; Biological Guidance:</strong>' +
      '        ' + renderSimpleList(organicRecommendations) +
      '      </div>' +
      '      <div class="rx-markers-box">' +
      '        <strong>Chemical Safety Guidance:</strong>' +
      '        ' + renderSimpleList(chemicalRecommendations) +
      '      </div>' +
      '    </div>' +
      '    <div class="rx-legal-notice" style="margin-top:0.75rem;">Use only locally registered products labelled for the confirmed crop/disease. Follow the product label for dose, PPE, application interval and pre-harvest interval; consult a KVK/agriculture officer when unsure.</div>' +
      '  </div>' +

      '  <div class="rx-section">' +
      '    <div class="rx-section-title">III. PREVENTION &amp; FOLLOW-UP</div>' +
      '    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">' +
      '      <div class="rx-markers-box"><strong>Prevention:</strong>' + renderSimpleList(preventionItems) + '</div>' +
      '      <div class="rx-markers-box"><strong>What to Monitor:</strong>' + renderSimpleList(monitoringItems) + '</div>' +
      '    </div>' +
      '    <div class="rx-spray-window" style="margin-top:0.75rem;">' +
      '      <strong style="color:#1B4332;display:block;margin-bottom:0.25rem;">WEATHER CHECK BEFORE SPRAYING</strong>' +
      '      <span>This diagnosis response does not contain live weather measurements. Check current rain, wind, temperature and humidity in the Weather module before any foliar application.</span>' +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-section">' +
      '    <div class="rx-section-title">IV. IRRIGATION &amp; SUSTAINABILITY NOTE</div>' +
      '    <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:var(--radius-sm);padding:0.85rem 1rem;font-size:0.84rem;line-height:1.5;">' +
      '      Scan results alone do not measure soil moisture, water use, yield, or sustainability. Use the dedicated Irrigation and Sustainability modules with their connected farm inputs for those assessments.' +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-footer-grid">' +
      '    <div class="rx-sig-box">' +
      '      <div class="rx-sig-line">AgriSmart AI Diagnostic Engine</div>' +
      '      <small>Automated Plant Vision &bull; AgriSmart AI Platform</small>' +
      '    </div>' +
      '    <div class="rx-seal-box">' +
      '      <div class="rx-seal-stamp" style="border:2px solid #2D6A4F;color:#1B4332;">' +
      '        <span>AGRISMART AI</span>' +
      '        <strong>AI RECORD</strong>' +
      '        <small>Digital Scan #' + AgriApp.escapeHtml(reportId) + '</small>' +
      '      </div>' +
      '    </div>' +
      '    <div class="rx-sig-box">' +
      '      <div class="rx-sig-line">' + AgriApp.escapeHtml(farmerName) + '</div>' +
      '      <small>Farmer Acknowledgment</small>' +
      '    </div>' +
      '  </div>' +

      '  <div class="rx-legal-notice" style="font-size:0.72rem;color:#6B7280;text-align:center;margin-top:1rem;padding-top:0.6rem;border-top:1px dashed #D1D5DB;">' +
      '    <strong>AgriSmart AI Verified Digital Record (ID: ' + AgriApp.escapeHtml(reportId) + '):</strong> Generated from the AgriSmart AI image-model screening result. This record is not a laboratory diagnosis or a substitute for local agricultural advice.' +
      '  </div>' +
      '</div>' +

      '<!-- PRESCRIPTION SLIP MODAL PREVIEW -->' +
      '<div class="modal-backdrop hidden" id="prescription-modal" role="dialog" aria-modal="true">' +
      '  <div class="modal-card" style="max-width:880px;width:95%;max-height:92vh;overflow-y:auto;padding:1.5rem;">' +
      '    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.8rem;border-bottom:1px solid var(--border);">' +
      '      <div>' +
      '        <h3 style="margin:0;font-size:1.25rem;">AgriSmart AI Field Health &amp; Treatment Report</h3>' +
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


    // Copy Report ID Handler
    var copyBtn = document.getElementById("copy-report-id-btn");
    var copyLabel = document.getElementById("copy-btn-label");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var textToCopy = reportId;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(onCopied, fallbackCopy);
        } else {
          fallbackCopy();
        }

        function fallbackCopy() {
          var temp = document.createElement("textarea");
          temp.value = textToCopy;
          document.body.appendChild(temp);
          temp.select();
          try {
            document.execCommand("copy");
            onCopied();
          } catch (e) {
            AgriApp.toast("Report ID: " + textToCopy);
          }
          document.body.removeChild(temp);
        }

        function onCopied() {
          if (copyLabel) copyLabel.textContent = "✓ Copied!";
          copyBtn.style.borderColor = "#2D6A4F";
          copyBtn.style.color = "#2D6A4F";
          var lang = (AgriApp.getLanguage && AgriApp.getLanguage()) || "en";
          var toastMsg = lang === "gu"
            ? "રિપોર્ટ ID કૉપિ થયો: " + textToCopy
            : (lang === "hi" ? "रिपोर्ट ID कॉपी हुआ: " + textToCopy : "Report ID copied: " + textToCopy);
          AgriApp.toast(toastMsg);
          setTimeout(function () {
            if (copyLabel) copyLabel.textContent = "Copy";
          }, 2400);
        }
      });
    }

    // 1. Image fallback
    var imgEl = document.getElementById("result-img-elem");
    if (imgEl) {
      imgEl.addEventListener("error", function () {
        imgEl.src = placeholderSvg(result.crop + " (" + result.disease + ")");
      });
    }

    // 2. Interactive model-focus inspector. Grad-CAM explains where the CNN
    // focused; it is not a bounding-box lesion detector or thermal sensor.
    var btnOriginal = document.getElementById("mode-btn-original");
    var btnLesion = document.getElementById("mode-btn-lesion");
    var btnThermal = document.getElementById("mode-btn-thermal");
    var gradcamImg = document.getElementById("gradcam-img-elem");
    var inspectorNotice = document.getElementById("inspector-notice");

    function setInspectorMode(mode) {
      [btnOriginal, btnLesion, btnThermal].forEach(function (b) {
        if (b) b.classList.remove("active");
      });
      if (gradcamImg) gradcamImg.style.display = "none";
      if (imgEl) imgEl.style.display = "block";
      if (inspectorNotice) inspectorNotice.style.display = "none";

      if (mode === "original") {
        if (btnOriginal) btnOriginal.classList.add("active");
      } else if (mode === "lesion") {
        if (btnLesion) btnLesion.classList.add("active");
        if (result.gradcamDataUrl && gradcamImg) {
          gradcamImg.src = result.gradcamDataUrl;
          gradcamImg.style.display = "block";
          if (imgEl) imgEl.style.display = "none";
          if (inspectorNotice) {
            inspectorNotice.textContent = "AI Focus (Grad-CAM): highlights image regions that influenced the classifier. It does not locate or measure lesions.";
            inspectorNotice.style.display = "block";
          }
        } else if (inspectorNotice) {
          inspectorNotice.textContent = "Model-focus visualization is not available for this scan.";
          inspectorNotice.style.display = "block";
        }
      } else if (mode === "thermal") {
        if (btnThermal) btnThermal.classList.add("active");
        if (inspectorNotice) {
          inspectorNotice.textContent = "Thermal imagery requires a thermal sensor. No thermal sensor data was provided for this scan.";
          inspectorNotice.style.display = "block";
        }
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
      if (acresLabel) acresLabel.textContent = acres.toFixed(1) + " Acres";
      if (waterVal) waterVal.textContent = "Label";
      if (doseVal) doseVal.textContent = "Label";
      if (tanksVal) tanksVal.textContent = "Capacity";
      if (costVal) costVal.textContent = "Not set";
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
        var promptText = "This is my " + result.crop + " crop. The scan found " + result.disease + " with " + pct + "% confidence. What should I do to protect my crop?";
        if (window.KhedutMitr && window.KhedutMitr.askPreloaded) {
          window.KhedutMitr.askPreloaded(promptText, { crop: result.crop, disease: result.disease });
        } else {
          var launcher = document.getElementById("khedut-mitr-btn");
          if (launcher) launcher.click();
          var mInput = document.getElementById("khedut-mitr-input");
          var mSend = document.getElementById("khedut-mitr-send");
          if (mInput && mSend) {
            mInput.value = promptText;
            mSend.click();
          }
        }
      });
    }

    // 7. Tabs for Organic vs Chemical — use only advisory data returned by the backend.
    var tabAll = document.getElementById("tab-all");
    var tabOrganic = document.getElementById("tab-organic");
    var tabChemical = document.getElementById("tab-chemical");
    var treatmentBox = document.getElementById("treatment-content");

    function escapeList(items) {
      return (items || []).map(function (rec) {
        return (
          '<li class="treatment-item">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
          '<span>' + AgriApp.escapeHtml(rec) + '</span>' +
          '</li>'
        );
      }).join("");
    }

    function emptyAdvice(message) {
      return '<p style="color:var(--text-muted);font-size:0.9rem;margin:0;">' + AgriApp.escapeHtml(message) + '</p>';
    }

    function renderAdvice(title, items, tone) {
      var bg = tone === "organic" ? "var(--success-soft)" : "var(--warning-soft)";
      var border = tone === "organic" ? "var(--success-border)" : "var(--warning-border)";
      var heading = tone === "organic" ? "var(--success)" : "var(--warning)";
      return (
        '<div style="background:' + bg + ';border:1px solid ' + border + ';border-radius:var(--radius-sm);padding:1rem;margin-bottom:1rem;">' +
        '<h4 style="color:' + heading + ';font-size:0.92rem;margin-bottom:0.4rem;">' + AgriApp.escapeHtml(title) + '</h4>' +
        ((items && items.length) ? '<ul class="treatment-list">' + escapeList(items) + '</ul>' : emptyAdvice("No specific advisory was returned for this scan.")) +
        '</div>'
      );
    }

    function setTabActive(activeBtn) {
      [tabAll, tabOrganic, tabChemical].forEach(function (btn) {
        if (btn) btn.classList.remove("active");
      });
      if (activeBtn) activeBtn.classList.add("active");
    }

    function showAllAdvice() {
      var all = (result.recommendations || []);
      treatmentBox.innerHTML = all.length
        ? '<ul class="treatment-list">' + escapeList(all) + '</ul>'
        : emptyAdvice("No treatment recommendation was returned. Confirm the model result with a local agriculture expert before treating the crop.");
    }

    if (tabAll) {
      tabAll.addEventListener("click", function () {
        setTabActive(tabAll);
        showAllAdvice();
      });
    }

    if (tabOrganic) {
      tabOrganic.addEventListener("click", function () {
        setTabActive(tabOrganic);
        treatmentBox.innerHTML = renderAdvice("Organic & Biological Guidance", result.organicRecommendations || [], "organic");
      });
    }

    if (tabChemical) {
      tabChemical.addEventListener("click", function () {
        setTabActive(tabChemical);
        treatmentBox.innerHTML = renderAdvice("Chemical Safety Guidance", result.chemicalRecommendations || [], "chemical");
      });
    }
  });
})();
