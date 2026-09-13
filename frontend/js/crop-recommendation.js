(function (global) {
  "use strict";

  function getCropEmoji(crop) {
    var c = String(crop || "").toLowerCase();
    if (c.indexOf("groundnut") !== -1) return "🥜";
    if (c.indexOf("cotton") !== -1) return "🌱";
    if (c.indexOf("soybean") !== -1) return "🫘";
    if (c.indexOf("chickpea") !== -1) return "🥣";
    if (c.indexOf("maize") !== -1 || c.indexOf("corn") !== -1) return "🌽";
    if (c.indexOf("millet") !== -1 || c.indexOf("bajra") !== -1) return "🌾";
    return "🌿";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("crop-profile-form");
    var resetBtn = document.getElementById("reset-farm-btn");
    var compareBtn = document.getElementById("open-compare-btn");
    var compareModal = document.getElementById("compare-modal");
    var closeCompareBtn = document.getElementById("close-compare-modal");
    var dismissCompareBtn = document.getElementById("dismiss-compare-modal");
    var compareTableRoot = document.getElementById("compare-table-root");
    var resultsRoot = document.getElementById("crop-results-root");
    var loadingPanel = document.getElementById("crop-loading");

    function triggerMitr(questionText, context) {
      if (window.KhedutMitr && window.KhedutMitr.askPreloaded) {
        window.KhedutMitr.askPreloaded(questionText, context || { crop: "Groundnut" });
      } else {
        var mitrBtn = document.getElementById("khedut-mitr-btn");
        if (mitrBtn) mitrBtn.click();
        var mInput = document.getElementById("khedut-mitr-input");
        var mSend = document.getElementById("khedut-mitr-send");
        if (mInput && mSend) {
          mInput.value = questionText;
          mSend.click();
        }
      }
    }

    var currentRecommendation = null;

    function renderResults(data) {
      currentRecommendation = data;
      var top = data.topRecommendation;
      var ranked = data.rankedCrops;
      var topEmoji = getCropEmoji(top.name);

      var runnersHtml = ranked.slice(1, 4).map(function (crop) {
        var emoji = getCropEmoji(crop.name);
        return (
          '<div class="card runner-card" style="padding:1.2rem;display:flex;flex-direction:column;justify-content:space-between;">' +
          '  <div>' +
          '    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">' +
          '      <div style="display:flex;align-items:center;gap:0.6rem;">' +
          '        <span style="font-size:1.8rem;">' + emoji + '</span>' +
          '        <div>' +
          '          <strong style="font-size:1.1rem;color:var(--text-main);">' + AgriApp.escapeHtml(crop.name) + '</strong>' +
          '          <div style="font-size:0.75rem;color:var(--text-subtle);">' + AgriApp.escapeHtml(crop.category) + '</div>' +
          '        </div>' +
          '      </div>' +
          '      <div style="text-align:right;">' +
          '        <span style="font-size:1.3rem;font-weight:800;color:var(--leaf);">' + crop.suitabilityScore + '%</span>' +
          '      </div>' +
          '    </div>' +
          '    <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 0.75rem;line-height:1.4;">' + AgriApp.escapeHtml(crop.rotationAnalysis) + '</p>' +
          '    <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-subtle);padding-top:0.6rem;border-top:1px solid var(--border);margin-bottom:0.8rem;">' +
          '      <span>Water: <strong>' + AgriApp.escapeHtml(crop.waterLevel) + '</strong></span>' +
          '      <span>Harvest in: <strong>' + AgriApp.escapeHtml(crop.growthDuration) + '</strong></span>' +
          '    </div>' +
          '  </div>' +
          '  <button class="btn btn-secondary btn-sm runner-ask-btn" data-crop="' + AgriApp.escapeHtml(crop.name) + '" type="button" style="width:100%;justify-content:center;font-weight:700;">' +
          '    <span>🤖 Ask Khedut Mitr About ' + AgriApp.escapeHtml(crop.name) + ' &rarr;</span>' +
          '  </button>' +
          '</div>'
        );
      }).join("");

      resultsRoot.innerHTML =
        '<!-- 1. TOP RECOMMENDATION HERO CARD -->' +
        '<div class="card top-crop-card" style="margin-bottom:2rem;border:2px solid var(--leaf);background:var(--bg-surface-elevated);">' +
        '  <div class="top-crop-header">' +
        '    <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">' +
        '      <div class="top-crop-avatar">' + topEmoji + '</div>' +
        '      <div>' +
        '        <span class="badge badge-success" style="font-weight:800;font-size:0.75rem;margin-bottom:0.3rem;">🥇 BEST MATCH FOR YOUR FIELD</span>' +
        '        <h2 style="font-size:1.9rem;margin:0;color:var(--text-main);">' + AgriApp.escapeHtml(top.name) + ' (' + AgriApp.escapeHtml(top.hindiName) + ')</h2>' +
        '        <div style="font-size:0.85rem;color:var(--text-muted);">' + AgriApp.escapeHtml(top.category) + ' &bull; Season: ' + AgriApp.escapeHtml(top.season) + '</div>' +
        '      </div>' +
        '    </div>' +
        '    <div class="suitability-badge-wrap">' +
        '      <div class="suitability-score-num">' + top.suitabilityScore + '%</div>' +
        '      <div class="suitability-score-lbl">MATCH SCORE</div>' +
        '    </div>' +
        '  </div>' +

        '  <!-- 4 KEY PILLS -->' +
        '  <div class="crop-kpi-grid">' +
        '    <div class="crop-kpi-pill">' +
        '      <span class="crop-kpi-title">Expected Yield</span>' +
        '      <strong class="crop-kpi-val">' + AgriApp.escapeHtml(top.expectedYield) + '</strong>' +
        '    </div>' +
        '    <div class="crop-kpi-pill">' +
        '      <span class="crop-kpi-title">Days to Harvest</span>' +
        '      <strong class="crop-kpi-val">' + AgriApp.escapeHtml(top.growthDuration) + '</strong>' +
        '    </div>' +
        '    <div class="crop-kpi-pill">' +
        '      <span class="crop-kpi-title">Water Needed</span>' +
        '      <strong class="crop-kpi-val">' + AgriApp.escapeHtml(top.waterRequirement) + '</strong>' +
        '    </div>' +
        '    <div class="crop-kpi-pill">' +
        '      <span class="crop-kpi-title">Soil Match</span>' +
        '      <strong class="crop-kpi-val">Excellent for Loam</strong>' +
        '    </div>' +
        '  </div>' +

        '  <!-- WHY THIS CROP? -->' +
        '  <div style="margin-top:1.5rem;padding:1.2rem;background:var(--bg-sand);border-radius:var(--radius-md);">' +
        '    <h3 style="font-size:1.05rem;margin:0 0 0.6rem;color:var(--forest-dark);">🔍 Why Groundnut after Wheat?</h3>' +
        '    <p style="font-size:0.95rem;color:var(--text-main);line-height:1.6;margin:0 0 0.8rem;">' +
        '      Wheat is a heavy cereal crop that uses up a lot of nitrogen from the soil. Groundnut is a legume that naturally puts 40–60 kg of nitrogen back into your soil, restoring your field without buying expensive extra fertilizer!' +
        '    </p>' +
        '    <div style="font-size:0.85rem;font-weight:700;color:var(--forest-dark);margin-bottom:0.4rem;">Why it fits your Anand farm:</div>' +
        '    <ul style="margin:0;padding-left:1.2rem;font-size:0.88rem;color:var(--text-muted);line-height:1.5;">' +
        '      <li>Your loose loamy soil allows groundnut pods to expand underground easily.</li>' +
        '      <li>Soil pH 6.5 is the exact sweet spot for healthy root nodules.</li>' +
        '      <li>Strong market demand and guaranteed government MSP prices in Gujarat mandis.</li>' +
        '    </ul>' +
        '  </div>' +

        '  <!-- ACTION FOOTER -->' +
        '  <div style="margin-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">' +
        '    <button class="btn btn-primary btn-lg" id="ask-mitr-crop-btn" style="font-weight:800;">' +
        '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '      <span>Ask Khedut Mitr About Groundnut</span>' +
        '    </button>' +
        '    <span style="font-size:0.82rem;color:var(--text-muted);">Recommended seeds: GG-20, TG-37A</span>' +
        '  </div>' +
        '</div>' +

        '<!-- 2. OTHER GOOD OPTIONS -->' +
        '<div style="margin-bottom:1.5rem;">' +
        '  <h3 style="font-size:1.25rem;margin:0 0 0.2rem;color:var(--text-main);">Other Good Crops for Your Farm</h3>' +
        '  <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 1rem;">Alternative choices ranked by how well they fit your soil.</p>' +
        '  <div class="runners-grid">' +
        runnersHtml +
        '  </div>' +
        '</div>';

      var askMitrBtn = document.getElementById("ask-mitr-crop-btn");
      if (askMitrBtn) {
        askMitrBtn.addEventListener("click", function () {
          triggerMitr("Why is Groundnut the best crop after wheat for my farm in Anand?", { crop: "Groundnut" });
        });
      }

      var runnerBtns = resultsRoot.querySelectorAll(".runner-ask-btn");
      runnerBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var cName = btn.getAttribute("data-crop");
          triggerMitr("Why is " + cName + " a good alternative crop for my farm in Anand?", { crop: cName });
        });
      });
    }

    function renderCompareModal() {
      if (!currentRecommendation || !compareTableRoot) return;
      var crops = currentRecommendation.rankedCrops.slice(0, 3);

      var tableHtml =
        '<table class="compare-table">' +
        '  <thead>' +
        '    <tr>' +
        '      <th>Feature</th>' +
        crops.map(function (c) { return '<th>' + getCropEmoji(c.name) + ' ' + AgriApp.escapeHtml(c.name) + '</th>'; }).join("") +
        '    </tr>' +
        '  </thead>' +
        '  <tbody>' +
        '    <tr>' +
        '      <td><strong>Match Score</strong></td>' +
        crops.map(function (c) { return '<td style="font-weight:800;color:var(--leaf);font-size:1.1rem;">' + c.suitabilityScore + '%</td>'; }).join("") +
        '    </tr>' +
        '    <tr>' +
        '      <td><strong>Water Needed</strong></td>' +
        crops.map(function (c) { return '<td>' + AgriApp.escapeHtml(c.waterRequirement) + '</td>'; }).join("") +
        '    </tr>' +
        '    <tr>' +
        '      <td><strong>Expected Yield</strong></td>' +
        crops.map(function (c) { return '<td>' + AgriApp.escapeHtml(c.expectedYield) + '</td>'; }).join("") +
        '    </tr>' +
        '    <tr>' +
        '      <td><strong>Harvest in</strong></td>' +
        crops.map(function (c) { return '<td>' + AgriApp.escapeHtml(c.growthDuration) + '</td>'; }).join("") +
        '    </tr>' +
        '    <tr>' +
        '      <td><strong>Soil Benefit</strong></td>' +
        crops.map(function (c) { return '<td>' + AgriApp.escapeHtml(c.rotationAnalysis) + '</td>'; }).join("") +
        '    </tr>' +
        '  </tbody>' +
        '</table>';

      compareTableRoot.innerHTML = tableHtml;
    }

    function runAnalysis(customParams) {
      if (loadingPanel) loadingPanel.classList.remove("hidden");
      if (resultsRoot) resultsRoot.style.opacity = "0.3";

      setTimeout(function () {
        if (loadingPanel) loadingPanel.classList.add("hidden");
        if (resultsRoot) resultsRoot.style.opacity = "1";
        var res = AgriAPI.recommendCrops(customParams);
        renderResults(res);
      }, 500);
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var custom = {
          location: document.getElementById("inp-location").value,
          soilType: document.getElementById("inp-soil-type").value,
          soilPh: parseFloat(document.getElementById("inp-soil-ph").value) || 6.5,
          previousCrop: document.getElementById("inp-prev-crop").value,
          waterAvailability: document.getElementById("inp-water-avail").value
        };
        runAnalysis(custom);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        AgriAPI.resetFarmContext();
        var ctx = AgriAPI.getFarmContext();
        document.getElementById("inp-location").value = ctx.location;
        document.getElementById("inp-soil-type").value = ctx.soilType;
        document.getElementById("inp-soil-ph").value = ctx.soilPh;
        document.getElementById("inp-prev-crop").value = ctx.previousCrop;
        document.getElementById("inp-water-avail").value = ctx.waterAvailability;
        runAnalysis();
      });
    }

    if (compareBtn) {
      compareBtn.addEventListener("click", function () {
        renderCompareModal();
        if (compareModal) compareModal.classList.remove("hidden");
      });
    }

    function closeCompare() {
      if (compareModal) compareModal.classList.add("hidden");
    }

    if (closeCompareBtn) closeCompareBtn.addEventListener("click", closeCompare);
    if (dismissCompareBtn) dismissCompareBtn.addEventListener("click", closeCompare);
    if (compareModal) {
      compareModal.addEventListener("click", function (e) {
        if (e.target === compareModal) closeCompare();
      });
    }

    runAnalysis();
  });
})(window);
