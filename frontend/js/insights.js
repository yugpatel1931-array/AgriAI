(function () {
  "use strict";

  function polyline(values) {
    var max = Math.max.apply(null, values.concat([1]));
    var min = Math.min.apply(null, values.concat([0]));
    var span = Math.max(1, max - min);
    return values.map(function (value, index) {
      var x = (index / (values.length - 1)) * 320;
      var y = 140 - ((value - min) / span) * 105;
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
  }

  function meter(label, pct, color, icon) {
    return (
      '<div class="meter-row">' +
      '<span style="font-weight:600;font-size:0.9rem;display:flex;align-items:center;gap:0.45rem">' +
      icon + '<span>' + label + '</span>' +
      '</span>' +
      '<div class="meter-track">' +
      '<div class="meter-fill" style="width:' + pct + '%;background:' + color + '"></div>' +
      '</div>' +
      '<strong style="text-align:right;font-size:0.95rem">' + pct + '%</strong>' +
      '</div>'
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var data = AgriAPI.getInsights();
    var history = AgriAPI.getScanHistory();
    var root = document.getElementById("insights-root");
    if (!root) return;

    if (!history.length) {
      root.innerHTML =
        '<div class="card empty">' +
        '<div class="empty-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>' +
        '<h2>No insight data yet</h2>' +
        '<p class="muted">Scan crops in your fields to generate farm-level health distribution and recurring disease trends.</p>' +
        '<a class="btn btn-primary" href="scan.html" style="margin-top:0.8rem">Start First Scan</a>' +
        '</div>';
      return;
    }

    var points = polyline(data.trend);
    var pointPairs = points.split(" ");
    var lastPoint = pointPairs[pointPairs.length - 1].split(",");
    var lastY = lastPoint[1];

    var iconHealthy = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
    var iconWarn = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    var iconDanger = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="3"><polygon points="12 2 2 22 22 22 12 2"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

    root.innerHTML =
      '<div class="grid-2">' +
      '<article class="card">' +
      '<div class="eyebrow">Canopy Condition</div>' +
      '<h2 style="font-size:1.35rem;margin-bottom:0.4rem">Overall Crop Health Distribution</h2>' +
      '<p class="muted" style="font-size:0.88rem;margin-bottom:1.4rem">Percentage share of health statuses across stored inspection records.</p>' +
      '<div class="health-meter">' +
      meter("Healthy", data.healthyPct, "var(--success)", iconHealthy) +
      meter("Needs Attention", data.attentionPct, "var(--warning)", iconWarn) +
      meter("High Risk", data.highPct, "var(--danger)", iconDanger) +
      '</div>' +
      '</article>' +

      '<article class="card trend">' +
      '<div class="eyebrow">Seasonal Trend</div>' +
      '<h2 style="font-size:1.35rem;margin-bottom:0.4rem">Foliar Health Trajectory</h2>' +
      '<p class="muted" style="font-size:0.88rem;margin-bottom:1rem">Healthy scan proportion trend across consecutive inspection intervals.</p>' +
      '<svg viewBox="0 0 320 160" role="img" aria-label="Crop health trend line" style="background:var(--bg-sand-light);border-radius:var(--radius-sm);padding:0.6rem">' +
      '<line x1="0" y1="35" x2="320" y2="35" stroke="var(--border)" stroke-dasharray="4 4" stroke-width="1"/>' +
      '<line x1="0" y1="88" x2="320" y2="88" stroke="var(--border)" stroke-dasharray="4 4" stroke-width="1"/>' +
      '<line x1="0" y1="140" x2="320" y2="140" stroke="var(--border)" stroke-width="1"/>' +
      '<polyline fill="none" stroke="var(--primary)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" points="' + points + '"/>' +
      '<circle cx="320" cy="' + lastY + '" r="5" fill="var(--earth)" stroke="#FFFFFF" stroke-width="2"/>' +
      '</svg>' +
      '<div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-subtle);margin-top:0.4rem">' +
      '<span>Earlier Scans</span><span>Current Average (' + data.healthyPct + '% Vigor)</span>' +
      '</div>' +
      '</article>' +
      '</div>' +

      '<section class="section" style="padding:2.5rem 0 1.5rem">' +
      '<div class="section-head">' +
      '<div class="eyebrow">Disease Surveillance</div>' +
      '<h2 style="font-size:1.4rem">Most Common Detected Issues</h2>' +
      '<p class="muted" style="font-size:0.9rem">Frequency of disease matches flagged across your diagnostic history.</p>' +
      '</div>' +
      '<div class="grid-4">' +
      data.common.map(function (item) {
        var hasCount = item.count > 0;
        return (
          '<article class="card ' + (hasCount ? '' : 'card-sand') + '">' +
          '<div style="font-size:0.82rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em">Condition</div>' +
          '<h3 style="margin-top:0.2rem;font-size:1.1rem">' + AgriApp.escapeHtml(item.name) + '</h3>' +
          '<p class="value" style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:' + (hasCount ? 'var(--forest)' : 'var(--text-subtle)') + ';margin:0.4rem 0">' +
          item.count +
          '</p>' +
          '<p class="muted" style="font-size:0.8rem;margin:0">' + (hasCount ? 'Alerts documented' : 'No recent detections') + '</p>' +
          '</article>'
        );
      }).join("") +
      '</div>' +
      '</section>' +

      '<section class="grid-2">' +
      '<article class="card" style="border-left:4px solid var(--earth)">' +
      '<div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.6rem">' +
      '<div class="icon-wrap-earth" style="width:32px;height:32px;border-radius:6px;display:grid;place-items:center">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' +
      '</div>' +
      '<h3 style="font-size:1.05rem;margin:0">Key Field Observation</h3>' +
      '</div>' +
      '<p style="color:var(--text-main);font-size:0.95rem;line-height:1.5;margin:0">' +
      AgriApp.escapeHtml(data.cards[0]) +
      '</p>' +
      '</article>' +

      '<article class="card" style="border-left:4px solid var(--primary)">' +
      '<div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.6rem">' +
      '<div class="icon-wrap" style="width:32px;height:32px;border-radius:6px;display:grid;place-items:center">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
      '</div>' +
      '<h3 style="font-size:1.05rem;margin:0">Agronomic Trajectory</h3>' +
      '</div>' +
      '<p style="color:var(--text-main);font-size:0.95rem;line-height:1.5;margin:0">' +
      AgriApp.escapeHtml(data.cards[1]) +
      '</p>' +
      '</article>' +
      '</section>';
  });
})();
