(function (global) {
  "use strict";

  var NAV_ITEMS = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "dashboard.html", label: "Dashboard", key: "dashboard" },
    { href: "scan.html", label: "Scan", key: "scan" },
    { href: "history.html", label: "History", key: "history" },
    { href: "insights.html", label: "Insights", key: "insights" },
    { href: "settings.html", label: "Settings", key: "settings" }
  ];

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  }

  function currentPage() {
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!file || file === "") return "index.html";
    return file;
  }

  function brandMark() {
    return (
      '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">' +
      '<rect width="32" height="32" rx="8" fill="#1F7A4D"/>' +
      '<path d="M16 6c5.2 3.2 8 7.6 8 13.2-2.4-1.6-5.1-2.4-8-2.4s-5.6.8-8 2.4C8 13.6 10.8 9.2 16 6z" fill="#F6F4EF"/>' +
      '<path d="M16 16.8V26" stroke="#C4A35A" stroke-width="2" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function renderHeader() {
    var mount = $("#site-header");
    if (!mount) return;
    var page = currentPage();
    var links = NAV_ITEMS.map(function (item) {
      var current = page === item.href ? ' aria-current="page"' : "";
      return "<li><a href=\"" + item.href + "\"" + current + ">" + item.label + "</a></li>";
    }).join("");
    mount.innerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="container nav" id="nav">' +
      '<a class="brand" href="index.html">' + brandMark() + "<span>AgriSmart AI</span></a>" +
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links" id="menu-toggle" aria-label="Open menu">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' +
      "</button>" +
      '<ul class="nav-links" id="nav-links">' + links + "</ul>" +
      '<div class="nav-cta"><a class="btn btn-primary" href="scan.html">Start Scanning</a></div>' +
      "</div></header>";

    var toggle = $("#menu-toggle");
    var nav = $("#nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
    }
  }

  function renderFooter() {
    var mount = $("#site-footer");
    if (!mount) return;
    mount.innerHTML =
      '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
      "<div><strong>AgriSmart AI</strong><p class=\"muted\">AI-powered crop health assistant for farmers. Identify issues earlier and keep a simple scan history.</p></div>" +
      '<div><strong>Product</strong><div class="footer-links">' +
      '<a href="index.html">Home</a><a href="dashboard.html">Dashboard</a><a href="scan.html">Scan</a><a href="history.html">History</a>' +
      "</div></div>" +
      '<div><strong>More</strong><div class="footer-links">' +
      '<a href="insights.html">Insights</a><a href="settings.html">Settings</a>' +
      "</div></div></div>" +
      '<p class="copyright">© ' + new Date().getFullYear() + " AgriSmart AI. Demonstration frontend for Smart India Hackathon.</p>" +
      "</div></footer>";
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
    if (mins < 60) return mins + " minutes ago";
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours + " hour" + (hours === 1 ? "" : "s") + " ago";
    var days = Math.round(hours / 24);
    return days + " day" + (days === 1 ? "" : "s") + " ago";
  }

  function formatDate(iso) {
    var date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return date.toLocaleString();
  }

  function confidenceLabel(value) {
    var pct = value <= 1 ? Math.round(value * 100) : Math.round(value);
    return pct + "%";
  }

  function riskClass(risk) {
    var key = String(risk || "").toLowerCase();
    if (key === "low") return "badge badge-low";
    if (key === "high") return "badge badge-high";
    return "badge badge-moderate";
  }

  function toast(message) {
    var existing = $(".toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 2800);
  }

  function queryParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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
    $,
    $$,
    applyTheme: applyTheme,
    greeting: greeting,
    relativeTime: relativeTime,
    formatDate: formatDate,
    confidenceLabel: confidenceLabel,
    riskClass: riskClass,
    toast: toast,
    queryParam: queryParam,
    escapeHtml: escapeHtml
  };
})(window);
