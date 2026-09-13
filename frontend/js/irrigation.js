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
      var action, title, badge, confidence, color, summary;

      if (moisture < 20) {
        action = "WATER NOW (SOIL IS DRY)";
        title = "Water your crop today";
        badge = "WATER NEEDED";
        confidence = 94;
        color = "danger";
        summary = "Your soil moisture is at " + moisture + "% (very dry). Give your plants water today to keep leaves healthy and prevent wilting.";
      } else if (moisture < 28 && rainProb < 40) {
        action = "LIGHT WATERING TODAY";
        title = "Give a light watering";
        badge = "LIGHT WATERING";
        confidence = 89;
        color = "warning";
        summary = "Soil is getting slightly dry (" + moisture + "%) and rain is unlikely (" + rainProb + "%). Give a 2-hour light watering at the roots.";
      } else if (rainProb >= 60 && moisture >= 28) {
        action = "WAIT BEFORE WATERING";
        title = "Wait — Rain is expected";
        badge = "WAIT BEFORE WATERING";
        confidence = 88;
        color = "warning";
        summary = "Rain is expected today (" + rainProb + "% chance, ~22mm) and your soil already has enough moisture (" + moisture + "%). Waiting keeps roots healthy and saves about 14,000 liters of water per acre.";
      } else if (moisture >= 45) {
        action = "DO NOT WATER (SOIL IS TOO WET)";
        title = "Soil is already very wet";
        badge = "DO NOT WATER";
        confidence = 96;
        color = "danger";
        summary = "Soil moisture is at " + moisture + "%. Adding more water can suffocate roots and cause leaf disease. Let the field drain.";
      } else {
        action = "WAIT BEFORE WATERING";
        title = "Soil moisture is good";
        badge = "SOIL IS GOOD";
        confidence = 85;
        color = "success";
        summary = "Soil moisture is in the healthy range (" + moisture + "%). Check back again tomorrow.";
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
      var statusClass = decision.color === "danger" ? "badge-danger" : (decision.color === "warning" ? "badge-warning" : "badge-success");
      var borderClass = decision.color === "danger" ? "border-left:5px solid var(--danger);" : (decision.color === "warning" ? "border-left:5px solid var(--warning);" : "border-left:5px solid var(--leaf);");

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
        '    <div style="font-size:0.72rem;color:var(--text-subtle);text-transform:uppercase;letter-spacing:0.04em;">AI CONFIDENCE</div>' +
        '  </div>' +
        '</div>' +

        '<div style="background:var(--bg-sand);padding:1rem 1.25rem;border-radius:var(--radius-sm);margin-bottom:1.5rem;">' +
        '  <div style="font-size:0.8rem;font-weight:700;color:var(--forest-dark);margin-bottom:0.3rem;">WHAT SHOULD YOU DO?</div>' +
        '  <p style="font-size:1.05rem;color:var(--text-main);line-height:1.5;margin:0;font-weight:600;">' +
        AgriApp.escapeHtml(decision.summary) +
        '  </p>' +
        '</div>' +

        '<div class="telemetry-pills-grid">' +
        '  <div class="telemetry-pill">' +
        '    <span class="pill-label">Current Soil Moisture</span>' +
        '    <strong class="pill-value">' + decision.moisture + '%</strong>' +
        '    <small class="pill-sub">Healthy loam range: 30 - 45%</small>' +
        '  </div>' +
        '  <div class="telemetry-pill">' +
        '    <span class="pill-label">Rain Chance Today</span>' +
        '    <strong class="pill-value">' + decision.rainProb + '%</strong>' +
        '    <small class="pill-sub">~22mm rain expected</small>' +
        '  </div>' +
        '  <div class="telemetry-pill">' +
        '    <span class="pill-label">Crop Stage</span>' +
        '    <strong class="pill-value">' + AgriApp.escapeHtml(decision.stage) + '</strong>' +
        '    <small class="pill-sub">Tomato crop</small>' +
        '  </div>' +
        '  <div class="telemetry-pill">' +
        '    <span class="pill-label">Check Again In</span>' +
        '    <strong class="pill-value">Tomorrow</strong>' +
        '    <small class="pill-sub">After the rain clears</small>' +
        '  </div>' +
        '</div>' +

        '<div style="margin-top:1.5rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;padding-top:1.2rem;border-top:1px solid var(--border);">' +
        '  <button class="btn btn-primary btn-lg" id="ask-mitr-irrig-btn" style="font-weight:800;">' +
        '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '    <span>Ask Khedut Mitr: "Should I water today?"</span>' +
        '  </button>' +
        '</div>';

      var askMitrBtn = document.getElementById("ask-mitr-irrig-btn");
      if (askMitrBtn) {
        askMitrBtn.addEventListener("click", function () {
          var q = (decision && decision.moisture < 20)
            ? "My soil moisture is dry at " + decision.moisture + "%. How much should I water my tomato crop today?"
            : "Should I water my crop today in Anand?";
          triggerMitr(q, { crop: "Tomato" });
        });
      }
    }

    function renderPipeline(decision) {
      var steps = [
        {
          num: 1,
          name: "Soil Moisture Test",
          status: decision.moisture < 20 ? "Dry" : (decision.moisture > 40 ? "Too Wet" : "Good"),
          badgeClass: decision.moisture < 20 ? "badge-danger" : (decision.moisture > 40 ? "badge-warning" : "badge-success"),
          desc: "Current soil moisture is " + decision.moisture + "%."
        },
        {
          num: 2,
          name: "Rain Forecast",
          status: decision.rainProb >= 60 ? "Rain Likely" : "Dry Sky",
          badgeClass: decision.rainProb >= 60 ? "badge-warning" : "badge-secondary",
          desc: decision.rainProb + "% chance of rain today."
        },
        {
          num: 3,
          name: "Plant Growth Stage",
          status: decision.stage,
          badgeClass: "badge-secondary",
          desc: "Flowering tomato plants need well-aerated soil."
        },
        {
          num: 4,
          name: "Final Advice",
          status: decision.action,
          badgeClass: decision.color === "danger" ? "badge-danger" : (decision.color === "warning" ? "badge-warning" : "badge-success"),
          desc: "AI recommendation synthesized for farmer."
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
  });
})(window);
