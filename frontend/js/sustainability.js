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

    // 1. Sustainability Hero Gauge
    if (heroMount) {
      var circumference = 2 * Math.PI * 52; // ~326.7
      var offset = circumference - (sustData.overallScore / 100) * circumference;

      heroMount.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:2rem;">' +
        '  <div>' +
        '    <span class="badge badge-success" style="font-weight:800;font-size:0.75rem;margin-bottom:0.4rem;">FARM HEALTH SCORE</span>' +
        '    <h2 style="font-size:1.9rem;margin:0 0 0.4rem;color:var(--text-main);">Your Farm Is Doing Well!</h2>' +
        '    <p style="font-size:0.95rem;color:var(--text-muted);max-width:45ch;margin:0 0 1.2rem;line-height:1.5;">' +
        '      Your farm in <strong>' + AgriApp.escapeHtml(sustData.farmProfile.location) + '</strong> scores <strong>82 out of 100</strong>, which is <strong>14% better</strong> than average farms in your district.' +
        '    </p>' +
        '    <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">' +
        '      <div>' +
        '        <span style="font-size:0.75rem;color:var(--text-subtle);text-transform:uppercase;font-weight:600;">Rating</span>' +
        '        <div style="font-weight:700;color:var(--leaf);font-size:1.1rem;">Good Farm Health</div>' +
        '      </div>' +
        '      <div>' +
        '        <span style="font-size:0.75rem;color:var(--text-subtle);text-transform:uppercase;font-weight:600;">District Average</span>' +
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
        '      <div class="sust-gauge-label">OUT OF 100</div>' +
        '    </div>' +
        '  </div>' +
        '</div>' +

        '<div style="margin-top:1.5rem;padding-top:1.2rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">' +
        '  <button class="btn btn-primary btn-lg" id="ask-mitr-sust-btn" type="button" style="font-weight:800;background:var(--forest-dark);border-color:var(--forest-dark);box-shadow:0 4px 14px rgba(27,67,50,0.3);">' +
        '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '    <span>Ask Khedut Mitr: "How can I improve my score to 90+?"</span>' +
        '  </button>' +
        '  <a href="unhealthy-plants.html" class="btn btn-secondary btn-sm" style="font-weight:700;">Check Crops Needing Attention &rarr;</a>' +
        '</div>';

      var askMitrBtn = document.getElementById("ask-mitr-sust-btn");
      if (askMitrBtn) {
        askMitrBtn.addEventListener("click", function () {
          triggerMitr("How can I improve my farm score from 82 to 90+?", { crop: "Tomato" });
        });
      }
    }

    // 2. Simple Component Breakdown Stack
    if (componentsMount) {
      var simpleComponents = [
        { title: "💧 Water Management", score: 88, status: "Doing Great", color: "#2D6A4F", desc: "Using drip irrigation and waiting before rain saves lots of water." },
        { title: "🌱 Crop Care & Foliar Health", score: 91, status: "Doing Great", color: "#40916C", desc: "Checking leaves regularly catches spots early before they spread." },
        { title: "🌾 Crop Selection (Groundnut)", score: 82, status: "Good", color: "#52B788", desc: "Planning groundnut after wheat naturally puts nitrogen back into the soil." },
        { title: "♻️ Soil Organic Health", score: 76, status: "Can Improve", color: "#74C69D", desc: "Soil is in good shape. Adding farm compost will make it even stronger." },
        { title: "🧪 Spray & Medicine Balance", score: 74, status: "Can Improve", color: "#B26A00", desc: "Using more organic neem or bio-sprays will protect honeybees and reduce medicine costs." }
      ];

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

    // 3. Improvement Opportunities with Direct Ask Khedut Mitr Integration
    if (improvementsMount) {
      var simpleImprovements = [
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
      ];

      improvementsMount.innerHTML = simpleImprovements.map(function (imp, idx) {
        return (
          '<div class="card recommendation-card" style="padding:1.4rem;display:flex;flex-direction:column;justify-content:space-between;">' +
          '  <div>' +
          '    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">' +
          '      <span class="badge badge-success" style="font-size:0.7rem;font-weight:700;">Easy Win</span>' +
          '      <strong style="font-size:0.9rem;color:var(--leaf);">' + imp.gain + '</strong>' +
          '    </div>' +
          '    <h4 style="margin:0 0 0.4rem;font-size:1.1rem;color:var(--text-main);">' + imp.title + '</h4>' +
          '    <p style="font-size:0.88rem;color:var(--text-muted);margin:0 0 1.2rem;line-height:1.5;">' + imp.desc + '</p>' +
          '  </div>' +
          '  <div>' +
          '    <button class="btn btn-secondary btn-sm imp-ask-btn" data-idx="' + idx + '" type="button" style="width:100%;justify-content:center;font-weight:700;">' +
          '      <span>🤖 Ask Khedut Mitr About This &rarr;</span>' +
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
  });
})(window);
