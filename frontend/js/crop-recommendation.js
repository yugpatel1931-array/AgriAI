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
    if (c.indexOf("gram") !== -1 || c.indexOf("mung") !== -1) return "🌱";
    if (c.indexOf("sesame") !== -1 || c.indexOf("til") !== -1) return "🌿";
    return "🌿";
  }

  var CROP_TRANSLATIONS = {
    en: {
      heroBadge: "🥇 BEST MATCH FOR YOUR FIELD",
      matchScoreLabel: "MATCH SCORE",
      kpiYield: "Expected Yield",
      kpiHarvest: "Days to Harvest",
      kpiWater: "Water Needed",
      kpiSoil: "Soil Match",
      soilMatchVal: "Excellent for Loam",
      whyTitle: "🔍 Why Groundnut after Wheat?",
      whyDesc: "Wheat is a heavy cereal crop that uses up a lot of nitrogen from the soil. Groundnut is a legume that naturally puts 40–60 kg of nitrogen back into your soil, restoring your field without buying expensive extra fertilizer!",
      whyFitsSub: "Why it fits your Anand farm:",
      bullets: [
        "Your loose loamy soil allows groundnut pods to expand underground easily.",
        "Soil pH 6.5 is the exact sweet spot for healthy root nodules.",
        "Strong market demand and guaranteed government MSP prices in Gujarat mandis."
      ],
      askBtn: "Ask Khedut Mitr About Groundnut",
      seedsText: "Recommended seeds: GG-20, TG-37A",
      otherTitle: "Other Good Crops for Your Farm",
      otherDesc: "Alternative choices ranked by how well they fit your soil.",
      waterLbl: "Water:",
      harvestLbl: "Harvest in:",
      askRunner: "🤖 Ask Khedut Mitr About {name} &rarr;",
      compareFeatures: {
        feature: "Feature",
        matchScore: "Match Score",
        water: "Water Needed",
        yield: "Expected Yield",
        harvest: "Harvest in",
        benefit: "Soil Benefit"
      }
    },
    gu: {
      heroBadge: "🥇 તમારા ખેતર માટે શ્રેષ્ઠ પસંદગી",
      matchScoreLabel: "મેચ સ્કોર",
      kpiYield: "અપેક્ષિત ઉત્પાદન",
      kpiHarvest: "લણણી સુધીના દિવસો",
      kpiWater: "જરૂરી પાણી",
      kpiSoil: "જમીન અનુકૂળતા",
      soilMatchVal: "ગોરાડુ જમીન માટે ઉત્તમ",
      whyTitle: "🔍 ઘઉં પછી મગફળી શા માટે?",
      whyDesc: "ઘઉં એ ભારે ધાન્ય પાક છે જે જમીનમાંથી ઘણું નાઇટ્રોજન વાપરી નાખે છે. મગફળી એ કઠોળ વર્ગનો પાક હોવાથી કુદરતી રીતે જમીનમાં ૪૦–૬૦ કિલો નાઇટ્રોજન પાછું ઉમેરે છે, જેથી મોંઘા ખાતરનો ખર્ચ બચે છે!",
      whyFitsSub: "આણંદના ખેતર માટે શા માટે અનુકૂળ છે:",
      bullets: [
        "તમારી પોચી ગોરાડુ જમીન મગફળીના ડોડવાને જમીનમાં સરળતાથી વિકસવા દે છે.",
        "જમીનનો ૬.૫ pH મૂળની ગાંઠોના તંદુરસ્ત વિકાસ માટે એકદમ યોગ્ય છે.",
        "ગુજરાતના માર્કેટ યાર્ડમાં મગફળીની ભારે માંગ અને સરકારના ટેકાના ભાવ (MSP) મળે છે."
      ],
      askBtn: "મગફળી વિશે ખેડૂત મિત્રને પૂછો",
      seedsText: "ભલામણ કરેલ બિયારણ: GG-20, TG-37A",
      otherTitle: "તમારા ખેતર માટે અન્ય સારા પાક",
      otherDesc: "તમારી જમીન અનુસાર ક્રમબદ્ધ વૈકલ્પિક પાક.",
      waterLbl: "પાણી:",
      harvestLbl: "લણણી:",
      askRunner: "🤖 {name} વિશે ખેડૂત મિત્રને પૂછો &rarr;",
      compareFeatures: {
        feature: "વિગત",
        matchScore: "મેચ સ્કોર",
        water: "જરૂરી પાણી",
        yield: "અપેક્ષિત ઉત્પાદન",
        harvest: "લણણી સમય",
        benefit: "જમીન ફાયદો"
      }
    },
    hi: {
      heroBadge: "🥇 आपके खेत के लिए सर्वश्रेष्ठ विकल्प",
      matchScoreLabel: "मैच स्कोर",
      kpiYield: "अपेक्षित पैदावार",
      kpiHarvest: "कटाई के दिन",
      kpiWater: "आवश्यक पानी",
      kpiSoil: "मिट्टी अनुकूलता",
      soilMatchVal: "दोमट मिट्टी के लिए उत्तम",
      whyTitle: "🔍 गेहूं के बाद मूंगफली क्यों?",
      whyDesc: "गेहूं एक भारी अनाज वाली फसल है जो मिट्टी से काफी नाइट्रोजन सोख लेती है। मूंगफली एक दलहनी फसल है जो स्वाभाविक रूप से मिट्टी में ४०-६० किग्रा नाइट्रोजन वापस लाती है, जिससे महंगे उर्वरक की बचत होती है!",
      whyFitsSub: "आपके आनंद फार्म के लिए क्यों उपयुक्त है:",
      bullets: [
        "आपकी भुरभुरी दोमट मिट्टी में मूंगफली की फली आसानी से फैलती है।",
        "मिट्टी का ६.५ pH स्वस्थ जड़ों की ग्रंथियों के लिए एकदम सही है।",
        "गुजरात की मंडियों में मूंगफली की अच्छी मांग और सरकारी समर्थन मूल्य (MSP) मिलता है।"
      ],
      askBtn: "मूंगफली के बारे में किसान मित्र से पूछें",
      seedsText: "अनुशंसित बीज: GG-20, TG-37A",
      otherTitle: "आपके खेत के लिए अन्य अच्छी फसलें",
      otherDesc: "आपकी मिट्टी के आधार पर अन्य अनुशंसित विकल्प।",
      waterLbl: "पानी:",
      harvestLbl: "कटाई:",
      askRunner: "🤖 {name} के बारे में किसान मित्र से पूछें &rarr;",
      compareFeatures: {
        feature: "विवरण",
        matchScore: "मैच स्कोर",
        water: "आवश्यक पानी",
        yield: "अपेक्षित पैदावार",
        harvest: "कटाई का समय",
        benefit: "मिट्टी का लाभ"
      }
    }
  };

  function getLocalizedCropName(name, lang) {
    var n = String(name || "").toLowerCase();
    if (lang === "gu") {
      if (n.indexOf("groundnut") !== -1) return "મગફળી (Groundnut)";
      if (n.indexOf("cotton") !== -1) return "કપાસ (Cotton)";
      if (n.indexOf("soybean") !== -1) return "સોયાબીન (Soybean)";
      if (n.indexOf("chickpea") !== -1) return "ચણા (Chickpea)";
      if (n.indexOf("maize") !== -1 || n.indexOf("corn") !== -1) return "મકાઈ (Maize)";
      if (n.indexOf("green gram") !== -1 || n.indexOf("mung") !== -1) return "મગ (Mung)";
      if (n.indexOf("sesame") !== -1 || n.indexOf("til") !== -1) return "તલ (Sesame)";
    } else if (lang === "hi") {
      if (n.indexOf("groundnut") !== -1) return "मूंगफली (Groundnut)";
      if (n.indexOf("cotton") !== -1) return "कपास (Cotton)";
      if (n.indexOf("soybean") !== -1) return "सोयाबीन (Soybean)";
      if (n.indexOf("chickpea") !== -1) return "चना (Chickpea)";
      if (n.indexOf("maize") !== -1 || n.indexOf("corn") !== -1) return "मक्का (Maize)";
      if (n.indexOf("green gram") !== -1 || n.indexOf("mung") !== -1) return "मूंग (Mung)";
      if (n.indexOf("sesame") !== -1 || n.indexOf("til") !== -1) return "तिल (Sesame)";
    }
    return name;
  }

  function updateDropdownOptions(lang) {
    var l = lang || (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";
    var soilSelect = document.getElementById("inp-soil-type");
    if (soilSelect) {
      var soilOpts = {
        en: ["Loamy (Loose & fertile)", "Clay Loam", "Sandy Loam", "Black Cotton Soil"],
        gu: ["ગોરાડુ (પોચી અને ફળદ્રુપ)", "કાંપવાળી માટી (Clay Loam)", "રેતાળ ગોરાડુ (Sandy Loam)", "કાળી કપાસવાળી જમીન (Black Cotton)"],
        hi: ["दोमट (उपजाऊ व भुरभुरी)", "चिकनी दोमट (Clay Loam)", "बलुई दोमट (Sandy Loam)", "काली कपास मिट्टी (Black Cotton)"]
      };
      var sList = soilOpts[l] || soilOpts.en;
      for (var i = 0; i < soilSelect.options.length; i++) {
        if (sList[i]) soilSelect.options[i].text = sList[i];
      }
    }

    var prevSelect = document.getElementById("inp-prev-crop");
    if (prevSelect) {
      var prevOpts = {
        en: ["Wheat (Uses up soil nitrogen)", "Rice / Paddy", "Cotton", "Tomato"],
        gu: ["ઘઉં (જમીનનું નાઇટ્રોજન વાપરે છે)", "ડાંગર / ચોખા", "કપાસ", "ટામેટા"],
        hi: ["गेहूं (मिट्टी का नाइट्रोजन कम करता है)", "धान / चावल", "कपास", "टमाटर"]
      };
      var pList = prevOpts[l] || prevOpts.en;
      for (var j = 0; j < prevSelect.options.length; j++) {
        if (pList[j]) prevSelect.options[j].text = pList[j];
      }
    }

    var waterSelect = document.getElementById("inp-water-avail");
    if (waterSelect) {
      var waterOpts = {
        en: ["Moderate (Canal & Tubewell)", "Plenty of water", "Limited water"],
        gu: ["મધ્યમ (કેનાલ અને બોરવેલ)", "પૂરતું પાણી (કેનાલ સુવિધા)", "મર્યાદિત પાણી (વરસાદ આધારિત)"],
        hi: ["मध्यम (नहर और नलकूप)", "प्रचुर पानी (स्थायी नहर)", "सीमित पानी (वर्षा आधारित)"]
      };
      var wList = waterOpts[l] || waterOpts.en;
      for (var k = 0; k < waterSelect.options.length; k++) {
        if (wList[k]) waterSelect.options[k].text = wList[k];
      }
    }

    var seasonSelect = document.getElementById("inp-season");
    if (seasonSelect) {
      var seasonOpts = {
        en: ["Kharif / Monsoon (Current)", "Rabi / Winter", "Zaid / Summer"],
        gu: ["ખરીફ / ચોમાસુ (ચાલુ)", "રવિ / શિયાળો", "જાયદ / ઉનાળો"],
        hi: ["खरीफ / मानसून (वर्तमान)", "रबी / सर्दी", "जायद / गर्मी"]
      };
      var seList = seasonOpts[l] || seasonOpts.en;
      for (var m = 0; m < seasonSelect.options.length; m++) {
        if (seList[m]) seasonSelect.options[m].text = seList[m];
      }
    }
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

      var l = (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";
      var t = CROP_TRANSLATIONS[l] || CROP_TRANSLATIONS.en;

      var topDisplayName = (l === "gu") ? "મગફળી (Groundnut - GJ-G 22)" : (l === "hi" ? "मूंगफली (Groundnut - GJ-G 22)" : (AgriApp.escapeHtml(top.name) + ' (' + AgriApp.escapeHtml(top.hindiName) + ')'));
      var topCategoryDisplay = (l === "gu") ? "તેલીબિયાં / કઠોળ પાક • ઋતુ: ખરીફ / જાયદ" : (l === "hi" ? "तिलहन / दलहन फसल • मौसम: खरीफ / जायद" : (AgriApp.escapeHtml(top.category) + ' &bull; Season: ' + AgriApp.escapeHtml(top.season)));

      var runnersHtml = ranked.slice(1, 4).map(function (crop) {
        var emoji = getCropEmoji(crop.name);
        var cropDisplayName = getLocalizedCropName(crop.name, l);
        var askBtnText = t.askRunner.replace("{name}", cropDisplayName);

        return (
          '<div class="card runner-card" style="padding:1.2rem;display:flex;flex-direction:column;justify-content:space-between;">' +
          '  <div>' +
          '    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;">' +
          '      <div style="display:flex;align-items:center;gap:0.6rem;">' +
          '        <span style="font-size:1.8rem;">' + emoji + '</span>' +
          '        <div>' +
          '          <strong style="font-size:1.1rem;color:var(--text-main);">' + AgriApp.escapeHtml(cropDisplayName) + '</strong>' +
          '          <div style="font-size:0.75rem;color:var(--text-subtle);">' + AgriApp.escapeHtml(crop.category) + '</div>' +
          '        </div>' +
          '      </div>' +
          '      <div style="text-align:right;">' +
          '        <span style="font-size:1.3rem;font-weight:800;color:var(--leaf);">' + crop.suitabilityScore + '%</span>' +
          '      </div>' +
          '    </div>' +
          '    <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 0.75rem;line-height:1.4;">' + AgriApp.escapeHtml(crop.rotationAnalysis) + '</p>' +
          '    <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-subtle);padding-top:0.6rem;border-top:1px solid var(--border);margin-bottom:0.8rem;">' +
          '      <span>' + t.waterLbl + ' <strong>' + AgriApp.escapeHtml(crop.waterLevel) + '</strong></span>' +
          '      <span>' + t.harvestLbl + ' <strong>' + AgriApp.escapeHtml(crop.growthDuration) + '</strong></span>' +
          '    </div>' +
          '  </div>' +
          '  <button class="btn btn-secondary btn-sm runner-ask-btn" data-crop="' + AgriApp.escapeHtml(crop.name) + '" type="button" style="width:100%;justify-content:center;font-weight:700;">' +
          '    <span>' + askBtnText + '</span>' +
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
        '        <span class="badge badge-success" style="font-weight:800;font-size:0.75rem;margin-bottom:0.3rem;">' + t.heroBadge + '</span>' +
        '        <h2 style="font-size:1.9rem;margin:0;color:var(--text-main);">' + topDisplayName + '</h2>' +
        '        <div style="font-size:0.85rem;color:var(--text-muted);">' + topCategoryDisplay + '</div>' +
        '      </div>' +
        '    </div>' +
        '    <div class="suitability-badge-wrap">' +
        '      <div class="suitability-score-num">' + top.suitabilityScore + '%</div>' +
        '      <div class="suitability-score-lbl">' + t.matchScoreLabel + '</div>' +
        '    </div>' +
        '  </div>' +

        '  <!-- 4 KEY PILLS -->' +
        '  <div class="crop-kpi-grid">' +
        '    <div class="crop-kpi-pill">' +
        '      <span class="crop-kpi-title">' + t.kpiYield + '</span>' +
        '      <strong class="crop-kpi-val">' + AgriApp.escapeHtml(top.expectedYield) + '</strong>' +
        '    </div>' +
        '    <div class="crop-kpi-pill">' +
        '      <span class="crop-kpi-title">' + t.kpiHarvest + '</span>' +
        '      <strong class="crop-kpi-val">' + AgriApp.escapeHtml(top.growthDuration) + '</strong>' +
        '    </div>' +
        '    <div class="crop-kpi-pill">' +
        '      <span class="crop-kpi-title">' + t.kpiWater + '</span>' +
        '      <strong class="crop-kpi-val">' + AgriApp.escapeHtml(top.waterRequirement) + '</strong>' +
        '    </div>' +
        '    <div class="crop-kpi-pill">' +
        '      <span class="crop-kpi-title">' + t.kpiSoil + '</span>' +
        '      <strong class="crop-kpi-val">' + t.soilMatchVal + '</strong>' +
        '    </div>' +
        '  </div>' +

        '  <!-- WHY THIS CROP? -->' +
        '  <div style="margin-top:1.5rem;padding:1.2rem;background:var(--bg-sand);border-radius:var(--radius-md);">' +
        '    <h3 style="font-size:1.05rem;margin:0 0 0.6rem;color:var(--forest-dark);">' + t.whyTitle + '</h3>' +
        '    <p style="font-size:0.95rem;color:var(--text-main);line-height:1.6;margin:0 0 0.8rem;">' +
        t.whyDesc +
        '    </p>' +
        '    <div style="font-size:0.85rem;font-weight:700;color:var(--forest-dark);margin-bottom:0.4rem;">' + t.whyFitsSub + '</div>' +
        '    <ul style="margin:0;padding-left:1.2rem;font-size:0.88rem;color:var(--text-muted);line-height:1.5;">' +
        t.bullets.map(function(b) { return '<li>' + b + '</li>'; }).join('') +
        '    </ul>' +
        '  </div>' +

        '  <!-- ACTION FOOTER -->' +
        '  <div style="margin-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">' +
        '    <button class="btn btn-primary btn-lg" id="ask-mitr-crop-btn" style="font-weight:800;">' +
        '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '      <span>' + t.askBtn + '</span>' +
        '    </button>' +
        '    <span style="font-size:0.82rem;color:var(--text-muted);">' + t.seedsText + '</span>' +
        '  </div>' +
        '</div>' +

        '<!-- 2. OTHER GOOD OPTIONS -->' +
        '<div style="margin-bottom:1.5rem;">' +
        '  <h3 style="font-size:1.25rem;margin:0 0 0.2rem;color:var(--text-main);">' + t.otherTitle + '</h3>' +
        '  <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 1rem;">' + t.otherDesc + '</p>' +
        '  <div class="runners-grid">' +
        runnersHtml +
        '  </div>' +
        '</div>';

      var askMitrBtn = document.getElementById("ask-mitr-crop-btn");
      if (askMitrBtn) {
        askMitrBtn.addEventListener("click", function () {
          var q = (l === "gu")
            ? "આણંદમાં ઘઉં પછી મારા ખેતર માટે મગફળી કેમ શ્રેષ્ઠ પાક છે?"
            : ((l === "hi") ? "आनंद में गेहूं के बाद मेरे खेत के लिए मूंगफली सबसे अच्छी फसल क्यों है?" : "Why is Groundnut the best crop after wheat for my farm in Anand?");
          triggerMitr(q, { crop: "Groundnut" });
        });
      }

      var runnerBtns = resultsRoot.querySelectorAll(".runner-ask-btn");
      runnerBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var cName = btn.getAttribute("data-crop");
          var cDisplay = getLocalizedCropName(cName, l);
          var q = (l === "gu")
            ? (cDisplay + " આણંદમાં મારા ખેતર માટે સારો વિકલ્પ કેમ છે?")
            : ((l === "hi") ? (cDisplay + " आनंद में मेरे खेत के लिए अच्छा विकल्प क्यों है?") : ("Why is " + cName + " a good alternative crop for my farm in Anand?"));
          triggerMitr(q, { crop: cName });
        });
      });
    }

    function renderCompareModal() {
      if (!currentRecommendation || !compareTableRoot) return;
      var crops = currentRecommendation.rankedCrops.slice(0, 3);
      var l = (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";
      var t = CROP_TRANSLATIONS[l] || CROP_TRANSLATIONS.en;
      var cf = t.compareFeatures;

      var tableHtml =
        '<table class="compare-table">' +
        '  <thead>' +
        '    <tr>' +
        '      <th>' + cf.feature + '</th>' +
        crops.map(function (c) {
          var cropDisplayName = getLocalizedCropName(c.name, l);
          return '<th>' + getCropEmoji(c.name) + ' ' + AgriApp.escapeHtml(cropDisplayName) + '</th>';
        }).join("") +
        '    </tr>' +
        '  </thead>' +
        '  <tbody>' +
        '    <tr>' +
        '      <td><strong>' + cf.matchScore + '</strong></td>' +
        crops.map(function (c) { return '<td style="font-weight:800;color:var(--leaf);font-size:1.1rem;">' + c.suitabilityScore + '%</td>'; }).join("") +
        '    </tr>' +
        '    <tr>' +
        '      <td><strong>' + cf.water + '</strong></td>' +
        crops.map(function (c) { return '<td>' + AgriApp.escapeHtml(c.waterRequirement) + '</td>'; }).join("") +
        '    </tr>' +
        '    <tr>' +
        '      <td><strong>' + cf.yield + '</strong></td>' +
        crops.map(function (c) { return '<td>' + AgriApp.escapeHtml(c.expectedYield) + '</td>'; }).join("") +
        '    </tr>' +
        '    <tr>' +
        '      <td><strong>' + cf.harvest + '</strong></td>' +
        crops.map(function (c) { return '<td>' + AgriApp.escapeHtml(c.growthDuration) + '</td>'; }).join("") +
        '    </tr>' +
        '    <tr>' +
        '      <td><strong>' + cf.benefit + '</strong></td>' +
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

    // Initial dropdown setup & analysis run
    updateDropdownOptions();
    runAnalysis();

    // Re-render when language changes
    window.addEventListener("agri:lang", function (e) {
      var l = (e && e.detail && e.detail.lang) || ((window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en");
      updateDropdownOptions(l);
      if (currentRecommendation) {
        renderResults(currentRecommendation);
      }
      if (compareModal && !compareModal.classList.contains("hidden")) {
        renderCompareModal();
      }
    });
  });
})(window);
