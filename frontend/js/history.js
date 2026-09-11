(function () {
  "use strict";

  function withinRange(iso, range) {
    if (!range) return true;
    var time = new Date(iso).getTime();
    if (Number.isNaN(time)) return false;
    var now = Date.now();
    if (range === "24h") return now - time <= 24 * 60 * 60 * 1000;
    if (range === "7d") return now - time <= 7 * 24 * 60 * 60 * 1000;
    if (range === "30d") return now - time <= 30 * 24 * 60 * 60 * 1000;
    return true;
  }

  function render(records) {
    var root = document.getElementById("history-list");
    if (!records.length) {
      root.innerHTML =
        '<div class="card empty"><p><strong>No scans yet.</strong></p><p class="muted">Upload your first crop image to start building your crop health history.</p><a class="btn btn-primary" href="scan.html">Start First Scan</a></div>';
      return;
    }
    root.innerHTML = records.map(function (item) {
      return (
        '<a class="scan-row" href="result.html?id=' + encodeURIComponent(item.id) + '">' +
        "<div><strong>" + item.crop + "</strong><div class=\"muted\">" + AgriApp.formatDate(item.scannedAt) + "</div></div>" +
        "<div>" + item.disease + "</div>" +
        "<div>" + AgriApp.confidenceLabel(item.confidence) + "</div>" +
        '<span class="' + AgriApp.riskClass(item.risk) + '">' + item.risk + "</span>" +
        "<div class=\"muted\">Open</div></a>"
      );
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var all = AgriAPI.getScanHistory();
    var crops = Array.from(new Set(all.map(function (item) { return item.crop; }))).sort();
    var cropFilter = document.getElementById("crop-filter");
    crops.forEach(function (crop) {
      var option = document.createElement("option");
      option.value = crop;
      option.textContent = crop;
      cropFilter.appendChild(option);
    });

    function apply() {
      var q = document.getElementById("search").value.trim().toLowerCase();
      var crop = cropFilter.value;
      var risk = document.getElementById("risk-filter").value;
      var date = document.getElementById("date-filter").value;
      var filtered = all.filter(function (item) {
        var hay = (item.crop + " " + item.disease).toLowerCase();
        return (!q || hay.indexOf(q) !== -1) &&
          (!crop || item.crop === crop) &&
          (!risk || item.risk === risk) &&
          withinRange(item.scannedAt, date);
      });
      render(filtered);
    }

    ["search", "crop-filter", "risk-filter", "date-filter"].forEach(function (id) {
      document.getElementById(id).addEventListener("input", apply);
      document.getElementById(id).addEventListener("change", apply);
    });
    apply();
  });
})();
