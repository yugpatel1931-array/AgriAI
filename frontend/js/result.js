(function () {
  "use strict";

  function placeholderSvg() {
    return (
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#e7f4ec"/><text x="50%" y="50%" text-anchor="middle" fill="#145C38" font-family="Segoe UI" font-size="20">Demo scan — photo not stored</text></svg>'
      )
    );
  }

  function listItems(items) {
    return "<ul>" + items.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("") + "</ul>";
  }

  function renderMissing() {
    document.getElementById("result-root").innerHTML =
      '<section class="card empty"><h2>No scan result found</h2><p class="muted">The record may have been cleared, or analysis has not been run yet.</p><a class="btn btn-primary" href="scan.html">Scan a Crop</a></section>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    var id = AgriApp.queryParam("id");
    var result = id ? AgriAPI.getScanById(id) : AgriAPI.getLastResult();
    if (!result) {
      renderMissing();
      return;
    }
    AgriAPI.setLastResult(result);

    var imgSrc = result.imageDataUrl || placeholderSvg();
    document.getElementById("result-root").innerHTML =
      '<article class="card result-hero">' +
      '<div><img id="result-image" alt="Scanned crop leaf" src="' + imgSrc + '"></div>' +
      "<div><p class=\"eyebrow\">Demonstration result</p>" +
      "<h2>" + result.disease + "</h2>" +
      '<div class="result-stats">' +
      '<div class="stat-box"><div class="label">Crop</div><strong>' + result.crop + "</strong></div>" +
      '<div class="stat-box"><div class="label">Diagnosis</div><strong>' + result.disease + "</strong></div>" +
      '<div class="stat-box"><div class="label">Confidence</div><strong>' + AgriApp.confidenceLabel(result.confidence) + "</strong></div>" +
      '<div class="stat-box"><div class="label">Risk Level</div><span class="' + AgriApp.riskClass(result.risk) + '">' + result.risk + "</span></div>" +
      "</div></div></article>" +
      '<section class="grid-2" style="margin-top:1rem">' +
      '<article class="card"><h3>AI explanation</h3><p>' + result.explanation + "</p>" +
      "<h3>Symptoms</h3>" + listItems(result.symptoms || []) + "</article>" +
      '<article class="card"><h3>Recommended actions</h3>' + listItems(result.recommendations || []) +
      '<p class="disclaimer">These points are informational guidance for demonstration, not guaranteed agricultural prescriptions.</p>' +
      "<h3>Result metadata</h3>" +
      "<p><strong>Scan date:</strong> " + AgriApp.formatDate(result.scannedAt) + "<br>" +
      "<strong>Crop:</strong> " + result.crop + "<br>" +
      "<strong>Diagnosis:</strong> " + result.disease + "<br>" +
      "<strong>Confidence:</strong> " + AgriApp.confidenceLabel(result.confidence) + "<br>" +
      "<strong>Risk:</strong> " + result.risk + "</p></article></section>" +
      '<div class="actions-row no-print">' +
      '<button class="btn btn-primary" type="button" id="save-btn">Save Result</button>' +
      '<a class="btn btn-secondary" href="scan.html">Scan Another Crop</a>' +
      '<button class="btn btn-ghost" type="button" id="print-btn">Print Report</button>' +
      '<a class="btn btn-ghost" href="dashboard.html">Back to Dashboard</a>' +
      "</div>";

    var image = document.getElementById("result-image");
    image.addEventListener("error", function () {
      image.src = placeholderSvg();
    });

    document.getElementById("save-btn").addEventListener("click", function () {
      var saved = AgriAPI.saveScan(result);
      if (!saved.ok) {
        AgriApp.toast(saved.error || "Could not save this result.");
        return;
      }
      if (saved.trimmed) {
        AgriApp.toast("Saved without the image because storage was full.");
      } else {
        AgriApp.toast("Result saved to history.");
      }
    });
    document.getElementById("print-btn").addEventListener("click", function () {
      window.print();
    });
  });
})();
