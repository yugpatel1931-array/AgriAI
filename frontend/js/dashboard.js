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
    if (c.indexOf("groundnut") !== -1) return "🥜";
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
    if (healthyShare) healthyShare.textContent = healthy + " healthy";
    if (attentionShare) {
      attentionShare.textContent = issues + " need attention →";
    }

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
        healthBadge.textContent = "New Farm";
        healthSummary.textContent = "Check your first crop to see health records for your farm.";
      } else if (healthPct >= 75) {
        healthBadge.className = "badge badge-success";
        healthBadge.textContent = "Good Farm Health";
        healthSummary.textContent = "Most of your crops look healthy. 3 crops showed leaf spots and need your attention.";
      } else if (healthPct >= 50) {
        healthBadge.className = "badge badge-warning";
        healthBadge.textContent = "Attention Needed";
        healthSummary.textContent = "Several crops have signs of leaf disease. Check them today to protect your harvest.";
      } else {
        healthBadge.className = "badge badge-danger";
        healthBadge.textContent = "Action Needed";
        healthSummary.textContent = "Multiple severe leaf symptoms found. Please check your fields immediately.";
      }
    }

    // 3. 4 KPI Summary Cards (with Clickable "Attention Needed" Card)
    var kpis = document.getElementById("kpis");
    if (kpis) {
      var kpiData = [
        { label: "Total Crops Checked", value: stats.totalScans, sub: "Scans recorded on device", id: "kpi-scans" },
        { label: "Healthy Crops", value: stats.healthyCrops, sub: "Looking strong and green", id: "kpi-healthy" },
        { label: "Crops Need Attention", value: stats.issuesDetected, sub: "Click to see what to do", isAction: true, id: "kpi-attention" },
        { label: "Crops Monitored", value: stats.cropsMonitored, sub: "Varieties on your farm", id: "kpi-crops" }
      ];

      kpis.innerHTML = kpiData.map(function (item) {
        var actionStyle = item.isAction ? ' style="cursor:pointer;border:2px solid var(--warning);background:var(--warning-soft);"' : '';
        var badge = item.isAction ? ' <span class="badge badge-warning" style="margin-left:0.4rem;font-size:0.65rem;">CHECK NOW</span>' : '';
        return (
          '<div class="kpi-card"' + actionStyle + ' id="' + item.id + '">' +
          '  <div style="font-size:0.82rem;font-weight:700;color:var(--text-subtle);text-transform:uppercase;">' + item.label + badge + '</div>' +
          '  <div class="number" style="' + (item.isAction ? 'color:var(--warning);font-weight:900;' : '') + '">' + item.value + '</div>' +
          '  <div style="font-size:0.78rem;color:var(--text-muted);">' + item.sub + '</div>' +
          '</div>'
        );
      }).join("");

      var attentionKpi = document.getElementById("kpi-attention");
      if (attentionKpi) {
        attentionKpi.addEventListener("click", function () {
          window.location.href = "unhealthy-plants.html";
        });
      }

      var attentionBanner = document.getElementById("dashboard-attention-banner");
      if (attentionBanner) {
        attentionBanner.addEventListener("click", function () {
          window.location.href = "unhealthy-plants.html";
        });
      }
    }

    // 4. Recent Scans List
    var recent = document.getElementById("recent-scans");
    if (recent) {
      if (!stats.recent || !stats.recent.length) {
        recent.innerHTML =
          '<div style="text-align:center;padding:2.5rem 1rem;">' +
          '  <p><strong>No crop checks yet.</strong></p>' +
          '  <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:1rem;">Take a photo of a leaf to check your crop health.</p>' +
          '  <a class="btn btn-primary btn-sm" href="scan.html">Check First Crop</a>' +
          '</div>';
      } else {
        recent.innerHTML = stats.recent.map(function (item) {
          var emoji = getCropEmoji(item.crop);
          var isHealthy = item.disease === "Healthy";
          var riskText = isHealthy ? "Healthy" : (item.risk === "High" ? "Take action soon" : "Needs attention");
          var riskClass = isHealthy ? "badge-success" : (item.risk === "High" ? "badge-danger" : "badge-warning");

          return (
            '<a class="scan-row" href="' + (isHealthy ? 'scan.html' : 'unhealthy-plants.html?crop=' + encodeURIComponent(item.crop)) + '">' +
            '  <div style="display:flex;align-items:center;gap:0.85rem;">' +
            '    <div class="crop-avatar">' + emoji + '</div>' +
            '    <div>' +
            '      <strong style="color:var(--text-main);font-size:0.95rem;">' + AgriApp.escapeHtml(item.crop) + '</strong>' +
            '      <div style="font-size:0.78rem;color:var(--text-subtle);">' + AgriApp.relativeTime(item.scannedAt) + '</div>' +
            '    </div>' +
            '  </div>' +
            '  <div><span style="font-weight:700;font-size:0.92rem;color:var(--text-main);">' + AgriApp.escapeHtml(item.disease) + '</span></div>' +
            '  <div><span style="font-size:0.85rem;color:var(--text-muted);">AI confidence: ' + Math.round(item.confidence * 100) + '%</span></div>' +
            '  <div><span class="badge ' + riskClass + '" style="font-size:0.75rem;font-weight:700;">' + riskText + '</span></div>' +
            '  <div style="color:var(--forest-mid);font-weight:700;font-size:0.85rem;">What to do &rarr;</div>' +
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
          '  <div class="bar-fill" style="height:' + h + 'px;" title="' + days[index] + ': ' + value + ' checks"></div>' +
          '  <span class="bar-label">' + days[index] + '</span>' +
          '</div>'
        );
      }).join("");
    }
  });
})();
