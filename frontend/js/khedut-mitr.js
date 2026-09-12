(function (global) {
  "use strict";

  // Web Audio subtle chime for response bloom
  function playBloomChime() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // AudioContext policy or unsupported
    }
  }

  // Leaf SVG Logo
  function getLeafLogoSvg(size) {
    var s = size || 24;
    return (
      '<svg width="' + s + '" height="' + s + '" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="32" height="32" rx="8" fill="#2D6A4F"/>' +
      '<path d="M16 6C21.6 9 24.5 13.5 24.5 19.5C21.9 17.8 18.9 17 16 17C13.1 17 10.1 17.8 7.5 19.5C7.5 13.5 10.4 9 16 6Z" fill="#52B788"/>' +
      '<path d="M16 17.5V25" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M16 21L19.5 18.5" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="16" cy="10" r="2" fill="#FFFFFF"/>' +
      '</svg>'
    );
  }

  // Moving Leaf Actor SVG for the loading stage
  function getMovingLeafSvg() {
    return (
      '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M4 4 C10 4, 26 8, 30 24 C32 32, 27 33, 23 30 C8 26, 4 10, 4 4 Z" fill="#2D6A4F" stroke="#74C69D" stroke-width="2.2"/>' +
      '<path d="M4 4 L24 24" stroke="#95D5B2" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M11 11 L18 8" stroke="#95D5B2" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M16 16 L23 13" stroke="#95D5B2" stroke-width="1.5" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  // Agronomic Knowledge Base for contextual answers
  var AGRONOMIC_KB = {
    neem: "To prepare a standard 0.5% Neem Seed Kernel Extract (NSKE) or cold-pressed Neem Oil spray:\n• Mix 5 ml of pure cold-pressed neem oil per 1 liter of water.\n• Add 1-2 ml of liquid soap or organic surfactant as an emulsifier so the oil blends smoothly with water.\n• Shake thoroughly and spray early in the morning or late afternoon (avoid harsh noon sunlight).\n• Neem acts as an antifeedant, disrupts fungal spore germination, and is safe for beneficial pollinators.",
    chemical: "Recommended chemical treatment guidelines (follow ICAR & CIBRC standards):\n• For foliar fungal blights: Foliar spray of Mancozeb 75% WP @ 2.0 to 2.5 grams per liter of water.\n• Alternative: Chlorothalonil 75% WP @ 2.0 grams per liter at the first onset of lesions.\n• Observe a Pre-Harvest Interval (PHI) of at least 7 to 10 days before picking produce.\n• Always wear protective goggles, gloves, and a mask while preparing and applying chemical sprays.",
    weather: "Weather factors to monitor:\n• High relative humidity (>80%) and prolonged leaf wetness (more than 6 hours) provide ideal conditions for fungal spore germination.\n• Warm temperatures (22°C - 28°C) combined with overcast skies accelerate blight spread.\n• Recommendation: Switch to drip irrigation rather than overhead sprinklers to keep foliage dry.",
    spread: "To prevent disease transmission to adjacent crops:\n• Sanitize pruning shears with a 10% bleach solution or ethanol between plants.\n• Prune severely spotted lower foliage and dispose of it away from the field; do not leave infected debris on soil.\n• Practice a 2-3 year crop rotation with non-Solanaceous crops (e.g. rotate tomato/potato with legumes or maize).\n• Maintain proper plant spacing (45-60 cm) to facilitate air circulation throughout the canopy.",
    irrigation: "Irrigation best practices:\n• Avoid evening overhead watering which keeps leaves wet overnight.\n• Irrigate at ground level around the root zone early in the morning so any surface splashes evaporate quickly in the daytime warmth.\n• Use mulching (organic straw or plastic mulch) to prevent soil-borne pathogens from splashing onto lower leaves during irrigation.",
    cost: "Cost-effective organic alternatives for smallholder farmers:\n• Fermented Cow Urine (Gau Mutra) solution: Mix 1 part aged cow urine with 10 parts water; acts as a natural foliar anti-fungal and mild nitrogen booster.\n• Sour Buttermilk (Chaas) spray: Dilute 1 liter of 3-day fermented buttermilk in 10 liters of water; lactic acid bacteria inhibit fungal pathogens.\n• Wood ash dusting: Light dusting of sifted wood ash on moist foliage helps deter leaf-eating pests and mildews."
  };

  function getBotResponse(userText, context) {
    var text = (userText || "").toLowerCase();
    var crop = (context && context.crop) || "crop";
    var disease = (context && context.disease) || "condition";

    if (text.indexOf("neem") !== -1 || text.indexOf("organic") !== -1 || text.indexOf("bio") !== -1 || text.indexOf("natural") !== -1) {
      return "🌿 **Organic Remedy for " + crop + ":**\n\n" + AGRONOMIC_KB.neem;
    }
    if (text.indexOf("chemical") !== -1 || text.indexOf("fungicide") !== -1 || text.indexOf("spray") !== -1 || text.indexOf("dose") !== -1 || text.indexOf("dosage") !== -1 || text.indexOf("medicine") !== -1 || text.indexOf("dawai") !== -1) {
      return "🧪 **Chemical Spray & Dosage Advisory:**\n\n" + AGRONOMIC_KB.chemical;
    }
    if (text.indexOf("weather") !== -1 || text.indexOf("rain") !== -1 || text.indexOf("humidity") !== -1 || text.indexOf("temperature") !== -1) {
      return "🌧️ **Weather Impact on " + disease + ":**\n\n" + AGRONOMIC_KB.weather;
    }
    if (text.indexOf("spread") !== -1 || text.indexOf("prevent") !== -1 || text.indexOf("other crop") !== -1 || text.indexOf("neighbor") !== -1) {
      return "🛡️ **Preventing Foliar Pathogen Spread:**\n\n" + AGRONOMIC_KB.spread;
    }
    if (text.indexOf("water") !== -1 || text.indexOf("irrigation") !== -1 || text.indexOf("sinchai") !== -1) {
      return "💧 **Irrigation & Moisture Management:**\n\n" + AGRONOMIC_KB.irrigation;
    }
    if (text.indexOf("cost") !== -1 || text.indexOf("cheap") !== -1 || text.indexOf("free") !== -1 || text.indexOf("desi") !== -1 || text.indexOf("kharch") !== -1) {
      return "💰 **Low-Cost Bio-Formulations:**\n\n" + AGRONOMIC_KB.cost;
    }
    if (text.indexOf("hello") !== -1 || text.indexOf("hi") !== -1 || text.indexOf("namaste") !== -1 || text.indexOf("kem cho") !== -1) {
      return "Namaste! 🙏 I am **Khedut Mitr** (Farmer's Friend). How can I assist you with your " + crop + " today? You can ask me about organic neem sprays, chemical dosages, or weather precautions.";
    }

    return (
      "Regarding your **" + crop + "** affected by **" + disease + "**:\n\n" +
      "1. **Immediate Step:** Prune the most affected lower leaves to stop fungal spore dispersal.\n" +
      "2. **Foliar Treatment:** Choose either an organic bio-fungicide (Neem oil @ 5ml/L or Trichoderma viride) OR a targeted contact fungicide (Mancozeb 75% WP @ 2.5g/L).\n" +
      "3. **Airflow:** Ensure good ventilation between rows and avoid wetting the foliage during evening hours.\n\n" +
      "Would you like detailed preparation steps for neem oil, chemical dosage, or weather advisory?"
    );
  }

  // Text-to-speech speaker utility
  function speakText(rawText, onEndCallback) {
    if (!("speechSynthesis" in window)) {
      if (global.AgriApp) AgriApp.toast("Text-to-speech is not supported on this device.");
      return;
    }
    window.speechSynthesis.cancel();
    var clean = rawText.replace(/[\*\_#•]/g, "").replace(/<[^>]*>/g, "");
    var utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }
    window.speechSynthesis.speak(utterance);
  }

  function initKhedutMitr() {
    if (document.getElementById("khedut-mitr-root")) return;

    var scanId = global.AgriApp && AgriApp.queryParam ? AgriApp.queryParam("id") : null;
    var result = null;
    if (global.AgriAPI) {
      result = scanId ? AgriAPI.getScanById(scanId) : AgriAPI.getLastResult();
    }

    var cropName = (result && result.crop) || "Crop";
    var diseaseName = (result && result.disease) || "Foliar Condition";
    var confidencePct = result ? (result.confidence <= 1 ? Math.round(result.confidence * 100) : Math.round(result.confidence)) : 92;

    var container = document.createElement("div");
    container.id = "khedut-mitr-root";

    container.innerHTML =
      '<!-- LAUNCHER BUTTON -->' +
      '<button class="khedut-mitr-launcher" id="khedut-mitr-btn" aria-label="Open Khedut Mitr AI Agronomist">' +
      '  <div class="khedut-mitr-icon-bubble">' +
      '    ' + getLeafLogoSvg(24) +
      '  </div>' +
      '  <div class="khedut-mitr-launcher-text">' +
      '    <span class="khedut-mitr-launcher-title">Khedut Mitr</span>' +
      '    <span class="khedut-mitr-launcher-sub">AI Agronomist &bull; ખેડૂત મિત્ર</span>' +
      '  </div>' +
      '</button>' +

      '<!-- CHAT WINDOW -->' +
      '<div class="khedut-mitr-window hidden" id="khedut-mitr-dialog" role="dialog" aria-modal="true" aria-label="Khedut Mitr Chatbot">' +
      '  <div class="khedut-mitr-header">' +
      '    <div class="khedut-mitr-header-info">' +
      '      <div class="khedut-mitr-avatar">' +
      '        ' + getLeafLogoSvg(24) +
      '      </div>' +
      '      <div>' +
      '        <div class="khedut-mitr-header-title">' +
      '          <span>Khedut Mitr</span>' +
      '          <span style="font-size:0.7rem;background:var(--leaf);color:var(--forest-dark);padding:0.1rem 0.4rem;border-radius:999px;font-weight:800;">ONLINE</span>' +
      '        </div>' +
      '        <div class="khedut-mitr-header-sub">ખેડૂત મિત્ર &bull; AI Voice-Enabled Agronomist</div>' +
      '      </div>' +
      '    </div>' +
      '    <button class="khedut-mitr-close-btn" id="khedut-mitr-close" aria-label="Close Chat">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '    </button>' +
      '  </div>' +

      '  <div class="khedut-mitr-messages" id="khedut-mitr-msg-list">' +
      '    <!-- Initial Greeting -->' +
      '    <div class="khedut-mitr-msg bot">' +
      '      <div class="khedut-mitr-msg-bubble">' +
      '        <p style="margin-bottom:0.6rem;"><strong>Namaste Farmer!</strong> 🌿 I am <strong>Khedut Mitr</strong>, your AI crop protection companion.</p>' +
      (result
        ? '<p style="margin-bottom:0.6rem;">I see your <strong>' + AgriApp.escapeHtml(cropName) + '</strong> was diagnosed with <strong>' + AgriApp.escapeHtml(diseaseName) + '</strong> (' + confidencePct + '% match). You can speak 🎙️ or type questions about dosages, organic spray mixing, and spray timing.</p>'
        : '<p style="margin-bottom:0.6rem;">How are your crops doing today? Feel free to speak or ask me anything about plant diseases, bio-pesticides, or chemical treatments.</p>'
      ) +
      '        <div style="font-size:0.78rem;font-weight:700;color:var(--text-subtle);margin-top:0.8rem;text-transform:uppercase;letter-spacing:0.04em;">Quick questions to ask:</div>' +
      '        <div class="khedut-mitr-chips-wrap">' +
      '          <button class="khedut-mitr-prompt-chip" data-q="How to prepare Neem oil spray?">🌿 How to prepare Neem oil spray?</button>' +
      '          <button class="khedut-mitr-prompt-chip" data-q="What chemical fungicide and dosage should I use?">🧪 Chemical fungicide dosage & safety?</button>' +
      '          <button class="khedut-mitr-prompt-chip" data-q="Does humidity or weather increase this disease?">🌧️ Weather precautions for this crop?</button>' +
      '          <button class="khedut-mitr-prompt-chip" data-q="How do I prevent this from spreading to nearby crops?">🛡️ How to prevent spread to other crops?</button>' +
      '          <button class="khedut-mitr-prompt-chip" data-q="What are low-cost desi remedies?">💰 Cost-effective organic alternatives?</button>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      '  <div class="khedut-mitr-input-bar">' +
      '    <div class="khedut-mitr-input-wrap">' +
      '      <!-- Blinking leaf caret inside the input bar -->' +
      '      <span class="leaf-blinking-caret" id="leaf-blinking-caret" aria-hidden="true">' +
      '        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">' +
      '          <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4L6 22l3.6-.6C10.3 21.8 11.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" fill="#52B788"/>' +
      '          <path d="M12 7v10M9 10l3-3 3 3" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>' +
      '        </svg>' +
      '      </span>' +
      '      <input type="text" class="khedut-mitr-input" id="khedut-mitr-input" placeholder="Ask or speak to Khedut Mitr..." autocomplete="off">' +
      '    </div>' +
      '    <!-- Voice Speech-to-Text Button -->' +
      '    <button class="mitr-voice-btn" id="khedut-mitr-voice-btn" type="button" title="Speak to Khedut Mitr (Voice Mic)" aria-label="Voice input">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>' +
      '    </button>' +
      '    <!-- Send Button -->' +
      '    <button class="khedut-mitr-send-btn" id="khedut-mitr-send" aria-label="Send Question">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
      '    </button>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(container);

    var btn = document.getElementById("khedut-mitr-btn");
    var dialog = document.getElementById("khedut-mitr-dialog");
    var closeBtn = document.getElementById("khedut-mitr-close");
    var input = document.getElementById("khedut-mitr-input");
    var sendBtn = document.getElementById("khedut-mitr-send");
    var voiceBtn = document.getElementById("khedut-mitr-voice-btn");
    var msgList = document.getElementById("khedut-mitr-msg-list");

    function toggleChat() {
      var isHidden = dialog.classList.contains("hidden");
      if (isHidden) {
        dialog.classList.remove("hidden");
        btn.classList.add("hidden");
        input.focus();
        scrollToBottom();
      } else {
        dialog.classList.add("hidden");
        btn.classList.remove("hidden");
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
    }

    btn.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", toggleChat);

    function scrollToBottom() {
      msgList.scrollTop = msgList.scrollHeight;
    }

    function addMessage(sender, htmlText, isBloom) {
      var msg = document.createElement("div");
      msg.className = "khedut-mitr-msg " + sender + (isBloom ? " answer-bloom-in" : "");
      
      var listenBtnHtml = "";
      if (sender === "bot") {
        listenBtnHtml =
          '<button class="mitr-listen-btn" type="button" title="Listen to this advisory">' +
          '  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>' +
          '  <span>Listen</span>' +
          '</button>';
      }

      msg.innerHTML =
        '<div class="khedut-mitr-msg-bubble">' +
        htmlText.replace(/\n/g, "<br>") +
        listenBtnHtml +
        '</div>';

      msgList.appendChild(msg);
      scrollToBottom();

      // Listen button handler
      if (sender === "bot") {
        var listenBtn = msg.querySelector(".mitr-listen-btn");
        if (listenBtn) {
          listenBtn.addEventListener("click", function () {
            var btnSpan = listenBtn.querySelector("span");
            btnSpan.textContent = "Speaking...";
            listenBtn.style.color = "var(--fresh)";
            speakText(htmlText, function () {
              btnSpan.textContent = "Listen";
              listenBtn.style.color = "";
            });
          });
        }
      }

      return msg;
    }

    // Modern Organic AI Agronomist Thinking Indicator
    function showMitrThinkingStage() {
      var stage = document.createElement("div");
      stage.className = "khedut-mitr-msg bot";
      stage.innerHTML =
        '<div class="khedut-mitr-msg-bubble mitr-thinking-bubble">' +
        '  <div class="mitr-thinking-sprout" aria-hidden="true">' +
        '    🌿' +
        '  </div>' +
        '  <div class="mitr-thinking-content">' +
        '    <span>Khedut Mitr is analyzing pathology</span>' +
        '    <div class="mitr-pulse-dots">' +
        '      <span></span><span></span><span></span>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      msgList.appendChild(stage);
      scrollToBottom();
      return stage;
    }

    function handleSend(text) {
      var query = text || input.value.trim();
      if (!query) return;
      input.value = "";

      // 1. Add user message
      addMessage("user", AgriApp.escapeHtml(query));

      // 2. Modern sleek AI thinking indicator
      var loadingStage = showMitrThinkingStage();

      // 3. Responsive and snappy reply delivery (~650ms)
      setTimeout(function () {
        loadingStage.remove();
        var reply = getBotResponse(query, result);
        addMessage("bot", reply, true);
        playBloomChime();
      }, 650);
    }

    sendBtn.addEventListener("click", function () {
      handleSend();
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    });

    msgList.addEventListener("click", function (e) {
      var chip = e.target.closest(".khedut-mitr-prompt-chip");
      if (chip) {
        var q = chip.getAttribute("data-q");
        handleSend(q);
      }
    });

    // Voice Speech-to-Text Recognition Setup
    var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = null;
    var isListening = false;

    if (SpeechRec) {
      recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN"; // English (India) / also accepts local phonetic words

      recognition.onstart = function () {
        isListening = true;
        voiceBtn.classList.add("listening");
        input.placeholder = "Listening to your voice... Speak now!";
      };

      recognition.onresult = function (event) {
        var spoken = event.results[0][0].transcript;
        input.value = spoken;
        input.placeholder = "Ask or speak to Khedut Mitr...";
        handleSend(spoken);
      };

      recognition.onerror = function (err) {
        isListening = false;
        voiceBtn.classList.remove("listening");
        input.placeholder = "Ask or speak to Khedut Mitr...";
        if (global.AgriApp) {
          AgriApp.toast("Voice recognition error: " + (err.error || "Unable to hear voice"));
        }
      };

      recognition.onend = function () {
        isListening = false;
        voiceBtn.classList.remove("listening");
        input.placeholder = "Ask or speak to Khedut Mitr...";
      };
    }

    if (voiceBtn) {
      voiceBtn.addEventListener("click", function () {
        if (!SpeechRec) {
          if (global.AgriApp) {
            AgriApp.toast("Speech recognition is not supported in this browser. Please type your query.");
          }
          return;
        }
        if (isListening) {
          recognition.stop();
        } else {
          try {
            recognition.start();
          } catch (err) {
            console.warn("Speech recognition error:", err);
          }
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initKhedutMitr);
  } else {
    initKhedutMitr();
  }

  global.KhedutMitr = {
    init: initKhedutMitr
  };
})(window);
