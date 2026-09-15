(function (global) {
  "use strict";

  var NAV_ITEMS = [
    {
      href: "dashboard.html",
      label: "Home",
      key: "dashboard",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
    },
    {
      href: "scan.html",
      label: "Check Crop",
      key: "scan",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'
    },
    {
      href: "unhealthy-plants.html",
      label: "Crops Need Attention",
      key: "unhealthy-plants",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    },
    {
      href: "crop-recommendation.html",
      label: "Choose Crop",
      key: "crop-recommendation",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c0-4.4 3.6-8 8-8v-1c-5 0-9 4-9 9"/><path d="M14 20c0-6.6-5.4-12-12-12v1c5.5 0 10 4.5 10 10"/><circle cx="12" cy="5" r="2"/></svg>'
    },
    {
      href: "irrigation.html",
      label: "Water",
      key: "irrigation",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>'
    },
    {
      href: "weather.html",
      label: "Weather",
      key: "weather",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>'
    },
    {
      href: "sustainability.html",
      label: "Farm Score",
      key: "sustainability",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>'
    },
    {
      href: "result.html",
      label: "Crop PDF Report",
      key: "result",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    },
    {
      href: "history.html",
      label: "My History",
      key: "history",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    },
    {
      href: "settings.html",
      label: "Settings",
      key: "settings",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    }
  ];

  var AUTH_KEY = "agrismart_auth_session";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function currentPage() {
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!file || file === "") return "index.html";
    return file;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  }

  function getAuth() {
    try {
      var raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setAuth(auth) {
    try {
      if (!auth) {
        localStorage.removeItem(AUTH_KEY);
      } else {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function isSignedIn() {
    var auth = getAuth();
    return Boolean(auth && auth.signedIn);
  }

  function brandLogo() {
    return '<img class="brand-logo" src="assets/images/vasudha-mark.jpeg" width="36" height="36" alt="VASUDHA logo" loading="eager">';
  }

  function renderHeader() {
    var mount = $("#site-header");
    if (!mount) return;
    var page = currentPage();
    var isLanding = (page === "index.html" || page === "");

    if (isLanding) {
      document.body.classList.remove("has-sidebar");
      renderLandingHeader(mount);
    } else {
      document.body.classList.add("has-sidebar");
      renderAppShellHeader(mount, page);
    }
  }

  function renderLandingHeader(mount) {
    var auth = getAuth();
    var authHtml = (auth && auth.signedIn)
      ? '<a class="btn btn-secondary" href="dashboard.html" title="Go to Dashboard" style="border:1.5px solid var(--leaf);font-weight:700;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.3rem;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>Hi, ' + escapeHtml(auth.name || "Farmer") + ' &rarr;</span></a>'
      : '<a class="btn btn-secondary" href="login.html" style="font-weight:700;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.3rem;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>Login / Sign Up</span></a>';

    mount.innerHTML =
      '<header class="landing-header">' +
      '<div class="container landing-nav">' +
      '<a class="landing-brand" href="index.html">' + brandLogo() + '<span><strong>VASUDHA</strong></span></a>' +
      '<ul class="landing-links" id="landing-nav-links">' +
      '<li><a href="index.html" class="active">Home</a></li>' +
      '<li><a href="#features">Features</a></li>' +
      '<li><a href="#how-it-works">How It Works</a></li>' +
      '<li><a href="dashboard.html">My Farm</a></li>' +
      '<li><a href="scan.html">Check Crop</a></li>' +
      '</ul>' +
      '<div class="landing-cta">' +
      authHtml +
      '<a class="btn btn-primary" href="scan.html">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>' +
      '<span>Scan Crop</span>' +
      '</a>' +
      '</div>' +
      '</div>' +
      '</header>';
  }

  function renderAppShellHeader(mount, page) {
    var settings = global.AgriAPI ? AgriAPI.getSettings() : { farmerName: "Farmer", theme: "light" };
    var auth = getAuth();
    var farmerName = (auth && auth.name) || settings.farmerName || "Farmer";
    var farmName = (auth && auth.farmName) || settings.farmName || "Greenfield Farm";

    var navLinks = NAV_ITEMS.map(function (item) {
      var isActive = page === item.href;
      return (
        '<a href="' + item.href + '" class="sidebar-link' + (isActive ? ' active' : '') + '">' +
        item.icon +
        '<span>' + item.label + '</span>' +
        '</a>'
      );
    }).join("");

    var isUserSignedIn = isSignedIn();
    var topbarAuthHtml = isUserSignedIn
      ? '<a href="settings.html" class="topbar-auth-pill" title="Signed in as ' + escapeHtml(farmerName) + '"><div class="farmer-avatar-sm">' + escapeHtml(farmerName.charAt(0).toUpperCase()) + '</div><span>' + escapeHtml(farmerName) + '</span></a>'
      : '<a href="login.html" class="btn btn-sm btn-secondary topbar-login-pill" title="Login or Register"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>Login / Sign Up</span></a>';

    mount.innerHTML =
      '<div class="sidebar-backdrop" id="sidebar-backdrop"></div>' +
      '<aside class="app-sidebar" id="app-sidebar">' +
      '  <div class="sidebar-header">' +
      '    <a class="sidebar-brand" href="index.html" title="VASUDHA — Earth / ધરતી">' +
      '      ' + brandLogo() +
      '      <span class="sidebar-brand-copy"><strong>VASUDHA</strong><small>Earth • ધરતી</small><em>Rooted in Earth.</em></span>' +
      '      <span class="sidebar-brand-badge">AI 2.0</span>' +
      '    </a>' +
      '  </div>' +
      '  <nav class="sidebar-nav">' +
      navLinks +
      '  </nav>' +
      '  <div class="sidebar-footer">' +
      '    <a href="settings.html" class="farmer-chip">' +
      '      <div class="farmer-avatar">' + escapeHtml(farmerName.charAt(0).toUpperCase()) + '</div>' +
      '      <div class="farmer-details">' +
      '        <div class="farmer-name">' + escapeHtml(farmerName) + '</div>' +
      '        <div class="farmer-role">' + (isUserSignedIn ? escapeHtml(farmName) : 'Guest Mode &bull; Click to Sign In') + '</div>' +
      '      </div>' +
      '    </a>' +
      '  </div>' +
      '</aside>' +
      '<header class="app-topbar" id="app-topbar">' +
      '  <div class="topbar-left">' +
      '    <button class="sidebar-toggle-btn" id="sidebar-toggle" aria-label="Toggle Navigation">' +
      '      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
      '    </button>' +
      '    <div class="topbar-search">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '      <input type="search" id="topbar-search-input" placeholder="Search crop scans, diseases, treatments...">' +
      '    </div>' +
      '  </div>' +
      '  <div class="topbar-right">' +
      '    <div class="topbar-lang-wrap" title="Change Language / ભાષા બદલો">' +
      '      <span style="font-size:0.9rem;margin-right:0.2rem;">🌐</span>' +
      '      <select id="app-lang-select" class="topbar-lang-select" aria-label="Language">' +
      '        <option value="en">English</option>' +
      '        <option value="gu">ગુજરાતી</option>' +
      '        <option value="hi">हिन्दी</option>' +
      '      </select>' +
      '    </div>' +
      '    <a href="index.html" class="topbar-btn" title="Back to Public Landing Page" aria-label="Landing Page">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' +
      '    </a>' +
      '    <div class="model-status-pill">' +
      '      <span class="pulse-dot"></span>' +
      '      <span>AI Helper Online</span>' +
      '    </div>' +
      '    <button class="topbar-btn" id="btn-notifications" aria-label="Notifications" title="Field Alerts">' +
      '      <span class="unread-dot"></span>' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
      '    </button>' +
      '    <button class="topbar-btn" id="btn-theme-toggle" aria-label="Toggle Theme" title="Toggle Theme">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
      '    </button>' +
      '    ' + topbarAuthHtml +
      '  </div>' +
      '</header>';

    setupShellInteractions();
  }

  function setupShellInteractions() {
    var toggleBtn = $("#sidebar-toggle");
    var sidebar = $("#app-sidebar");
    var backdrop = $("#sidebar-backdrop");
    var notifBtn = $("#btn-notifications");
    var themeBtn = $("#btn-theme-toggle");
    var searchInput = $("#topbar-search-input");
    var langSelect = $("#app-lang-select");

    if (langSelect) {
      try {
        var savedLang = localStorage.getItem("agrismart_lang") || "en";
        langSelect.value = savedLang;
        langSelect.addEventListener("change", function () {
          var lang = langSelect.value;
          applyLanguage(lang, true);
        });
      } catch (e) {}
    }

    if (toggleBtn && sidebar && backdrop) {
      toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("is-open");
        backdrop.classList.toggle("is-open");
      });
      backdrop.addEventListener("click", function () {
        sidebar.classList.remove("is-open");
        backdrop.classList.remove("is-open");
      });
    }

    if (notifBtn) {
      notifBtn.addEventListener("click", function () {
        toast("Advisory: Humidity elevated (82%). Watch Solanaceae crops for blight spores.");
      });
    }

    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme") || "light";
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        if (global.AgriAPI) {
          AgriAPI.saveSettings({ theme: next });
        }
        toast("Switched to " + next + " mode");
      });
    }

    if (searchInput) {
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var val = searchInput.value.trim();
          if (val) {
            location.href = "history.html?q=" + encodeURIComponent(val);
          }
        }
      });
    }
  }

  function renderFooter() {
    var mount = $("#site-footer");
    if (!mount) return;
    var page = currentPage();
    var isLanding = (page === "index.html" || page === "");

    if (isLanding) {
      mount.innerHTML =
        '<footer class="site-footer">' +
        '  <div class="container">' +
        '    <div class="footer-grid">' +
        '      <div>' +
        '        <div class="landing-brand" style="margin-bottom:0.8rem">' + brandLogo() + '<span><strong>VASUDHA</strong></span></div>' +
        '        <p>VASUDHA means <strong>Earth / ધરતી</strong> — simple AI-powered crop health help made for Indian farmers.</p>' +
        '        <p style="margin-top:0.6rem;font-weight:800;">Rooted in Earth. Powered by Intelligence.</p>' +
        '        <p style="margin-top:0.5rem;font-size:0.82rem;color:var(--text-subtle);">Smart India Hackathon 2026 demonstration.</p>' +
        '      </div>' +
        '      <div>' +
        '        <h4 style="margin-bottom:0.8rem">Farmer Tools</h4>' +
        '        <div class="footer-links">' +
        '          <a href="scan.html">Check Crop</a>' +
        '          <a href="dashboard.html">My Farm</a>' +
        '          <a href="history.html">Crop Check History</a>' +
        '          <a href="insights.html">Crop Health Insights</a>' +
        '        </div>' +
        '      </div>' +
        '      <div>' +
        '        <h4 style="margin-bottom:0.8rem">Help & Settings</h4>' +
        '        <div class="footer-links">' +
        '          <a href="settings.html">My Farm Settings</a>' +
        '          <a href="login.html">Farmer Sign In</a>' +
        '          <a href="https://icar.org.in/" target="_blank" rel="noopener">ICAR Guidelines</a>' +
        '          <a href="#how-it-works">How the crop check works</a>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '    <div class="footer-identity">' +
        '      <img src="assets/images/vasudha-logo.jpeg" alt="VASUDHA logo" loading="lazy">' +
        '      <div><strong>VASUDHA</strong> means <strong>Earth / ધરતી</strong>.<br><span>Rooted in Earth. Powered by Intelligence.</span></div>' +
        '    </div>' +
        '    <div class="copyright">' +
        '      <span>&copy; ' + new Date().getFullYear() + ' <strong>VASUDHA</strong> &bull; Farmer-first crop care</span>' +
        '      <span><strong>Made by Team Apex</strong> &bull; Smart India Hackathon 2026</span>' +
        '    </div>' +
        '  </div>' +
        '</footer>';
    } else {
      mount.innerHTML =
        '<footer style="margin-top:auto;padding:1.2rem 0;border-top:1px solid var(--border);font-size:0.84rem;color:var(--text-subtle);display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.8rem;">' +
        '  <span><strong>VASUDHA</strong> &bull; Rooted in Earth. Powered by Intelligence.</span>' +
        '  <span><strong>Made by Team Apex</strong> &bull; Smart India Hackathon 2026</span>' +
        '</footer>';
    }
  }

  function showAuthModal(onSuccess) {
    var existing = $(".modal-backdrop");
    if (existing) existing.remove();

    var backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.id = "auth-save-modal";
    backdrop.innerHTML =
      '<div class="modal-card" role="dialog" aria-modal="true">' +
      '  <button class="modal-close" id="modal-close-btn" aria-label="Close dialog">' +
      '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '  </button>' +
      '  <div style="text-align:center;margin-bottom:1.4rem">' +
      '    <div style="margin:0 auto 0.6rem;width:44px;height:44px;border-radius:50%;background:var(--sage);color:var(--forest-dark);display:grid;place-items:center;">' +
      '      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
      '    </div>' +
      '    <h3 style="margin-bottom:0.3rem">Save Scan to Your Farm</h3>' +
      '    <p style="font-size:0.88rem;color:var(--text-muted)">Create your free farmer profile or sign in to track this crop condition over time.</p>' +
      '  </div>' +
      '  <button class="auth-btn-google" id="modal-google-btn">' +
      '    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>' +
      '    <span>Continue with Google</span>' +
      '  </button>' +
      '  <div class="auth-divider"><span>or with demo account</span></div>' +
      '  <button class="btn btn-primary" id="modal-demo-btn" style="width:100%;margin-bottom:0.8rem">' +
      '    <span>Sign In as Ramesh Patel (Demo Farmer)</span>' +
      '  </button>' +
      '  <div style="text-align:center">' +
      '    <a href="login.html" style="font-size:0.85rem;color:var(--forest-mid);font-weight:600">Enter custom email & password &rarr;</a>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(backdrop);

    var closeBtn = backdrop.querySelector("#modal-close-btn");
    var googleBtn = backdrop.querySelector("#modal-google-btn");
    var demoBtn = backdrop.querySelector("#modal-demo-btn");

    function finishAuth(name, email) {
      setAuth({
        signedIn: true,
        name: name,
        email: email,
        farmName: "Greenfield Farm"
      });
      backdrop.remove();
      toast("Welcome, " + name + "! Result saved to your farm.");
      renderHeader();
      if (typeof onSuccess === "function") onSuccess();
    }

    closeBtn.addEventListener("click", function () { backdrop.remove(); });
    backdrop.addEventListener("click", function (e) { if (e.target === backdrop) backdrop.remove(); });

    googleBtn.addEventListener("click", function () {
      finishAuth("Ramesh Patel (Google)", "ramesh.farmer@gmail.com");
    });

    demoBtn.addEventListener("click", function () {
      finishAuth("Ramesh Patel", "ramesh@agrismart.ai");
    });
  }

  function greeting() {
    var hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  function relativeTime(iso) {
    var then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "Unknown date";
    var diff = Date.now() - then;
    var mins = Math.round(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + "m ago";
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours + "h ago";
    var days = Math.round(hours / 24);
    return days + "d ago";
  }

  function formatDate(iso) {
    var date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatReportId(id, crop, date) {
    if (!id && !crop) return "AGRI-GJ-2026-08421";
    var raw = String(id || "").trim().replace(/^#+/, "");
    if (/^AGRI-[A-Z0-9-]+$/i.test(raw) && !/SCAN/i.test(raw)) {
      return raw.toUpperCase();
    }
    var year = "2026";
    if (date) {
      var d = new Date(date);
      if (!Number.isNaN(d.getTime())) year = String(d.getFullYear());
    }
    var cropStr = (crop || "").toLowerCase();
    var hash = 0;
    for (var i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    var num = String(Math.abs(hash) % 90000 + 10000);
    return "AGRI-GJ-" + year + "-" + num;
  }

  function confidenceLabel(value) {
    var pct = value <= 1 ? Math.round(value * 100) : Math.round(value);
    return pct + "%";
  }

  function riskClass(risk) {
    var key = String(risk || "").toLowerCase();
    if (key === "low" || key === "healthy") return "badge badge-low badge-healthy";
    if (key === "high") return "badge badge-high badge-danger";
    return "badge badge-moderate badge-warning";
  }

  function toast(message) {
    var existing = $(".toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>' +
      '<span>' + escapeHtml(message) + '</span>';
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 3200);
  }

  function queryParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }


  var TRANSLATIONS = {
    en: {
      nav: {
        dashboard: "Home",
        scan: "Check Crop",
        "unhealthy-plants": "Crops Need Attention",
        "crop-recommendation": "Choose Crop",
        irrigation: "Water",
        weather: "Weather",
        sustainability: "Farm Score",
        result: "Crop PDF Report",
        history: "My History",
        settings: "Settings"
      },
      topbar: {
        loginSignUp: "Login / Sign Up",
        aiOnline: "AI Helper Online"
      },
      sidebar: {
        farmer: "Farmer",
        guestRole: "Guest Mode • Click to Sign In"
      },
      common: {
        searchPlaceholder: "Search crop scans, diseases, treatments...",
        aiHelperOnline: "AI Helper Online",
        checkNow: "CHECK NOW",
        backToHome: "Back to Home",
        seeAdvice: "🔍 See Advice",
        askMitr: "🤖 Ask Khedut Mitr",
        close: "Close"
      },
      dashboard: {
        greeting: "Good morning, Farmer! 👋",
        lead: "Here's what needs your attention today on your farm in Anand, Gujarat.",
        attentionTitle: "3 Crops Need Your Attention",
        attentionSub: "Tomato, Potato, and Chilli showed signs of leaf spots in recent scans. Tap anywhere to check.",
        attentionBtn: "Check Crops Now →",
        farmHealthTitle: "How Is Your Farm Doing?",
        farmHealthSummary: "Most of your crops look healthy. 3 crops showed leaf spots and need your attention.",
        healthyCrops: "Healthy Crops",
        needAttention: "Need Attention",
        farmHealthLabel: "FARM HEALTH",
        quickFieldAction: "Quick Field Action",
        checkYourCrop: "Check Your Crop",
        checkCropDesc: "Notice spots, curling, or leaf yellowing? Take a photo with your camera for simple advice on what to do.",
        checkCropBtn: "Check Crop Now →",
        kpiTotalScans: "Total Crops Checked",
        kpiHealthy: "Healthy Crops",
        kpiAttention: "Crops Need Attention",
        kpiMonitored: "Crops Monitored",
        whatShouldDoTitle: "What Should I Do Today?",
        whatShouldDoSub: "Clear advice for your farm in Anand, Gujarat.",
        waterAdviceTitle: "WATER ADVICE",
        waterAdviceStatus: "Wait Before Watering",
        waterAdviceDesc: "Rain is expected today (78% chance) and your soil already has plenty of moisture. Waiting saves water and protects roots.",
        waterAdviceBtn: "See Water Advice →",
        weatherTitle: "TODAY'S WEATHER",
        weatherStatus: "30°C • Rain Likely",
        weatherDesc: "Hold off on spraying today so rain doesn't wash it away. Best time to spray is tomorrow morning (06:30 – 09:00 AM).",
        weatherBtn: "See Weather Advice →",
        cropChoiceTitle: "NEXT CROP CHOICE",
        cropChoiceStatus: "Groundnut After Wheat",
        cropChoiceDesc: "Restores natural nitrogen to your soil depleted by wheat. High suitability (94%) for loamy soil in Anand.",
        cropChoiceBtn: "See Best Seeds →",
        sustainabilityTitle: "YOUR FARM SCORE",
        sustainabilityStatus: "82 / 100 • Good",
        sustainabilityDesc: "Your farm practices are 14% more sustainable than regional baseline. Switch to bio-spray to reach 90+.",
        sustainabilityBtn: "See Improvement Tips →"
      },
      unhealthy: {
        eyebrow: "Attention Needed",
        pageTitle: "⚠️ Crops That Need Attention",
        pageLead: "These crops showed signs of leaf disease during recent scans. Tap any plant to see what it means and what to do.",
        backBtn: "Back to Home",
        seeAdvice: "🔍 See Advice",
        pdfSlip: "📄 PDF Slip",
        askMitr: "🤖 Ask Khedut Mitr",
        modalWhatMeans: "WHAT THIS MEANS",
        modalWhatToDo: "WHAT SHOULD YOU DO?",
        modalAskBtn: 'Ask Khedut Mitr: "What should I do?"',
        modalPdfBtn: "📄 View & Download PDF Slip",
        viewScan: "View full technical scan details →"
      },
      cropRec: {
        eyebrow: "Choose Next Crop",
        pageTitle: "Which Crop Is Right for Your Farm? 🌱",
        pageLead: "Pick the best crop to grow next based on your soil, water, and what you planted before.",
        profileTitle: "Tell Us About Your Field",
        profileLead: "Pre-filled with your farm in Anand, Gujarat. Change anything if needed.",
        resetBtn: "Reset to Anand Farm",
        lblLocation: "Where is your farm?",
        lblSoilType: "What is your soil type?",
        lblSoilPh: "Soil pH: ",
        lblSoilPhDesc: "ⓘ pH 6.5 means your soil has the ideal balance for seeds.",
        lblPrevCrop: "What crop did you grow before?",
        lblWaterAvail: "How much water do you have?",
        lblSeason: "Upcoming Season",
        btnAnalyze: "See Best Crops For My Farm →",
        btnCompare: "Compare Top 3 Crops",
        loadingTitle: "Finding the best crops for your farm...",
        loadingSub: "Looking at soil, rainfall, and what you grew before.",
        compareTitle: "Compare Top Crops",
        compareLead: "Side-by-side comparison of your best options"
      },
      irrigation: {
        eyebrow: "Water Advice",
        pageTitle: "Should I Water Today? 💧",
        pageLead: "Simple advice for your crops in Anand, Gujarat. Save water and protect your plant roots.",
        simTitle: "🔬 Test Different Soil & Weather Conditions",
        simReset: "Reset to Farm Actuals"
      },
      weather: {
        eyebrow: "Weather Advice",
        pageTitle: "Today's Weather & Farm Advice 🌦️",
        pageLead: "Hour-by-hour forecast and spraying advice for your farm in Anand, Gujarat."
      },
      sustainability: {
        eyebrow: "Farm Health Score",
        pageTitle: "How Sustainable Is Your Farm? 🌍",
        pageLead: "See your overall farm score, water efficiency, and soil health with simple improvement steps."
      },
      history: {
        eyebrow: "Field Log",
        pageTitle: "Your Field History 📜",
        pageLead: "Review past crop scans, disease findings, and care logs for your farm."
      }
    },
    gu: {
      nav: {
        dashboard: "મુખ્ય પૃષ્ઠ",
        scan: "પાક તપાસો",
        "unhealthy-plants": "ધ્યાન માંગતા પાક",
        "crop-recommendation": "પાક પસંદગી",
        irrigation: "સિંચાઈ સલાહ",
        weather: "હવામાન સલાહ",
        sustainability: "ખેતર સ્કોર",
        result: "પાક PDF રિપોર્ટ",
        history: "ઇતિહાસ",
        settings: "સેટિંગ્સ"
      },
      topbar: {
        loginSignUp: "પ્રવેશ કરો / સાઇન અપ",
        aiOnline: "AI સહાયક ઓનલાઇન"
      },
      sidebar: {
        farmer: "ખેડૂત",
        guestRole: "ગેસ્ટ મોડ • સાઇન ઇન કરવા ક્લિક કરો"
      },
      common: {
        searchPlaceholder: "પાક રોગ, સારવાર, માહિતી શોધો...",
        aiHelperOnline: "AI સહાયક ઓનલાઇન",
        checkNow: "તપાસો",
        backToHome: "મુખ્ય પૃષ્ઠ પર પાછા જાઓ",
        seeAdvice: "🔍 સલાહ જુઓ",
        askMitr: "🤖 ખેડૂત મિત્રને પૂછો",
        close: "બંધ કરો"
      },
      dashboard: {
        greeting: "સુપ્રભાત, ખેડૂત મિત્ર! 👋",
        lead: "આણંદ, ગુજરાતમાં તમારા ખેતર માટે આજની મહત્વપૂર્ણ માહિતી.",
        attentionTitle: "૩ પાક પર તમારું ધ્યાન જરૂરી છે",
        attentionSub: "ટામેટા, બટાકા અને મરચીમાં પાંદડા પર ડાઘ દેખાયા છે. તપાસવા માટે અહીં ક્લિક કરો.",
        attentionBtn: "પાક અત્યારે તપાસો →",
        farmHealthTitle: "તમારું ખેતર કેવું છે?",
        farmHealthSummary: "તમારા મોટાભાગના પાક તંદુરસ્ત છે. ૩ પાક પર ડાઘ દેખાયા છે અને ધ્યાન આપવાની જરૂર છે.",
        healthyCrops: "તંદુરસ્ત પાક",
        needAttention: "ધ્યાન જરૂરી",
        farmHealthLabel: "ખેતર સ્વાસ્થ્ય",
        quickFieldAction: "ઝડપી ખેતર તપાસ",
        checkYourCrop: "તમારો પાક તપાસો",
        checkCropDesc: "પાંદડા પર ડાઘ કે પીળાશ દેખાય છે? સરળ સલાહ મેળવવા માટે કેમેરાથી ફોટો લો.",
        checkCropBtn: "પાક હમણાં તપાસો →",
        kpiTotalScans: "કુલ તપાસેલા પાક",
        kpiHealthy: "તંદુરસ્ત પાક",
        kpiAttention: "ધ્યાન માંગતા પાક",
        kpiMonitored: "દેખરેખ હેઠળના પાક",
        whatShouldDoTitle: "આજે મારે શું કરવું જોઈએ?",
        whatShouldDoSub: "આણંદ, ગુજરાતમાં તમારા ખેતર માટે સ્પષ્ટ સલાહ.",
        waterAdviceTitle: "સિંચાઈ સલાહ",
        waterAdviceStatus: "પાણી આપતા પહેલા થોભો",
        waterAdviceDesc: "આજે વરસાદની ૭૮% શક્યતા છે અને જમીનમાં પૂરતો ભેજ છે. રાહ જોવાથી પાણી બચશે અને મૂળ સુરક્ષિત રહેશે.",
        waterAdviceBtn: "સિંચાઈ સલાહ જુઓ →",
        weatherTitle: "આજનું હવામાન",
        weatherStatus: "૩૦°C • વરસાદની શક્યતા",
        weatherDesc: "આજે છંટકાવ ન કરો જેથી વરસાદથી ધોવાઈ ન જાય. આવતીકાલે સવારે (૦૬:૩૦ - ૦૯:૦૦) છંટકાવ કરવો શ્રેષ્ઠ રહેશે.",
        weatherBtn: "હવામાન સલાહ જુઓ →",
        cropChoiceTitle: "આગામી પાક પસંદગી",
        cropChoiceStatus: "ઘઉં પછી મગફળી",
        cropChoiceDesc: "ઘઉંથી ઘટેલું કુદરતી નાઇટ્રોજન જમીનમાં પાછું લાવે છે. આણંદની ગોરાડુ જમીન માટે ૯૪% અનુકૂળ.",
        cropChoiceBtn: "શ્રેષ્ઠ બિયારણ જુઓ →",
        sustainabilityTitle: "તમારા ખેતરનો સ્કોર",
        sustainabilityStatus: "૮૨ / ૧૦૦ • ઉત્તમ",
        sustainabilityDesc: "તમારી ખેતી પદ્ધતિઓ પ્રાદેશિક સરેરાશ કરતાં ૧૪% વધુ ટકાઉ છે. ૯૦+ સુધી પહોંચવા જૈવિક સ્પ્રે વાપરો.",
        sustainabilityBtn: "સુધારાની સલાહ જુઓ →"
      },
      unhealthy: {
        eyebrow: "ધ્યાન આપવાની જરૂર છે",
        pageTitle: "⚠️ ધ્યાન માંગતા પાક (૩ પાક)",
        pageLead: "તાજેતરની તપાસમાં આ પાકમાં પાંદડાના રોગના લક્ષણો દેખાયા છે. શું કરવું તે જોવા માટે કોઈપણ પાક પર ટેપ કરો.",
        backBtn: "મુખ્ય પૃષ્ઠ પર પાછા જાઓ",
        seeAdvice: "🔍 સલાહ જુઓ",
        pdfSlip: "📄 PDF સ્લિપ",
        askMitr: "🤖 ખેડૂત મિત્રને પૂછો",
        modalWhatMeans: "આનો અર્થ શું થાય છે?",
        modalWhatToDo: "તમારે શું કરવું જોઈએ?",
        modalAskBtn: 'ખેડૂત મિત્રને પૂછો: "મારે શું કરવું જોઈએ?"',
        modalPdfBtn: "📄 PDF સ્લિપ જુઓ અને ડાઉનલોડ કરો",
        viewScan: "સંપૂર્ણ ટેકનિકલ સ્કેન વિગતો જુઓ →"
      },
      cropRec: {
        eyebrow: "આગામી પાક પસંદ કરો",
        pageTitle: "તમારા ખેતર માટે કયો પાક શ્રેષ્ઠ છે? 🌱",
        pageLead: "તમારી જમીન, પાણી અને અગાઉના પાકના આધારે શ્રેષ્ઠ આગામી પાક પસંદ કરો.",
        profileTitle: "તમારા ખેતરની વિગત આપો",
        profileLead: "તમારા આણંદ, ગુજરાતના ખેતરની વિગત પહેલેથી ભરેલી છે. જરૂર મુજબ બદલો.",
        resetBtn: "આણંદ ખેતર મુજબ રીસેટ કરો",
        lblLocation: "તમારું ખેતર ક્યાં છે? (જિલ્લો)",
        lblSoilType: "જમીનનો પ્રકાર કયો છે?",
        lblSoilPh: "જમીન pH: ",
        lblSoilPhDesc: "ⓘ pH 6.5 નો અર્થ છે કે તમારી જમીન બિયારણ માટે આદર્શ સંતુલિત છે.",
        lblPrevCrop: "અગાઉ કયો પાક લીધો હતો?",
        lblWaterAvail: "પાણીની ઉપલબ્ધતા કેટલી છે?",
        lblSeason: "આગામી ઋતુ",
        btnAnalyze: "મારા ખેતર માટે શ્રેષ્ઠ પાક જુઓ →",
        btnCompare: "ટોચના ૩ પાકની સરખામણી કરો",
        loadingTitle: "તમારા ખેતર માટે શ્રેષ્ઠ પાક શોધી રહ્યા છીએ...",
        loadingSub: "જમીન, વરસાદ અને અગાઉના પાકનું વિશ્લેષણ થઈ રહ્યું છે.",
        compareTitle: "ટોચના પાકની સરખામણી",
        compareLead: "તમારા શ્રેષ્ઠ વિકલ્પોની સાથે-સાથે સરખામણી"
      },
      irrigation: {
        eyebrow: "સિંચાઈ સલાહ",
        pageTitle: "શું આજે પાણી આપવું જોઈએ? 💧",
        pageLead: "આણંદ, ગુજરાતમાં તમારા પાક માટે સરળ સલાહ. પાણી બચાવો અને મૂળ સુરક્ષિત રાખો.",
        simTitle: "🔬 જમીન અને હવામાનની પરિસ્થિતિ ચકાસો",
        simReset: "ખેતરની વાસ્તવિક સ્થિતિ પર રીસેટ કરો"
      },
      weather: {
        eyebrow: "હવામાન સલાહ",
        pageTitle: "આજનું હવામાન અને ખેતર સલાહ 🌦️",
        pageLead: "આણંદ, ગુજરાતમાં તમારા ખેતર માટે કલાકવાર આગાહી અને છંટકાવની સલાહ."
      },
      sustainability: {
        eyebrow: "ખેતર સ્વાસ્થ્ય સ્કોર",
        pageTitle: "તમારું ખેતર કેટલું ટકાઉ છે? 🌍",
        pageLead: "સરળ સુધારણા પગલાં સાથે તમારા ખેતરનો એકંદર સ્કોર, પાણીની કાર્યક્ષમતા અને જમીનનું સ્વાસ્થ્ય જુઓ."
      },
      history: {
        eyebrow: "ખેતર લોગ",
        pageTitle: "તમારા ખેતરનો ઇતિહાસ 📜",
        pageLead: "તમારા ખેતર માટે અગાઉની પાક તપાસ, રોગ તારણો અને સંભાળ લોગની સમીક્ષા કરો."
      }
    },
    hi: {
      nav: {
        dashboard: "मुख्य पृष्ठ",
        scan: "फसल जांचें",
        "unhealthy-plants": "ध्यान देने योग्य फसलें",
        "crop-recommendation": "फसल चयन",
        irrigation: "सिंचाई सलाह",
        weather: "मौसम सलाह",
        sustainability: "फार्म स्कोर",
        result: "फसल PDF रिपोर्ट",
        history: "इतिहास",
        settings: "सेटिंग्स"
      },
      topbar: {
        loginSignUp: "लॉगिन / साइन अप",
        aiOnline: "AI सहायक सक्रिय"
      },
      sidebar: {
        farmer: "किसान",
        guestRole: "गेस्ट मोड • साइन इन करने के लिए क्लिक करें"
      },
      common: {
        searchPlaceholder: "फसल रोग, उपचार, जानकारी खोजें...",
        aiHelperOnline: "AI सहायक सक्रिय",
        checkNow: "जांचें",
        backToHome: "मुख्य पृष्ठ पर लौटें",
        seeAdvice: "🔍 सलाह देखें",
        askMitr: "🤖 किसान मित्र से पूछें",
        close: "बंद करें"
      },
      dashboard: {
        greeting: "नमस्ते, किसान भाई! 👋",
        lead: "आनंद, गुजरात में आपके खेत के लिए आज की महत्वपूर्ण जानकारी।",
        attentionTitle: "३ फसलों पर आपका ध्यान आवश्यक है",
        attentionSub: "टमाटर, आलू और मिर्च में पत्तों पर धब्बे दिखे हैं। जांचने के लिए यहाँ टैप करें।",
        attentionBtn: "फसलें अभी देखें →",
        farmHealthTitle: "आपका खेत कैसा चल रहा है?",
        farmHealthSummary: "आपकी अधिकांश फसलें स्वस्थ हैं। ३ फसलों पर धब्बे दिखे हैं और ध्यान देने की आवश्यकता है।",
        healthyCrops: "स्वस्थ फसलें",
        needAttention: "ध्यान आवश्यक",
        farmHealthLabel: "खेत स्वास्थ्य",
        quickFieldAction: "त्वरित खेत जांच",
        checkYourCrop: "अपनी फसल जांचें",
        checkCropDesc: "पत्तों पर धब्बे या पीलापन दिख रहा है? सरल सलाह के लिए कैमरे से फोटो लें।",
        checkCropBtn: "फसल अभी जांचें →",
        kpiTotalScans: "कुल जांची गई फसलें",
        kpiHealthy: "स्वस्थ फसलें",
        kpiAttention: "ध्यान देने योग्य फसलें",
        kpiMonitored: "निगरानी वाली फसलें",
        whatShouldDoTitle: "आज मुझे क्या करना चाहिए?",
        whatShouldDoSub: "आनंद, गुजरात में आपके खेत के लिए स्पष्ट सलाह।",
        waterAdviceTitle: "सिंचाई सलाह",
        waterAdviceStatus: "पानी देने से पहले रुकें",
        waterAdviceDesc: "आज बारिश की ७८% संभावना है और मिट्टी में पर्याप्त नमी है। रुकने से पानी बचेगा और जड़ें सुरक्षित रहेंगी।",
        waterAdviceBtn: "सिंचाई सलाह देखें →",
        weatherTitle: "आज का मौसम",
        weatherStatus: "३०°C • बारिश की संभावना",
        weatherDesc: "आज छिड़काव न करें ताकि बारिश में दवा बह न जाए। कल सुबह (०६:३० - ०९:००) छिड़काव का सबसे अच्छा समय है।",
        weatherBtn: "मौसम सलाह देखें →",
        cropChoiceTitle: "अगली फसल का चयन",
        cropChoiceStatus: "गेहूं के बाद मूंगफली",
        cropChoiceDesc: "गेहूं से घटे प्राकृतिक नाइट्रोजन को मिट्टी में वापस लाता है। आनंद की दोमट मिट्टी के लिए ९४% उपयुक्त।",
        cropChoiceBtn: "सर्वोत्तम बीज देखें →",
        sustainabilityTitle: "आपके खेत का स्कोर",
        sustainabilityStatus: "८२ / १०० • उत्तम",
        sustainabilityDesc: "आपकी कृषि पद्धतियां क्षेत्रीय औसत से १४% अधिक टिकाऊ हैं। ९०+ तक पहुंचने के लिए जैविक स्प्रे अपनाएं।",
        sustainabilityBtn: "सुधार के उपाय देखें →"
      },
      unhealthy: {
        eyebrow: "ध्यान देने की आवश्यकता है",
        pageTitle: "⚠️ ध्यान देने योग्य फसलें (३ फसलें)",
        pageLead: "हाल की जांच में इन फसलों में पत्तियों के रोग दिखे हैं। क्या करना है यह देखने के लिए किसी भी पौधे पर टैप करें।",
        backBtn: "मुख्य पृष्ठ पर लौटें",
        seeAdvice: "🔍 सलाह देखें",
        pdfSlip: "📄 PDF पर्ची",
        askMitr: "🤖 किसान मित्र से पूछें",
        modalWhatMeans: "इसका क्या अर्थ है?",
        modalWhatToDo: "आपको क्या करना चाहिए?",
        modalAskBtn: 'किसान मित्र से पूछें: "मुझे क्या करना चाहिए?"',
        modalPdfBtn: "📄 PDF पर्ची देखें व डाउनलोड करें",
        viewScan: "विस्तृत तकनीकी रिपोर्ट देखें →"
      },
      cropRec: {
        eyebrow: "अगली फसल का चयन करें",
        pageTitle: "आपके खेत के लिए कौन सी फसल सही है? 🌱",
        pageLead: "अपनी मिट्टी, पानी और पिछली फसल के आधार पर अगली सर्वश्रेष्ठ फसल चुनें।",
        profileTitle: "अपने खेत का विवरण दें",
        profileLead: "आनंद, गुजरात के आपके खेत की जानकारी पहले से भरी है। जरूरत पड़ने पर बदलें।",
        resetBtn: "आनंद फार्म पर रीसेट करें",
        lblLocation: "आपका खेत कहाँ है? (ज़िला)",
        lblSoilType: "मिट्टी का प्रकार क्या है?",
        lblSoilPh: "मिट्टी का pH: ",
        lblSoilPhDesc: "ⓘ pH 6.5 का अर्थ है कि आपकी मिट्टी बीजों के लिए संतुलित है।",
        lblPrevCrop: "पहले कौन सी फसल उगाई थी?",
        lblWaterAvail: "पानी की उपलब्धता कितनी है?",
        lblSeason: "आगामी मौसम",
        btnAnalyze: "मेरे खेत के लिए सर्वोत्तम फसलें देखें →",
        btnCompare: "शीर्ष ३ फसलों की तुलना करें",
        loadingTitle: "आपके खेत के लिए सर्वोत्तम फसलें खोजी जा रही हैं...",
        loadingSub: "मिट्टी, वर्षा और पिछली फसल का विश्लेषण हो रहा है।",
        compareTitle: "शीर्ष फसलों की तुलना",
        compareLead: "आपके सर्वश्रेष्ठ विकल्पों की तुलना"
      },
      irrigation: {
        eyebrow: "सिंचाई सलाह",
        pageTitle: "क्या आज पानी देना चाहिए? 💧",
        pageLead: "आनंद, गुजरात में आपकी फसलों के लिए सरल सलाह। पानी बचाएं और जड़ों को सुरक्षित रखें।",
        simTitle: "🔬 विभिन्न मिट्टी और मौसम स्थितियों का परीक्षण करें",
        simReset: "खेत की वास्तविक स्थिति पर रीसेट करें"
      },
      weather: {
        eyebrow: "मौसम सलाह",
        pageTitle: "आज का मौसम और खेत सलाह 🌦️",
        pageLead: "आनंद, गुजरात में आपके खेत के लिए प्रति घंटे का पूर्वानुमान और छिड़काव सलाह।"
      },
      sustainability: {
        eyebrow: "खेत स्वास्थ्य स्कोर",
        pageTitle: "आपका खेत कितना टिकाऊ है? 🌍",
        pageLead: "सरल सुधार कदमों के साथ अपने खेत का समग्र स्कोर, जल दक्षता और मिट्टी का स्वास्थ्य देखें।"
      },
      history: {
        eyebrow: "खेत लॉग",
        pageTitle: "आपके खेत का इतिहास 📜",
        pageLead: "अपने खेत के लिए पिछली फसल जांच, रोग निष्कर्ष और देखभाल लॉग की समीक्षा करें।"
      }
    }
  };

  function applyLanguage(lang, showToast) {
    var l = lang || localStorage.getItem("agrismart_lang") || "en";
    if (!TRANSLATIONS[l]) l = "en";
    localStorage.setItem("agrismart_lang", l);
    document.documentElement.setAttribute("lang", l);

    var t = TRANSLATIONS[l];

    // 1. Sync dropdowns
    var topSelect = document.getElementById("app-lang-select");
    if (topSelect) topSelect.value = l;
    var setSelect = document.getElementById("language");
    if (setSelect) setSelect.value = l;

    // 2. Update sidebar navigation
    var sidebarLinks = document.querySelectorAll(".sidebar-link");
    sidebarLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      var item = NAV_ITEMS.find(function (n) { return n.href === href; });
      if (item && t.nav && t.nav[item.key]) {
        var span = link.querySelector("span");
        if (span) span.textContent = t.nav[item.key];
      }
    });

    // 3. Topbar & Shell Auth elements
    var searchInput = document.getElementById("topbar-search-input");
    if (searchInput && t.common.searchPlaceholder) {
      searchInput.placeholder = t.common.searchPlaceholder;
    }
    var statusPill = document.querySelector(".model-status-pill span:last-child");
    if (statusPill && t.common.aiHelperOnline) {
      statusPill.textContent = t.common.aiHelperOnline;
    }
    var loginPill = document.querySelector(".topbar-login-pill span");
    if (loginPill && t.topbar && t.topbar.loginSignUp) {
      loginPill.textContent = t.topbar.loginSignUp;
    }
    var farmerRole = document.querySelector(".farmer-role");
    if (farmerRole && !isSignedIn()) {
      farmerRole.textContent = t.sidebar ? t.sidebar.guestRole : (l === "gu" ? "ગેસ્ટ મોડ • સાઇન ઇન કરવા ક્લિક કરો" : (l === "hi" ? "गेस्ट मोड • साइन इन करने के लिए क्लिक करें" : "Guest Mode • Click to Sign In"));
    }
    var farmerNameEl = document.querySelector(".farmer-name");
    if (farmerNameEl && (farmerNameEl.textContent.trim() === "Farmer" || farmerNameEl.textContent.trim() === "ખેડૂત" || farmerNameEl.textContent.trim() === "किसान")) {
      farmerNameEl.textContent = t.sidebar ? t.sidebar.farmer : (l === "gu" ? "ખેડૂત" : (l === "hi" ? "किसान" : "Farmer"));
    }

    // 4. Safe breadcrumbs back button across all subpages
    document.querySelectorAll("main a.btn-ghost[href='dashboard.html'] span, .breadcrumb a span, .breadcrumb-back span").forEach(function (s) {
      if (t.common && t.common.backToHome) s.textContent = t.common.backToHome;
    });

    // 5. Dashboard page elements
    var greetingEl = document.getElementById("greeting");
    if (greetingEl && t.dashboard.greeting) {
      greetingEl.textContent = t.dashboard.greeting;
    }
    var leadEl = document.querySelector("main header p.lead");
    if (leadEl && t.dashboard.lead && document.getElementById("farm-health-centerpiece")) {
      leadEl.textContent = t.dashboard.lead;
    }

    var banner = document.getElementById("dashboard-attention-banner");
    if (banner) {
      var h2 = banner.querySelector("h2");
      if (h2) h2.textContent = t.dashboard.attentionTitle;
      var p = banner.querySelector("p");
      if (p) p.textContent = t.dashboard.attentionSub;
      var aSpan = banner.querySelector("a.btn span");
      if (aSpan) aSpan.textContent = t.dashboard.attentionBtn;
    }

    var cTitle = document.querySelector("#farm-health-centerpiece h2");
    if (cTitle) cTitle.textContent = t.dashboard.farmHealthTitle;
    var cSum = document.getElementById("farm-health-summary");
    if (cSum) cSum.textContent = t.dashboard.farmHealthSummary;
    var cGauge = document.querySelector(".health-gauge-center .label");
    if (cGauge) cGauge.textContent = t.dashboard.farmHealthLabel;

    var ctaCard = document.querySelector(".card.card-forest");
    if (ctaCard) {
      var eye = ctaCard.querySelector(".eyebrow");
      if (eye) eye.textContent = t.dashboard.quickFieldAction;
      var ctaH3 = ctaCard.querySelector("h3");
      if (ctaH3) ctaH3.textContent = t.dashboard.checkYourCrop;
      var ctaP = ctaCard.querySelector("p");
      if (ctaP) ctaP.textContent = t.dashboard.checkCropDesc;
      var ctaBtn = ctaCard.querySelector("a.btn span");
      if (ctaBtn) ctaBtn.textContent = t.dashboard.checkCropBtn;
    }

    // KPI cards on dashboard
    var kpiScans = document.querySelector("#kpi-scans div:first-child");
    if (kpiScans) kpiScans.textContent = t.dashboard.kpiTotalScans;
    var kpiHealthy = document.querySelector("#kpi-healthy div:first-child");
    if (kpiHealthy) kpiHealthy.textContent = t.dashboard.kpiHealthy;
    var kpiAtt = document.querySelector("#kpi-attention div:first-child");
    if (kpiAtt) {
      kpiAtt.innerHTML = t.dashboard.kpiAttention + ' <span class="badge badge-warning" style="margin-left:0.4rem;font-size:0.65rem;">' + t.common.checkNow + '</span>';
    }
    var kpiMon = document.querySelector("#kpi-crops div:first-child");
    if (kpiMon) kpiMon.textContent = t.dashboard.kpiMonitored;

    // What should I do today section on dashboard
    var actionsGrid = document.querySelector(".farmer-actions-grid");
    if (actionsGrid && actionsGrid.previousElementSibling) {
      var actH2 = actionsGrid.previousElementSibling.querySelector("h2");
      if (actH2) actH2.textContent = t.dashboard.whatShouldDoTitle;
      var actP = actionsGrid.previousElementSibling.querySelector("p");
      if (actP) actP.textContent = t.dashboard.whatShouldDoSub;

      var cards = actionsGrid.querySelectorAll(".farmer-action-card");
      if (cards.length >= 4) {
        // Water
        var wStrong = cards[0].querySelector("strong");
        if (wStrong) wStrong.textContent = t.dashboard.waterAdviceStatus;
        var wP = cards[0].querySelector("p");
        if (wP) wP.textContent = t.dashboard.waterAdviceDesc;
        var wA = cards[0].querySelector("a");
        if (wA) wA.textContent = t.dashboard.waterAdviceBtn;

        // Weather
        var weStrong = cards[1].querySelector("strong");
        if (weStrong) weStrong.textContent = t.dashboard.weatherStatus;
        var weP = cards[1].querySelector("p");
        if (weP) weP.textContent = t.dashboard.weatherDesc;
        var weA = cards[1].querySelector("a");
        if (weA) weA.textContent = t.dashboard.weatherBtn;

        // Crop Choice
        var cStrong = cards[2].querySelector("strong");
        if (cStrong) cStrong.textContent = t.dashboard.cropChoiceStatus;
        var cP = cards[2].querySelector("p");
        if (cP) cP.textContent = t.dashboard.cropChoiceDesc;
        var cA = cards[2].querySelector("a");
        if (cA) cA.textContent = t.dashboard.cropChoiceBtn;

        // Sustainability
        var sStrong = cards[3].querySelector("strong");
        if (sStrong) sStrong.textContent = t.dashboard.sustainabilityStatus;
        var sP = cards[3].querySelector("p");
        if (sP) sP.textContent = t.dashboard.sustainabilityDesc;
        var sA = cards[3].querySelector("a");
        if (sA) sA.textContent = t.dashboard.sustainabilityBtn;
      }
    }

    // 6. Unhealthy plants page static elements
    if (document.getElementById("unhealthy-cards-mount")) {
      var uEye = document.querySelector("main header .eyebrow span");
      if (uEye && t.unhealthy.eyebrow) uEye.textContent = t.unhealthy.eyebrow;
      var uH1 = document.querySelector("main header h1");
      if (uH1 && t.unhealthy.pageTitle) uH1.textContent = t.unhealthy.pageTitle;
      var uLead = document.querySelector("main header p.lead");
      if (uLead && t.unhealthy.pageLead) uLead.textContent = t.unhealthy.pageLead;
      var mAsk = document.querySelector("#modal-ask-mitr-btn span");
      if (mAsk && t.unhealthy.modalAskBtn) mAsk.textContent = t.unhealthy.modalAskBtn;
      var mPdf = document.querySelector("#modal-download-pdf-btn span");
      if (mPdf && t.unhealthy.modalPdfBtn) mPdf.textContent = t.unhealthy.modalPdfBtn;
      var mView = document.getElementById("modal-view-scan-btn");
      if (mView && t.unhealthy.viewScan) mView.textContent = t.unhealthy.viewScan;
    }

    // 7. Crop recommendation page static elements
    if (document.getElementById("crop-profile-form")) {
      var crEye = document.querySelector("main header .eyebrow span");
      if (crEye && t.cropRec.eyebrow) crEye.textContent = t.cropRec.eyebrow;
      var crH1 = document.querySelector("main header h1");
      if (crH1 && t.cropRec.pageTitle) crH1.textContent = t.cropRec.pageTitle;
      var crLead = document.querySelector("main header p.lead");
      if (crLead && t.cropRec.pageLead) crLead.textContent = t.cropRec.pageLead;

      var profHeader = document.querySelector("#crop-profile-form").previousElementSibling;
      if (profHeader) {
        var crProfH2 = profHeader.querySelector("h2");
        if (crProfH2 && t.cropRec.profileTitle) crProfH2.textContent = t.cropRec.profileTitle;
        var crProfP = profHeader.querySelector("p");
        if (crProfP && t.cropRec.profileLead) crProfP.textContent = t.cropRec.profileLead;
      }
      var crReset = document.getElementById("reset-farm-btn");
      if (crReset && t.cropRec.resetBtn) crReset.textContent = t.cropRec.resetBtn;

      var lLoc = document.querySelector("label[for='inp-location']");
      if (lLoc && t.cropRec.lblLocation) lLoc.textContent = t.cropRec.lblLocation;
      var lSoil = document.querySelector("label[for='inp-soil-type']");
      if (lSoil && t.cropRec.lblSoilType) lSoil.textContent = t.cropRec.lblSoilType;
      var lPhSpan = document.querySelector("label[for='inp-soil-ph'] span");
      if (lPhSpan && t.cropRec.lblSoilPh) lPhSpan.textContent = t.cropRec.lblSoilPh;
      var lPhDesc = document.querySelector("label[for='inp-soil-ph'] ~ div");
      if (lPhDesc && t.cropRec.lblSoilPhDesc) lPhDesc.textContent = t.cropRec.lblSoilPhDesc;
      var lPrev = document.querySelector("label[for='inp-prev-crop']");
      if (lPrev && t.cropRec.lblPrevCrop) lPrev.textContent = t.cropRec.lblPrevCrop;
      var lWater = document.querySelector("label[for='inp-water-avail']");
      if (lWater && t.cropRec.lblWaterAvail) lWater.textContent = t.cropRec.lblWaterAvail;
      var lSeason = document.querySelector("label[for='inp-season']");
      if (lSeason && t.cropRec.lblSeason) lSeason.textContent = t.cropRec.lblSeason;

      var crAnalyze = document.querySelector("#analyze-crops-btn span");
      if (crAnalyze && t.cropRec.btnAnalyze) crAnalyze.textContent = t.cropRec.btnAnalyze;
      var crCompBtn = document.querySelector("#open-compare-btn span");
      if (crCompBtn && t.cropRec.btnCompare) crCompBtn.textContent = t.cropRec.btnCompare;

      var lH3 = document.querySelector("#crop-loading h3");
      if (lH3 && t.cropRec.loadingTitle) lH3.textContent = t.cropRec.loadingTitle;
      var lP = document.querySelector("#crop-loading p");
      if (lP && t.cropRec.loadingSub) lP.textContent = t.cropRec.loadingSub;

      var cmpH3 = document.getElementById("compare-modal-title");
      if (cmpH3 && t.cropRec.compareTitle) cmpH3.textContent = t.cropRec.compareTitle;
      var cmpP = cmpH3 ? cmpH3.nextElementSibling : null;
      if (cmpP && t.cropRec.compareLead) cmpP.textContent = t.cropRec.compareLead;
      var cmpDismiss = document.getElementById("dismiss-compare-modal");
      if (cmpDismiss && t.common && t.common.close) cmpDismiss.textContent = t.common.close;
    }

    // 8. Irrigation page static elements
    if (document.getElementById("irrigation-hero-mount")) {
      var irEye = document.querySelector("main header .eyebrow span");
      if (irEye && t.irrigation.eyebrow) irEye.textContent = t.irrigation.eyebrow;
      var irH1 = document.querySelector("main header h1");
      if (irH1 && t.irrigation.pageTitle) irH1.textContent = t.irrigation.pageTitle;
      var irLead = document.querySelector("main header p.lead");
      if (irLead && t.irrigation.pageLead) irLead.textContent = t.irrigation.pageLead;
      var simH2 = document.querySelector("#reset-sim-btn") ? document.querySelector("#reset-sim-btn").previousElementSibling.querySelector("h2 span") : null;
      if (simH2 && t.irrigation.simTitle) simH2.textContent = t.irrigation.simTitle;
      var simReset = document.getElementById("reset-sim-btn");
      if (simReset && t.irrigation.simReset) simReset.textContent = t.irrigation.simReset;
    }

    // 9. Weather page static elements
    if (document.getElementById("weather-hero-mount")) {
      var weEye = document.querySelector("main header .eyebrow span");
      if (weEye && t.weather.eyebrow) weEye.textContent = t.weather.eyebrow;
      var weH1 = document.querySelector("main header h1");
      if (weH1 && t.weather.pageTitle) weH1.textContent = t.weather.pageTitle;
      var weLead = document.querySelector("main header p.lead");
      if (weLead && t.weather.pageLead) weLead.textContent = t.weather.pageLead;
    }

    // 10. Sustainability page static elements
    if (document.getElementById("sustainability-hero-mount")) {
      var suEye = document.querySelector("main header .eyebrow span");
      if (suEye && t.sustainability.eyebrow) suEye.textContent = t.sustainability.eyebrow;
      var suH1 = document.querySelector("main header h1");
      if (suH1 && t.sustainability.pageTitle) suH1.textContent = t.sustainability.pageTitle;
      var suLead = document.querySelector("main header p.lead");
      if (suLead && t.sustainability.pageLead) suLead.textContent = t.sustainability.pageLead;
    }

    // 11. History page static elements
    if (document.getElementById("history-cards-mount") || document.getElementById("history-table-body")) {
      var hiEye = document.querySelector("main header .eyebrow span");
      if (hiEye && t.history.eyebrow) hiEye.textContent = t.history.eyebrow;
      var hiH1 = document.querySelector("main header h1");
      if (hiH1 && t.history.pageTitle) hiH1.textContent = t.history.pageTitle;
      var hiLead = document.querySelector("main header p.lead");
      if (hiLead && t.history.pageLead) hiLead.textContent = t.history.pageLead;
    }

    // 12. Khedut Mitr text elements
    var lSub = document.querySelector(".khedut-mitr-launcher-sub");
    if (lSub) {
      lSub.textContent = l === "gu" ? "તમારો ખેડૂત મિત્ર" : (l === "hi" ? "आपका किसान मित्र" : "ખેડૂત મિત્ર • Farm Helper");
    }
    var vBanner = document.querySelector(".khedut-mitr-voice-banner span:first-child");
    if (vBanner) {
      vBanner.textContent = l === "gu" ? "🎤 બોલીને પૂછો / માઈક પર ટેપ કરો" : (l === "hi" ? "🎤 बोलकर पूछें / माइक पर टैप करें" : "🎤 બોલીને પૂછો / Tap mic to speak");
    }
    var mInput = document.getElementById("khedut-mitr-input");
    if (mInput) {
      mInput.placeholder = l === "gu" ? "લખો અથવા બોલીને ખેડૂત મિત્રને પૂછો..." : (l === "hi" ? "टाइप करें या बोलकर किसान मित्र से पूछें..." : "Type or speak to Khedut Mitr...");
    }

    // 13. Dispatch event for page-specific dynamic re-renders
    try {
      window.dispatchEvent(new CustomEvent("agri:lang", { detail: { lang: l } }));
    } catch (err) {}
    
        if (showToast) {
      if (l === "gu") {
        toast("ભાષા સફળતાપૂર્વક બદલાઈ: ગુજરાતી");
      } else if (l === "hi") {
        toast("भाषा सफलतापूर्वक बदली: हिन्दी");
      } else {
        toast("Language set to English");
      }
    }
  }

  function init() {
    var settings = global.AgriAPI ? AgriAPI.getSettings() : { theme: "light" };
    applyTheme(settings.theme);
    renderHeader();
    renderFooter();
    var savedLang = localStorage.getItem("agrismart_lang") || "en";
    applyLanguage(savedLang, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.AgriApp = {
    $: $,
    $$: $$,
    applyTheme: applyTheme,
    greeting: greeting,
    relativeTime: relativeTime,
    formatDate: formatDate,
    formatReportId: formatReportId,
    confidenceLabel: confidenceLabel,
    riskClass: riskClass,
    toast: toast,
    queryParam: queryParam,
    escapeHtml: escapeHtml,
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    showAuthModal: showAuthModal,
    getAuth: getAuth,
    setAuth: setAuth,
    isSignedIn: isSignedIn,
    applyLanguage: applyLanguage,
    getLanguage: function () { return localStorage.getItem("agrismart_lang") || "en"; }
  };
})(window);
