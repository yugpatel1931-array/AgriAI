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

  var CROP_DATA = {
    en: {
      Tomato: {
        name: "Tomato",
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
      Potato: {
        name: "Potato",
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
      Chilli: {
        name: "Chilli",
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
      },
      ui: {
        aiConfidence: "AI confidence:",
        scanned: "Scanned:",
        ref: "Ref:",
        seeAdvice: "🔍 See Advice",
        pdfSlip: "📄 PDF Slip",
        askMitr: "🤖 Ask Khedut Mitr",
        detectedSuffix: " detected",
        status: "Status",
        aiConfTitle: "AI Confidence",
        scannedTitle: "Scanned",
        reportIdTitle: "Report ID",
        whatMeans: "WHAT THIS MEANS",
        whatToDo: "WHAT SHOULD YOU DO?",
        askMitrBtn: 'Ask Khedut Mitr: "What should I do?"',
        pdfDownloadBtn: "📄 View & Download PDF Slip",
        viewScanBtn: "View full technical scan details →"
      }
    },
    gu: {
      Tomato: {
        name: "ટામેટા",
        disease: "અર્લી બ્લાઇટ (પાંદડા પર ડાઘ)",
        riskLabel: "ધ્યાન આપો",
        riskClass: "badge-warning",
        confidence: "૯૨%",
        scannedTime: "૨ દિવસ પહેલા",
        reportId: "AGRI-GJ-2026-84921",
        meaning: "તપાસમાં ટામેટાના નીચેના પાંદડા પર ગોળાકાર ડાઘ જોવા મળ્યા છે. આ સામાન્ય રીતે ગરમ અને ભેજવાળા વાતાવરણમાં થાય છે.",
        quickActions: [
          "ડાઘવાળા નીચેના પાંદડા તોડીને કોથળીમાં ભરી ખેતરથી દૂર નિકાલ કરો (જમીન પર ન ફેંકો).",
          "પાણી આપતી વખતે પાંદડા સૂકા રાખો (સીધું મૂળ પાસે જ પાણી આપો).",
          "ડાઘ આગળ વધ્યા નથી તેની ખાતરી કરવા નજીકના છોડ તપાસો."
        ],
        autoQuestion: "આ મારો ટામેટાનો પાક છે. તપાસમાં ૯૨% ચોકસાઈ સાથે અર્લી બ્લાઇટ જોવા મળ્યો છે. પાક બચાવવા મારે શું કરવું જોઈએ?"
      },
      Potato: {
        name: "બટાકા",
        disease: "લેટ બ્લાઇટ (કાળા ધબ્બા)",
        riskLabel: "ઉચ્ચ જોખમ — પગલાં લો",
        riskClass: "badge-danger",
        confidence: "૯૦%",
        scannedTime: "૩ દિવસ પહેલા",
        reportId: "AGRI-GJ-2026-72814",
        meaning: "બટાકાના પાંદડા પર ભીના કાળા ધબ્બા દેખાયા છે. વધુ ભેજવાળા વાતાવરણમાં લેટ બ્લાઇટ ઝડપથી ફેલાઈ શકે છે.",
        quickActions: [
          "આ ભાગ તરત જ તપાસો અને વધુ બગડેલા પાંદડા કાપી લો.",
          "રોગગ્રસ્ત પાંદડા ખેતરના શેઢા પર ન છોડો.",
          "જમીનની સપાટી સુકાઈ ન જાય ત્યાં સુધી પાણી આપવાનું થોભો."
        ],
        autoQuestion: "આ મારો બટાકાનો પાક છે. તપાસમાં લેટ બ્લાઇટ મળ્યો છે. પાક બચાવવા તરત શું કરવું?"
      },
      Chilli: {
        name: "મરચી",
        disease: "પર્ણ વલન / ડાઘ",
        riskLabel: "ધ્યાન આપો",
        riskClass: "badge-warning",
        confidence: "૮૮%",
        scannedTime: "૪ દિવસ પહેલા",
        reportId: "AGRI-GJ-2026-63952",
        meaning: "મરચીના પાંદડા પર નાના ગોળાકાર ડાઘ અને પાંદડા વળેલા જોવા મળ્યા છે. જો સારવાર ન કરાય તો પાંદડા ખરી પડે છે.",
        quickActions: [
          "છોડ નીચે ખરી પડેલા ડાઘવાળા પાંદડા ઉપાડી સાફ કરો.",
          "સાંજના સમયે પાંદડા પર પાણી છાંટવાનું ટાળો.",
          "વચ્ચેની ગીચ ડાળીઓ હળવી કરો જેથી અંદર સૂર્યપ્રકાશ પહોંચી શકે."
        ],
        autoQuestion: "આ મારી મરચીનો પાક છે. પાંદડા ખરતા અટકાવવા શું કરવું?"
      },
      ui: {
        aiConfidence: "AI ચોકસાઈ:",
        scanned: "તપાસ તારીખ:",
        ref: "સંદર્ભ:",
        seeAdvice: "🔍 સલાહ જુઓ",
        pdfSlip: "📄 PDF સ્લિપ",
        askMitr: "🤖 ખેડૂત મિત્રને પૂછો",
        detectedSuffix: " જણાયું",
        status: "સ્થિતિ",
        aiConfTitle: "AI ચોકસાઈ",
        scannedTitle: "તપાસ સમય",
        reportIdTitle: "રિપોર્ટ આઈડી",
        whatMeans: "આનો અર્થ શું થાય છે?",
        whatToDo: "તમારે શું કરવું જોઈએ?",
        askMitrBtn: 'ખેડૂત મિત્રને પૂછો: "હું શું કરું?"',
        pdfDownloadBtn: "📄 PDF સ્લિપ જુઓ અને ડાઉનલોડ કરો",
        viewScanBtn: "સંપૂર્ણ ટેકનિકલ સ્કેન વિગતો જુઓ →"
      }
    },
    hi: {
      Tomato: {
        name: "टमाटर",
        disease: "अगेती झुलसा (Early Blight)",
        riskLabel: "ध्यान दें",
        riskClass: "badge-warning",
        confidence: "९२%",
        scannedTime: "२ दिन पहले",
        reportId: "AGRI-GJ-2026-84921",
        meaning: "जांच में टमाटर के निचले पत्तों पर गोल छल्लेदार धब्बे पाए गए हैं। यह गर्म और नम मौसम में आम तौर पर फैलता है।",
        quickActions: [
          "धब्बे वाले निचले पत्तों को तोड़कर थैली में बंद करके खेत से दूर नष्ट करें (मिट्टी पर न छोड़ें)।",
          "पानी देते समय पत्तों को सूखा रखें (सीधे जड़ों में पानी दें)।",
          "आस-पास के टमाटर के पौधों की जांच करें कि धब्बे फैले तो नहीं।"
        ],
        autoQuestion: "यह मेरी टमाटर की फसल है। जांच में अर्ली ब्लाइट पाया गया है। फसल बचाने के लिए मुझे क्या करना चाहिए?"
      },
      Potato: {
        name: "आलू",
        disease: "पछेती झुलसा (Late Blight)",
        riskLabel: "उच्च जोखिम — तुरंत कदम उठाएं",
        riskClass: "badge-danger",
        confidence: "९०%",
        scannedTime: "३ दिन पहले",
        reportId: "AGRI-GJ-2026-72814",
        meaning: "आलू के पत्तों पर पानी से भीगे गहरे काले धब्बे दिखे हैं। अत्यधिक नमी वाले मौसम में यह रोग तेजी से फैल सकता है।",
        quickActions: [
          "इस हिस्से की तुरंत जांच करें और अधिक प्रभावित पत्तों को काट लें।",
          "रोगग्रस्त पत्तों को खेत की मेड़ों पर न छोड़ें।",
          "जब तक मिट्टी की ऊपरी सतह सूख न जाए, सिंचाई रोक दें।"
        ],
        autoQuestion: "यह मेरी आलू की फसल है। जांच में लेट ब्लाइट मिला है। फसल बचाने के लिए तुरंत क्या करें?"
      },
      Chilli: {
        name: "मिर्च",
        disease: "पर्ण कुंचन / धब्बा",
        riskLabel: "ध्यान दें",
        riskClass: "badge-warning",
        confidence: "८८%",
        scannedTime: "४ दिन पहले",
        reportId: "AGRI-GJ-2026-63952",
        meaning: "मिर्च के पत्तों पर गोल धब्बे और मुड़े हुए पत्ते पाए गए हैं। समय पर उपचार न करने पर पत्ते झड़ने लगते हैं।",
        quickActions: [
          "पौधों के नीचे गिरे हुए धब्बेदार पत्तों को उठाकर साफ करें।",
          "शाम के समय पत्तों पर पानी के छींटे मारने से बचें।",
          "बीच की घनी शाखाओं को छांटें ताकि धूप अंदर तक पहुंच सके।"
        ],
        autoQuestion: "यह मेरी मिर्च की फसल है। पत्ते झड़ने से रोकने के लिए क्या करें?"
      },
      ui: {
        aiConfidence: "AI सटीकता:",
        scanned: "जांच समय:",
        ref: "संदर्भ:",
        seeAdvice: "🔍 सलाह देखें",
        pdfSlip: "📄 PDF पर्ची",
        askMitr: "🤖 किसान मित्र से पूछें",
        detectedSuffix: " पाया गया",
        status: "स्थिति",
        aiConfTitle: "AI सटीकता",
        scannedTitle: "जांच समय",
        reportIdTitle: "रिपोर्ट आईडी",
        whatMeans: "इसका क्या अर्थ है?",
        whatToDo: "आपको क्या करना चाहिए?",
        askMitrBtn: 'किसान मित्र से पूछें: "मुझे क्या करना चाहिए?"',
        pdfDownloadBtn: "📄 PDF पर्ची देखें व डाउनलोड करें",
        viewScanBtn: "विस्तृत तकनीकी रिपोर्ट देखें →"
      }
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
    var modalReportId = document.getElementById("modal-report-id-text");
    var modalMeaning = document.getElementById("modal-meaning-text");
    var modalActionsList = document.getElementById("modal-actions-list");
    var modalAskMitrBtn = document.getElementById("modal-ask-mitr-btn");
    var modalDownloadPdfBtn = document.getElementById("modal-download-pdf-btn");
    var modalViewScanBtn = document.getElementById("modal-view-scan-btn");

    var activeCropKey = null;

    function getLangData() {
      var l = (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";
      return CROP_DATA[l] || CROP_DATA.en;
    }

    function openPlantModal(cropKey) {
      activeCropKey = cropKey;
      var langData = getLangData();
      var ui = langData.ui;
      var d = langData[cropKey] || CROP_DATA.en[cropKey] || {
        name: cropKey,
        disease: "Condition",
        riskLabel: "Needs Attention",
        riskClass: "badge-warning",
        confidence: "90%",
        scannedTime: "Recently",
        reportId: "AGRI-GJ-2026-84921",
        meaning: "The scan found signs of leaf stress.",
        quickActions: ["Check the leaves and keep the crop well aerated."],
        autoQuestion: "My " + cropKey + " has leaf spots. What should I do?"
      };

      if (modalEmoji) modalEmoji.textContent = getCropEmoji(cropKey);
      if (modalTitle) modalTitle.textContent = d.name;
      if (modalDiseaseBadge) {
        modalDiseaseBadge.innerHTML = '<span class="badge ' + d.riskClass + '" style="font-weight:700;">' + AgriApp.escapeHtml(d.disease) + ui.detectedSuffix + '</span>';
      }
      if (modalRisk) modalRisk.textContent = d.riskLabel;
      if (modalConfidence) modalConfidence.textContent = d.confidence;
      if (modalScanned) modalScanned.textContent = d.scannedTime;
      if (modalReportId) modalReportId.textContent = d.reportId || "AGRI-GJ-2026-84921";
      if (modalMeaning) modalMeaning.textContent = d.meaning;

      // Update static labels in modal
      var modalStatLabels = modal ? modal.querySelectorAll(".modal-card span[style*='text-transform:uppercase']") : [];
      if (modalStatLabels.length >= 4) {
        modalStatLabels[0].textContent = ui.status;
        modalStatLabels[1].textContent = ui.aiConfTitle;
        modalStatLabels[2].textContent = ui.scannedTitle;
        modalStatLabels[3].textContent = ui.reportIdTitle;
      }
      var modalHeadings = modal ? modal.querySelectorAll(".modal-card h3") : [];
      if (modalHeadings.length >= 2) {
        modalHeadings[0].textContent = ui.whatMeans;
        modalHeadings[1].textContent = ui.whatToDo;
      }

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
          '<span>' + AgriApp.escapeHtml(ui.askMitrBtn) + '</span>';
      }

      if (modalDownloadPdfBtn) {
        modalDownloadPdfBtn.href = "result.html?id=" + encodeURIComponent(d.reportId || '') + "&crop=" + encodeURIComponent(cropKey);
        var pdfSpan = modalDownloadPdfBtn.querySelector("span");
        if (pdfSpan) pdfSpan.textContent = ui.pdfDownloadBtn;
      }

      if (modalViewScanBtn) {
        modalViewScanBtn.href = "result.html?id=" + encodeURIComponent(d.reportId || '') + "&crop=" + encodeURIComponent(cropKey);
        modalViewScanBtn.textContent = ui.viewScanBtn;
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

    // Modal Ask Mitr handler
    if (modalAskMitrBtn) {
      modalAskMitrBtn.addEventListener("click", function () {
        if (!activeCropKey) return;
        var langData = getLangData();
        var d = langData[activeCropKey] || CROP_DATA.en[activeCropKey];
        closeModal();

        var q = d ? d.autoQuestion : ("My " + activeCropKey + " has disease. What should I do?");
        var ctx = {
          crop: activeCropKey,
          disease: d ? d.disease : "Leaf Spot"
        };

        if (window.KhedutMitr && window.KhedutMitr.askPreloaded) {
          window.KhedutMitr.askPreloaded(q, ctx);
        } else {
          var mitrBtn = document.getElementById("khedut-mitr-btn");
          if (mitrBtn) mitrBtn.click();
        }
      });
    }

    var cropsList = ["Tomato", "Potato", "Chilli"];

    function renderCards() {
      if (!mount) return;
      var langData = getLangData();
      var ui = langData.ui;

      mount.innerHTML = cropsList.map(function (cropKey) {
        var d = langData[cropKey] || CROP_DATA.en[cropKey];
        var emoji = getCropEmoji(cropKey);

        return (
          '<div class="card unhealthy-card" data-crop="' + cropKey + '" style="cursor:pointer;transition:all 0.2s ease;padding:1.4rem;">' +
          '  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">' +
          '    <div style="display:flex;align-items:center;gap:0.75rem;">' +
          '      <span style="font-size:2.2rem;">' + emoji + '</span>' +
          '      <div>' +
          '        <h3 style="font-size:1.3rem;margin:0;color:var(--text-main);">' + AgriApp.escapeHtml(d.name) + '</h3>' +
          '        <span style="font-size:0.85rem;color:var(--danger);font-weight:700;">' + AgriApp.escapeHtml(d.disease) + '</span>' +
          '        <div style="font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:0.75rem;color:var(--forest-dark);font-weight:700;margin-top:0.2rem;">' + ui.ref + ' ' + AgriApp.escapeHtml(d.reportId || "AGRI-GJ-2026-84921") + '</div>' +
          '      </div>' +
          '    </div>' +
          '    <span class="badge ' + d.riskClass + '" style="font-weight:700;">' + AgriApp.escapeHtml(d.riskLabel) + '</span>' +
          '  </div>' +
          '  <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin:0 0 1rem 0;">' +
          AgriApp.escapeHtml(d.meaning) +
          '  </p>' +
          '  <div style="display:flex;gap:1rem;font-size:0.82rem;color:var(--text-muted);margin-bottom:1.2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);">' +
          '    <span>' + ui.aiConfidence + ' <strong style="color:var(--text-main);">' + d.confidence + '</strong></span>' +
          '    <span>&bull;</span>' +
          '    <span>' + ui.scanned + ' <strong style="color:var(--text-main);">' + d.scannedTime + '</strong></span>' +
          '  </div>' +
          '  <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">' +
          '    <button class="btn btn-secondary btn-sm card-view-btn" data-crop="' + cropKey + '" style="flex:1;justify-content:center;font-weight:700;">' +
          '      <span>' + ui.seeAdvice + '</span>' +
          '    </button>' +
          '    <a class="btn btn-outline btn-sm card-pdf-btn" href="result.html?id=' + encodeURIComponent(d.reportId || '') + '&crop=' + encodeURIComponent(cropKey) + '" style="flex:1;justify-content:center;font-weight:700;display:inline-flex;align-items:center;gap:0.35rem;border-color:var(--leaf);color:var(--forest-dark);">' +
          '      <span>' + ui.pdfSlip + '</span>' +
          '    </a>' +
          '    <button class="btn btn-primary btn-sm card-ask-mitr-btn" data-crop="' + cropKey + '" style="flex:1.2;justify-content:center;font-weight:800;background:var(--forest-dark);border-color:var(--forest-dark);box-shadow:0 2px 6px rgba(27,67,50,0.3);">' +
          '      <span>' + ui.askMitr + '</span>' +
          '    </button>' +
          '  </div>' +
          '</div>'
        );
      }).join("");

      var cards = mount.querySelectorAll(".unhealthy-card");
      cards.forEach(function (card) {
        card.addEventListener("click", function (e) {
          var pdfBtn = e.target.closest(".card-pdf-btn");
          if (pdfBtn) {
            e.stopPropagation();
            return;
          }

          var askBtn = e.target.closest(".card-ask-mitr-btn");
          if (askBtn) {
            e.stopPropagation();
            var cKey = askBtn.getAttribute("data-crop");
            var cD = langData[cKey] || CROP_DATA.en[cKey];
            if (cD && window.KhedutMitr && window.KhedutMitr.askPreloaded) {
              window.KhedutMitr.askPreloaded(cD.autoQuestion, { crop: cKey, disease: cD.disease });
            }
            return;
          }

          var cropKey = card.getAttribute("data-crop");
          openPlantModal(cropKey);
        });
      });
    }

    renderCards();

    // Check if query parameter specifies a crop (e.g. ?crop=Tomato)
    var urlParams = new URLSearchParams(window.location.search);
    var targetCrop = urlParams.get("crop");
    if (targetCrop && (CROP_DATA.en[targetCrop] || CROP_DATA.gu[targetCrop])) {
      openPlantModal(targetCrop);
    }

    // Re-render immediately on language switch
    window.addEventListener("agri:lang", function () {
      renderCards();
      if (activeCropKey && modal && !modal.classList.contains("hidden")) {
        openPlantModal(activeCropKey);
      }
    });
  });
})();
