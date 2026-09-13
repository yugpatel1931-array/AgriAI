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
      // AudioContext policy
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

  // Moving Leaf Actor SVG for thinking state
  function getMovingLeafSvg() {
    return (
      '<svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M4 4 C10 4, 26 8, 30 24 C32 32, 27 33, 23 30 C8 26, 4 10, 4 4 Z" fill="#2D6A4F" stroke="#74C69D" stroke-width="2.2"/>' +
      '<path d="M4 4 L24 24" stroke="#95D5B2" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M11 11 L18 8" stroke="#95D5B2" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M16 16 L23 13" stroke="#95D5B2" stroke-width="1.5" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  // Inline markdown formatter: bold, italics, and actionable link buttons
  function formatInlineMarkdown(str) {
    if (!str) return "";
    var res = str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    res = res.replace(/\*(.*?)\*/g, "<em>$1</em>");
    res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;gap:0.35rem;margin:0.35rem 0;font-weight:700;color:#FFFFFF!important;text-decoration:none;background:var(--forest-dark);box-shadow:0 2px 6px rgba(27,67,50,0.3);">$1</a>');
    return res;
  }

  function getChipIcon(q) {
    var lq = (q || "").toLowerCase();
    if (lq.indexOf("pdf") !== -1 || lq.indexOf("slip") !== -1 || lq.indexOf("report") !== -1 || lq.indexOf("પીડીએફ") !== -1 || lq.indexOf("રિપોર્ટ") !== -1 || lq.indexOf("પ્રિન્ટ") !== -1 || lq.indexOf("पीडीएफ") !== -1 || lq.indexOf("रिपोर्ट") !== -1 || lq.indexOf("प्रिंट") !== -1) return "📄";
    if (lq.indexOf("water") !== -1 || lq.indexOf("પાણી") !== -1 || lq.indexOf("पानी") !== -1 || lq.indexOf("સિંચાઈ") !== -1 || lq.indexOf("sinchai") !== -1 || lq.indexOf("વરસાદ") !== -1 || lq.indexOf("barish") !== -1 || lq.indexOf("बारिश") !== -1) return "💧";
    if (lq.indexOf("spray") !== -1 || lq.indexOf("છંટકાવ") !== -1 || lq.indexOf("સ્પ્રે") !== -1 || lq.indexOf("छिड़काव") !== -1 || lq.indexOf("time") !== -1 || lq.indexOf("સમય") !== -1 || lq.indexOf("समय") !== -1) return "🎯";
    if (lq.indexOf("neem") !== -1 || lq.indexOf("લીમડા") !== -1 || lq.indexOf("નીમ") !== -1 || lq.indexOf("organic") !== -1 || lq.indexOf("bio") !== -1 || lq.indexOf("જૈવિક") !== -1 || lq.indexOf("जैविक") !== -1) return "🌿";
    if (lq.indexOf("compost") !== -1 || lq.indexOf("khaad") !== -1 || lq.indexOf("ખાતર") !== -1 || lq.indexOf("खाद") !== -1 || lq.indexOf("bigha") !== -1 || lq.indexOf("વીઘા") !== -1 || lq.indexOf("एकड़") !== -1) return "🌱";
    if (lq.indexOf("compare") !== -1 || lq.indexOf("તફાવત") !== -1 || lq.indexOf("સરખામણી") !== -1 || lq.indexOf("तुलना") !== -1 || lq.indexOf("cotton") !== -1 || lq.indexOf("કપાસ") !== -1 || lq.indexOf("कपास") !== -1 || lq.indexOf("seeds") !== -1 || lq.indexOf("બિયારણ") !== -1 || lq.indexOf("બીજ") !== -1 || lq.indexOf("बीज") !== -1) return "🌾";
    if (lq.indexOf("score") !== -1 || lq.indexOf("સ્કોર") !== -1 || lq.indexOf("स्कोर") !== -1) return "📈";
    if (lq.indexOf("leaf") !== -1 || lq.indexOf("leaves") !== -1 || lq.indexOf("spot") !== -1 || lq.indexOf("પાંદડા") !== -1 || lq.indexOf("पत्ते") !== -1) return "🍃";
    return "💡";
  }

  // Markdown to structured HTML parser for advisor responses with interactive prompt chips
  function formatAdvisorMessage(rawText) {
    if (!rawText) return "";
    var lines = rawText.split("\n");
    var html = [];
    var pendingChips = [];

    function flushPendingChips() {
      if (pendingChips.length > 0) {
        html.push('<div class="khedut-mitr-chips-wrap" style="margin-top:0.4rem;margin-bottom:0.4rem;">');
        pendingChips.forEach(function (c) {
          var safeQ = c.q.replace(/"/g, "&quot;");
          html.push(
            '  <button class="khedut-mitr-prompt-chip" data-q="' + safeQ + '" type="button">' +
            '    <span style="font-size:1.05rem;line-height:1;margin-right:0.35rem;">' + c.icon + '</span>' +
            '    <span>' + c.q + '</span>' +
            '  </button>'
          );
        });
        html.push('</div>');
        pendingChips = [];
      }
    }

    lines.forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed) {
        flushPendingChips();
        html.push('<div style="height:0.35rem;"></div>');
        return;
      }

      // Check for suggestion prompt item: "• Ask: *...*" or "• પૂછો: *...*" or "• पूछें: *...*"
      var askMatch = trimmed.match(/^[•\-\*]?\s*(?:Ask|ask|પૂછો|पूछें)\s*:\s*\*?([^\*]+)\*?/);
      if (askMatch) {
        var q = askMatch[1].trim();
        var icon = getChipIcon(q);
        pendingChips.push({ q: q, icon: icon });
        return;
      }

      // If there were pending chips and this is a non-chip line, flush them
      flushPendingChips();

      // Check for suggestion heading: "**Next step:**", "**આગળ પૂછો:**", "**आगे पूछें:**", etc.
      var isSuggestHeading = trimmed.match(/^\*\*(?:Next step|Next steps|Ask next|આગળ પૂછો|આગળનું પગલું|આગળના પગલાં|આગળ પૂછવા માટે|आगे पूछें|आगे का कदम|आगे के कदम|आगे पूछने के लिए)\s*:\*\*/i);
      if (isSuggestHeading) {
        html.push(
          '<div style="font-size:0.75rem;font-weight:700;color:var(--text-subtle);margin:0.75rem 0 0.2rem 0;text-transform:uppercase;letter-spacing:0.04em;">' +
          '  💡 ' + formatInlineMarkdown(trimmed) +
          '</div>'
        );
        return;
      }

      // Check for numbered steps: "1. **Title:** description"
      var numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        var num = numMatch[1];
        var rest = formatInlineMarkdown(numMatch[2]);
        html.push(
          '<div class="khedut-mitr-step-item">' +
          '  <span class="khedut-mitr-step-num">' + num + '</span>' +
          '  <div style="flex:1;">' + rest + '</div>' +
          '</div>'
        );
        return;
      }

      // Check for regular bullet points
      var bulletMatch = trimmed.match(/^[•\-\*]\s+(.*)$/);
      if (bulletMatch) {
        var bRest = formatInlineMarkdown(bulletMatch[1]);
        html.push(
          '<div style="display:flex;align-items:flex-start;gap:0.5rem;margin:0.25rem 0 0.25rem 0.4rem;">' +
          '  <span style="color:#52B788;font-weight:bold;flex-shrink:0;">•</span>' +
          '  <div>' + bRest + '</div>' +
          '</div>'
        );
        return;
      }

      // Standard paragraph
      html.push('<p style="margin:0 0 0.35rem 0;line-height:1.55;">' + formatInlineMarkdown(trimmed) + '</p>');
    });

    flushPendingChips();
    return html.join("");
  }

  // Layered, Farmer-Friendly Agricultural Advisor Responses (English, Gujarati, Hindi)
  function getBotResponse(userText, context) {
    var text = (userText || "").toLowerCase();
    var farmCtx = (global.AgriAPI && AgriAPI.getFarmContext) ? AgriAPI.getFarmContext() : null;
    var loc = (farmCtx && farmCtx.location) || "Anand, Gujarat";
    var crop = (context && context.crop) || (farmCtx && farmCtx.crop) || "Tomato";
    var disease = (context && context.disease) || "leaf spots";
    var lang = (global.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : (localStorage.getItem("agrismart_lang") || "en");

    // =========================================================================
    // 1. GUJARATI ADVISOR (ગુજરાતી)
    // =========================================================================
    if (lang === "gu") {
      // 0a. Report ID Intent
      if (text.indexOf("report id") !== -1 || text.indexOf("રિપોર્ટ આઈડી") !== -1 || text.indexOf("આઈડી") !== -1) {
        return (
          "**તમારો સત્તાવાર પાક નિદાન રિપોર્ટ ID:** 📋\n\n" +
          "**`AGRI-GJ-2026-84921`**\n\n" +
          "1. **પ્રમાણિત ડિજિટલ રેકોર્ડ:** આ ID તમારા ખેતર (પટેલ ફાર્મ, આણંદ) ના આજના ડિજિટલ સ્કેન સાથે જોડાયેલ છે.\n" +
          "2. **ખાતર/દવા માટે ઉપયોગી:** આ ID તમારા સ્થાનિક કેવીકે (KVK) અથવા એગ્રો-સેન્ટર પર બતાવીને સાચી દવા અને ડોઝ મેળવી શકો છો.\n\n" +
          "[ 📄 સત્તાવાર PDF સ્લિપ ખોલો / ડાઉનલોડ કરો → ](result.html?id=AGRI-GJ-2026-84921&crop=Tomato)\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *પીડીએફ સ્લિપ ડાઉનલોડ કરો*\n" +
          "• પૂછો: *છંટકાવ કરવાનો શ્રેષ્ઠ સમય કયો છે?*"
        );
      }
      // 0b. PDF Slip & Official Report
      if (text.indexOf("pdf") !== -1 || text.indexOf("slip") !== -1 || text.indexOf("report") !== -1 || text.indexOf("પીડીએફ") !== -1 || text.indexOf("રિપોર્ટ") !== -1 || text.indexOf("પ્રિન્ટ") !== -1) {
        return (
          "**તમારા પાકનો સત્તાવાર ડિજિટલ PDF રિપોર્ટ તૈયાર છે:** 📄\n\n" +
          "આ રિપોર્ટમાં તમારા ખેતરના રોગના સાચા લક્ષણો, જૈવિક અને રાસાયણિક દવાઓનો સાચો ડોઝ અને આણંદનું હવામાન સામેલ છે.\n\n" +
          "[ 📄 સત્તાવાર PDF સ્લિપ ખોલો / ડાઉનલોડ કરો → ](result.html)\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *શું આજે પાકને પાણી આપવું જોઈએ?*\n" +
          "• પૂછો: *છંટકાવ કરવાનો શ્રેષ્ઠ સમય કયો છે?*"
        );
      }
      // 1. Weather / Rain / Spray Timing
      if (text.indexOf("spray") !== -1 || text.indexOf("છંટકાવ") !== -1 || text.indexOf("સ્પ્રે") !== -1 || text.indexOf("દવા") !== -1 || text.indexOf("છાંટ") !== -1 || text.indexOf("weather") !== -1 || text.indexOf("હવામાન") !== -1 || (text.indexOf("rain") !== -1 && text.indexOf("wash") !== -1) || text.indexOf("વરસાદ") !== -1) {
        return (
          "**આજે વરસાદની શક્યતા છે — આજે દવાનો છંટકાવ ન કરવો!** 🌦️\n\n" +
          "**આણંદ માટે છંટકાવના ૩ મહત્વના નિયમો:**\n" +
          "1. **આજે છંટકાવ બંધ રાખો:** આજે " + loc + "માં ૭૮% વરસાદ (~૨૨ મિમી) ની શક્યતા છે. અત્યારે દવા છાંટશો તો દર એકરે ₹૮૦૦ થી ₹૧,૨૦૦ ની દવા વરસાદના પાણીમાં ધોવાઈ જશે.\n" +
          "2. **છંટકાવ માટે ઉત્તમ સમય: આવતીકાલે સવારે ૦૬:૩૦ થી ૦૯:૦૦:** સવારે પવન ધીમો (<૧૦ કિમી/કલાક) રહેશે, પાંદડાના છિદ્રો ખુલ્લા રહેશે અને દવા ૯૪% અસરકારક રીતે શોષાશે.\n" +
          "3. **બપોરના તડકામાં છંટકાવ ટાળો:** સવારે ૧૧:૩૦ પછી તડકામાં દવા ન છાંટવી — તડકાથી દવા ઉડી જાય છે અને પાંદડા બળી શકે છે.\n\n" +
          "**ખેડૂતનો આર્થિક ફાયદો:** સાચા સમયે છંટકાવ કરવાથી દવાનો બગાડ અટકશે અને એકરે ₹૮૦૦ થી ₹૧,૨૦૦ ની બચત થશે!\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *શું આજે પાકને પાણી આપવું જોઈએ?*\n" +
          "• પૂછો: *લીમડાના તેલનો સ્પ્રે કેવી રીતે બનાવવો?*"
        );
      }

      // 2. Water / Irrigation
      if (text.indexOf("water") !== -1 || text.indexOf("irrigation") !== -1 || text.indexOf("પાણી") !== -1 || text.indexOf("સિંચાઈ") !== -1 || text.indexOf("sinchai") !== -1 || text.indexOf("pani") !== -1 || text.indexOf("ભેજ") !== -1) {
        return (
          "**ના, આજે પાણી આપતા પહેલા થોભો!** ⏸️\n\n" +
          "**આજે તમારે શું કરવું:**\n" +
          "1. **૧–૨ દિવસ સુધી સિંચાઈ બંધ રાખો:** તમારા ખેતરની જમીનમાં મૂળ પાસે ૩૧% ભેજ પહેલેથી છે.\n" +
          "2. **વરસાદના પાણીનો લાભ લો:** આજે ૭૮% વરસાદની શક્યતા (~૨૨ મિમી) છે. કુદરતી વરસાદથી તમારું દર એકરે ૧૪,૦૦૦ લિટર પાણી અને પંપની વીજળી બચશે!\n" +
          "3. **મૂળનો સડો અટકાવો:** ગોરાડુ જમીનમાં વધુ પાણી ભરાવાથી મૂળ શ્વાસ નથી લઈ શકતા અને ફૂગ વધે છે. જમીનને શ્વાસ લેવા દો.\n\n" +
          "**આગળનું પગલું:**\n" +
          "• પૂછો: *છંટકાવ કરવાનો શ્રેષ્ઠ સમય કયો છે?*\n" +
          "• પૂછો: *મારા પાંદડાની સંભાળ કેવી રીતે રાખવી?*"
        );
      }

      // 3. Crop Recommendation (Cotton, Soybean, Groundnut)
      if (text.indexOf("cotton") !== -1 || text.indexOf("કપાસ") !== -1) {
        return (
          "**કપાસ તમારા ખેતર માટે #૨ ક્રમનો સારો વિકલ્પ છે (૮૬% મેચ):** 🌱\n\n" +
          "**મગફળી સાથે સરખામણી:**\n" +
          "1. **પાણીની જરૂરિયાત:** કપાસને આશરે ૮૦૦ મિમી પાણી અને ૧૫૦–૧૬૦ દિવસ જોઈએ છે, જ્યારે મગફળી ૧૦૫ દિવસમાં તૈયાર થાય છે.\n" +
          "2. **જમીનની તાકાત:** કપાસ જમીનના પોષક તત્વો વાપરે છે, જ્યારે મગફળી જમીનને કુદરતી નાઇટ્રોજન આપે છે.\n" +
          "3. **નિર્ણય:** જો તમારી પાસે કાયમી ટપક સિંચાઈ હોય તો કપાસ વાવો; જમીન ફળદ્રુપ રાખવી હોય તો મગફળી ઉત્તમ છે.\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *ઘઉં પછી મગફળી વાવવાના શું ફાયદા છે?*\n" +
          "• પૂછો: *આણંદ માટે કયા પ્રમાણિત બિયારણ સારા છે?*"
        );
      }

      if (text.indexOf("soybean") !== -1 || text.indexOf("સોયાબીન") !== -1) {
        return (
          "**સોયાબીન તમારા ખેતર માટે #૩ ક્રમનો વિકલ્પ છે (૮૧% મેચ):** 🫘\n\n" +
          "1. **ઓછો સમય:** ૯૦–૯૫ દિવસમાં પાકી જાય છે અને જમીનમાં નાઇટ્રોજન વધારે છે.\n" +
          "2. **મગફળી કેમ આગળ છે:** આણંદની ગોરાડુ જમીનમાં મગફળીના તેલની ગુણવત્તા અને સ્થાનિક બજારભાવ સોયાબીન કરતાં વધુ સારો મળે છે.\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *ઘઉં પછી મગફળી વાવવાના શું ફાયદા છે?*\n" +
          "• પૂછો: *કપાસ અને મગફળીમાં શું તફાવત છે?*"
        );
      }

      if (text.indexOf("crop") !== -1 || text.indexOf("પાક") !== -1 || text.indexOf("wheat") !== -1 || text.indexOf("ઘઉં") !== -1 || text.indexOf("મગફળી") !== -1 || text.indexOf("groundnut") !== -1 || text.indexOf("seed") !== -1 || text.indexOf("બિયારણ") !== -1) {
        return (
          "**ઘઉં પછી મગફળી તમારા ખેતર માટે #૧ શ્રેષ્ઠ પાક છે! (૯૪% સુસંગતતા)** 🥜\n\n" +
          "**ઘઉં પછી મગફળી વાવવાના ૩ મોટા ફાયદા:**\n" +
          "1. **જમીનમાં કુદરતી નાઇટ્રોજન પાછો આપે છે:** ઘઉં જમીનમાંથી ઘણો નાઇટ્રોજન ખેંચી લે છે. મગફળી કઠોળ વર્ગનો પાક હોવાથી જમીનમાં ૪૦–૬૦ કિલો કુદરતી નાઇટ્રોજન ઉમેરે છે, જેથી યુરિયા ખાતરનો ખર્ચ દર એકરે ₹૧,૫૦૦ બચે છે.\n" +
          "2. **આણંદની ગોરાડુ જમીન માટે ઉત્તમ:** ગોરાડુ જમીન પોચી હોવાથી મગફળીના ડોડવા જમીનમાં ખૂબ સારા અને મોટા બેસે છે.\n" +
          "3. **ઓછું પાણી અને સારો નફો:** કપાસ કરતાં અડધું પાણી જોઈએ છે અને એકરે ₹૩૨,૦૦૦ થી ₹૪૦,૦૦૦ ચોખ્ખો નફો આપે છે.\n\n" +
          "**આણંદ માટે શ્રેષ્ઠ પ્રમાણિત બિયારણ:**\n" +
          "• **GG-20** (ગુજરાત ગ્રાઉન્ડનટ ૨૦) અથવા **TG-37A** જે વધુ ઉત્પાદન આપે છે.\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *કપાસ અને મગફળીમાં શું તફાવત છે?*"
        );
      }

      // 4. Sustainability / Farm Score & 3-Step Action Plan
      if (text.indexOf("compost") !== -1 || text.indexOf("ખાતર") !== -1 || text.indexOf("છાણિયું") !== -1 || text.indexOf("vermicompost") !== -1) {
        return (
          "**જમીનની ફળદ્રુપતા વધારવા માટે ખાતરનો સાચો ઉપયોગ (+૬ થી +૧૦ પોઇન્ટ):** 🌾\n\n" +
          "1. **યોગ્ય પ્રમાણ:** આગામી વાવણી પહેલાં વીઘા દીઠ ૨ થી ૩ ટન (એકરે ૪-૫ ટન) સારી રીતે કોહવાયેલું દેશી છાણિયું ખાતર અથવા વર્મીકમ્પોસ્ટ નાખો.\n" +
          "2. **ઓર્ગેનિક કાર્બન:** આનાથી તમારી ગોરાડુ જમીનનો ઓર્ગેનિક કાર્બન ૦.૭૫% થી ઉપર જશે અને ભેજ સંગ્રહ ક્ષમતા ૨૫% વધશે.\n" +
          "3. **સ્કોર ફાયદો:** સોઇલ હેલ્થ સ્કોર ૭૬ થી વધી ૮૮ થશે!\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *ખેતર સ્કોર ૯૦+ કેવી રીતે કરવો?*\n" +
          "• પૂછો: *લીમડાના તેલનો સ્પ્રે કેવી રીતે બનાવવો?*"
        );
      }

      if (text.indexOf("mulch") !== -1 || text.indexOf("પરાળ") !== -1 || text.indexOf("ઘાસ") !== -1 || text.indexOf("મલ્ચિંગ") !== -1) {
        return (
          "**ટામેટાના પાળા પર સૂકા ઘાસનું મલ્ચિંગ (+૪ થી +૬ પોઇન્ટ):** 🍂\n\n" +
          "1. **કેવી રીતે કરવું:** ટામેટા કે મગફળીના છોડની હરોળ વચ્ચે ૨ થી ૩ ઇંચ જાડું ઘઉંનું પરાળ અથવા સૂકું ઘાસ પાથરો.\n" +
          "2. **લાભ:** નીંદણ (ખડ) ઊગતું અટકશે, જમીનનો ભેજ સૂર્યના તાપમાં સુકાશે નહીં, અને વરસાદના છાંટાથી પાંદડા પર કાદવ નહીં ઊડે.\n" +
          "3. **પાણીની બચત:** દર અઠવાડિયે આશરે ૩૦% પાણી બચશે અને વોટર મેનેજમેન્ટ સ્કોર વધશે!\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *શું આજે પાકને પાણી આપવું જોઈએ?*\n" +
          "• પૂછો: *ખેતર સ્કોર ૯૦+ કેવી રીતે કરવો?*"
        );
      }

      if (text.indexOf("bio") !== -1 || text.indexOf("જૈવિક") !== -1 || text.indexOf("લીમડા") !== -1 || text.indexOf("ટ્રાઇકોડર્મા") !== -1) {
        return (
          "**જૈવિક સ્પ્રે અપનાવીને સ્કોર વધારો (+૮ થી +૧૨ પોઇન્ટ):** 🌿\n\n" +
          "1. **લીમડાનું તેલ સ્પ્રે:** ૧ લિટર પાણીમાં ૫ મિલી લીમડાનું તેલ અને ૧ મિલી સાબુનું પાણી મિક્સ કરો.\n" +
          "2. **ટ્રાઇકોડર્મા:** ૧ લિટર પાણીમાં ૧૦ ગ્રામ ટ્રાઇકોડર્મા ભેળવી છોડ પર છંટકાવ કરો.\n" +
          "3. **લાભ:** ઝેરી રાસાયણિક દવાઓ બંધ થશે, મધમાખી-અળસિયા સુરક્ષિત રહેશે અને સ્પ્રે બેલેન્સ સ્કોર ૭૪ થી વધી ૮૮ થશે!"
        );
      }

      if (text.indexOf("score") !== -1 || text.indexOf("સ્કોર") !== -1 || text.indexOf("ખેતર") !== -1 || text.indexOf("સુધાર") !== -1 || text.indexOf("90") !== -1 || text.indexOf("૯૦") !== -1 || text.indexOf("સસ્ટેઇનેબિલિટી") !== -1) {
        return (
          "**તમારા ખેતરનો સ્કોર ૮૨ થી વધારીને ૯૨+ કરવાનો સીધો ૩-પગલાંનો પ્લાન:** 📈♻️\n\n" +
          "**આ ૩ સરળ પગલાંથી ૧૦ થી ૧૫ પોઇન્ટ સીધા વધશે:**\n" +
          "1. **રાસાયણિક દવાને બદલે જૈવિક સ્પ્રે અપનાવો (+૮ થી +૧૨ પોઇન્ટ):**\n" +
          "   રાસાયણિક જંતુનાશકોની જગ્યાએ ટ્રાઇકોડર્મા અથવા દેશી લીમડાનું તેલ (૧ લિટર પાણીમાં ૫ મિલી) વાપરો. તેનાથી મધમાખી અને અળસિયા સુરક્ષિત રહેશે અને દવાનો સ્કોર ૭૪ થી વધીને ૮૮ થશે.\n" +
          "2. **ખેતરમાં સારું છાણિયું કે અળસિયા ખાતર ઉમેરો (+૬ થી +૧૦ પોઇન્ટ):**\n" +
          "   આગામી વાવણી પહેલાં વીઘા દીઠ ૨ થી ૩ ટન સારી રીતે કોહવાયેલું દેશી છાણિયું ખાતર અથવા વર્મીકમ્પોસ્ટ નાખો. આનાથી જમીનનું ઓર્ગેનિક કાર્બન વધશે અને જમીન સ્વાસ્થ્ય ૭૬ થી વધી ૮૮ થશે.\n" +
          "3. **ટામેટાના પાળા પર સૂકા ઘાસનું મલ્ચિંગ કરો (+૪ થી +૬ પોઇન્ટ):**\n" +
          "   ટામેટા કે મગફળીની હરોળ વચ્ચે સૂકું ઘાસ કે ઘઉંનું પરાળ પાથરો. તેનાથી ભેજ જળવાઈ રહેશે, ૩૦% પાણી બચશે અને વરસાદના છાંટાથી પાંદડા પર ફૂગ નહીં ચડે.\n\n" +
          "**ખેડૂતનો સીધો આર્થિક ફાયદો:**\n" +
          "આ ૩ પગલાં લેવાથી તમારા ખેતરનો સ્કોર આણંદ જિલ્લાના શ્રેષ્ઠ ૫% ખેતરોમાં આવશે અને દર એકરે ₹૧,૨૦૦ થી ₹૧,૮૦૦ ની દવાનો ખર્ચ બચશે!\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *લીમડાના તેલનો સ્પ્રે કેવી રીતે બનાવવો?*\n" +
          "• પૂછો: *વીઘા દીઠ કેટલું ખાતર નાખવું?*"
        );
      }

      // 5. Crop Disease Scans (Tomato, Potato, Chilli)
      if (text.indexOf("potato") !== -1 || text.indexOf("બટાકા") !== -1 || text.indexOf("late blight") !== -1) {
        return (
          "**બટાકાના પાકમાં લેટ બ્લાઇટ ઝડપથી ફેલાઈ શકે છે, તેથી તાત્કાલિક કાળજી જરૂરી છે!** 🥔\n\n" +
          "**તરત જ આ પગલાં લો:**\n" +
          "1. **રોગગ્રસ્ત પાંદડા કાપી લો:** વધુ અસરગ્રસ્ત છોડના પાંદડા કાપીને કોથળીમાં ભરી ખેતરથી દૂર નિકાલ કરો.\n" +
          "2. **દવાનો છંટકાવ:** ૨૪ કલાકમાં મેટાલેક્સિલ + મેન્કોઝેબ (રીડોમિલ એમઝેડ @ ૨.૫ ગ્રામ / લિટર) નો છંટકાવ કરો.\n" +
          "3. **પાણી બંધ કરો:** જમીનની સપાટી સુકાય ત્યાં સુધી સિંચાઈ બંધ રાખો.\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *લીમડાના તેલનો સ્પ્રે કેવી રીતે બનાવવો?*\n" +
          "• પૂછો: *શું આજે પાકને પાણી આપવું જોઈએ?*"
        );
      }

      if (text.indexOf("chilli") !== -1 || text.indexOf("મરચી") !== -1 || text.indexOf("leaf spot") !== -1) {
        return (
          "**મરચીમાં પાંદડાના ડાઘ ખરી પડતા પહેલા રોકી શકાય છે!** 🌶️\n\n" +
          "**તમારે શું કરવું:**\n" +
          "1. **ખરેલા પાંદડા સાફ કરો:** છોડની નીચે પડેલા ડાઘવાળા પાંદડા એકઠા કરી સુરક્ષિત દાટી દો.\n" +
          "2. **કોપર ઓક્સીક્લોરાઇડ:** ૧ લિટર પાણીમાં ૨.૫ ગ્રામ ભેળવી સારો છંટકાવ કરો.\n" +
          "3. **સૂર્યપ્રકાશ મળવા દો:** વચ્ચેની ગીચ ડાળીઓ હળવી કરો જેથી સૂર્યપ્રકાશ અંદર પહોંચે.\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *છંટકાવ કરવાનો શ્રેષ્ઠ સમય કયો છે?*\n" +
          "• પૂછો: *શું આજે પાકને પાણી આપવું જોઈએ?*"
        );
      }

      if (text.indexOf("blight") !== -1 || text.indexOf("બ્લાઇટ") !== -1 || text.indexOf("tomato") !== -1 || text.indexOf("ટામેટા") !== -1) {
        return (
          "**ચિંતા ન કરો, સમયસર પગલાં લઈએ તો અર્લી બ્લાઇટ નિયંત્રણમાં આવી શકે છે!** 🍅\n\n" +
          "**આજે તમારે શું કરવું:**\n" +
          "1. **ડાઘવાળા પાંદડા કાપો:** કાળી ગોળ રિંગવાળા નીચેના પાંદડા કાપીને કોથળીમાં ભરી સુરક્ષિત નિકાલ કરો.\n" +
          "2. **પાંદડા સૂકા રાખો:** પાણી ફક્ત મૂળિયામાં જ આપો; પાંદડા પર પાણી ન છાંટો.\n" +
          "3. **રક્ષણાત્મક દવાનો છંટકાવ:** આવતીકાલે સવારે લીમડાનું તેલ (૧ લિટરમાં ૫ મિલી) અથવા મેન્કોઝેબ દવાનો છંટકાવ કરો.\n\n" +
          "**શા માટે આવું થયું?**\n" +
          "હવામાનમાં ગરમી (૩૦°C) અને વધુ ભેજ (૭૮%) હોવાથી ટામેટામાં ફૂગના ડાઘ ઝડપથી વધે છે.\n\n" +
          "**આગળનું પગલું:**\n" +
          "• પૂછો: *લીમડાના તેલનો સ્પ્રે કેવી રીતે બનાવવો?*"
        );
      }

      // 6. Desi Remedies Gujarati
      if (text.indexOf("desi") !== -1 || text.indexOf("દેશી") !== -1 || text.indexOf("ઉપાય") !== -1 || text.indexOf("છાશ") !== -1 || text.indexOf("ગૌમૂત્ર") !== -1) {
        return (
          "**૨ ઓછા ખર્ચના દેશી રામબાણ ઉપાયો:** 💰🌿\n\n" +
          "1. **ખાટી છાશનો સ્પ્રે:** ૧૦ લિટર પાણીમાં ૧ લિટર ૩ દિવસ જૂની ખાટી છાશ ભેળવી છાંટવાથી પાંદડાની ફૂગ અટકે છે.\n" +
          "2. **ગૌમૂત્ર:** ૧૦ લિટર પાણીમાં ૧ લિટર ગૌમૂત્ર મેળવી છાંટવાથી કુદરતી ટોનિકનું કામ કરે છે અને પાંદડા ઘટ્ટ લીલા બને છે.\n\n" +
          "**આગળ પૂછો:**\n" +
          "• પૂછો: *ખેતર સ્કોર ૯૦+ કેવી રીતે કરવો?*\n" +
          "• પૂછો: *લીમડાના તેલનો સ્પ્રે કેવી રીતે બનાવવો?*"
        );
      }

      // Default Gujarati
      return (
        "**તમારા પાક અંગે ખેડૂત મિત્રની સલાહ:** 🌱\n\n" +
        "1. **આજની તપાસ:** જમીનમાં ૩૧% ભેજ છે અને વરસાદની શક્યતા હોવાથી આજે પાણી ન આપવું.\n" +
        "2. **પાંદડા તપાસ:** નીચેના પાંદડા પર ડાઘ જણાય તો તરત દૂર કરવા.\n" +
        "3. **છંટકાવ સમય:** આવતીકાલે સવારે ૦૬:૩૦ થી ૦૯:૦૦ વચ્ચે છંટકાવ કરવો શ્રેષ્ઠ રહેશે.\n\n" +
        "**આગળ પૂછો:**\n" +
        "• પૂછો: *શું આજે પાકને પાણી આપવું જોઈએ?*\n" +
        "• પૂછો: *છંટકાવ કરવાનો શ્રેષ્ઠ સમય કયો છે?*"
      );
    }

    // =========================================================================
    // 2. HINDI ADVISOR (हिन्दी)
    // =========================================================================
    if (lang === "hi") {
      // 0a. Report ID Intent
      if (text.indexOf("report id") !== -1 || text.indexOf("रिपोर्ट आईडी") !== -1 || text.indexOf("आईडी") !== -1) {
        return (
          "**आपकी फसल जांच का आधिकारिक रिपोर्ट ID:** 📋\n\n" +
          "**`AGRI-GJ-2026-84921`**\n\n" +
          "1. **सत्यापित डिजिटल रिकॉर्ड:** यह ID आपके खेत (पटेल फार्म, आनंद) के आज के डिजिटल पत्ते की जांच से जुड़ा है।\n" +
          "2. **दवा/सलाह में उपयोगी:** यह ID अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या खाद-बीज विक्रेता को बताकर सही दवा प्राप्त कर सकते हैं।\n\n" +
          "[ 📄 आधिकारिक PDF स्लिप खोलें / डाउनलोड करें → ](result.html?id=AGRI-GJ-2026-84921&crop=Tomato)\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *पीडीएफ रिपोर्ट दें*\n" +
          "• पूछें: *छिड़काव का सही समय क्या है?*"
        );
      }
      // 0b. PDF Slip & Official Report
      if (text.indexOf("pdf") !== -1 || text.indexOf("slip") !== -1 || text.indexOf("report") !== -1 || text.indexOf("पीडीएफ") !== -1 || text.indexOf("रिपोर्ट") !== -1 || text.indexOf("प्रिंट") !== -1) {
        return (
          "**आपकी फसल की आधिकारिक डिजिटल PDF रिपोर्ट तैयार है:** 📄\n\n" +
          "इस रिपोर्ट में फसल के वास्तविक रोग लक्षण, जैविक व रासायनिक दवाओं की सही मात्रा और आनंद का सटीक मौसम शामिल है।\n\n" +
          "[ 📄 आधिकारिक PDF स्लिप खोलें / डाउनलोड करें → ](result.html)\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *क्या आज फसल को पानी देना चाहिए?*\n" +
          "• पूछें: *छिड़काव का सही समय क्या है?*"
        );
      }
      // 1. Weather / Rain / Spray Timing
      if (text.indexOf("spray") !== -1 || text.indexOf("छिड़काव") !== -1 || text.indexOf("स्प्रे") !== -1 || text.indexOf("दवा") !== -1 || text.indexOf("weather") !== -1 || text.indexOf("मौसम") !== -1 || (text.indexOf("rain") !== -1 && text.indexOf("wash") !== -1) || text.indexOf("बारिश") !== -1) {
        return (
          "**आज बारिश की संभावना है — आज दवा का छिड़काव न करें!** 🌦️\n\n" +
          "**आनंद के लिए छिड़काव के ३ जरूरी नियम:**\n" +
          "1. **आज छिड़काव रोकें:** आज " + loc + " में ७૮% बारिश (~२२ मिमी) का अनुमान है। अभी छिड़काव करने से प्रति एकड़ ₹८०० से ₹१,२०० की दवा बारिश में बह जाएगी।\n" +
          "2. **छिड़काव का सबसे अच्छा समय: कल सुबह ०६:३૦ से ०९:०० बजे:** सुबह हवा शांत रहेगी (<१० किमी/घंटा), तापमान सुहावना रहेगा और पत्तियां ९४% दवा सोख लेंगी।\n" +
          "3. **दोपहर की तेज धूप में छिड़काव न करें:** ११:३૦ से ३:३૦ के बीच कभी छिड़काव न करें — धूप से पत्तियां झुलस सकती हैं।\n\n" +
          "**किसान भाई को फायदा:** सही समय पर छिड़काव करने से दवा की बर्बादी बचेगी और प्रति एकड़ ₹८०० से ₹१,२०० की सीधी बचत होगी!\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *क्या आज फसल को पानी देना चाहिए?*\n" +
          "• पूछें: *नीम तेल का जैविक स्प्रे कैसे तैयार करें?*"
        );
      }

      // 2. Water / Irrigation
      if (text.indexOf("water") !== -1 || text.indexOf("irrigation") !== -1 || text.indexOf("पानी") !== -1 || text.indexOf("सिंचाई") !== -1 || text.indexOf("sinchai") !== -1 || text.indexOf("pani") !== -1 || text.indexOf("नमी") !== -1) {
        return (
          "**नहीं, आज पानी देने से पहले रुकें!** ⏸️\n\n" +
          "**आज आपको क्या करना चाहिए:**\n" +
          "1. **१–२ दिनों तक सिंचाई रोकें:** आपके खेत में जड़ों के पास पहले से ३૧% नमी मौजूद है।\n" +
          "2. **बारिश के पानी का फायदा लें:** आज ७૮% बारिश (~२२ मिमी) की संभावना है। बारिश से प्रति एकड़ लगभग १४,००० लीटर पानी और बिजली बचेगी!\n" +
          "3. **जड़ गलन से बचाएं:** दोमट मिट्टी में जरूरत से ज्यादा पानी देने से जड़ें सड़ने लगती हैं और फफूंद फैलती है। मिट्टी को हवा लेने दें।\n\n" +
          "**अगला कदम:**\n" +
          "• पूछें: *छिड़काव का सही समय क्या है?*\n" +
          "• पूछें: *टमाटर के पत्तों की देखभाल कैसे करें?*"
        );
      }

      // 3. Crop Recommendation (Cotton, Soybean, Groundnut)
      if (text.indexOf("cotton") !== -1 || text.indexOf("कपास") !== -1) {
        return (
          "**कपास आपके खेत के लिए #२ विकल्प है (८६% मैच):** 🌱\n\n" +
          "**मूंगफली के साथ तुलना:**\n" +
          "1. **पानी की जरूरत:** कपास को लगभग ८०० मिमी पानी और १५०–१६० दिन लगते हैं, जबकि मूंगफली सिर्फ ४५० मिमी पानी और १०५ दिनों में तैयार हो जाती है।\n" +
          "2. **मृदा स्वास्थ्य:** कपास मिट्टी से पोषक तत्व सोखती है, जबकि मूंगफली मिट्टी में प्राकृतिक नाइट्रोजन जोड़ती है।\n" +
          "3. **निष्कर्ष:** यदि आपके पास पर्याप्त ड्रिप सिंचाई है तो कपास लगा सकते हैं; लेकिन पानी की बचत और जमीन की सेहत के लिए मूंगफली ज्यादा सुरक्षित है।\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *गेहूं के बाद मूंगफली क्यों?*\n" +
          "• पूछें: *कपास और मूंगफली की तुलना कैसे करें?*"
        );
      }

      if (text.indexOf("soybean") !== -1 || text.indexOf("सोयाबीन") !== -1) {
        return (
          "**सोयाबीन आपके खेत के लिए #३ विकल्प है (८૧% मैच):** 🫘\n\n" +
          "1. **कम समय:** ९०–९५ दिनों में पक जाती है और मिट्टी में नाइट्रोजन बढ़ाती है।\n" +
          "2. **मूंगफली क्यों आगे है:** आनंद की दोमट मिट्टी में मूंगफली के दानों की पैदावार और बाजार भाव सोयाबीन से बेहतर मिलता है।\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *गेहूं के बाद मूंगफली क्यों?*\n" +
          "• पूछें: *आणंद के लिए कौन से बीज अच्छे हैं?*"
        );
      }

      if (text.indexOf("crop") !== -1 || text.indexOf("फसल") !== -1 || text.indexOf("wheat") !== -1 || text.indexOf("गेहूं") !== -1 || text.indexOf("मूंगफली") !== -1 || text.indexOf("groundnut") !== -1 || text.indexOf("seed") !== -1 || text.indexOf("बीज") !== -1) {
        return (
          "**गेहूं के बाद मूंगफली आपके खेत के लिए #૧ सर्वोत्तम फसल है! (९४% मैच)** 🥜\n\n" +
          "**गेहूं के बाद मूंगफली लगाने के ३ बड़े लाभ:**\n" +
          "1. **मिट्टी में प्राकृतिक नाइट्रोजन वापस लाती है:** गेहूं मिट्टी से काफी पोषक तत्व खींच लेता है। मूंगफली एक दलहनी फसल है जो जड़ों में ४૦–६० किग्रा/हेक्टेयर प्राकृतिक नाइट्रोजन स्थिर करती है, जिससे यूरिया पर प्रति एकड़ ₹१,५०० की बचत होती है।\n" +
          "2. **आनंद की दोमट मिट्टी के अनुकूल:** भुरभुरी दोमट मिट्टी में मूंगफली के दाने नीचे आसानी से फैलते हैं और पैदावार अच्छी होती है।\n" +
          "3. **कम पानी और अधिक मुनाफा:** कपास की तुलना में बहुत कम पानी (४५०–५५० मिमी) चाहिए और प्रति एकड़ ₹३२,००० से ₹४०,००० का शुद्ध मुनाफा देती है।\n\n" +
          "**आनंद के लिए सर्वोत्तम प्रमाणित बीज:**\n" +
          "• **GG-20** या **TG-37A** जो गुजरात में सबसे लोकप्रिय और अधिक उपज देने वाले बीज हैं।\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *कपास और मूंगफली की तुलना कैसे करें?*"
        );
      }

      // 4. Sustainability / Farm Score & 3-Step Action Plan
      if (text.indexOf("compost") !== -1 || text.indexOf("खाद") !== -1 || text.indexOf("गोबर") !== -1 || text.indexOf("vermicompost") !== -1) {
        return (
          "**मिट्टी की शक्ति बढ़ाने के लिए खाद का सही उपयोग (+६ से +१० अंक):** 🌾\n\n" +
          "1. **मात्रा:** बुवाई से पहले प्रति एकड़ ४ से ५ टन अच्छी सड़ी हुई देसी गोबर की खाद या केंचुआ खाद मिलाएं।\n" +
          "2. **जैविक कार्बन:** इससे आनंद की दोमट मिट्टी में जैविक कार्बन ०.७५% से अधिक होगा और जल धारण क्षमता २५% बढ़ेगी।\n" +
          "3. **स्कोर लाभ:** मृदा स्वास्थ्य स्कोर ७६ से बढ़कर सीधे ८૮ हो जाएगा!\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *फार्म स्कोर ९०+ कैसे करें?*\n" +
          "• पूछें: *नीम तेल का जैविक स्प्रे कैसे तैयार करें?*"
        );
      }

      if (text.indexOf("mulch") !== -1 || text.indexOf("घास") !== -1 || text.indexOf("पुआल") !== -1 || text.indexOf("मल्चिंग") !== -1) {
        return (
          "**टमाटर की कतारों में सूखी घास की मल्चिंग (+४ से +६ अंक):** 🍂\n\n" +
          "1. **विधि:** टमाटर या मूंगफली के पौधों के बीच २ से ३ इंच मोटी गेहूं की सूखी घास या पुआल बिछाएं।\n" +
          "2. **लाभ:** खरपतवार नहीं उगेगा, मिट्टी की नमी धूप में नहीं उड़ेगी, और बारिश में मिट्टी के छींटे पत्तों पर नहीं लगेंगे।\n" +
          "3. **पानी की बचत:** हर हफ्ते लगभग ३०% कम पानी की आवश्यकता होगी और जल प्रबंधन स्कोर बढ़ेगा!\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *क्या आज फसल को पानी देना चाहिए?*\n" +
          "• पूछें: *फार्म स्कोर ९०+ कैसे करें?*"
        );
      }

      if (text.indexOf("bio") !== -1 || text.indexOf("जैविक") !== -1 || text.indexOf("नीम") !== -1 || text.indexOf("ट्राइकोडर्मा") !== -1) {
        return (
          "**जैविक स्प्रे अपनाकर स्कोर बढ़ाएं (+८ से +१२ अंक):** 🌿\n\n" +
          "1. **नीम तेल स्प्रे:** १ लीटर साफ पानी में ५ मिली शुद्ध नीम तेल और १ मिली शैम्पू घोलकर सुबह छिड़कें।\n" +
          "2. **ट्राइकोडर्मा:** १ लीटर पानी में १० ग्राम ट्राइकोडर्मा मिलाकर छिड़काव करें।\n" +
          "3. **लाभ:** रासायनिक अवशेष शून्य रहेगा, केंचुए-मधुमक्खियां बचेंगी और दवा संतुलन स्कोर ७४ से ८૮ पहुंचेगा!\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *नीम तेल का जैविक स्प्रे कैसे तैयार करें?*\n" +
          "• पूछें: *छिड़काव का सही समय क्या है?*"
        );
      }

      if (text.indexOf("score") !== -1 || text.indexOf("स्कोर") !== -1 || text.indexOf("खेत") !== -1 || text.indexOf("सुधार") !== -1 || text.indexOf("90") !== -1 || text.indexOf("९०") !== -1 || text.indexOf("सस्टेनेबिलिटी") !== -1) {
        return (
          "**अपने खेत का स्कोर ८२ से बढ़ाकर ९२+ करने की सीधी ३-चरणीय योजना:** 📈♻️\n\n" +
          "**ये ३ आसान कदम उठाकर १० से १५ अंक सीधे बढ़ाएं:**\n" +
          "1. **कड़े रसायनों की जगह जैविक स्प्रे अपनाएं (+८ से +१२ अंक):**\n" +
          "   रासायनिक दवाओं के बजाय ट्राइकोडर्मा या शुद्ध नीम तेल (५ मिली / १ लीटर पानी) का उपयोग करें। इससे टमाटर पर कोई जहरीला अवशेष नहीं रहता, मधुमक्खियां-केंचुए सुरक्षित रहते हैं और दवा संतुलन स्कोर ७४ से ८૮ पहुंचेगा।\n" +
          "2. **खेत में अच्छी गोबर खाद या वर्मीकम्पोस्ट मिलाएं (+६ से +१० अंक):**\n" +
          "   अगली बुवाई से पहले प्रति एकड़ ४ से ५ टन अच्छी सड़ी हुई गोबर खाद या केंचुआ खाद डालें। इससे मिट्टी में जैविक कार्बन बढ़ता है और मृदा स्वास्थ्य स्कोर ७६ से ८૮ हो जाएगा।\n" +
          "3. **टमाटर की कतारों में सूखी घास की मल्चिंग करें (+४ से +६ अंक):**\n" +
          "   टमाटर या मूंगफली के पौधों के बीच सूखी घास या पुआल बिछाएं। इससे मिट्टी में नमी टिकती है, ३०% पानी बचता है और बारिश की छींटों से पत्तों पर फफूंद नहीं लगती।\n\n" +
          "**किसान भाई को सीधा फायदा:**\n" +
          "इन ३ कदमों से आपका खेत आनंद जिले के शीर्ष ५% खेतों में शामिल होगा और दवाओं पर प्रति एकड़ ₹१,२०૦ से ₹૧,૮૦૦ की सीधी बचत होगी!\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *नीम तेल का जैविक स्प्रे कैसे तैयार करें?*\n" +
          "• पूछें: *एकड़ में कितनी खाद डालें?*"
        );
      }

      // 5. Crop Disease Scans (Tomato, Potato, Chilli)
      if (text.indexOf("potato") !== -1 || text.indexOf("आलू") !== -1 || text.indexOf("late blight") !== -1) {
        return (
          "**आलू में लेट ब्लाइट तेजी से फैल सकता है, तुरंत ध्यान देने की आवश्यकता है!** 🥔\n\n" +
          "**तुरंत ये कदम उठाएं:**\n" +
          "1. **प्रभावित पौधे अलग करें:** गंभीर रूप से प्रभावित पत्तों को काटकर नष्ट करें।\n" +
          "2. **दवा का छिड़काव:** २४ घंटे के भीतर रिडोमिल एमजेड (२.५ ग्राम / १ लीटर) का छिड़काव करें।\n" +
          "3. **सिंचाई रोकें:** मिट्टी सूखने तक पानी न दें।\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *नीम तेल का जैविक स्प्रे कैसे तैयार करें?*\n" +
          "• पूछें: *क्या आज फसल को पानी देना चाहिए?*"
        );
      }

      if (text.indexOf("chilli") !== -1 || text.indexOf("मिर्च") !== -1 || text.indexOf("leaf spot") !== -1) {
        return (
          "**मिर्च में पत्तों के धब्बे गिरने से पहले रोके जा सकते हैं!** 🌶️\n\n" +
          "**आपको क्या करना चाहिए:**\n" +
          "1. **गिरे हुए पत्ते साफ करें:** पौधों के नीचे गिरे संक्रमित पत्तों को इकट्ठा कर नष्ट करें।\n" +
          "2. **कॉपर ऑक्सीक्लोराइड:** १ लीटर पानी में २.૫ ग्राम मिलाकर अच्छा छिड़काव करें।\n" +
          "3. **हवा और धूप:** बीच की घनी टहनियों को हल्का करें ताकि धूप अंदर तक पहुंचे।\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *छिड़काव का सही समय क्या है?*\n" +
          "• पूछें: *क्या आज फसल को पानी देना चाहिए?*"
        );
      }

      if (text.indexOf("blight") !== -1 || text.indexOf("ब्लाइट") !== -1 || text.indexOf("tomato") !== -1 || text.indexOf("टमाटर") !== -1) {
        return (
          "**चिंता न करें, समय पर कदम उठाने से अर्ली ब्लाइट नियंत्रित हो सकता है!** 🍅\n\n" +
          "**आज आपको क्या करना चाहिए:**\n" +
          "1. **धब्बे वाले पत्ते हटाएं:** काले गोल छल्ले वाले निचले पत्तों को काटकर नष्ट करें।\n" +
          "2. **पत्तियों को सूखा रखें:** पानी केवल जड़ों में ही दें; पत्तों पर पानी न डालें।\n" +
          "3. **सुरक्षात्मक छिड़काव:** कल सुबह नीम तेल (५ मिली / १ लीटर) या मैंकोजेब दवा का छिड़काव करें।\n\n" +
          "**यह क्यों हुआ?**\n" +
          "गर्म मौसम (३०°C) और अधिक नमी (७૮%) के कारण टमाटर में धब्बे तेजी से बढ़ते हैं।\n\n" +
          "**आगे पूछें:**\n" +
          "• पूछें: *नीम तेल का जैविक स्प्रे कैसे तैयार करें?*\n" +
          "• पूछें: *क्या आज फसल को पानी देना चाहिए?*"
        );
      }

      // Default Hindi
      return (
        "**आपकी फसल के संबंध में किसान मित्र की सलाह:** 🌱\n\n" +
        "1. **आज की जांच:** मिट्टी में ३૧% नमी है और बारिश की संभावना के कारण आज पानी न दें।\n" +
        "2. **पत्तियों की जांच:** निचले पत्तों पर धब्बे दिखें तो तुरंत हटाएं।\n" +
        "3. **छिड़काव समय:** कल सुबह ०६:३० से ०९:०० के बीच छिड़काव का सबसे अच्छा समय है।\n\n" +
        "**आगे पूछें:**\n" +
        "• पूछें: *क्या आज फसल को पानी देना चाहिए?*\n" +
        "• पूछें: *छिड़काव का सही समय क्या है?*"
      );
    }

    // =========================================================================
    // 3. ENGLISH ADVISOR
    // =========================================================================
    // 0a. Report ID Intent
    if (text.indexOf("report id") !== -1 || text.indexOf("report-id") !== -1 || text.indexOf("what is my report id") !== -1 || text.indexOf("my id") !== -1) {
      return (
        "**Your Official Crop Diagnostic Report ID:** 📋\n\n" +
        "**`AGRI-GJ-2026-84921`**\n\n" +
        "1. **Verified Digital Record:** Authenticated foliar pathology assessment for Patel Farm, Anand, Gujarat.\n" +
        "2. **How to Use:** Quote this Report ID to your local Krishi Vigyan Kendra (KVK) extension officer or agro-input dealer for direct treatment reference.\n\n" +
        "[ 📄 View & Download Official PDF Slip → ](result.html?id=AGRI-GJ-2026-84921&crop=Tomato)\n\n" +
        "**Next step:**\n" +
        "• Ask: *Download PDF Report*\n" +
        "• Ask: *When is the best time to spray tomorrow?*"
      );
    }

    // 0b. PDF Slip & Official Field Report
    if (text.indexOf("pdf") !== -1 || text.indexOf("slip") !== -1 || text.indexOf("report") !== -1 || text.indexOf("print") !== -1 || text.indexOf("download") !== -1) {
      return (
        "**Here is your Official Crop Health & Treatment PDF Report:** 📄\n\n" +
        "This verified field slip contains real diagnostic findings, exact knapsack tank dosage calculators, organic neem remedies, and local Anand weather alerts.\n\n" +
        "[ 📄 View & Download Official PDF Slip → ](result.html)\n\n" +
        "**Next step:**\n" +
        "• Ask: *Should I water my crop today?*\n" +
        "• Ask: *When is the best time to spray tomorrow?*"
      );
    }

    // 1. Weather / Rain / Spray Timing (Evaluated FIRST so "spray my tomato" gets spray advice!)
    if (text.indexOf("spray") !== -1 || text.indexOf("spraying") !== -1 || text.indexOf("weather") !== -1 || text.indexOf("rain") !== -1 || text.indexOf("humidity") !== -1 || text.indexOf("window") !== -1) {
      return (
        "**Rain is expected today — hold off on spraying today!** 🌦️\n\n" +
        "**3 Direct Spray Timing Rules for Anand:**\n" +
        "1. **Hold off today (Rain Alert):** There is a 78% chance of rain (~22mm) in " + loc + " today. Spraying now will wash away ₹800–₹1,200/acre worth of medicine before plants can absorb it.\n" +
        "2. **Best Spray Window: Tomorrow Morning (06:30 AM – 09:00 AM):** Winds are gentle (<10 km/h), temperatures are mild (24–27°C), and leaves absorb foliar sprays with 94% efficiency.\n" +
        "3. **Avoid Afternoon Heat:** Never spray between 11:30 AM and 03:30 PM — hot solar rays cause fast droplet evaporation and chemical leaf scorch.\n\n" +
        "**Farmer Benefit:** Following this schedule prevents medicine wash-off and saves ₹800 to ₹1,200 per acre in chemical costs!\n\n" +
        "**Next Steps:**\n" +
        "• Ask: *Should I water my crop today?*\n" +
        "• Ask: *How to prepare organic Neem spray?*"
      );
    }

    // 2. Water / Irrigation Query
    if (text.indexOf("water") !== -1 || text.indexOf("irrigation") !== -1 || text.indexOf("sinchai") !== -1 || text.indexOf("pani") !== -1 || text.indexOf("moisture") !== -1) {
      return (
        "**No, hold off before watering today!** ⏸️\n\n" +
        "**What you should do today:**\n" +
        "1. **Hold off on watering for 1–2 days:** Your soil already has 31% moisture in the root zone.\n" +
        "2. **Utilize Free Rainwater:** A 78% chance of rain (~22mm) will naturally hydrate your field today in " + loc + ", saving about 14,000 liters of water per acre!\n" +
        "3. **Prevent Root Rot:** Adding extra water now makes loamy soil soggy and causes root rot. Let your soil breathe.\n\n" +
        "**When to check next:** Check your soil tomorrow afternoon once rain clears.\n\n" +
        "**Next step:**\n" +
        "• Ask: *When is the best time to spray?*\n" +
        "• Ask: *How are my tomato leaves doing?*"
      );
    }

    // 3. Crop Recommendation (Cotton, Soybean, Groundnut)
    if (text.indexOf("cotton") !== -1) {
      return (
        "**Cotton (Kapas) is your #2 ranked crop option (86% Match):** 🌱\n\n" +
        "**Key Comparison with Groundnut:**\n" +
        "1. **Water Needs:** Cotton requires ~800 mm water and 150–160 days. Groundnut needs only 450 mm and matures in 105 days.\n" +
        "2. **Soil Impact:** Cotton depletes nitrogen; Groundnut naturally enriches soil with 40–60 kg/ha of nitrogen.\n" +
        "3. **Farmer Advice:** If you have guaranteed drip irrigation and want high gross market sales, select Cotton (Bt-II hybrid). For water savings and soil replenishment, Groundnut is the superior rotation choice.\n\n" +
        "**Next step:**\n" +
        "• Ask: *Why is Groundnut recommended after Wheat?*\n" +
        "• Ask: *What seeds are best for Anand?*"
      );
    }

    if (text.indexOf("soybean") !== -1) {
      return (
        "**Soybean is your #3 ranked crop option (81% Match):** 🫘\n\n" +
        "1. **Short Duration:** Fast maturity in 90–95 days.\n" +
        "2. **Nitrogen Fixer:** Naturally enriches soil like Groundnut.\n" +
        "3. **Why Groundnut Wins in Anand:** Anand's loamy soil produces higher pod oil content and better local mandi selling prices for Groundnut."
      );
    }

    if (text.indexOf("what to plant") !== -1 || text.indexOf("crop recommendation") !== -1 || text.indexOf("choose crop") !== -1 || text.indexOf("wheat") !== -1 || text.indexOf("groundnut") !== -1 || text.indexOf("seeds") !== -1 || text.indexOf("seed") !== -1) {
      return (
        "**Groundnut (Mungfali) is the #1 recommended crop for your field! (94% Match)** 🥜\n\n" +
        "**3 Reasons Groundnut is Best After Wheat:**\n" +
        "1. **Brings Back Soil Power:** Wheat uses up a lot of soil nitrogen. Groundnut is a legume that fixes 40–60 kg/ha of natural nitrogen back into your soil, saving ₹1,500/acre in urea fertilizer.\n" +
        "2. **Perfect for Loam Soil:** Your loose loamy soil in " + loc + " allows groundnut pods to expand underground easily without getting squeezed.\n" +
        "3. **Water Efficient & High Profit:** Needs only 450–550 mm water (half of sugarcane or cotton) and gives ₹32,000–₹40,000 net profit per acre.\n\n" +
        "**Recommended Seeds for Anand:**\n" +
        "• **GG-20** or **TG-37A** certified seeds give top yields in Gujarat.\n\n" +
        "**Next step:**\n" +
        "• Ask: *How does Groundnut compare with Cotton?*"
      );
    }

    // 4. Sustainability / Farm Score & 3-Step Action Plan
    if (text.indexOf("bio-spray") !== -1 || text.indexOf("bio spray") !== -1 || (text.indexOf("neem") !== -1 && text.indexOf("trichoderma") !== -1)) {
      return (
        "**How to Switch to Bio-Sprays to Lift Your Score (+8 to +12 Points):** 🌿\n\n" +
        "1. **Pure Neem Oil (5ml/L):** Mix 5 ml pure cold-pressed neem oil with 1 ml liquid soap per liter of clean water. Spray early morning (06:30–09:00 AM).\n" +
        "2. **Trichoderma viride (10g/L):** Beneficial biocontrol fungus that naturally attacks soil-borne pathogens and leaf blights.\n" +
        "3. **Impact:** Zero chemical residue, protects honeybee pollinators, and lifts your Spray Balance score from 74 to 88!"
      );
    }

    if (text.indexOf("compost") !== -1 || text.indexOf("manure") !== -1 || text.indexOf("vermicompost") !== -1 || text.indexOf("khaad") !== -1) {
      return (
        "**How Farm Compost & Vermicompost Boost Soil Health (+6 to +10 Points):** 🌾\n\n" +
        "1. **Recommended Dosage:** Apply 4 to 5 tonnes per hectare (approx. 2 tonnes per bigha) of well-rotted cow dung manure before sowing.\n" +
        "2. **Vermicompost Option:** If using vermicompost, 1 tonne per acre is sufficient.\n" +
        "3. **Soil Benefit:** Increases soil organic carbon in Anand loamy soil, holds 25% more moisture during hot dry spells, and boosts Soil Health score from 76 to 88!"
      );
    }

    if (text.indexOf("mulch") !== -1 || text.indexOf("straw") !== -1) {
      return (
        "**How Dry Straw Mulch Protects Tomato Rows (+4 to +6 Points):** 🍂\n\n" +
        "1. **Application:** Lay 5–7 cm (2–3 inches) of dry wheat straw or dry grass along tomato plant rows.\n" +
        "2. **Water Savings:** Cuts surface evaporation by 30%, keeping soil moist for 2 extra days between watering cycles.\n" +
        "3. **Disease Prevention:** Stops heavy rain drops from splashing soil spores onto lower leaves, cutting early blight risk significantly!"
      );
    }

    if (text.indexOf("sustainability") !== -1 || text.indexOf("farm score") !== -1 || text.indexOf("score") !== -1 || text.indexOf("improve") !== -1 || text.indexOf("90") !== -1) {
      return (
        "**Here is your direct 3-step action plan to increase your Farm Score from 82 to 92+!** 📈♻️\n\n" +
        "**3 Direct Actions to Gain +10 to +15 Points:**\n" +
        "1. **Switch to Bio-Sprays instead of harsh chemicals (+8 to +12 Points):**\n" +
        "   Use *Trichoderma viride* or pure cold-pressed Neem oil (5ml in 1 liter clean water). It leaves 0% chemical residue on your tomatoes, protects honeybees and soil worms, and directly lifts your Spray Balance score from 74 to 88.\n" +
        "2. **Add Farm Compost or Vermicompost (+6 to +10 Points):**\n" +
        "   Spread 4 to 5 tonnes/hectare of well-rotted cow dung manure (*desi gobar khaad*) or vermicompost before the next sowing. This raises organic carbon above 0.75% and boosts your Soil Health score from 76 to 88.\n" +
        "3. **Put Dry Straw Mulch on Crop Rows (+4 to +6 Points):**\n" +
        "   Cover bare soil between tomato rows with 5–7 cm of dry wheat straw or dry grass. This cuts soil water evaporation by 30%, stops weed germination, and prevents mud splash on lower leaves.\n\n" +
        "**Farmer Savings & Benefit:**\n" +
        "Following these 3 steps moves your farm into the top 5% in Anand district and saves you ₹1,200 to ₹1,800 per acre in chemical pesticide and fertilizer costs!\n\n" +
        "**Next Steps:**\n" +
        "• Ask: *How to prepare organic Neem spray?*\n" +
        "• Ask: *How much compost per bigha?*"
      );
    }

    // 5. Crop Disease Scans (Potato Late Blight, Chilli Leaf Spot, Tomato Early Blight)
    if (text.indexOf("potato") !== -1 || text.indexOf("late blight") !== -1) {
      return (
        "**Late blight needs quick attention because it can spread fast!** 🥔\n\n" +
        "**What you should do right now:**\n" +
        "1. **Isolate the patch:** Check affected plants immediately and remove badly blighted leaves into a sealed sack.\n" +
        "2. **Spray protective medicine:** Apply Metalaxyl + Mancozeb (Ridomil MZ @ 2.5g in 1 liter water) within 24 hours.\n" +
        "3. **Stop watering:** Keep the field dry until wet weather clears.\n\n" +
        "**Why this happened:**\n" +
        "Rainy and humid weather helps late blight spores travel on leaf moisture.\n\n" +
        "**Next step:**\n" +
        "• Ask: *When should I rescan my potato crop?*"
      );
    }

    if (text.indexOf("chilli") !== -1 || text.indexOf("leaf spot") !== -1) {
      return (
        "**Chilli leaf spots can be stopped before leaves start dropping!** 🌶️\n\n" +
        "**What you should do:**\n" +
        "1. **Clear dropped leaves:** Rake up any fallen spotted leaves from under plants and safely bury them away from field boundaries.\n" +
        "2. **Spray Copper Oxychloride:** Mix 2.5g in 1 liter of water and spray leaves thoroughly.\n" +
        "3. **Improve airflow:** Thin out crowded center branches so sunlight reaches inside the plant canopy.\n\n" +
        "**Why this happened:**\n" +
        "Damp foliage late in the day allows fungal spots to form.\n\n" +
        "**Next step:**\n" +
        "• Ask: *How to prepare organic spray?*"
      );
    }

    if (text.indexOf("tomato") !== -1 || text.indexOf("blight") !== -1 || text.indexOf("leaf") !== -1) {
      return (
        "**Don't worry, early blight can be controlled if we act quickly!** 🍅\n\n" +
        "**What you should do today:**\n" +
        "1. **Remove spotted leaves:** Carefully cut off lower leaves that have dark round rings and throw them away in a bag (do not leave them on the soil).\n" +
        "2. **Water at the roots only:** Keep leaves dry; avoid splashing water on foliage.\n" +
        "3. **Spray protective medicine:** Spray organic Neem oil (5ml in 1 liter water) or Mancozeb medicine (2.5g in 1 liter water) tomorrow morning.\n\n" +
        "**Why this happened:**\n" +
        "Warm weather (30°C) and high humidity (78%) in " + loc + " help leaf spots grow on lower tomato leaves.\n\n" +
        "**Next step:**\n" +
        "• Ask: *Should I water today?*\n" +
        "• Ask: *How to mix neem oil spray?*"
      );
    }

    // 6. Neem Oil Preparation Recipe
    if (text.indexOf("neem") !== -1 || text.indexOf("organic") !== -1 || text.indexOf("bio") !== -1) {
      return (
        "**How to prepare fresh Neem Oil spray at home:** 🌿\n\n" +
        "1. Take **5 ml of pure cold-pressed neem oil** for every 1 liter of clean water.\n" +
        "2. Add **1 ml of liquid soap or washing liquid** — this helps the oil mix smoothly with water.\n" +
        "3. Shake the sprayer bottle vigorously until the water looks milky.\n" +
        "4. Spray early in the morning (06:30 - 09:00 AM) on both top and undersides of leaves.\n\n" +
        "**Farmer tip:** Neem is completely safe for children, farm animals, and honeybees!\n\n" +
        "**Next step:**\n" +
        "• Ask: *When is the best time to spray?*\n" +
        "• Ask: *Should I water my crop today?*"
      );
    }

    // 7. Low-cost Desi Remedies
    if (text.indexOf("desi") !== -1 || text.indexOf("cost") !== -1 || text.indexOf("cheap") !== -1 || text.indexOf("free") !== -1) {
      return (
        "**2 Low-Cost Remedies from the farm:** 💰\n\n" +
        "1. **Sour Buttermilk (Khatti Chaas):** Dilute 1 liter of 3-day-old sour buttermilk into 10 liters of water. Spraying this stops fungal leaf spots naturally.\n" +
        "2. **Cow Urine (Gau Mutra):** Mix 1 liter cow urine into 10 liters of water. Acts as a natural medicine and gives leaves a healthy green color.\n\n" +
        "**Next step:**\n" +
        "• Ask: *How to reach 90+ score?*\n" +
        "• Ask: *How to prepare organic Neem spray?*"
      );
    }

    // 8. Greetings
    if (text.indexOf("hello") !== -1 || text.indexOf("hi") !== -1 || text.indexOf("namaste") !== -1 || text.indexOf("kem cho") !== -1) {
      return (
        "**Namaste! 🙏 I am Khedut Mitr, your farm companion.**\n\n" +
        "How can I help you today? You can tap the microphone 🎤 to speak, or tap one of the questions below."
      );
    }

    // Default friendly response
    return (
      "**Regarding your " + crop + ":** 🌱\n\n" +
      "1. **Today's check:** Your field has adequate moisture (31%) and rain is expected, so hold off on watering.\n" +
      "2. **Leaf check:** Check lower leaves for spots and remove any badly affected leaves.\n" +
      "3. **Spraying:** Best time to spray is tomorrow morning 06:30 AM – 09:00 AM.\n\n" +
      "**Next step:**\n" +
      "• Ask: *Should I water my crop today?*\n" +
      "• Ask: *When is the best time to spray tomorrow?*"
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

  function getPageChips() {
    var path = (window.location.pathname.split("/").pop() || "").toLowerCase();
    var lang = (global.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : (localStorage.getItem("agrismart_lang") || "en");

    if (lang === "gu") {
      if (path === "unhealthy-plants.html") {
        return [
          { q: "મારા ટામેટામાં અર્લી બ્લાઇટ રોગ દેખાય છે. પાક બચાવવા માટે મારે શું કરવું જોઈએ?", label: "🍅 ટામેટા માટે શું કરવું?" },
          { q: "મારા બટાકામાં લેટ બ્લાઇટ રોગ દેખાય છે. પાક બચાવવા તરત શું કરવું?", label: "🥔 બટાકા માટે શું કરવું?" },
          { q: "શું આજે પાકને પાણી આપવું જોઈએ?", label: "💧 શું આજે પાણી આપવું?" },
          { q: "લીમડાના તેલનો સ્પ્રે કેવી રીતે બનાવવો?", label: "🌿 લીમડાનો સ્પ્રે બનાવવો?" }
        ];
      }
      if (path === "irrigation.html") {
        return [
          { q: "શું આજે પાકને પાણી આપવું જોઈએ?", label: "💧 શું આજે પાણી આપવું?" },
          { q: "વરસાદની આગાહી જોતાં પાણી આપતા પહેલા કેમ થોભવું જોઈએ?", label: "🌧️ પાણી આપતા પહેલા કેમ થોભવું?" },
          { q: "સિંચાઈ રોકવાથી કેટલું પાણી અને વીજળી બચશે?", label: "🌊 કેટલું પાણી બચશે?" }
        ];
      }
      if (path === "crop-recommendation.html") {
        return [
          { q: "ઘઉં પછી મગફળી વાવવાના શું ફાયદા છે?", label: "🌱 ઘઉં પછી મગફળી કેમ?" },
          { q: "આણંદ માટે કયા પ્રમાણિત બિયારણ સારા છે?", label: "🌾 શ્રેષ્ઠ બિયારણ કયા?" },
          { q: "કપાસ અને મગફળીમાં શું તફાવત છે?", label: "⚖️ કપાસ સાથે સરખામણી?" }
        ];
      }
      if (path === "weather.html") {
        return [
          { q: "આવતીકાલે દવા છાંટવાનો શ્રેષ્ઠ સમય કયો છે?", label: "🎯 છંટકાવનો શ્રેષ્ઠ સમય?" },
          { q: "શું આજે દવા છાંટવાથી વરસાદમાં ધોવાઈ જશે?", label: "🌧️ શું વરસાદથી દવા ધોવાશે?" },
          { q: "શું આજે પાકને પાણી આપવું જોઈએ?", label: "💧 શું આજે પાણી આપવું?" }
        ];
      }
      if (path === "sustainability.html") {
        return [
          { q: "મારા ખેતરના ૮૨ સ્કોરનો શું અર્થ થાય છે?", label: "♻️ ૮૨ સ્કોરનો અર્થ શું?" },
          { q: "ખેતર સ્કોર ૯૦+ કેવી રીતે કરવો?", label: "📈 સ્કોર ૯૦+ કેવી રીતે કરવો?" },
          { q: "જમીન સુધારવા માટે ઓછા ખર્ચના દેશી ઉપાયો કયા છે?", label: "💰 સસ્તા દેશી ઉપાયો?" }
        ];
      }
      return [
        { q: "શું આજે પાકને પાણી આપવું જોઈએ?", label: "💧 શું આજે પાણી આપવું?" },
        { q: "ઘઉં પછી કયો પાક વાવવો સારો?", label: "🌱 ઘઉં પછી કયો પાક?" },
        { q: "મારા ટામેટામાં અર્લી બ્લાઇટ રોગ દેખાય છે. પાક બચાવવા માટે મારે શું કરવું જોઈએ?", label: "🍅 ટામેટા માટે સલાહ?" },
        { q: "લીમડાના તેલનો સ્પ્રે કેવી રીતે બનાવવો?", label: "🌿 લીમડાનો સ્પ્રે બનાવવો?" }
      ];
    }

    if (lang === "hi") {
      if (path === "unhealthy-plants.html") {
        return [
          { q: "मेरे टमाटर में अगेती झुलसा रोग है। फसल बचाने के लिए क्या करें?", label: "🍅 टमाटर के लिए क्या करें?" },
          { q: "मेरे आलू में पछेती झुलसा रोग है। तुरंत क्या करना चाहिए?", label: "🥔 आलू के लिए क्या करें?" },
          { q: "क्या आज फसल को पानी देना चाहिए?", label: "💧 क्या आज पानी देना चाहिए?" },
          { q: "नीम तेल का जैविक स्प्रे कैसे तैयार करें?", label: "🌿 नीम स्प्रे कैसे बनाएं?" }
        ];
      }
      if (path === "irrigation.html") {
        return [
          { q: "क्या आज फसल को पानी देना चाहिए?", label: "💧 क्या आज पानी देना चाहिए?" },
          { q: "बारिश के अनुमान को देखते हुए पानी देने से पहले क्यों रुकें?", label: "🌧️ पानी देने से पहले क्यों रुकें?" },
          { q: "सिंचाई रोकने से कितना पानी और खर्च बचेगा?", label: "🌊 कितना पानी बचेगा?" }
        ];
      }
      if (path === "crop-recommendation.html") {
        return [
          { q: "गेहूं के बाद मूंगफली बोने के क्या फायदे हैं?", label: "🌱 गेहूं के बाद मूंगफली क्यों?" },
          { q: "आणंद के लिए कौन से बीज अच्छे हैं?", label: "🌾 उत्तम बीज किस्में?" },
          { q: "कपास और मूंगफली की तुलना कैसे करें?", label: "⚖️ कपास से तुलना?" }
        ];
      }
      if (path === "weather.html") {
        return [
          { q: "कल सुबह छिड़काव का सबसे अच्छा समय कब है?", label: "🎯 छिड़काव का सही समय?" },
          { q: "क्या आज दवा छिड़कने से बारिश में धुल जाएगी?", label: "🌧️ क्या बारिश से दवा धुलेगी?" },
          { q: "क्या आज फसल को पानी देना चाहिए?", label: "💧 क्या आज पानी देना चाहिए?" }
        ];
      }
      if (path === "sustainability.html") {
        return [
          { q: "मेरे खेत के ८२ स्कोर का क्या अर्थ है?", label: "♻️ ८२ स्कोर का क्या मतलब है?" },
          { q: "फार्म स्कोर ९०+ कैसे करें?", label: "📈 स्कोर ९०+ कैसे करें?" },
          { q: "जमीन की सेहत सुधारने के लिए सस्ते देसी उपाय क्या हैं?", label: "💰 सस्ते देसी नुस्खे?" }
        ];
      }
      return [
        { q: "क्या आज फसल को पानी देना चाहिए?", label: "💧 क्या आज पानी देना चाहिए?" },
        { q: "गेहूं के बाद कौन सी फसल बोनी चाहिए?", label: "🌱 गेहूं के बाद कौन सी फसल?" },
        { q: "मेरे टमाटर में अगेती झुलसा रोग है। फसल बचाने के लिए क्या करें?", label: "🍅 टमाटर के लिए सलाह?" },
        { q: "नीम तेल का जैविक स्प्रे कैसे तैयार करें?", label: "🌿 नीम स्प्रे कैसे बनाएं?" }
      ];
    }

    // Default English
    if (path === "unhealthy-plants.html") {
      return [
        { q: "This is my tomato crop. The scan found Early Blight with 92% confidence. What should I do to protect my crop?", label: "🍅 What to do for Tomato?" },
        { q: "This is my potato crop. The scan found Late Blight with 90% confidence. What should I do right now to save my crop?", label: "🥔 What to do for Potato?" },
        { q: "Should I water my crop today?", label: "💧 Should I water today?" },
        { q: "How to prepare Neem oil spray?", label: "🌿 How to mix Neem spray?" }
      ];
    }
    if (path === "irrigation.html") {
      return [
        { q: "Should I water my crop today?", label: "💧 Should I water today?" },
        { q: "Why should I wait before watering?", label: "🌧️ Why wait before watering?" },
        { q: "How much water do I save?", label: "🌊 How much water saved?" }
      ];
    }
    if (path === "crop-recommendation.html") {
      return [
        { q: "Why is Groundnut recommended after Wheat?", label: "🌱 Why Groundnut after Wheat?" },
        { q: "What seeds are best for Anand?", label: "🌾 Best seed cultivars?" },
        { q: "How does Groundnut compare with Cotton?", label: "⚖️ Compare with Cotton?" }
      ];
    }
    if (path === "weather.html") {
      return [
        { q: "When is the best time to spray tomorrow?", label: "🎯 When to spray tomorrow?" },
        { q: "Will rain wash away my spray?", label: "🌧️ Will rain wash spray?" },
        { q: "Should I water today?", label: "💧 Should I water today?" }
      ];
    }
    if (path === "sustainability.html") {
      return [
        { q: "What does my farm score mean?", label: "♻️ What does 82 score mean?" },
        { q: "How can I improve my score to 90?", label: "📈 How to reach 90+ score?" },
        { q: "What are low cost desi remedies?", label: "💰 Low-cost desi remedies?" }
      ];
    }
    return [
      { q: "Should I water my crop today?", label: "💧 Should I water today?" },
      { q: "What crop should I plant after Wheat?", label: "🌱 Best crop after Wheat?" },
      { q: "This is my tomato crop. The scan found Early Blight with 92% confidence. What should I do to protect my crop?", label: "🍅 What to do for Tomato?" },
      { q: "How to prepare Neem oil spray?", label: "🌿 How to mix Neem spray?" }
    ];
  }

  var activeAddMessage = null;
  var activeAddLoadingStage = null;
  var activeToggleChat = null;
  var activeDialog = null;

  function initKhedutMitr() {
    if (document.getElementById("khedut-mitr-root")) return;

    var farmCtx = (global.AgriAPI && AgriAPI.getFarmContext) ? AgriAPI.getFarmContext() : null;
    var cropName = (farmCtx && farmCtx.crop) || "Tomato";

    var container = document.createElement("div");
    container.id = "khedut-mitr-root";

    function getInitialGreetingHtml() {
      var chips = getPageChips();
      var chipsHtml = chips.map(function (c) {
        return '<button class="khedut-mitr-prompt-chip" data-q="' + c.q.replace(/"/g, '&quot;') + '" type="button">' + c.label + '</button>';
      }).join("");

      var currentLang = (global.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : (localStorage.getItem("agrismart_lang") || "en");
      var locStr = ((farmCtx && farmCtx.location) || "Anand, Gujarat");

      var gTitle = "Namaste Farmer! 🙏";
      var gBody = "I am <strong>Khedut Mitr</strong>, your personal farm helper.<br>Connected to your fields in <strong>" + locStr + "</strong>. How can I help your crops today?";
      var gSub = "Quick questions you can tap:";

      if (currentLang === "gu") {
        gTitle = "નમસ્તે ખેડૂત મિત્ર! 🙏";
        gBody = "હું <strong>ખેડૂત મિત્ર</strong> છું, તમારો ખેતી સહાયક.<br>તમારા <strong>" + locStr + "</strong> ના ખેતર સાથે જોડાયેલ છું. આજે તમારા પાક માટે શું સહાય જોઈએ?";
        gSub = "ઝડપી સવાલો — સીધા ટેપ કરો:";
      } else if (currentLang === "hi") {
        gTitle = "नमस्ते किसान भाई! 🙏";
        gBody = "मैं हूँ <strong>खेड़ूत मित्र</strong>, आपका निजी कृषि सहायक।<br>आपके <strong>" + locStr + "</strong> के खेत से जुड़ा हुआ हूँ। आज आपकी फसल के लिए क्या सहायता चाहिए?";
        gSub = "त्वरित सवाल — सीधे टैप करें:";
      }

      return (
        '<div class="khedut-mitr-msg bot">' +
        '  <div class="khedut-mitr-msg-author">Khedut Mitr</div>' +
        '  <div class="khedut-mitr-msg-bubble">' +
        '    <p style="margin:0 0 0.4rem 0;"><strong>' + gTitle + '</strong></p>' +
        '    <p style="margin:0 0 0.6rem 0;">' + gBody + '</p>' +
        '    <div style="font-size:0.75rem;font-weight:700;color:var(--text-subtle);margin-top:0.6rem;text-transform:uppercase;letter-spacing:0.04em;">' + gSub + '</div>' +
        '    <div class="khedut-mitr-chips-wrap">' +
        chipsHtml +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }

    container.innerHTML =
      '<!-- Floating Launcher Button with Organic Breathing Animation -->' +
      '<button class="khedut-mitr-launcher" id="khedut-mitr-btn" aria-label="Open Khedut Mitr Agronomist">' +
      '  <div class="khedut-mitr-icon-bubble">' + getLeafLogoSvg(26) + '</div>' +
      '  <div class="khedut-mitr-launcher-text">' +
      '    <div class="khedut-mitr-launcher-title">Khedut Mitr</div>' +
      '    <div class="khedut-mitr-launcher-sub">ખેડૂત મિત્ર &bull; Farm Helper</div>' +
      '  </div>' +
      '</button>' +

      '<!-- Interactive Chat Window (Docked Bottom Right) -->' +
      '<div class="khedut-mitr-window khedut-mitr-dialog hidden" id="khedut-mitr-dialog" role="dialog" aria-label="Khedut Mitr Agricultural Assistant">' +
      '  <div class="khedut-mitr-header">' +
      '    <div class="khedut-mitr-header-info">' +
      '      <div class="khedut-mitr-avatar">' +
      '        ' + getLeafLogoSvg(24) +
      '      </div>' +
      '      <div>' +
      '        <div class="khedut-mitr-header-title">' +
      '          <span>Khedut Mitr (ખેડૂત મિત્ર)</span>' +
      '          <span style="font-size:0.68rem;background:#52B788;color:#FFFFFF;padding:0.12rem 0.45rem;border-radius:999px;font-weight:800;letter-spacing:0.02em;">ONLINE</span>' +
      '        </div>' +
      '        <div class="khedut-mitr-header-sub">Your Living Farm Helper &bull; ' + ((farmCtx && farmCtx.location) || "Anand, Gujarat") + '</div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="khedut-mitr-header-actions">' +
      '      <!-- Start New Chat Button -->' +
      '      <button class="khedut-mitr-header-btn" id="khedut-mitr-reset" title="Start new chat / નવી વાતચીત" aria-label="Start new chat">' +
      '        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>' +
      '      </button>' +
      '      <!-- Make Screen Bigger / Smaller Toggle -->' +
      '      <button class="khedut-mitr-header-btn" id="khedut-mitr-expand" title="Make screen bigger" aria-label="Toggle screen size">' +
      '        <svg class="expand-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>' +
      '        <svg class="contract-icon hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>' +
      '      </button>' +
      '      <!-- Close Chat Button -->' +
      '      <button class="khedut-mitr-close-btn" id="khedut-mitr-close" title="Close Chat" aria-label="Close Chat">' +
      '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '      </button>' +
      '    </div>' +
      '  </div>' +

      '  <div class="khedut-mitr-messages" id="khedut-mitr-msg-list">' +
      getInitialGreetingHtml() +
      '  </div>' +

      '  <!-- VOICE PROMPT BANNER -->' +
      '  <div class="khedut-mitr-voice-banner">' +
      '    <span>🎤 બોલીને પૂછો / Tap mic to speak</span>' +
      '    <span style="font-size:0.72rem;font-weight:700;">English &bull; ગુજરાતી &bull; हिन्दी</span>' +
      '  </div>' +

      '  <div class="khedut-mitr-input-bar">' +
      '    <div class="khedut-mitr-input-wrap">' +
      '      <span class="leaf-blinking-caret" id="leaf-blinking-caret" aria-hidden="true">' +
      '        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">' +
      '          <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4L6 22l3.6-.6C10.3 21.8 11.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" fill="#52B788"/>' +
      '          <path d="M12 7v10M9 10l3-3 3 3" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>' +
      '        </svg>' +
      '      </span>' +
      '      <input type="text" class="khedut-mitr-input" id="khedut-mitr-input" placeholder="Type or speak to Khedut Mitr..." autocomplete="off">' +
      '    </div>' +
      '    <!-- Voice Speech-to-Text Button -->' +
      '    <button class="mitr-voice-btn" id="khedut-mitr-voice-btn" type="button" title="Speak to Khedut Mitr (Voice Mic)" aria-label="Voice input">' +
      '      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>' +
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
    var resetBtn = document.getElementById("khedut-mitr-reset");
    var expandBtn = document.getElementById("khedut-mitr-expand");
    var input = document.getElementById("khedut-mitr-input");
    var sendBtn = document.getElementById("khedut-mitr-send");
    var voiceBtn = document.getElementById("khedut-mitr-voice-btn");
    var msgList = document.getElementById("khedut-mitr-msg-list");

    activeDialog = dialog;
    if (!btn || !dialog) return;

    function scrollToBottom() {
      if (msgList) {
        msgList.scrollTop = msgList.scrollHeight;
      }
    }

    function resetToNewChat(clearOnly) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (msgList) {
        msgList.innerHTML = clearOnly ? "" : getInitialGreetingHtml();
      }
      if (input) {
        input.value = "";
      }
      setTimeout(scrollToBottom, 30);
    }

    activeResetToNewChat = resetToNewChat;

    function toggleChat(forceOpen) {
      var shouldOpen = forceOpen !== undefined ? forceOpen : dialog.classList.contains("hidden");
      if (shouldOpen) {
        dialog.classList.remove("hidden");
        btn.classList.add("hidden");
        setTimeout(scrollToBottom, 40);
        setTimeout(scrollToBottom, 180);
        input.focus();
      } else {
        dialog.classList.add("hidden");
        btn.classList.remove("hidden");
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        // Reset to fresh new chat when closing so next time it opens it starts anew
        resetToNewChat(false);
      }
    }

    activeToggleChat = toggleChat;

    btn.addEventListener("click", function () { toggleChat(true); });
    closeBtn.addEventListener("click", function () { toggleChat(false); });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        resetToNewChat(false);
        if (global.AgriApp && AgriApp.toast) {
          var curLang = (global.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : (localStorage.getItem("agrismart_lang") || "en");
          var msg = curLang === "gu" ? "નવી વાતચીત શરૂ થઈ" : (curLang === "hi" ? "नई बातचीत शुरू हुई" : "New chat started");
          AgriApp.toast(msg);
        }
      });
    }

    // Expand screen toggle button
    if (expandBtn) {
      expandBtn.addEventListener("click", function () {
        dialog.classList.toggle("is-expanded");
        var isExp = dialog.classList.contains("is-expanded");
        var expIcon = expandBtn.querySelector(".expand-icon");
        var contIcon = expandBtn.querySelector(".contract-icon");
        if (expIcon && contIcon) {
          if (isExp) {
            expIcon.classList.add("hidden");
            contIcon.classList.remove("hidden");
            expandBtn.title = "Make window smaller";
          } else {
            expIcon.classList.remove("hidden");
            contIcon.classList.add("hidden");
            expandBtn.title = "Make window bigger";
          }
        }
        setTimeout(scrollToBottom, 100);
      });
    }

    function addMessage(sender, text, isBloom) {
      var msg = document.createElement("div");
      msg.className = "khedut-mitr-msg " + sender + (isBloom ? " answer-bloom-in" : "");

      var authorLabel = sender === "bot" ? "Khedut Mitr" : "You (Farmer)";
      var innerBubbleHtml = "";

      if (sender === "user") {
        var safeUserText = (text || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        innerBubbleHtml = safeUserText;
      } else {
        var formatted = formatAdvisorMessage(text);
        var listenBtnHtml =
          '<button class="mitr-listen-btn" type="button" title="Listen to this advice">' +
          '  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>' +
          '  <span>Listen</span>' +
          '</button>';
        innerBubbleHtml = formatted + listenBtnHtml;
      }

      msg.innerHTML =
        '<div class="khedut-mitr-msg-author">' + authorLabel + '</div>' +
        '<div class="khedut-mitr-msg-bubble">' + innerBubbleHtml + '</div>';

      msgList.appendChild(msg);
      scrollToBottom();
      setTimeout(scrollToBottom, 60);

      var lBtn = msg.querySelector(".mitr-listen-btn");
      if (lBtn) {
        lBtn.addEventListener("click", function () {
          var isPlaying = lBtn.classList.contains("speaking");
          if (isPlaying) {
            window.speechSynthesis.cancel();
            lBtn.classList.remove("speaking");
            lBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg><span>Listen</span>';
          } else {
            lBtn.classList.add("speaking");
            lBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause</span>';
            speakText(text, function () {
              lBtn.classList.remove("speaking");
              lBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg><span>Listen</span>';
            });
          }
        });
      }

      if (isBloom) {
        playBloomChime();
      }
    }

    activeAddMessage = addMessage;

    function addLoadingStage() {
      var loader = document.createElement("div");
      loader.className = "khedut-mitr-msg bot mitr-loader-stage";
      loader.id = "mitr-loader-stage";
      loader.innerHTML =
        '<div class="khedut-mitr-msg-author">Khedut Mitr</div>' +
        '<div class="khedut-mitr-msg-bubble">' +
        '  <div style="animation:spin 1.8s linear infinite;display:grid;place-items:center;">' +
        '    ' + getMovingLeafSvg() +
        '  </div>' +
        '  <span style="font-weight:600;font-size:0.88rem;">Checking farm conditions & preparing advice...</span>' +
        '</div>';
      msgList.appendChild(loader);
      scrollToBottom();
      return loader;
    }

    activeAddLoadingStage = addLoadingStage;

    function handleSend(userQuestion, customContext) {
      var text = (userQuestion || input.value || "").trim();
      if (!text) return;

      input.value = "";
      addMessage("user", text, false);

      var loader = addLoadingStage();
      sendBtn.disabled = true;

      var delayMs = 600 + Math.floor(Math.random() * 250);
      setTimeout(function () {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
        var reply = getBotResponse(text, customContext || { crop: cropName });
        addMessage("bot", reply, true);
        sendBtn.disabled = false;
        input.focus();
        scrollToBottom();
      }, delayMs);
    }

    sendBtn.addEventListener("click", function () {
      handleSend();
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        handleSend();
      }
    });

    // Delegated click for prompt chips
    msgList.addEventListener("click", function (e) {
      var chip = e.target.closest(".khedut-mitr-prompt-chip");
      if (chip) {
        var q = chip.getAttribute("data-q");
        if (q) handleSend(q);
      }
    });

    // Voice recognition (Web Speech API)
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = null;
    var isListening = false;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "gu-IN"; // Gujarati first, with fallback

      recognition.onstart = function () {
        isListening = true;
        voiceBtn.classList.add("recording");
        input.placeholder = "Listening... બોલો, હું સાંભળું છું";
      };

      recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        if (transcript) {
          input.value = transcript;
          handleSend(transcript);
        }
      };

      recognition.onerror = function () {
        isListening = false;
        voiceBtn.classList.remove("recording");
        input.placeholder = "Type or speak to Khedut Mitr...";
      };

      recognition.onend = function () {
        isListening = false;
        voiceBtn.classList.remove("recording");
        input.placeholder = "Type or speak to Khedut Mitr...";
      };

      voiceBtn.addEventListener("click", function () {
        if (isListening) {
          recognition.stop();
        } else {
          try {
            recognition.start();
          } catch (e) {
            // Already started
          }
        }
      });
    } else {
      voiceBtn.title = "Voice recognition is not supported in this browser.";
      voiceBtn.style.opacity = "0.6";
      voiceBtn.addEventListener("click", function () {
        if (global.AgriApp) AgriApp.toast("Voice speech-to-text is not supported in this browser. Please type your question.");
      });
    }
  }

  var activeResetToNewChat = null;

  // Exposed method for external buttons (Unhealthy plants, Dashboard, etc.)
  function askPreloaded(questionText, context) {
    if (!document.getElementById("khedut-mitr-root")) {
      initKhedutMitr();
    }
    if (activeToggleChat) {
      activeToggleChat(true);
    }
    // Clean reset for fresh preloaded chat
    if (activeResetToNewChat) {
      activeResetToNewChat(true);
    }
    if (activeAddMessage && activeAddLoadingStage) {
      activeAddMessage("user", questionText, false);
      var loader = activeAddLoadingStage();
      setTimeout(function () {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
        var reply = getBotResponse(questionText, context);
        activeAddMessage("bot", reply, true);
      }, 650);
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initKhedutMitr);
  } else {
    initKhedutMitr();
  }

  global.KhedutMitr = {
    init: initKhedutMitr,
    getBotResponse: getBotResponse,
    askPreloaded: askPreloaded,
    resetToNewChat: function () {
      if (activeResetToNewChat) activeResetToNewChat(false);
    }
  };
})(window);
