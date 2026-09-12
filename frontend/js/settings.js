(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var settings = AgriAPI.getSettings();

    var farmerNameEl = document.getElementById("farmerName");
    var farmNameEl = document.getElementById("farmName");
    var locationEl = document.getElementById("location");
    var languageEl = document.getElementById("language");
    var themeEl = document.getElementById("theme");
    var notificationsEl = document.getElementById("notifications");

    if (farmerNameEl) farmerNameEl.value = settings.farmerName || "";
    if (farmNameEl) farmNameEl.value = settings.farmName || "";
    if (locationEl) locationEl.value = settings.location || "";
    if (languageEl) languageEl.value = settings.language || "en";
    if (themeEl) themeEl.value = settings.theme || "light";
    if (notificationsEl) notificationsEl.checked = Boolean(settings.notifications);

    // Live theme preview on selection change
    if (themeEl) {
      themeEl.addEventListener("change", function () {
        AgriApp.applyTheme(themeEl.value);
      });
    }

    var form = document.getElementById("settings-form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var result = AgriAPI.saveSettings({
          farmerName: (farmerNameEl ? farmerNameEl.value.trim() : "") || "Farmer",
          farmName: farmNameEl ? farmNameEl.value.trim() : "",
          location: locationEl ? locationEl.value.trim() : "",
          language: languageEl ? languageEl.value : "en",
          theme: themeEl ? themeEl.value : "light",
          notifications: notificationsEl ? notificationsEl.checked : true
        });

        if (!result.ok) {
          AgriApp.toast(result.error || "Could not save settings.");
          return;
        }

        AgriApp.applyTheme(result.settings.theme);
        AgriApp.toast("Settings saved successfully on this device.");
      });
    }

    var clearBtn = document.getElementById("clear-history");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        var confirmed = window.confirm("Are you sure you want to delete all saved crop scans from this browser? This action cannot be undone.");
        if (!confirmed) return;
        AgriAPI.clearHistory();
        AgriApp.toast("All scan records have been cleared from local storage.");
      });
    }
  });
})();
