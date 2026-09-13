(function () {
  "use strict";

  function getCropEmoji(crop) {
    var c = String(crop || "").toLowerCase();
    if (c.indexOf("tomato") !== -1) return "🍅";
    if (c.indexOf("potato") !== -1) return "🥔";
    if (c.indexOf("chilli") !== -1) return "🌶️";
    if (c.indexOf("wheat") !== -1) return "🌾";
    if (c.indexOf("cotton") !== -1) return "🌱";
    return "🌿";
  }

  // Farmer-friendly simple descriptions
  var CROP_DETAILS = {
    "Tomato": {
      disease: "Early Blight",
      riskLabel: "Needs Attention",
      riskClass: "badge-warning",
      confidence: "92%",
      scannedTime: "2 days ago",
      reportId: "AGRI-GJ-2026-84921",
      meaning: "The scan found dark circular spots on lower tomato leaves with ring patterns. This usually happens in warm, humid weather.",
      quickActions: [
        "Remove and safely throw away the spotted lower leaves in a bag (do not leave on soil).",
        "Keep leaves completely dry when watering (water directly at the roots).",
        "Check nearby tomato plants to make sure spots have not spread."
      ],
      autoQuestion: "This is my tomato crop. The scan found Early Blight with 92% confidence. What should I do to protect my crop?"
    },
    "Potato": {
      disease: "Late Blight",
      riskLabel: "High — Take action soon",
      riskClass: "badge-danger",
      confidence: "90%",
      scannedTime: "3 days ago",
      reportId: "AGRI-GJ-2026-72814",
      meaning: "The scan found water-soaked dark patches on potato leaves. Late blight can spread quickly in wet or humid weather.",
      quickActions: [
        "Check this patch immediately and cut off severely blighted leaves.",
        "Do not leave diseased leaves on the field boundary.",
        "Hold off on watering until the soil surface dries out."
      ],
      autoQuestion: "This is my potato crop. The scan found Late Blight with 90% confidence. What should I do right now to save my crop?"
    },
    "Chilli": {
      disease: "Leaf Spot",
      riskLabel: "Needs Attention",
      riskClass: "badge-warning",
      confidence: "88%",
      scannedTime: "4 days ago",
      reportId: "AGRI-GJ-2026-63952",
      meaning: "The scan found small round spots with lighter centers on chilli leaves. If untreated, it causes premature leaf drop.",
      quickActions: [
        "Pick up and clear dropped spotted leaves from under the plants.",
        "Avoid overhead splashing water late in the evening.",
        "Thin out crowded center branches so sunlight can reach inside."
      ],
      autoQuestion: "This is my chilli crop. The scan found Leaf Spot with 88% confidence. What should I do to stop leaves from dropping?"
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var mount = document.getElementById("unhealthy-cards-mount");
    var modal = document.getElementById("plant-summary-modal");
    var closeBtn = document.getElementById("close-modal-btn");
    var modalEmoji = document.getElementById("modal-plant-emoji");
    var modalTitle = document.getElementById("modal-plant-title");
    var modalDiseaseBadge = document.getElementById("modal-disease-badge");
    var modalRisk = document.getElementById("modal-risk-text");
    var modalConfidence = document.getElementById("modal-confidence-text");
    var modalScanned = document.getElementById("modal-scanned-text");
    var modalMeaning = document.getElementById("modal-meaning-text");
    var modalActionsList = document.getElementById("modal-actions-list");
    var modalAskMitrBtn = document.getElementById("modal-ask-mitr-btn");
    var modalViewScanBtn = document.getElementById("modal-view-scan-btn");

    var farmCtx = (window.AgriAPI && AgriAPI.getFarmContext) ? AgriAPI.getFarmContext() : null;
    var selectedCropData = null;

    function openPlantModal(cropName) {
      var d = CROP_DETAILS[cropName] || {
        disease: "Condition",
        riskLabel: "Needs Attention",
        riskClass: "badge-warning",
        confidence: "90%",
        scannedTime: "Recently",
        meaning: "The scan found signs of leaf stress.",
        quickActions: ["Check the leaves and keep the crop well aerated."],
        autoQuestion: "My " + cropName + " has leaf spots. What should I do?"
      };

      selectedCropData = d;
      selectedCropData.cropName = cropName;

      if (modalEmoji) modalEmoji.textContent = getCropEmoji(cropName);
      if (modalTitle) modalTitle.textContent = cropName;
      if (modalDiseaseBadge) {
        modalDiseaseBadge.innerHTML = '<span class="badge ' + d.riskClass + '" style="font-weight:700;">' + AgriApp.escapeHtml(d.disease) + ' detected</span>';
      }
      if (modalRisk) modalRisk.textContent = d.riskLabel;
      if (modalConfidence) modalConfidence.textContent = d.confidence;
      if (modalScanned) modalScanned.textContent = d.scannedTime;
      var modalReportId = document.getElementById("modal-report-id-text");
      if (modalReportId) modalReportId.textContent = d.reportId || "AGRI-GJ-2026-84921";
      if (modalMeaning) modalMeaning.textContent = d.meaning;

      if (modalActionsList) {
        modalActionsList.innerHTML = d.quickActions.map(function (act, idx) {
          return (
            '<div style="display:flex;align-items:flex-start;gap:0.6rem;font-size:0.92rem;color:var(--text-main);line-height:1.45;">' +
            '  <span style="width:22px;height:22px;border-radius:50%;background:#2D6A4F;color:#fff;font-size:0.75rem;font-weight:800;display:grid;place-items:center;flex-shrink:0;margin-top:0.1rem;">' + (idx + 1) + '</span>' +
            '  <span>' + AgriApp.escapeHtml(act) + '</span>' +
            '</div>'
          );
        }).join("");
      }

      if (modalAskMitrBtn) {
        modalAskMitrBtn.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
          '<span>Ask Khedut Mitr: "What should I do?"</span>';
      }

      var modalDownloadPdfBtn = document.getElementById("modal-download-pdf-btn");
      if (modalDownloadPdfBtn) {
        modalDownloadPdfBtn.href = "result.html?crop=" + encodeURIComponent(cropName);
      }

      if (modalViewScanBtn) {
        modalViewScanBtn.href = "result.html?crop=" + encodeURIComponent(cropName);
      }

      if (modal) modal.classList.remove("hidden");
    }

    function closeModal() {
      if (modal) modal.classList.add("hidden");
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
    }

    // Direct automated Khedut Mitr integration from modal
    if (modalAskMitrBtn) {
      modalAskMitrBtn.addEventListener("click", function () {
        if (!selectedCropData) return;
        closeModal();

        var q = selectedCropData.autoQuestion;
        var ctx = {
          crop: selectedCropData.cropName,
          disease: selectedCropData.disease
        };

        if (window.KhedutMitr && window.KhedutMitr.askPreloaded) {
          window.KhedutMitr.askPreloaded(q, ctx);
        } else {
          var mitrBtn = document.getElementById("khedut-mitr-btn");
          if (mitrBtn) mitrBtn.click();
        }
      });
    }

    // Render plant cards
    var cropsList = [
      { name: "Tomato", id: "tomato" },
      { name: "Potato", id: "potato" },
      { name: "Chilli", id: "chilli" }
    ];

    if (mount) {
      mount.innerHTML = cropsList.map(function (c) {
        var d = CROP_DETAILS[c.name];
        var emoji = getCropEmoji(c.name);
        return (
          '<div class="card unhealthy-card" data-crop="' + c.name + '" style="cursor:pointer;transition:all 0.2s ease;padding:1.4rem;">' +
          '  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">' +
          '    <div style="display:flex;align-items:center;gap:0.75rem;">' +
          '      <span style="font-size:2.2rem;">' + emoji + '</span>' +
          '      <div>' +
          '        <h3 style="font-size:1.3rem;margin:0;color:var(--text-main);">' + c.name + '</h3>' +
          '        <span style="font-size:0.85rem;color:var(--danger);font-weight:700;">' + AgriApp.escapeHtml(d.disease) + '</span>' +
          '        <div style="font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:0.75rem;color:var(--forest-dark);font-weight:700;margin-top:0.2rem;">Ref: ' + AgriApp.escapeHtml(d.reportId || "AGRI-GJ-2026-84921") + '</div>' +
          '      </div>' +
          '    </div>' +
          '    <span class="badge ' + d.riskClass + '" style="font-weight:700;">' + AgriApp.escapeHtml(d.riskLabel) + '</span>' +
          '  </div>' +
          '  <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin:0 0 1rem 0;">' +
          AgriApp.escapeHtml(d.meaning) +
          '  </p>' +
          '  <div style="display:flex;gap:1rem;font-size:0.82rem;color:var(--text-muted);margin-bottom:1.2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);">' +
          '    <span>AI confidence: <strong style="color:var(--text-main);">' + d.confidence + '</strong></span>' +
          '    <span>&bull;</span>' +
          '    <span>Scanned: <strong style="color:var(--text-main);">' + d.scannedTime + '</strong></span>' +
          '  </div>' +
          '  <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">' +
          '    <button class="btn btn-secondary btn-sm card-view-btn" data-crop="' + c.name + '" style="flex:1;justify-content:center;font-weight:700;">' +
          '      <span>🔍 See Advice</span>' +
          '    </button>' +
          '    <a class="btn btn-outline btn-sm card-pdf-btn" href="result.html?id=' + encodeURIComponent(d.reportId || '') + '&crop=' + encodeURIComponent(c.name) + '" style="flex:1;justify-content:center;font-weight:700;display:inline-flex;align-items:center;gap:0.35rem;border-color:var(--leaf);color:var(--forest-dark);">' +
          '      <span>📄 PDF Slip</span>' +
          '    </a>' +
          '    <button class="btn btn-primary btn-sm card-ask-mitr-btn" data-crop="' + c.name + '" style="flex:1.2;justify-content:center;font-weight:800;background:var(--forest-dark);border-color:var(--forest-dark);box-shadow:0 2px 6px rgba(27,67,50,0.3);">' +
          '      <span>🤖 Ask Khedut Mitr</span>' +
          '    </button>' +
          '  </div>' +
          '</div>'
        );
      }).join("");

      // Card click handlers
      var cards = mount.querySelectorAll(".unhealthy-card");
      cards.forEach(function (card) {
        card.addEventListener("click", function (e) {
          // If clicked on "PDF Report" link inside the card:
          var pdfBtn = e.target.closest(".card-pdf-btn");
          if (pdfBtn) {
            e.stopPropagation();
            return; // let normal link navigation proceed
          }

          // If clicked on "Ask Khedut Mitr" button inside the card:
          var askBtn = e.target.closest(".card-ask-mitr-btn");
          if (askBtn) {
            e.stopPropagation();
            var crop = askBtn.getAttribute("data-crop");
            var cropD = CROP_DETAILS[crop];
            if (cropD && window.KhedutMitr && window.KhedutMitr.askPreloaded) {
              window.KhedutMitr.askPreloaded(cropD.autoQuestion, { crop: crop, disease: cropD.disease });
            }
            return;
          }

          // Otherwise open the advice modal
          var cropName = card.getAttribute("data-crop");
          openPlantModal(cropName);
        });
      });
    }

    // Check if query parameter specifies a crop (e.g. ?crop=Tomato)
    var urlParams = new URLSearchParams(window.location.search);
    var targetCrop = urlParams.get("crop");
    if (targetCrop && CROP_DETAILS[targetCrop]) {
      openPlantModal(targetCrop);
    }
  });
})();
