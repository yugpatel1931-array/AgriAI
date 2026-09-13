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

    // 1. Weather Hero
    if (heroMount) {
      heroMount.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.2rem;">' +
        '  <div style="display:flex;align-items:center;gap:0.75rem;">' +
        '    <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:rgba(82,183,136,0.18);display:grid;place-items:center;font-size:1.8rem;">⛈️</div>' +
        '    <div>' +
        '      <div style="display:flex;align-items:center;gap:0.6rem;">' +
        '        <h2 style="font-size:1.5rem;margin:0;color:var(--text-main);">' + AgriApp.escapeHtml(weatherData.location) + '</h2>' +
        '        <span class="badge badge-warning" style="font-size:0.7rem;font-weight:700;">Rain Expected Today</span>' +
        '      </div>' +
        '      <span style="font-size:0.85rem;color:var(--text-muted);">' + AgriApp.escapeHtml(cur.condition) + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <div style="text-align:right;">' +
        '    <div style="font-size:2.2rem;font-weight:800;color:var(--text-main);">' + cur.temp + '°C</div>' +
        '    <div style="font-size:0.8rem;color:var(--text-subtle);">Humidity: ' + cur.humidity + '% &bull; Rain Chance: ' + cur.rainProbability + '%</div>' +
        '  </div>' +
        '</div>' +

        '<div style="background:var(--bg-sand);padding:1.2rem 1.4rem;border-radius:var(--radius-md);margin-bottom:1.5rem;border-left:4px solid var(--warning);">' +
        '  <h3 style="font-size:0.95rem;text-transform:uppercase;color:var(--forest-dark);margin:0 0 0.6rem;letter-spacing:0.04em;">WHAT DOES THIS MEAN FOR YOUR FARM?</h3>' +
        '  <ul style="margin:0;padding-left:1.2rem;font-size:0.95rem;color:var(--text-main);line-height:1.6;">' +
        '    <li><strong>🌧️ Rain likely today:</strong> About 22mm of rain is expected. You do not need to run your water pump today.</li>' +
        '    <li><strong>🎯 Spraying:</strong> Hold off on spraying today so the rain does not wash away your medicine. <strong>Best time to spray is tomorrow morning (06:30 – 09:00 AM).</strong></li>' +
        '    <li><strong>🍃 Leaf health:</strong> High humidity (78%) helps leaf spots spread on lower tomato leaves. Check your lower leaves today.</li>' +
        '  </ul>' +
        '</div>' +

        '<div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">' +
        '  <button class="btn btn-primary btn-lg" id="ask-mitr-weather-btn" style="font-weight:800;">' +
        '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '    <span>Ask Khedut Mitr: "When should I spray?"</span>' +
        '  </button>' +
        '  <a href="irrigation.html" class="btn btn-secondary btn-sm" style="font-weight:700;">See Water Advice &rarr;</a>' +
        '</div>';

      var askMitrBtn = document.getElementById("ask-mitr-weather-btn");
      if (askMitrBtn) {
        askMitrBtn.addEventListener("click", function () {
          triggerMitr("When is the best time to spray my tomato crop in Anand?", { crop: "Tomato" });
        });
      }
    }

    // 2. 5-Day Forecast Grid
    if (forecastMount && weatherData.forecast5Day) {
      forecastMount.innerHTML = weatherData.forecast5Day.map(function (item, idx) {
        var isToday = idx === 0;
        var highlightStyle = isToday ? ' style="border:2px solid var(--leaf);background:var(--bg-surface-elevated);"' : '';
        var todayBadge = isToday ? '<span class="badge badge-success" style="font-size:0.65rem;margin-bottom:0.2rem;">TODAY</span>' : '';
        return (
          '<div class="forecast-day-card"' + highlightStyle + '>' +
          todayBadge +
          '  <div style="font-weight:700;font-size:0.95rem;color:var(--text-main);">' + AgriApp.escapeHtml(item.day) + '</div>' +
          '  <div style="font-size:0.75rem;color:var(--text-subtle);margin-bottom:0.4rem;">' + AgriApp.escapeHtml(item.date) + '</div>' +
          '  <div style="font-size:1.8rem;margin-bottom:0.4rem;">' + (item.rainProb >= 60 ? "⛈️" : (item.rainProb >= 30 ? "⛅" : "☀️")) + '</div>' +
          '  <div style="font-weight:800;font-size:1.1rem;color:var(--text-main);">' + item.tempMax + '° / ' + item.tempMin + '°</div>' +
          '  <div style="font-size:0.8rem;color:var(--warning);font-weight:700;margin-top:0.3rem;">' + item.rainProb + '% Rain</div>' +
          '  <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.4rem;padding-top:0.4rem;border-top:1px solid var(--border);">' +
          '    Spray: <strong>' + (isToday ? "Wait" : "Safe") + '</strong>' +
          '  </div>' +
          '</div>'
        );
      }).join("");
    }

    // 3. Actionable Field Advisories with Direct Ask Khedut Mitr Buttons
    if (advisoriesMount) {
      var simpleAdvisories = [
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
      ];

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
          '    <span>🤖 Ask Khedut Mitr About This &rarr;</span>' +
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
  });
})(window);
