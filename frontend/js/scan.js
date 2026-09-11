(function () {
  "use strict";

  var MAX_BYTES = 10 * 1024 * 1024;
  var ALLOWED = ["image/jpeg", "image/png", "image/webp"];
  var selectedFile = null;
  var objectUrl = null;

  function showAlert(message) {
    var el = document.getElementById("scan-alert");
    el.textContent = message;
    el.classList.toggle("hidden", !message);
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function isAllowed(file) {
    if (ALLOWED.indexOf(file.type) !== -1) return true;
    var name = (file.name || "").toLowerCase();
    return /\.(jpe?g|png|webp)$/.test(name);
  }

  function revokePreview() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  function setPreview(file) {
    selectedFile = file;
    revokePreview();
    objectUrl = URL.createObjectURL(file);
    var img = document.getElementById("preview-image");
    img.src = objectUrl;
    img.onerror = function () {
      showAlert("This image could not be displayed. Try another file.");
      clearSelection();
    };
    document.getElementById("file-name").textContent = file.name;
    document.getElementById("file-size").textContent = formatSize(file.size);
    document.getElementById("preview-panel").classList.remove("hidden");
    document.getElementById("analyze-btn").disabled = false;
  }

  function clearSelection() {
    selectedFile = null;
    revokePreview();
    document.getElementById("file-input").value = "";
    document.getElementById("camera-input").value = "";
    document.getElementById("preview-panel").classList.add("hidden");
    document.getElementById("analyze-btn").disabled = true;
  }

  function acceptFile(file) {
    showAlert("");
    if (!file) {
      showAlert("Please choose a crop image first.");
      return;
    }
    if (!isAllowed(file)) {
      showAlert("Unsupported image type. Use JPG, JPEG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      showAlert("Image is too large. Please stay under 10 MB.");
      return;
    }
    setPreview(file);
  }

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () {
        reject(new Error("Could not read the selected image."));
      };
      reader.onload = function () {
        var image = new Image();
        image.onload = function () {
          var maxW = 900;
          var scale = Math.min(1, maxW / image.width);
          var canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          var ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        };
        image.onerror = function () {
          reject(new Error("The selected file is not a valid image."));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function setStep(index) {
    var items = document.querySelectorAll("#progress-steps li");
    items.forEach(function (item, i) {
      item.classList.toggle("is-done", i < index);
      item.classList.toggle("is-active", i === index);
      var mark = i < index ? "✓ " : i === index ? "● " : "○ ";
      if (!/^[✓●○]/.test(item.textContent)) {
        item.textContent = mark + item.textContent;
      } else {
        item.textContent = mark + item.textContent.replace(/^[✓●○]\s/, "");
      }
    });
  }

  function runAnalysis() {
    if (!selectedFile) {
      showAlert("Please choose a crop image first.");
      return;
    }
    document.getElementById("upload-panel").classList.add("hidden");
    document.getElementById("preview-panel").classList.add("hidden");
    document.getElementById("loading-panel").classList.remove("hidden");
    setStep(0);

    var timers = [
      setTimeout(function () { setStep(1); }, 400),
      setTimeout(function () { setStep(2); }, 900),
      setTimeout(function () { setStep(3); }, 1400)
    ];

    compressImage(selectedFile)
      .then(function (dataUrl) {
        return AgriAPI.analyzeCrop({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          imageDataUrl: dataUrl
        });
      })
      .then(function () {
        timers.forEach(clearTimeout);
        window.location.href = "result.html";
      })
      .catch(function (err) {
        timers.forEach(clearTimeout);
        document.getElementById("loading-panel").classList.add("hidden");
        document.getElementById("upload-panel").classList.remove("hidden");
        document.getElementById("preview-panel").classList.remove("hidden");
        showAlert((err && err.message) || "Analysis could not be completed. Please try again.");
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var dropzone = document.getElementById("dropzone");
    var fileInput = document.getElementById("file-input");
    var cameraInput = document.getElementById("camera-input");

    document.getElementById("choose-btn").addEventListener("click", function (event) {
      event.stopPropagation();
      fileInput.click();
    });
    document.getElementById("camera-btn").addEventListener("click", function (event) {
      event.stopPropagation();
      cameraInput.click();
    });
    dropzone.addEventListener("click", function () {
      fileInput.click();
    });
    dropzone.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
      }
    });
    fileInput.addEventListener("change", function () {
      if (fileInput.files[0]) acceptFile(fileInput.files[0]);
    });
    cameraInput.addEventListener("change", function () {
      if (cameraInput.files[0]) acceptFile(cameraInput.files[0]);
    });
    ["dragenter", "dragover"].forEach(function (name) {
      dropzone.addEventListener(name, function (event) {
        event.preventDefault();
        dropzone.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach(function (name) {
      dropzone.addEventListener(name, function (event) {
        event.preventDefault();
        dropzone.classList.remove("is-dragover");
      });
    });
    dropzone.addEventListener("drop", function (event) {
      var file = event.dataTransfer.files[0];
      acceptFile(file);
    });
    document.getElementById("remove-btn").addEventListener("click", clearSelection);
    document.getElementById("analyze-btn").addEventListener("click", runAnalysis);
  });
})();
