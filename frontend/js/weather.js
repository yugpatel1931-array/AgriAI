(function (global) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var heroMount = document.getElementById("weather-hero-mount");
    var forecastMount = document.getElementById("forecast-5day-mount");
    var advisoriesMount = document.getElementById("advisories-mount");

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

    var weatherData = AgriAPI.getWeather();
    var cur = weatherData.current;

    function renderWeather() {
      var l = (window.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : "en";

      // 1. Weather Hero
      if (heroMount) {
        var rainExpBadge = (l === "gu") ? "આજે વરસાદની શક્યતા" : (l === "hi" ? "आज बारिश की संभावना" : "Rain Expected Today");
        var humRainLabel = (l === "gu") ? ("ભેજ: " + cur.humidity + "% &bull; વરસાદની શક્યતા: " + cur.rainProbability + "%") : ((l === "hi") ? ("नमी: " + cur.humidity + "% &bull; बारिश की संभावना: " + cur.rainProbability + "%") : ("Humidity: " + cur.humidity + "% &bull; Rain Chance: " + cur.rainProbability + "%"));
        var whatMeansTitle = (l === "gu") ? "તમારા ખેતર માટે આનો અર્થ શું થાય છે?" : (l === "hi" ? "आपके खेत के लिए इसका क्या अर्थ है?" : "WHAT DOES THIS MEAN FOR YOUR FARM?");
        
        var bullet1 = (l === "gu")
          ? "<li><strong>🌧️ આજે વરસાદની શક્યતા:</strong> આશરે ૨૨mm વરસાદ અપેક્ષિત છે. આજે વોટર પંપ ચલાવવાની જરૂર નથી.</li>"
          : (l === "hi" ? "<li><strong>🌧️ आज बारिश की संभावना:</strong> लगभग २२mm बारिश अपेक्षित है। आज सिंचाई पंप चलाने की आवश्यकता नहीं है।</li>" : "<li><strong>🌧️ Rain likely today:</strong> About 22mm of rain is expected. You do not need to run your water pump today.</li>");
        
        var bullet2 = (l === "gu")
          ? "<li><strong>🎯 દવા છંટકાવ:</strong> આજે છંટકાવ ન કરો જેથી વરસાદમાં દવા ધોવાઈ ન જાય. <strong>આવતીકાલે સવારે (૦૬:૩૦ – ૦૯:૦૦) છંટકાવ માટે શ્રેષ્ઠ સમય છે.</strong></li>"
          : (l === "hi" ? "<li><strong>🎯 दवा छिड़काव:</strong> आज छिड़काव न करें ताकि बारिश में दवा बह न जाए। <strong>कल सुबह (०६:३० – ०९:००) छिड़काव के लिए सर्वोत्तम समय है।</strong></li>" : "<li><strong>🎯 Spraying:</strong> Hold off on spraying today so the rain does not wash away your medicine. <strong>Best time to spray is tomorrow morning (06:30 – 09:00 AM).</strong></li>");

        var bullet3 = (l === "gu")
          ? "<li><strong>🍃 પાંદડાનું સ્વાસ્થ્ય:</strong> વધુ ભેજ (૭૮%) ટામેટાના નીચેના પાંદડા પર ડાઘ ફેલાવવામાં મદદ કરે છે. આજે નીચેના પાંદડા તપાસો.</li>"
          : (l === "hi" ? "<li><strong>🍃 पत्तियों का स्वास्थ्य:</strong> अत्यधिक नमी (७८%) से टमाटर की निचली पत्तियों पर धब्बे फैल सकते हैं। आज निचली पत्तियों की जांच करें।</li>" : "<li><strong>🍃 Leaf health:</strong> High humidity (78%) helps leaf spots spread on lower tomato leaves. Check your lower leaves today.</li>");

        var askBtnTxt = (l === "gu") ? 'ખેડૂત મિત્રને પૂછો: "છંટકાવ ક્યારે કરવો?"' : (l === "hi" ? 'किसान मित्र से पूछें: "छिड़काव कब करें?"' : 'Ask Khedut Mitr: "When should I spray?"');
        var seeWaterTxt = (l === "gu") ? "સિંચાઈ સલાહ જુઓ &rarr;" : (l === "hi" ? "सिंचाई सलाह देखें &rarr;" : "See Water Advice &rarr;");

        heroMount.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.2rem;">' +
          '  <div style="display:flex;align-items:center;gap:0.75rem;">' +
          '    <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:rgba(82,183,136,0.18);display:grid;place-items:center;font-size:1.8rem;">⛈️</div>' +
          '    <div>' +
          '      <div style="display:flex;align-items:center;gap:0.6rem;">' +
          '        <h2 style="font-size:1.5rem;margin:0;color:var(--text-main);">' + AgriApp.escapeHtml(weatherData.location) + '</h2>' +
          '        <span class="badge badge-warning" style="font-size:0.7rem;font-weight:700;">' + rainExpBadge + '</span>' +
          '      </div>' +
          '      <span style="font-size:0.85rem;color:var(--text-muted);">' + AgriApp.escapeHtml(cur.condition) + '</span>' +
          '    </div>' +
          '  </div>' +
          '  <div style="text-align:right;">' +
          '    <div style="font-size:2.2rem;font-weight:800;color:var(--text-main);">' + cur.temp + '°C</div>' +
          '    <div style="font-size:0.8rem;color:var(--text-subtle);">' + humRainLabel + '</div>' +
          '  </div>' +
          '</div>' +

          '<div style="background:var(--bg-sand);padding:1.2rem 1.4rem;border-radius:var(--radius-md);margin-bottom:1.5rem;border-left:4px solid var(--warning);">' +
          '  <h3 style="font-size:0.95rem;text-transform:uppercase;color:var(--forest-dark);margin:0 0 0.6rem;letter-spacing:0.04em;">' + whatMeansTitle + '</h3>' +
          '  <ul style="margin:0;padding-left:1.2rem;font-size:0.95rem;color:var(--text-main);line-height:1.6;">' +
          bullet1 +
          bullet2 +
          bullet3 +
          '  </ul>' +
          '</div>' +

          '<div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">' +
          '  <button class="btn btn-primary btn-lg" id="ask-mitr-weather-btn" style="font-weight:800;">' +
          '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
          '    <span>' + askBtnTxt + '</span>' +
          '  </button>' +
          '  <a href="irrigation.html" class="btn btn-secondary btn-sm" style="font-weight:700;">' + seeWaterTxt + '</a>' +
          '</div>';

        var askMitrBtn = document.getElementById("ask-mitr-weather-btn");
        if (askMitrBtn) {
          askMitrBtn.addEventListener("click", function () {
            var q = (l === "gu")
              ? "આણંદમાં મારા ટામેટાના પાક પર દવા છાંટવાનો શ્રેષ્ઠ સમય કયો છે?"
              : ((l === "hi") ? "आनंद में मेरी टमाटर की फसल पर दवा छिड़कने का सबसे अच्छा समय कौन सा है?" : "When is the best time to spray my tomato crop in Anand?");
            triggerMitr(q, { crop: "Tomato" });
          });
        }
      }

      // 2. 5-Day Forecast Grid
      if (forecastMount && weatherData.forecast5Day) {
        var todayLbl = (l === "gu") ? "આજે" : (l === "hi" ? "आज" : "TODAY");
        var rainSuffix = (l === "gu") ? "% વરસાદ" : (l === "hi" ? "% बारिश" : "% Rain");
        var sprayLbl = (l === "gu") ? "છંટકાવ:" : (l === "hi" ? "छिड़काव:" : "Spray:");
        var waitLbl = (l === "gu") ? "થોભો" : (l === "hi" ? "रुकें" : "Wait");
        var safeLbl = (l === "gu") ? "સુરક્ષિત" : (l === "hi" ? "सुरक्षित" : "Safe");

        forecastMount.innerHTML = weatherData.forecast5Day.map(function (item, idx) {
          var isToday = idx === 0;
          var highlightStyle = isToday ? ' style="border:2px solid var(--leaf);background:var(--bg-surface-elevated);"' : '';
          var todayBadge = isToday ? '<span class="badge badge-success" style="font-size:0.65rem;margin-bottom:0.2rem;">' + todayLbl + '</span>' : '';
          return (
            '<div class="forecast-day-card"' + highlightStyle + '>' +
            todayBadge +
            '  <div style="font-weight:700;font-size:0.95rem;color:var(--text-main);">' + AgriApp.escapeHtml(item.day) + '</div>' +
            '  <div style="font-size:0.75rem;color:var(--text-subtle);margin-bottom:0.4rem;">' + AgriApp.escapeHtml(item.date) + '</div>' +
            '  <div style="font-size:1.8rem;margin-bottom:0.4rem;">' + (item.rainProb >= 60 ? "⛈️" : (item.rainProb >= 30 ? "⛅" : "☀️")) + '</div>' +
            '  <div style="font-weight:800;font-size:1.1rem;color:var(--text-main);">' + item.tempMax + '° / ' + item.tempMin + '°</div>' +
            '  <div style="font-size:0.8rem;color:var(--warning);font-weight:700;margin-top:0.3rem;">' + item.rainProb + rainSuffix + '</div>' +
            '  <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.4rem;padding-top:0.4rem;border-top:1px solid var(--border);">' +
            '    ' + sprayLbl + ' <strong>' + (isToday ? waitLbl : safeLbl) + '</strong>' +
            '  </div>' +
            '</div>'
          );
        }).join("");
      }

      // 3. Actionable Field Advisories
      if (advisoriesMount) {
        var simpleAdvisories = (l === "gu") ? [
          {
            title: "આજે પાણી આપવાનું મુલતવી રાખો",
            badge: "પાણી બચાવો",
            icon: "💧",
            text: "આજે વરસાદની શક્યતા છે (~૨૨mm) અને જમીનમાં પહેલેથી ૩૧% ભેજ છે. રાહ જોવાથી પાણી બચશે અને મૂળ સડતા અટકશે.",
            prompt: "આણંદમાં વરસાદની આગાહીને જોતા શું આજે પાકને પાણી આપવું જોઈએ?"
          },
          {
            title: "આવતીકાલે સવારે છંટકાવ કરો (૦૬:૩૦ – ૦૯:૦૦)",
            badge: "શ્રેષ્ઠ સમય",
            icon: "🎯",
            text: "વહેલી સવારે પવન શાંત હોય છે અને પાંદડા દવા શોષવા તૈયાર હોય છે. બપોરના તડકામાં છંટકાવ ન કરો.",
            prompt: "આણંદમાં મારા ટામેટાના પાક પર દવા છાંટવાનો શ્રેષ્ઠ સમય કયો છે?"
          },
          {
            title: "નીચેના પાંદડા પર ડાઘ તપાસો",
            badge: "પાંદડા સ્વાસ્થ્ય",
            icon: "🍃",
            text: "વધુ ભેજ (૭૮%) ટામેટાના નીચેના પાંદડા પર અર્લી બ્લાઇટના ડાઘ ફેલાવે છે. આજે તમારો પાક તપાસો.",
            prompt: "વધુ ભેજવાળા વાતાવરણમાં ટામેટાના પાંદડાને અર્લી બ્લાઇટથી કેવી રીતે બચાવવા?"
          }
        ] : (l === "hi" ? [
          {
            title: "आज पानी देने से बचें",
            badge: "पानी बचाएं",
            icon: "💧",
            text: "आज बारिश की संभावना है (~२२mm) और मिट्टी में पहले से ३१% नमी है। रुकने से पानी बचेगा और जड़ें सुरक्षित रहेंगी।",
            prompt: "आनंद में बारिश के पूर्वानुमान को देखते हुए क्या आज फसल को पानी देना चाहिए?"
          },
          {
            title: "कल सुबह छिड़काव करें (०६:३० – ०९:००)",
            badge: "सर्वोत्तम समय",
            icon: "🎯",
            text: "सुबह हवा शांत रहती है और पत्तियां दवा सोखने के लिए तैयार होती हैं। दोपहर की धूप में छिड़काव न करें।",
            prompt: "आनंद में टमाटर की फसल पर छिड़काव का सबसे अच्छा समय कौन सा है?"
          },
          {
            title: "निचले पत्तों पर धब्बे जांचें",
            badge: "पत्ती स्वास्थ्य",
            icon: "🍃",
            text: "अत्यधिक नमी (७८%) से टमाटर के निचले पत्तों पर अर्ली ब्लाइट के धब्बे फैलते हैं। आज अपनी फसल जांचें।",
            prompt: "अत्यधिक नमी में टमाटर के पत्तों को अर्ली ब्लाइट से कैसे बचाएं?"
          }
        ] : [
          {
            title: "Hold Off on Watering Today",
            badge: "Save Water",
            icon: "💧",
            text: "Rain is expected today (~22mm) and your soil already has 31% moisture. Waiting saves water and protects roots from rot.",
            prompt: "Should I water my crop today given the rain forecast in Anand?"
          },
          {
            title: "Spray Tomorrow Morning (06:30 – 09:00 AM)",
            badge: "Best Spray Time",
            icon: "🎯",
            text: "Winds are gentle in the early morning and leaves are ready to take in medicine. Do not spray in the afternoon heat.",
            prompt: "When is the best time to spray my tomato crop in Anand?"
          },
          {
            title: "Check Lower Leaves for Spots",
            badge: "Leaf Health",
            icon: "🍃",
            text: "High humidity (78%) helps early blight leaf spots spread on lower tomato leaves. Check your crops today.",
            prompt: "How do I check and protect my tomato leaves from early blight in high humidity?"
          }
        ]);

        var askAdvTxt = (l === "gu") ? "🤖 આ વિશે ખેડૂત મિત્રને પૂછો &rarr;" : (l === "hi" ? "🤖 इसके बारे में किसान मित्र से पूछें &rarr;" : "🤖 Ask Khedut Mitr About This &rarr;");

        advisoriesMount.innerHTML = simpleAdvisories.map(function (adv, idx) {
          return (
            '<div class="card" style="margin-bottom:1rem;padding:1.2rem;">' +
            '  <div style="display:flex;align-items:flex-start;gap:1rem;margin-bottom:0.8rem;">' +
            '    <span style="font-size:1.8rem;flex-shrink:0;">' + adv.icon + '</span>' +
            '    <div style="flex:1;">' +
            '      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.3rem;">' +
            '        <strong style="font-size:1.05rem;color:var(--text-main);">' + adv.title + '</strong>' +
            '        <span class="badge badge-secondary">' + adv.badge + '</span>' +
            '      </div>' +
            '      <p style="font-size:0.88rem;color:var(--text-muted);margin:0;line-height:1.5;">' + adv.text + '</p>' +
            '    </div>' +
            '  </div>' +
            '  <button class="btn btn-secondary btn-sm weather-ask-btn" data-idx="' + idx + '" type="button" style="width:100%;justify-content:center;font-weight:700;">' +
            '    <span>' + askAdvTxt + '</span>' +
            '  </button>' +
            '</div>'
          );
        }).join("");

        var weatherAskBtns = advisoriesMount.querySelectorAll(".weather-ask-btn");
        weatherAskBtns.forEach(function (btn) {
          btn.addEventListener("click", function () {
            var idx = parseInt(btn.getAttribute("data-idx"), 10);
            var item = simpleAdvisories[idx];
            if (item) {
              triggerMitr(item.prompt, { crop: "Tomato" });
            }
          });
        });
      }
    }

    renderWeather();

    // Re-render when language changes
    window.addEventListener("agri:lang", renderWeather);
  });
})(window);
