(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var settings = AgriAPI.getSettings();
    document.getElementById("farmerName").value = settings.farmerName || "";
    document.getElementById("farmName").value = settings.farmName || "";
    document.getElementById("location").value = settings.location || "";
    document.getElementById("language").value = settings.language || "en";
    document.getElementById("theme").value = settings.theme || "light";
    document.getElementById("notifications").checked = Boolean(settings.notifications);

    document.getElementById("theme").addEventListener("change", function () {
      AgriApp.applyTheme(document.getElementById("theme").value);
    });

    document.getElementById("settings-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var result = AgriAPI.saveSettings({
        farmerName: document.getElementById("farmerName").value.trim() || "Farmer",
        farmName: document.getElementById("farmName").value.trim(),
        location: document.getElementById("location").value.trim(),
        language: document.getElementById("language").value,
        theme: document.getElementById("theme").value,
        notifications: document.getElementById("notifications").checked
      });
      if (!result.ok) {
        AgriApp.toast(result.error);
        return;
      }
      AgriApp.applyTheme(result.settings.theme);
      AgriApp.toast("Settings saved on this device.");
    });

    document.getElementById("clear-history").addEventListener("click", function () {
      var confirmed = window.confirm("Clear all saved scans from this browser?");
      if (!confirmed) return;
      AgriAPI.clearHistory();
      AgriApp.toast("Scan history cleared.");
    });
  });
})();
