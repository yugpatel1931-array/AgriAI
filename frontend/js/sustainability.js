(function (global) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var heroMount = document.getElementById("sustainability-hero-mount");
    var componentsMount = document.getElementById("components-mount");
    var improvementsMount = document.getElementById("improvements-mount");

    var sustData = (window.AgriAPI && AgriAPI.getSustainabilityScore) ? AgriAPI.getSustainabilityScore() : { overallScore: 82, farmProfile: { location: "Anand, Gujarat" } };

    // Helper to safely trigger Khedut Mitr
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

    function renderSustainability() {
      var l = (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";

      // 1. Sustainability Hero Gauge
      if (heroMount) {
        var circumference = 2 * Math.PI * 52; // ~326.7
        var offset = circumference - (sustData.overallScore / 100) * circumference;

        var badgeText = (l === "gu") ? "ખેતર સ્વાસ્થ્ય સ્કોર" : (l === "hi" ? "खेत स्वास्थ्य स्कोर" : "FARM HEALTH SCORE");
        var heroTitle = (l === "gu") ? "તમારું ખેતર ઉત્તમ સ્થિતિમાં છે!" : (l === "hi" ? "आपका खेत बेहतरीन स्थिति में है!" : "Your Farm Is Doing Well!");
        var heroDesc = (l === "gu")
          ? ("<strong>" + AgriApp.escapeHtml(sustData.farmProfile.location) + "</strong> માં તમારું ખેતર <strong>૧૦૦ માંથી ૮૨ સ્કોર</strong> ધરાવે છે, જે તમારા જિલ્લાના સરેરાશ ખેતરો કરતાં <strong>૧૪% વધુ સારું</strong> છે.")
          : (l === "hi"
            ? ("<strong>" + AgriApp.escapeHtml(sustData.farmProfile.location) + "</strong> में आपका खेत <strong>१०० में से ८२ स्कोर</strong> करता है, जो आपके ज़िले के औसत से <strong>१४% बेहतर</strong> है।")
            : ("Your farm in <strong>" + AgriApp.escapeHtml(sustData.farmProfile.location) + "</strong> scores <strong>82 out of 100</strong>, which is <strong>14% better</strong> than average farms in your district."));

        var ratingLbl = (l === "gu") ? "રેટિંગ" : (l === "hi" ? "रेटिंग" : "Rating");
        var ratingVal = (l === "gu") ? "ઉત્તમ ખેતર સ્વાસ્થ્ય" : (l === "hi" ? "उत्कृष्ट खेत स्वास्थ्य" : "Good Farm Health");
        var distAvgLbl = (l === "gu") ? "જિલ્લા સરેરાશ" : (l === "hi" ? "ज़िला औसत" : "District Average");
        var gaugeLbl = (l === "gu") ? "૧૦૦ માંથી" : (l === "hi" ? "१०० में से" : "OUT OF 100");
        var askBtnTxt = (l === "gu") ? 'ખેડૂત મિત્રને પૂછો: "૯૦+ સ્કોર કેવી રીતે મેળવવો?"' : (l === "hi" ? 'किसान मित्र से पूछें: "९०+ स्कोर कैसे प्राप्त करें?"' : 'Ask Khedut Mitr: "How can I improve my score to 90+?"');
        var checkCropTxt = (l === "gu") ? "ધ્યાન માંગતા પાક તપાસો &rarr;" : (l === "hi" ? "ध्यान देने योग्य फसलें देखें &rarr;" : "Check Crops Needing Attention &rarr;");

        heroMount.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:2rem;">' +
          '  <div>' +
          '    <span class="badge badge-success" style="font-weight:800;font-size:0.75rem;margin-bottom:0.4rem;">' + badgeText + '</span>' +
          '    <h2 style="font-size:1.9rem;margin:0 0 0.4rem;color:var(--text-main);">' + heroTitle + '</h2>' +
          '    <p style="font-size:0.95rem;color:var(--text-muted);max-width:45ch;margin:0 0 1.2rem;line-height:1.5;">' +
          heroDesc +
          '    </p>' +
          '    <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">' +
          '      <div>' +
          '        <span style="font-size:0.75rem;color:var(--text-subtle);text-transform:uppercase;font-weight:600;">' + ratingLbl + '</span>' +
          '        <div style="font-weight:700;color:var(--leaf);font-size:1.1rem;">' + ratingVal + '</div>' +
          '      </div>' +
          '      <div>' +
          '        <span style="font-size:0.75rem;color:var(--text-subtle);text-transform:uppercase;font-weight:600;">' + distAvgLbl + '</span>' +
          '        <div style="font-weight:700;color:var(--text-main);font-size:1.1rem;">72 / 100</div>' +
          '      </div>' +
          '    </div>' +
          '  </div>' +

          '  <div class="sust-gauge-wrap" aria-label="Sustainability Gauge">' +
          '    <svg class="sust-gauge-svg" viewBox="0 0 130 130">' +
          '      <circle class="sust-gauge-bg" cx="65" cy="65" r="52"></circle>' +
          '      <circle class="sust-gauge-value" cx="65" cy="65" r="52" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '"></circle>' +
          '    </svg>' +
          '    <div class="sust-gauge-center">' +
          '      <div class="sust-gauge-score">' + sustData.overallScore + '</div>' +
          '      <div class="sust-gauge-label">' + gaugeLbl + '</div>' +
          '    </div>' +
          '  </div>' +
          '</div>' +

          '<div style="margin-top:1.5rem;padding-top:1.2rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">' +
          '  <button class="btn btn-primary btn-lg" id="ask-mitr-sust-btn" type="button" style="font-weight:800;background:var(--forest-dark);border-color:var(--forest-dark);box-shadow:0 4px 14px rgba(27,67,50,0.3);">' +
          '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
          '    <span>' + askBtnTxt + '</span>' +
          '  </button>' +
          '  <a href="unhealthy-plants.html" class="btn btn-secondary btn-sm" style="font-weight:700;">' + checkCropTxt + '</a>' +
          '</div>';

        var askMitrBtn = document.getElementById("ask-mitr-sust-btn");
        if (askMitrBtn) {
          askMitrBtn.addEventListener("click", function () {
            var q = (l === "gu")
              ? "મારા ખેતરનો સ્કોર ૮૨ થી વધારીને ૯૦+ કેવી રીતે કરવો?"
              : ((l === "hi") ? "मेरे खेत का स्कोर ८२ से बढ़ाकर ९०+ कैसे करें?" : "How can I improve my farm score from 82 to 90+?");
            triggerMitr(q, { crop: "Tomato" });
          });
        }
      }

      // 2. Simple Component Breakdown Stack
      if (componentsMount) {
        var simpleComponents = (l === "gu") ? [
          { title: "💧 પાણી વ્યવસ્થાપન", score: 88, status: "ઉત્તમ", color: "#2D6A4F", desc: "ટપક સિંચાઈ અને વરસાદ પહેલા રાહ જોવાથી ઘણું પાણી બચે છે." },
          { title: "🌱 પાક સંભાળ અને પાંદડાનું સ્વાસ્થ્ય", score: 91, status: "ઉત્તમ", color: "#40916C", desc: "નિયમિત પાંદડા તપાસવાથી રોગ ફેલાતા પહેલા પકડાઈ જાય છે." },
          { title: "🌾 પાક પસંદગી (મગફળી)", score: 82, status: "સારું", color: "#52B788", desc: "ઘઉં પછી મગફળી વાવવાથી જમીનમાં કુદરતી નાઇટ્રોજન પાછું આવે છે." },
          { title: "♻️ જમીન સેન્દ્રિય સ્વાસ્થ્ય", score: 76, status: "સુધારી શકાય", color: "#74C69D", desc: "જમીન સારી સ્થિતિમાં છે. દેશી ખાતર ઉમેરવાથી વધુ ફળદ્રુપ બનશે." },
          { title: "🧪 દવા છંટકાવ સંતુલન", score: 74, status: "સુધારી શકાય", color: "#B26A00", desc: "લીમડા આધારિત જૈવિક સ્પ્રે વાપરવાથી મધમાખીઓ સુરક્ષિત રહે છે અને ખર્ચ ઘટે છે." }
        ] : (l === "hi" ? [
          { title: "💧 जल प्रबंधन", score: 88, status: "उत्कृष्ट", color: "#2D6A4F", desc: "ड्रिप सिंचाई और बारिश से पहले रुकने से काफी पानी बचता है।" },
          { title: "🌱 फसल देखभाल व पर्ण स्वास्थ्य", score: 91, status: "उत्कृष्ट", color: "#40916C", desc: "नियमित पत्तों की जांच से रोग फैलने से पहले पकड़ में आते हैं।" },
          { title: "🌾 फसल चयन (मूंगफली)", score: 82, status: "अच्छा", color: "#52B788", desc: "गेहूं के बाद मूंगफली उगाने से मिट्टी में प्राकृतिक नाइट्रोजन लौटती है।" },
          { title: "♻️ मिट्टी का जैविक स्वास्थ्य", score: 76, status: "सुधार संभव", color: "#74C69D", desc: "मिट्टी अच्छी स्थिति में है। देशी खाद डालने से यह और अधिक उपजाऊ होगी।" },
          { title: "🧪 दवा छिड़काव संतुलन", score: 74, status: "सुधार संभव", color: "#B26A00", desc: "जैविक नीम स्प्रे का उपयोग मधुमक्खियों को सुरक्षित रखता है और लागत घटाता है।" }
        ] : [
          { title: "💧 Water Management", score: 88, status: "Doing Great", color: "#2D6A4F", desc: "Using drip irrigation and waiting before rain saves lots of water." },
          { title: "🌱 Crop Care & Foliar Health", score: 91, status: "Doing Great", color: "#40916C", desc: "Checking leaves regularly catches spots early before they spread." },
          { title: "🌾 Crop Selection (Groundnut)", score: 82, status: "Good", color: "#52B788", desc: "Planning groundnut after wheat naturally puts nitrogen back into the soil." },
          { title: "♻️ Soil Organic Health", score: 76, status: "Can Improve", color: "#74C69D", desc: "Soil is in good shape. Adding farm compost will make it even stronger." },
          { title: "🧪 Spray & Medicine Balance", score: 74, status: "Can Improve", color: "#B26A00", desc: "Using more organic neem or bio-sprays will protect honeybees and reduce medicine costs." }
        ]);

        componentsMount.innerHTML = simpleComponents.map(function (c) {
          return (
            '<div class="card component-item-card" style="margin-bottom:0.75rem;padding:1rem 1.25rem;">' +
            '  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">' +
            '    <div>' +
            '      <strong style="font-size:1.05rem;color:var(--text-main);">' + c.title + '</strong>' +
            '      <span class="badge ' + (c.score >= 80 ? 'badge-success' : 'badge-warning') + '" style="margin-left:0.5rem;font-size:0.7rem;">' + c.status + '</span>' +
            '    </div>' +
            '    <strong style="font-size:1.15rem;color:var(--forest-dark);">' + c.score + ' / 100</strong>' +
            '  </div>' +
            '  <div class="vector-bar" style="height:6px;margin-bottom:0.5rem;">' +
            '    <div class="vector-fill" style="width:' + c.score + '%;background:' + c.color + ';"></div>' +
            '  </div>' +
            '  <p style="font-size:0.85rem;color:var(--text-muted);margin:0;">' + c.desc + '</p>' +
            '</div>'
          );
        }).join("");
      }

      // 3. Improvement Opportunities
      if (improvementsMount) {
        var easyWinTxt = (l === "gu") ? "સરળ રસ્તો" : (l === "hi" ? "आसान उपाय" : "Easy Win");
        var askImpTxt = (l === "gu") ? "🤖 આ વિશે ખેડૂત મિત્રને પૂછો &rarr;" : (l === "hi" ? "🤖 इसके बारे में किसान मित्र से पूछें &rarr;" : "🤖 Ask Khedut Mitr About This &rarr;");

        var simpleImprovements = (l === "gu") ? [
          {
            title: "રાસાયણિક દવાની જગ્યાએ લીમડા આધારિત જૈવિક સ્પ્રે વાપરો",
            gain: "+૮ થી +૧૨ પોઇન્ટ",
            desc: "લીમડાનું તેલ કે ટ્રાઇકોડર્મા વાપરવાથી ટામેટા પર કોઈ ઝેરી રસાયણ રહેતું નથી અને મધમાખીઓ પણ સુરક્ષિત રહે છે.",
            prompt: "મારો સ્કોર સુધારવા લીમડાના તેલ જેવા જૈવિક સ્પ્રે કેવી રીતે વાપરવા?"
          },
          {
            title: "જમીનમાં દેશી ખાતર કે વર્મીકમ્પોસ્ટ ઉમેરો",
            gain: "+૬ થી +૧૦ પોઇન્ટ",
            desc: "સારું કોહવાયેલું ગાયનું છાણિયું ખાતર ઉમેરવાથી ગરમીના દિવસોમાં ગોરાડુ જમીન ભેજ વધુ સમય જાળવી રાખે છે.",
            prompt: "જમીનનું સ્વાસ્થ્ય સુધારવા માટે કેટલું છાણિયું ખાતર કે અળસિયાનું ખાતર ઉમેરવું જોઈએ?"
          },
          {
            title: "ટામેટાના પાક ફરતે સૂકા ઘાસનું મલ્ચિંગ કરો",
            gain: "+૪ થી +૬ પોઇન્ટ",
            desc: "જમીન પર સૂકું ઘાસ પાથરવાથી નીંદણ અટકે છે અને વરસાદમાં નીચેના પાંદડા પર કાદવ ઊડતો નથી.",
            prompt: "ટામેટાના પાકમાં ઘાસનું મલ્ચિંગ કરવાથી પાણી કેવી રીતે બચે છે અને રોગ કેવી રીતે અટકે છે?"
          }
        ] : (l === "hi" ? [
          {
            title: "रसायनों के बजाय नीम बायो-स्प्रे अपनाएं",
            gain: "+८ से +१२ अंक",
            desc: "नीम तेल या ट्राइकोडर्मा के छिड़काव से टमाटर पर शून्य रासायनिक अवशेष रहता है और मधुमक्खियां सुरक्षित रहती हैं।",
            prompt: "अपना स्कोर सुधारने के लिए नीम तेल और बायो-स्प्रे कैसे अपनाएं?"
          },
          {
            title: "मिट्टी में देशी गोबर खाद या वर्मीकम्पोस्ट डालें",
            gain: "+६ से +१० अंक",
            desc: "सड़ी हुई गोबर खाद मिलाने से गर्मी के हफ्तों में दोमट मिट्टी में नमी लंबे समय तक बनी रहती है।",
            prompt: "मिट्टी के स्वास्थ्य सुधार के लिए कितनी गोबर खाद या वर्मीकम्पोस्ट डालनी चाहिए?"
          },
          {
            title: "टमाटर की क्यारियों पर सूखे पुआल की मल्चिंग करें",
            gain: "+४ से +६ अंक",
            desc: "जमीन को सूखे पुआल से ढकने से खरपतवार रुकते हैं और निचले पत्तों पर कीचड़ के छींटे नहीं पड़ते।",
            prompt: "टमाटर की क्यारियों पर मल्चिंग से पानी की बचत और फसल सुरक्षा कैसे होती है?"
          }
        ] : [
          {
            title: "Try Bio-Sprays Instead of Strong Chemicals",
            gain: "+8 to +12 Points",
            desc: "Using Neem oil or Trichoderma spray leaves zero chemical residue on tomatoes and is completely safe for honeybees.",
            prompt: "How do I switch to bio-sprays like Neem oil and Trichoderma to improve my score?"
          },
          {
            title: "Add Farm Compost (Khaad) to Your Soil",
            gain: "+6 to +10 Points",
            desc: "Adding well-rotted cow dung manure or vermicompost helps your loamy soil hold water better during hot weeks.",
            prompt: "How much cow dung manure or vermicompost should I add to improve soil health?"
          },
          {
            title: "Put Dry Straw Mulch on Tomato Rows",
            gain: "+4 to +6 Points",
            desc: "Covering the ground with dry straw stops weeds from growing and prevents mud splash on lower leaves.",
            prompt: "How does straw mulch on tomato rows save water and improve farm health?"
          }
        ]);

        improvementsMount.innerHTML = simpleImprovements.map(function (imp, idx) {
          return (
            '<div class="card recommendation-card" style="padding:1.4rem;display:flex;flex-direction:column;justify-content:space-between;">' +
            '  <div>' +
            '    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">' +
            '      <span class="badge badge-success" style="font-size:0.7rem;font-weight:700;">' + easyWinTxt + '</span>' +
            '      <strong style="font-size:0.9rem;color:var(--leaf);">' + imp.gain + '</strong>' +
            '    </div>' +
            '    <h4 style="margin:0 0 0.4rem;font-size:1.1rem;color:var(--text-main);">' + imp.title + '</h4>' +
            '    <p style="font-size:0.88rem;color:var(--text-muted);margin:0 0 1.2rem;line-height:1.5;">' + imp.desc + '</p>' +
            '  </div>' +
            '  <div>' +
            '    <button class="btn btn-secondary btn-sm imp-ask-btn" data-idx="' + idx + '" type="button" style="width:100%;justify-content:center;font-weight:700;">' +
            '      <span>' + askImpTxt + '</span>' +
            '    </button>' +
            '  </div>' +
            '</div>'
          );
        }).join("");

        var impBtns = improvementsMount.querySelectorAll(".imp-ask-btn");
        impBtns.forEach(function (btn) {
          btn.addEventListener("click", function () {
            var idx = parseInt(btn.getAttribute("data-idx"), 10);
            var item = simpleImprovements[idx];
            if (item) {
              triggerMitr(item.prompt, { crop: "Tomato" });
            }
          });
        });
      }
    }

    renderSustainability();

    // Re-render when language changes
    window.addEventListener("agri:lang", renderSustainability);
  });
})(window);
