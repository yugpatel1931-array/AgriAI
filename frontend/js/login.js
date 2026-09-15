(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var authPanel = document.getElementById("auth-panel");
    var onboardPanel = document.getElementById("onboard-panel");

    if (AgriApp.isSignedIn()) {
      var auth = AgriApp.getAuth() || {};
      authPanel.innerHTML =
        '<div style="text-align:center;padding:1rem 0">' +
        '<div class="icon-wrap" style="margin:0 auto 1rem;width:56px;height:56px;border-radius:50%"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>' +
        '<h2 style="font-size:1.4rem;margin-bottom:0.4rem">Welcome back, ' + AgriApp.escapeHtml(auth.name || "Farmer") + '</h2>' +
        '<p class="muted" style="font-size:0.9rem;margin-bottom:1.4rem">Active farmer session stored locally on this device (' + AgriApp.escapeHtml(auth.email || "email") + ').</p>' +
        '<div class="actions-row" style="justify-content:center;gap:0.8rem">' +
        '<a class="btn btn-primary" href="dashboard.html">Open Dashboard</a>' +
        '<button class="btn btn-ghost" type="button" id="sign-out">Sign Out</button>' +
        '</div>' +
        '</div>';

      var signOutBtn = document.getElementById("sign-out");
      if (signOutBtn) {
        signOutBtn.addEventListener("click", function () {
          AgriApp.setAuth(null);
          AgriApp.renderHeader();
          AgriApp.toast("Signed out successfully on this device.");
          window.location.reload();
        });
      }
      return;
    }

    var googleBtn = document.getElementById("auth-google");
    if (googleBtn) {
      googleBtn.addEventListener("click", function () {
        AgriApp.toast("Google Sign-In is configured for the future Supabase release. Please use email for this demonstration.");
      });
    }

    var loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var name = (document.getElementById("auth-name").value || "").trim();
        var email = (document.getElementById("auth-email").value || "").trim();
        var password = document.getElementById("auth-password").value || "";

        var submitBtn = loginForm.querySelector("button[type=submit]");
        if (submitBtn) submitBtn.disabled = true;

        function proceedSignedIn(user) {
          AgriApp.setAuth({ signedIn: true, id: user.id, name: user.name, email: user.email, demo: false });
          if (user.name) {
            AgriAPI.saveSettings({ farmerName: user.name });
          }
          AgriApp.renderHeader();

          authPanel.classList.add("hidden");
          onboardPanel.classList.remove("hidden");

          var settings = AgriAPI.getSettings();
          var obFarmer = document.getElementById("onboard-farmer");
          var obFarm = document.getElementById("onboard-farm");
          var obLoc = document.getElementById("onboard-location");
          var obCrops = document.getElementById("onboard-crops");

          if (obFarmer) obFarmer.value = user.name || settings.farmerName || "";
          if (obFarm) obFarm.value = settings.farmName || "";
          if (obLoc) obLoc.value = settings.location || "";
          if (obCrops) obCrops.value = settings.primaryCrops || "";
        }

        // Try to create the account first; if that email is already
        // registered, fall back to signing in with the same credentials.
        AgriAPI.signUp(name, email, password)
          .then(function (data) {
            proceedSignedIn(data.user);
          })
          .catch(function (err) {
            if (err.code === "EMAIL_EXISTS") {
              return AgriAPI.logIn(email, password).then(function (data) {
                proceedSignedIn(data.user);
              });
            }
            throw err;
          })
          .catch(function (err) {
            AgriApp.toast(err.message || "Could not sign in. Please try again.");
          })
          .then(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
      });
    }

    var onboardForm = document.getElementById("onboard-form");
    if (onboardForm) {
      onboardForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var obFarmer = document.getElementById("onboard-farmer");
        var obFarm = document.getElementById("onboard-farm");
        var obLoc = document.getElementById("onboard-location");
        var obCrops = document.getElementById("onboard-crops");

        AgriAPI.saveSettings({
          farmerName: (obFarmer ? obFarmer.value.trim() : "") || "Farmer",
          farmName: obFarm ? obFarm.value.trim() : "",
          location: obLoc ? obLoc.value.trim() : "",
          primaryCrops: obCrops ? obCrops.value.trim() : ""
        });

        AgriApp.toast("Farmer profile initialized!");
        setTimeout(function () {
          window.location.href = "dashboard.html";
        }, 400);
      });
    }
  });
})();
