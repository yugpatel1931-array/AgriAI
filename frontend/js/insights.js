(function () {
  "use strict";

  function polyline(values) {
    var max = Math.max.apply(null, values.concat([1]));
    var min = Math.min.apply(null, values.concat([0]));
    var span = Math.max(1, max - min);
    return values.map(function (value, index) {
      var x = (index / (values.length - 1)) * 320;
      var y = 140 - ((value - min) / span) * 110;
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var data = AgriAPI.getInsights();
    var history = AgriAPI.getScanHistory();
    var root = document.getElementById("insights-root");

    if (!history.length) {
      root.innerHTML =
        '<div class="card empty"><p><strong>No insight data yet.</strong></p><p class="muted">Scan a crop to generate farm-level patterns.</p><a class="btn btn-primary" href="scan.html">Start First Scan</a></div>';
      return;
    }

    var points = polyline(data.trend);
    var lastPoint = points.split(" ").pop().split(",");
    var lastY = lastPoint[1];
    root.innerHTML =
      '<div class="grid-2">' +
      '<article class="card"><h2>Overall Crop Health</h2><div class="health-meter">' +
      meter("Healthy", data.healthyPct, "var(--success)") +
      meter("Needs Attention", data.attentionPct, "var(--warning)") +
      meter("High Risk", data.highPct, "var(--danger)") +
      "</div></article>" +
      '<article class="card trend"><h2>Health trend</h2><p class="muted">Relative healthy-scan share over recent demo intervals.</p>' +
      '<svg viewBox="0 0 320 160" role="img" aria-label="Crop health trend line">' +
      '<polyline fill="none" stroke="#1f7a4d" stroke-width="3" points="' + points + '"/>' +
      '<circle cx="320" cy="' + lastY + '" r="4" fill="#c4a35a"/>' +
      "</svg></article></div>" +
      '<section class="section" style="padding-top:1.2rem"><h2>Common issues</h2><div class="grid-4" style="margin-top:0.8rem">' +
      data.common.map(function (item) {
        return '<article class="card"><h3>' + item.name + "</h3><p class=\"value\">" + item.count + "</p><p class=\"muted\">Recorded alerts</p></article>";
      }).join("") +
      "</div></section>" +
      '<section class="grid-2"><article class="card"><h3>Insight</h3><p>' + data.cards[0] + "</p></article>" +
      '<article class="card"><h3>Insight</h3><p>' + data.cards[1] + "</p></article></section>";
  });

  function meter(label, pct, color) {
    return (
      '<div class="meter-row"><span>' + label + '</span><div class="meter-track"><div class="meter-fill" style="width:' + pct + "%;background:" + color + '"></div></div><strong>' + pct + "%</strong></div>"
    );
  }
})();
