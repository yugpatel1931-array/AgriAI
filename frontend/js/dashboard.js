(function () {
  "use strict";

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

  document.addEventListener("DOMContentLoaded", function () {
    var settings = AgriAPI.getSettings();
    var stats = AgriAPI.getDashboardStats();
    var auth = AgriApp.getAuth();
    var farmerName = (auth && auth.name) || settings.farmerName || "Farmer";

    // 1. Personalized Greeting
    var greetingEl = document.getElementById("greeting");
    if (greetingEl) {
      greetingEl.textContent = AgriApp.greeting() + ", " + farmerName + "! 👋";
    }

    // 2. Farm Health Score Ring
    var total = stats.totalScans || 1;
    var healthy = stats.healthyCrops || 0;
    var issues = stats.issuesDetected || 0;
    var healthPct = stats.totalScans > 0 ? Math.round((healthy / total) * 100) : 100;

    var gaugeScore = document.getElementById("health-gauge-score");
    var gaugeCircle = document.getElementById("health-gauge-circle");
    var healthBadge = document.getElementById("farm-health-badge");
    var healthSummary = document.getElementById("farm-health-summary");
    var healthyShare = document.getElementById("healthy-share-text");
    var attentionShare = document.getElementById("attention-share-text");

    if (gaugeScore) gaugeScore.textContent = healthPct + "%";
    if (healthyShare) healthyShare.textContent = healthy + " crops (" + healthPct + "%)";
    if (attentionShare) attentionShare.textContent = issues + " flagged";

    if (gaugeCircle) {
      var circumference = 2 * Math.PI * 50; // ~314.159
      var offset = circumference - (healthPct / 100) * circumference;
      gaugeCircle.style.strokeDasharray = circumference;
      gaugeCircle.style.strokeDashoffset = offset;
      if (healthPct < 50) {
        gaugeCircle.style.stroke = "var(--danger)";
      } else if (healthPct < 75) {
        gaugeCircle.style.stroke = "var(--warning)";
      } else {
        gaugeCircle.style.stroke = "var(--leaf)";
      }
    }

    if (healthBadge && healthSummary) {
      if (stats.totalScans === 0) {
        healthBadge.className = "badge badge-low";
        healthBadge.textContent = "New Field Registry";
        healthSummary.textContent = "Start scanning your crop leaves to establish baseline farm health records.";
      } else if (healthPct >= 75) {
        healthBadge.className = "badge badge-success";
        healthBadge.textContent = "Optimal Crop Vigor";
        healthSummary.textContent = "Recent diagnostics show strong plant vitality with minimal disease pressure across monitored plots.";
      } else if (healthPct >= 50) {
        healthBadge.className = "badge badge-warning";
        healthBadge.textContent = "Moderate Field Stress";
        healthSummary.textContent = "Foliar disease symptoms flagged on some crops. Review active recommendations to prevent spread.";
      } else {
        healthBadge.className = "badge badge-danger";
        healthBadge.textContent = "High Risk Alerts Active";
        healthSummary.textContent = "Multiple severe fungal or bacterial symptoms detected. Immediate field inspection recommended.";
      }
    }

    // 3. 4 KPI Summary Cards
    var kpis = document.getElementById("kpis");
    if (kpis) {
      var kpiData = [
        { label: "Total Crops Scanned", value: stats.totalScans, sub: "Recorded field inspections" },
        { label: "Healthy Crops", value: stats.healthyCrops, sub: "Clear of foliar pathogens" },
        { label: "Attention Needed", value: stats.issuesDetected, sub: "Pathologies requiring remedy" },
        { label: "Crops Monitored", value: stats.cropsMonitored, sub: "Distinct crop varieties" }
      ];

      kpis.innerHTML = kpiData.map(function (item) {
        return (
          '<div class="kpi-card">' +
          '  <div style="font-size:0.82rem;font-weight:600;color:var(--text-subtle);text-transform:uppercase;">' + item.label + '</div>' +
          '  <div class="number">' + item.value + '</div>' +
          '  <div style="font-size:0.78rem;color:var(--text-muted);">' + item.sub + '</div>' +
          '</div>'
        );
      }).join("");
    }

    // 4. Recent Scans List
    var recent = document.getElementById("recent-scans");
    if (recent) {
      if (!stats.recent || !stats.recent.length) {
        recent.innerHTML =
          '<div style="text-align:center;padding:2.5rem 1rem;">' +
          '  <p><strong>No crop scans yet.</strong></p>' +
          '  <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:1rem;">Upload a crop leaf image to start building your living farm health history.</p>' +
          '  <a class="btn btn-primary btn-sm" href="scan.html">Scan First Crop</a>' +
          '</div>';
      } else {
        recent.innerHTML = stats.recent.map(function (item) {
          var emoji = getCropEmoji(item.crop);
          return (
            '<a class="scan-row" href="result.html?id=' + encodeURIComponent(item.id) + '">' +
            '  <div style="display:flex;align-items:center;gap:0.85rem;">' +
            '    <div class="crop-avatar">' + emoji + '</div>' +
            '    <div>' +
            '      <strong style="color:var(--text-main);font-size:0.95rem;">' + AgriApp.escapeHtml(item.crop) + '</strong>' +
            '      <div style="font-size:0.78rem;color:var(--text-subtle);">' + AgriApp.relativeTime(item.scannedAt) + '</div>' +
            '    </div>' +
            '  </div>' +
            '  <div><span style="font-weight:600;font-size:0.92rem;color:var(--text-main);">' + AgriApp.escapeHtml(item.disease) + '</span></div>' +
            '  <div><span style="font-size:0.85rem;color:var(--text-muted);">' + AgriApp.confidenceLabel(item.confidence) + ' Confidence</span></div>' +
            '  <div><span class="' + AgriApp.riskClass(item.risk) + '">' + AgriApp.escapeHtml(item.risk) + ' Risk</span></div>' +
            '  <div style="color:var(--forest-mid);font-weight:700;font-size:0.85rem;">Report &rarr;</div>' +
            '</a>'
          );
        }).join("");
      }
    }

    // 5. Weekly Activity Chart
    var chart = document.getElementById("overview-chart");
    if (chart && stats.weekly) {
      var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      var max = Math.max.apply(null, stats.weekly.concat([1]));
      chart.innerHTML = stats.weekly.map(function (value, index) {
        var h = Math.max(16, Math.round((value / max) * 140));
        return (
          '<div class="bar">' +
          '  <span style="height:' + h + 'px" title="' + value + ' scans on ' + days[index] + '"></span>' +
          '  <small>' + days[index] + '</small>' +
          '</div>'
        );
      }).join("");
    }
  });
})();
