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

  function render(records, totalScans) {
    var root = document.getElementById("history-list");
    var counter = document.getElementById("history-counter");
    if (!root) return;

    if (counter) {
      counter.textContent = "Showing " + records.length + " of " + totalScans + " recorded crop scans";
    }

    if (totalScans === 0) {
      root.innerHTML =
        '<div class="card" style="text-align:center;padding:3.5rem 1.5rem;">' +
        '<div style="width:56px;height:56px;border-radius:50%;background:var(--sage);color:var(--forest-dark);display:grid;place-items:center;margin:0 auto 1.2rem;">' +
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
        '</div>' +
        '<h3>No crop scans recorded yet</h3>' +
        '<p style="color:var(--text-muted);font-size:0.92rem;margin-bottom:1.5rem;">Your analyzed crops will appear here with symptoms, diagnosis, and action plans.</p>' +
        '<a class="btn btn-primary" href="scan.html">Scan Your First Crop</a>' +
        '</div>';
      return;
    }

    if (!records.length) {
      root.innerHTML =
        '<div class="card" style="text-align:center;padding:3.5rem 1.5rem;">' +
        '<div style="width:56px;height:56px;border-radius:50%;background:var(--bg-sand);color:var(--text-subtle);display:grid;place-items:center;margin:0 auto 1.2rem;">' +
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '</div>' +
        '<h3>No scans match your filters</h3>' +
        '<p style="color:var(--text-muted);font-size:0.92rem;margin-bottom:1.5rem;">Try adjusting your search terms, crop selection, or date interval.</p>' +
        '<button class="btn btn-secondary" type="button" id="reset-filters">Reset All Filters</button>' +
        '</div>';

      var resetBtn = document.getElementById("reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          document.getElementById("search").value = "";
          document.getElementById("crop-filter").value = "";
          document.getElementById("risk-filter").value = "";
          document.getElementById("date-filter").value = "";
          var all = AgriAPI.getScanHistory();
          render(all, all.length);
        });
      }
      return;
    }

    root.innerHTML = records.map(function (item) {
      var emoji = getCropEmoji(item.crop);
      var thumb = item.imageDataUrl
        ? '<img src="' + item.imageDataUrl + '" alt="" style="width:42px;height:42px;object-fit:cover;border-radius:var(--radius-sm);flex-shrink:0">'
        : '<div class="crop-avatar">' + emoji + '</div>';

      return (
        '<a class="scan-row" href="result.html?id=' + encodeURIComponent(item.id) + '">' +
        '  <div style="display:flex;align-items:center;gap:0.85rem;">' +
        '    ' + thumb +
        '    <div>' +
        '      <strong style="color:var(--text-main);font-size:0.95rem;">' + AgriApp.escapeHtml(item.crop) + '</strong>' +
        '      <div style="font-size:0.78rem;color:var(--text-subtle);">' + AgriApp.formatDate(item.scannedAt) + '</div>' +
        '    </div>' +
        '  </div>' +
        '  <div><span style="font-weight:600;font-size:0.92rem;color:var(--text-main);">' + AgriApp.escapeHtml(item.disease) + '</span></div>' +
        '  <div><span style="font-size:0.85rem;color:var(--text-muted);">' + AgriApp.confidenceLabel(item.confidence) + ' Confidence</span></div>' +
        '  <div><span class="' + AgriApp.riskClass(item.risk) + '">' + AgriApp.escapeHtml(item.risk) + ' Risk</span></div>' +
        '  <div style="color:var(--forest-mid);font-weight:700;font-size:0.88rem;">Open Report &rarr;</div>' +
        '</a>'
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

      var currentHistory = AgriAPI.getScanHistory();
      var filtered = currentHistory.filter(function (item) {
        var hay = (item.crop + " " + item.disease).toLowerCase();
        return (!q || hay.indexOf(q) !== -1) &&
          (!crop || item.crop === crop) &&
          (!risk || item.risk.toLowerCase() === risk.toLowerCase()) &&
          withinRange(item.scannedAt, date);
      });
      render(filtered, currentHistory.length);
    }

    var searchInput = document.getElementById("search");
    var riskFilter = document.getElementById("risk-filter");
    var dateFilter = document.getElementById("date-filter");

    if (searchInput) searchInput.addEventListener("input", apply);
    if (cropFilter) cropFilter.addEventListener("change", apply);
    if (riskFilter) riskFilter.addEventListener("change", apply);
    if (dateFilter) dateFilter.addEventListener("change", apply);

    var urlQ = AgriApp.queryParam("q");
    if (urlQ && searchInput) {
      searchInput.value = urlQ;
    }

    apply();
  });
})();
