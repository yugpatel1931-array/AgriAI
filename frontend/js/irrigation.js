(function (global) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var heroMount = document.getElementById("irrigation-hero-mount");
    var pipelineMount = document.getElementById("pipeline-steps-mount");
    var simMoisture = document.getElementById("sim-moisture");
    var simMoistureVal = document.getElementById("sim-moisture-val");
    var simRainProb = document.getElementById("sim-rain-prob");
    var simRainVal = document.getElementById("sim-rain-val");
    var simCropStage = document.getElementById("sim-crop-stage");
    var resetSimBtn = document.getElementById("reset-sim-btn");

    function triggerMitr(questionText, context) {
      if (window.KhedutMitr && window.KhedutMitr.askPreloaded) {
        window.KhedutMitr.askPreloaded(questionText, context || { crop: "Tomato" });
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

    function evaluateDecision(moisture, rainProb, stage) {
      var l = (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";
      var action, title, badge, confidence, color, summary;

      if (moisture < 20) {
        confidence = 94;
        color = "danger";
        if (l === "gu") {
          action = "અત્યારે પાણી આપો (જમીન સૂકી છે)";
          title = "આજે તમારા પાકને પાણી આપો";
          badge = "પાણી જરૂરી છે";
          summary = "તમારી જમીનનો ભેજ " + moisture + "% છે (ખૂબ સૂકી). પાંદડા તંદુરસ્ત રાખવા અને છોડને કરમાતા અટકાવવા આજે પાણી આપો.";
        } else if (l === "hi") {
          action = "अभी पानी दें (मिट्टी सूखी है)";
          title = "आज अपनी फसल को पानी दें";
          badge = "पानी आवश्यक है";
          summary = "आपकी मिट्टी में नमी " + moisture + "% है (काफी सूखी)। पत्तों को स्वस्थ रखने और मुरझाने से बचाने के लिए आज पानी दें।";
        } else {
          action = "WATER NOW (SOIL IS DRY)";
          title = "Water your crop today";
          badge = "WATER NEEDED";
          summary = "Your soil moisture is at " + moisture + "% (very dry). Give your plants water today to keep leaves healthy and prevent wilting.";
        }
      } else if (moisture < 28 && rainProb < 40) {
        confidence = 89;
        color = "warning";
        if (l === "gu") {
          action = "આજે હળવું પાણી આપો";
          title = "હળવું પાણી આપો";
          badge = "હળવી સિંચાઈ";
          summary = "જમીન થોડી સૂકી થઈ રહી છે (" + moisture + "%) અને વરસાદની શક્યતા ઓછી છે (" + rainProb + "%). મૂળ પાસે ૨ કલાક હળવું પાણી આપો.";
        } else if (l === "hi") {
          action = "आज हल्की सिंचाई करें";
          title = "हल्का पानी दें";
          badge = "हल्की सिंचाई";
          summary = "मिट्टी थोड़ी सूख रही है (" + moisture + "%) और बारिश की संभावना कम है (" + rainProb + "%। जड़ों के पास २ घंटे हल्की सिंचाई करें।";
        } else {
          action = "LIGHT WATERING TODAY";
          title = "Give a light watering";
          badge = "LIGHT WATERING";
          summary = "Soil is getting slightly dry (" + moisture + "%) and rain is unlikely (" + rainProb + "%). Give a 2-hour light watering at the roots.";
        }
      } else if (rainProb >= 60 && moisture >= 28) {
        confidence = 88;
        color = "warning";
        if (l === "gu") {
          action = "પાણી આપતા પહેલા થોભો (વરસાદની શક્યતા)";
          title = "થોભો — આજે વરસાદની શક્યતા છે";
          badge = "પાણી આપતા પહેલા થોભો";
          summary = "આજે વરસાદની " + rainProb + "% શક્યતા છે (~૨૨mm) અને તમારી જમીનમાં પહેલેથી જ પૂરતો ભેજ (" + moisture + "%) છે. થોભવાથી મૂળ સુરક્ષિત રહેશે અને એકરે આશરે ૧૪,૦૦૦ લિટર પાણીની બચત થશે.";
        } else if (l === "hi") {
          action = "पानी देने से पहले रुकें (बारिश की संभावना)";
          title = "रुकें — आज बारिश की संभावना है";
          badge = "पानी देने से पहले रुकें";
          summary = "आज बारिश की " + rainProb + "% संभावना है (~२२mm) और आपकी मिट्टी में पहले से पर्याप्त नमी (" + moisture + "%) है। रुकने से जड़ें सुरक्षित रहेंगी और प्रति एकड़ लगभग १४,००० लीटर पानी बचेगा।";
        } else {
          action = "WAIT BEFORE WATERING";
          title = "Wait — Rain is expected";
          badge = "WAIT BEFORE WATERING";
          summary = "Rain is expected today (" + rainProb + "% chance, ~22mm) and your soil already has enough moisture (" + moisture + "%). Waiting keeps roots healthy and saves about 14,000 liters of water per acre.";
        }
      } else if (moisture >= 45) {
        confidence = 96;
        color = "danger";
        if (l === "gu") {
          action = "પાણી ન આપો (જમીન ખૂબ ભીની છે)";
          title = "જમીન પહેલેથી ખૂબ ભીની છે";
          badge = "પાણી ન આપો";
          summary = "જમીનનો ભેજ " + moisture + "% છે. વધુ પાણી આપવાથી મૂળ ગૂંગળાઈ શકે છે અને પાંદડામાં રોગ ફેલાઈ શકે છે. પાણી નીતરી જવા દો.";
        } else if (l === "hi") {
          action = "पानी न दें (मिट्टी अत्यधिक गीली है)";
          title = "मिट्टी पहले से बहुत गीली है";
          badge = "पानी न दें";
          summary = "मिट्टी की नमी " + moisture + "% है। अधिक पानी देने से जड़ें घुट सकती हैं और पत्तों में रोग फैल सकता है। पानी निकलने दें।";
        } else {
          action = "DO NOT WATER (SOIL IS TOO WET)";
          title = "Soil is already very wet";
          badge = "DO NOT WATER";
          summary = "Soil moisture is at " + moisture + "%. Adding more water can suffocate roots and cause leaf disease. Let the field drain.";
        }
      } else {
        confidence = 85;
        color = "success";
        if (l === "gu") {
          action = "પાણી આપતા પહેલા થોભો";
          title = "જમીનમાં યોગ્ય ભેજ છે";
          badge = "ભેજ યોગ્ય છે";
          summary = "જમીનનો ભેજ સામાન્ય શ્રેણીમાં છે (" + moisture + "%). આવતીકાલે ફરી તપાસ કરો.";
        } else if (l === "hi") {
          action = "पानी देने से पहले रुकें";
          title = "मिट्टी में नमी सही है";
          badge = "नमी उपयुक्त";
          summary = "मिट्टी की नमी सामान्य स्तर पर है (" + moisture + "%। कल फिर से जांचें।";
        } else {
          action = "WAIT BEFORE WATERING";
          title = "Soil moisture is good";
          badge = "SOIL IS GOOD";
          summary = "Soil moisture is in the healthy range (" + moisture + "%). Check back again tomorrow.";
        }
      }

      return {
        action: action,
        title: title,
        badge: badge,
        confidence: confidence,
        color: color,
        summary: summary,
        moisture: moisture,
        rainProb: rainProb,
        stage: stage
      };
    }

    function renderHero(decision) {
      var l = (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";
      var statusClass = decision.color === "danger" ? "badge-danger" : (decision.color === "warning" ? "badge-warning" : "badge-success");
      var borderClass = decision.color === "danger" ? "border-left:5px solid var(--danger);" : (decision.color === "warning" ? "border-left:5px solid var(--warning);" : "border-left:5px solid var(--leaf);");

      var whatToDoLbl = (l === "gu") ? "તમારે શું કરવું જોઈએ?" : (l === "hi" ? "आपको क्या करना चाहिए?" : "WHAT SHOULD YOU DO?");
      var aiConfLbl = (l === "gu") ? "AI ચોકસાઈ" : (l === "hi" ? "AI सटीकता" : "AI CONFIDENCE");
      var mLabel = (l === "gu") ? "હાલનો જમીન ભેજ" : (l === "hi" ? "वर्तमान मिट्टी नमी" : "Current Soil Moisture");
      var mSub = (l === "gu") ? "ગોરાડુ જમીન માટે સામાન્ય: ૩૦ - ૪૫%" : (l === "hi" ? "दोमट के लिए उपयुक्त: ३० - ४५%" : "Healthy loam range: 30 - 45%");
      var rLabel = (l === "gu") ? "આજે વરસાદની શક્યતા" : (l === "hi" ? "आज बारिश की संभावना" : "Rain Chance Today");
      var rSub = (l === "gu") ? "આશરે ૨૨mm વરસાદની શક્યતા" : (l === "hi" ? "~२२mm बारिश की संभावना" : "~22mm rain expected");
      var sLabel = (l === "gu") ? "પાક તબક્કો" : (l === "hi" ? "फसल अवस्था" : "Crop Stage");
      var sSub = (l === "gu") ? "ટામેટાનો પાક" : (l === "hi" ? "टमाटर फसल" : "Tomato crop");
      var cLabel = (l === "gu") ? "ફરી ક્યારે તપાસવું" : (l === "hi" ? "अगली जांच" : "Check Again In");
      var cVal = (l === "gu") ? "આવતીકાલે" : (l === "hi" ? "कल" : "Tomorrow");
      var cSub = (l === "gu") ? "વરસાદ બંધ થયા પછી" : (l === "hi" ? "बारिश थमने के बाद" : "After the rain clears");
      var askBtnText = (l === "gu") ? 'ખેડૂત મિત્રને પૂછો: "શું આજે પાણી આપવું?"' : (l === "hi" ? 'किसान मित्र से पूछें: "क्या आज पानी देना चाहिए?"' : 'Ask Khedut Mitr: "Should I water today?"');

      heroMount.style = borderClass;
      heroMount.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.2rem;">' +
        '  <div style="display:flex;align-items:center;gap:0.75rem;">' +
        '    <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:rgba(82,183,136,0.18);display:grid;place-items:center;font-size:1.8rem;">💧</div>' +
        '    <div>' +
        '      <span class="badge ' + statusClass + '" style="font-weight:800;font-size:0.75rem;">' + AgriApp.escapeHtml(decision.badge) + '</span>' +
        '      <h2 style="font-size:1.8rem;margin:0.2rem 0 0;color:var(--text-main);">' + AgriApp.escapeHtml(decision.action) + '</h2>' +
        '    </div>' +
        '  </div>' +
        '  <div style="text-align:right;">' +
        '    <div style="font-size:1.6rem;font-weight:800;color:var(--leaf);">' + decision.confidence + '%</div>' +
        '    <div style="font-size:0.72rem;color:var(--text-subtle);text-transform:uppercase;letter-spacing:0.04em;">' + aiConfLbl + '</div>' +
        '  </div>' +
        '</div>' +

        '<div style="background:var(--bg-sand);padding:1rem 1.25rem;border-radius:var(--radius-sm);margin-bottom:1.5rem;">' +
        '  <div style="font-size:0.8rem;font-weight:700;color:var(--forest-dark);margin-bottom:0.3rem;">' + whatToDoLbl + '</div>' +
        '  <p style="font-size:1.05rem;color:var(--text-main);line-height:1.5;margin:0;font-weight:600;">' +
        AgriApp.escapeHtml(decision.summary) +
        '  </p>' +
        '</div>' +

        '<div class="telemetry-pills-grid">' +
        '  <div class="telemetry-pill">' +
        '    <span class="pill-label">' + mLabel + '</span>' +
        '    <strong class="pill-value">' + decision.moisture + '%</strong>' +
        '    <small class="pill-sub">' + mSub + '</small>' +
        '  </div>' +
        '  <div class="telemetry-pill">' +
        '    <span class="pill-label">' + rLabel + '</span>' +
        '    <strong class="pill-value">' + decision.rainProb + '%</strong>' +
        '    <small class="pill-sub">' + rSub + '</small>' +
        '  </div>' +
        '  <div class="telemetry-pill">' +
        '    <span class="pill-label">' + sLabel + '</span>' +
        '    <strong class="pill-value">' + AgriApp.escapeHtml(decision.stage) + '</strong>' +
        '    <small class="pill-sub">' + sSub + '</small>' +
        '  </div>' +
        '  <div class="telemetry-pill">' +
        '    <span class="pill-label">' + cLabel + '</span>' +
        '    <strong class="pill-value">' + cVal + '</strong>' +
        '    <small class="pill-sub">' + cSub + '</small>' +
        '  </div>' +
        '</div>' +

        '<div style="margin-top:1.5rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;padding-top:1.2rem;border-top:1px solid var(--border);">' +
        '  <button class="btn btn-primary btn-lg" id="ask-mitr-irrig-btn" style="font-weight:800;">' +
        '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '    <span>' + askBtnText + '</span>' +
        '  </button>' +
        '</div>';

      var askMitrBtn = document.getElementById("ask-mitr-irrig-btn");
      if (askMitrBtn) {
        askMitrBtn.addEventListener("click", function () {
          var q = (l === "gu")
            ? "આણંદમાં આજે મારા પાકને પાણી આપવું જોઈએ કે રાહ જોવી?"
            : ((l === "hi") ? "आनंद में आज मेरी फसल को पानी देना चाहिए या रुकना चाहिए?" : "Should I water my crop today in Anand?");
          triggerMitr(q, { crop: "Tomato" });
        });
      }
    }

    function renderPipeline(decision) {
      var l = (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";
      var s1Name = (l === "gu") ? "જમીન ભેજ પરીક્ષણ" : (l === "hi" ? "मिट्टी नमी परीक्षण" : "Soil Moisture Test");
      var s1Status = decision.moisture < 20
        ? (l === "gu" ? "સૂકી" : (l === "hi" ? "सूखी" : "Dry"))
        : (decision.moisture > 40 ? (l === "gu" ? "વધુ ભીની" : (l === "hi" ? "अधिक गीली" : "Too Wet")) : (l === "gu" ? "યોગ્ય" : (l === "hi" ? "उपयुक्त" : "Good")));
      var s1Desc = (l === "gu") ? ("હાલનો જમીન ભેજ " + decision.moisture + "% છે.") : (l === "hi" ? ("वर्तमान मिट्टी नमी " + decision.moisture + "% है।") : ("Current soil moisture is " + decision.moisture + "%."));

      var s2Name = (l === "gu") ? "વરસાદની આગાહી" : (l === "hi" ? "वर्षा पूर्वानुमान" : "Rain Forecast");
      var s2Status = decision.rainProb >= 60
        ? (l === "gu" ? "વરસાદની શક્યતા" : (l === "hi" ? "बारिश संभव" : "Rain Likely"))
        : (l === "gu" ? "સ્વચ્છ આકાશ" : (l === "hi" ? "साफ मौसम" : "Dry Sky"));
      var s2Desc = (l === "gu") ? ("આજે " + decision.rainProb + "% વરસાદની શક્યતા છે.") : (l === "hi" ? ("आज " + decision.rainProb + "% बारिश की संभावना है।") : (decision.rainProb + "% chance of rain today."));

      var s3Name = (l === "gu") ? "પાક વૃદ્ધિ તબક્કો" : (l === "hi" ? "फसल वृद्धि अवस्था" : "Plant Growth Stage");
      var s3Desc = (l === "gu") ? "ફૂલ આવતા ટામેટાના છોડને હવાદાર જમીન જરૂરી છે." : (l === "hi" ? "फूल आने पर टमाटर के पौधों को हवादार मिट्टी चाहिए।" : "Flowering tomato plants need well-aerated soil.");

      var s4Name = (l === "gu") ? "અંતિમ ખેડૂત સલાહ" : (l === "hi" ? "अंतिम किसान सलाह" : "Final Advice");
      var s4Desc = (l === "gu") ? "ખેડૂત માટે AI દ્વારા તૈયાર કરેલી ભલામણ." : (l === "hi" ? "किसान के लिए AI द्वारा तैयार की गई सलाह।" : "AI recommendation synthesized for farmer.");

      var steps = [
        {
          num: 1,
          name: s1Name,
          status: s1Status,
          badgeClass: decision.moisture < 20 ? "badge-danger" : (decision.moisture > 40 ? "badge-warning" : "badge-success"),
          desc: s1Desc
        },
        {
          num: 2,
          name: s2Name,
          status: s2Status,
          badgeClass: decision.rainProb >= 60 ? "badge-warning" : "badge-secondary",
          desc: s2Desc
        },
        {
          num: 3,
          name: s3Name,
          status: decision.stage,
          badgeClass: "badge-secondary",
          desc: s3Desc
        },
        {
          num: 4,
          name: s4Name,
          status: decision.action,
          badgeClass: decision.color === "danger" ? "badge-danger" : (decision.color === "warning" ? "badge-warning" : "badge-success"),
          desc: s4Desc
        }
      ];

      pipelineMount.innerHTML = steps.map(function (step) {
        return (
          '<div class="pipeline-step-card">' +
          '  <div class="step-badge-num">' + step.num + '</div>' +
          '  <h4 style="margin:0 0 0.3rem;font-size:0.95rem;color:var(--text-main);">' + AgriApp.escapeHtml(step.name) + '</h4>' +
          '  <div style="margin-bottom:0.4rem;"><span class="badge ' + step.badgeClass + '" style="font-size:0.7rem;">' + AgriApp.escapeHtml(step.status) + '</span></div>' +
          '  <p style="font-size:0.8rem;color:var(--text-muted);margin:0;">' + AgriApp.escapeHtml(step.desc) + '</p>' +
          '</div>'
        );
      }).join("");
    }

    function updateSimulation() {
      var m = parseInt(simMoisture.value, 10);
      var r = parseInt(simRainProb.value, 10);
      var s = simCropStage.value;

      simMoistureVal.textContent = m + "%";
      simRainVal.textContent = r + "%";

      var decision = evaluateDecision(m, r, s);
      renderHero(decision);
      renderPipeline(decision);
    }

    if (simMoisture) simMoisture.addEventListener("input", updateSimulation);
    if (simRainProb) simRainProb.addEventListener("input", updateSimulation);
    if (simCropStage) simCropStage.addEventListener("change", updateSimulation);

    if (resetSimBtn) {
      resetSimBtn.addEventListener("click", function () {
        var ctx = AgriAPI.getFarmContext();
        simMoisture.value = ctx.soilMoisture;
        simRainProb.value = ctx.rainProbability;
        simCropStage.value = ctx.growthStage;
        updateSimulation();
      });
    }

    updateSimulation();

    // Re-render when language changes
    window.addEventListener("agri:lang", updateSimulation);
  });
})(window);
