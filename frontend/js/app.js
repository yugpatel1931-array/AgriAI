(function (global) {
  "use strict";

  var NAV_ITEMS = [
    {
      href: "dashboard.html",
      label: "Dashboard",
      key: "dashboard",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>'
    },
    {
      href: "scan.html",
      label: "Scan Crop",
      key: "scan",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'
    },
    {
      href: "history.html",
      label: "Scan History",
      key: "history",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    },
    {
      href: "insights.html",
      label: "Farm Insights",
      key: "insights",
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
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
    return (
      '<svg class="brand-logo" width="34" height="34" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="38" height="38" rx="10" fill="#2D6A4F"/>' +
      '<path d="M19 8C25.6 11.5 29 16.5 29 23.5C26 21.5 22.5 20.5 19 20.5C15.5 20.5 12 21.5 9 23.5C9 16.5 12.4 11.5 19 8Z" fill="#52B788"/>' +
      '<path d="M19 21V30" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M19 25L23 22" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="19" cy="12" r="2.5" fill="#FFFFFF"/>' +
      '</svg>'
    );
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
      '<a class="landing-brand" href="index.html">' + brandLogo() + '<span>AgriSmart AI</span></a>' +
      '<ul class="landing-links" id="landing-nav-links">' +
      '<li><a href="index.html" class="active">Home</a></li>' +
      '<li><a href="#features">Features</a></li>' +
      '<li><a href="#how-it-works">How It Works</a></li>' +
      '<li><a href="dashboard.html">Living Farm</a></li>' +
      '<li><a href="scan.html">AI Diagnosis</a></li>' +
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
      '    <a class="sidebar-brand" href="index.html" title="AgriSmart AI">' +
      '      ' + brandLogo() +
      '      <span>AgriSmart AI</span>' +
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
      '    <a href="index.html" class="topbar-btn" title="Back to Public Landing Page" aria-label="Landing Page">' +
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' +
      '    </a>' +
      '    <div class="model-status-pill">' +
      '      <span class="pulse-dot"></span>' +
      '      <span>AI Model Online</span>' +
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
        '        <div class="landing-brand" style="margin-bottom:0.8rem">' + brandLogo() + '<span>AgriSmart AI</span></div>' +
        '        <p>AI-assisted foliar plant pathology and sustainable crop protection built for Indian agriculture. Instant leaf diagnosis, organic and chemical remedies, and living farm health records.</p>' +
        '        <p style="margin-top:0.8rem;font-size:0.82rem;color:var(--text-subtle);">Smart India Hackathon Demonstration Prototype.</p>' +
        '      </div>' +
        '      <div>' +
        '        <h4 style="margin-bottom:0.8rem">Features</h4>' +
        '        <div class="footer-links">' +
        '          <a href="scan.html">AI Crop Scanner</a>' +
        '          <a href="dashboard.html">Living Farm Health</a>' +
        '          <a href="history.html">Scan History</a>' +
        '          <a href="insights.html">Diagnostic Analytics</a>' +
        '        </div>' +
        '      </div>' +
        '      <div>' +
        '        <h4 style="margin-bottom:0.8rem">Resources</h4>' +
        '        <div class="footer-links">' +
        '          <a href="settings.html">Farmer Preferences</a>' +
        '          <a href="login.html">Farmer Portal</a>' +
        '          <a href="https://icar.org.in/" target="_blank" rel="noopener">ICAR Advisory Guidelines</a>' +
        '          <a href="#how-it-works">Diagnostic Accuracy Guide</a>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '    <div class="copyright">' +
        '      <span>&copy; ' + new Date().getFullYear() + ' AgriSmart AI &bull; For Greener Tomorrows</span>' +
        '      <span>Built with pride for Indian Farmers &bull; Smart India Hackathon</span>' +
        '    </div>' +
        '  </div>' +
        '</footer>';
    } else {
      mount.innerHTML =
        '<footer style="margin-top:auto;padding:1.5rem 0;border-top:1px solid var(--border);font-size:0.82rem;color:var(--text-subtle);display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.8rem;">' +
        '  <span>AgriSmart AI &bull; Living Crop Intelligence</span>' +
        '  <span>Demonstration System &bull; Offline Ready &bull; Smart India Hackathon</span>' +
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

  function init() {
    var settings = global.AgriAPI ? AgriAPI.getSettings() : { theme: "light" };
    applyTheme(settings.theme);
    renderHeader();
    renderFooter();
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
    isSignedIn: isSignedIn
  };
})(window);
