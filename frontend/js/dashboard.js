(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var settings = AgriAPI.getSettings();
    var stats = AgriAPI.getDashboardStats();
    var greeting = document.getElementById("greeting");
    if (greeting) {
      greeting.textContent = AgriApp.greeting() + ", " + (settings.farmerName || "Farmer") + " 👋";
    }

    var kpis = document.getElementById("kpis");
    kpis.innerHTML = [
      ["Total Scans", stats.totalScans],
      ["Healthy Crops", stats.healthyCrops],
      ["Issues Detected", stats.issuesDetected],
      ["Crops Monitored", stats.cropsMonitored]
    ].map(function (item) {
      return '<article class="card kpi"><p class="muted">' + item[0] + '</p><p class="value">' + item[1] + "</p></article>";
    }).join("");

    var recent = document.getElementById("recent-scans");
    if (!stats.recent.length) {
      recent.innerHTML =
        '<div class="empty"><p><strong>No scans yet.</strong></p><p class="muted">Upload your first crop image to start building your crop health history.</p><a class="btn btn-primary" href="scan.html">Start First Scan</a></div>';
    } else {
      recent.innerHTML = stats.recent.map(function (item) {
        return (
          '<a class="scan-row" href="result.html?id=' + encodeURIComponent(item.id) + '">' +
          "<div><strong>" + item.crop + "</strong><div class=\"muted\">" + AgriApp.relativeTime(item.scannedAt) + "</div></div>" +
          "<div>" + item.disease + "</div>" +
          "<div>" + AgriApp.confidenceLabel(item.confidence) + " Confidence</div>" +
          '<span class="' + AgriApp.riskClass(item.risk) + '">' + item.risk + " Risk</span>" +
          "<div class=\"muted\">View</div></a>"
        );
      }).join("");
    }

    var chart = document.getElementById("overview-chart");
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var max = Math.max.apply(null, stats.weekly.concat([1]));
    chart.innerHTML = stats.weekly.map(function (value, index) {
      var h = Math.max(8, Math.round((value / max) * 140));
      return '<div class="bar"><span style="height:' + h + 'px"></span><small>' + days[index] + "</small></div>";
    }).join("");
  });
})();
