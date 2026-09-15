(function () {
  "use strict";

  var MAX_BYTES = 10 * 1024 * 1024;
  var ALLOWED = ["image/jpeg", "image/png", "image/webp"];
  var selectedFile = null;
  var objectUrl = null;
  var selectedSymptoms = [];

  var STEP_TITLES = [
    "Preprocessing image & isolating foliage...",
    "Verifying crop species & leaf geometry...",
    "Scanning lesion patterns & spore signatures...",
    "Compiling verified organic & chemical remedies...",
    "Finalizing diagnostic report...",
    "Diagnosis Complete!"
  ];

  function showAlert(message) {
    var el = document.getElementById("scan-alert");
    if (!el) return;
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
    if (img) {
      img.src = objectUrl;
      img.onerror = function () {
        showAlert("This image could not be loaded. Please choose another photo.");
        clearSelection();
      };
    }

    var loadingImg = document.getElementById("loading-image");
    if (loadingImg) {
      loadingImg.src = objectUrl;
    }

    var nameEl = document.getElementById("file-name");
    var sizeEl = document.getElementById("file-size");
    if (nameEl) nameEl.textContent = file.name;
    if (sizeEl) sizeEl.textContent = formatSize(file.size);

    var uploadPanel = document.getElementById("upload-panel");
    var previewPanel = document.getElementById("preview-panel");
    var analyzeBtn = document.getElementById("analyze-btn");

    if (uploadPanel) uploadPanel.classList.add("hidden");
    if (previewPanel) previewPanel.classList.remove("hidden");
    if (analyzeBtn) analyzeBtn.disabled = false;
    showAlert("");
  }

  function clearSelection() {
    selectedFile = null;
    revokePreview();
    var fileInput = document.getElementById("file-input");
    var cameraInput = document.getElementById("camera-input");
    if (fileInput) fileInput.value = "";
    if (cameraInput) cameraInput.value = "";

    var uploadPanel = document.getElementById("upload-panel");
    var previewPanel = document.getElementById("preview-panel");
    var analyzeBtn = document.getElementById("analyze-btn");

    if (uploadPanel) uploadPanel.classList.remove("hidden");
    if (previewPanel) previewPanel.classList.add("hidden");
    if (analyzeBtn) analyzeBtn.disabled = true;
    showAlert("");
  }

  function acceptFile(file) {
    showAlert("");
    if (!file) {
      showAlert("Please select a crop leaf photo.");
      return;
    }
    if (!isAllowed(file)) {
      showAlert("Unsupported image format. Please use JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      showAlert("Image is too large (" + formatSize(file.size) + "). Maximum size is 10 MB.");
      return;
    }
    setPreview(file);
  }

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () {
        reject(new Error("Could not read the selected image file."));
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
          resolve(canvas.toDataURL("image/jpeg", 0.78));
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
    var progressFill = document.getElementById("scan-progress-fill");
    var headline = document.getElementById("loading-headline");

    items.forEach(function (item, i) {
      var done = i < index;
      var active = i === index;
      item.classList.toggle("completed", done);
      item.classList.toggle("active", active);

      var icon = item.querySelector(".hud-step-icon");
      if (icon) {
        if (done) icon.innerHTML = "✓";
        else if (active) icon.innerHTML = "●";
        else icon.innerHTML = String(i + 1);
      }
    });

    if (progressFill) {
      var pct = Math.min(100, Math.round(((index + 1) / (items.length + 1)) * 100));
      progressFill.style.width = pct + "%";
    }

    if (headline && STEP_TITLES[index]) {
      headline.textContent = STEP_TITLES[index];
    }
  }

  function runAnalysis() {
    if (!selectedFile) {
      showAlert("Please choose a crop image first.");
      return;
    }

    var uploadPanel = document.getElementById("upload-panel");
    var previewPanel = document.getElementById("preview-panel");
    var loadingPanel = document.getElementById("loading-panel");
    var loadingImg = document.getElementById("loading-image");

    if (loadingImg && objectUrl) {
      loadingImg.src = objectUrl;
    }

    if (uploadPanel) uploadPanel.classList.add("hidden");
    if (previewPanel) previewPanel.classList.add("hidden");
    if (loadingPanel) loadingPanel.classList.remove("hidden");
    showAlert("");
    setStep(0);

    var timers = [
      setTimeout(function () { setStep(1); }, 450),
      setTimeout(function () { setStep(2); }, 950),
      setTimeout(function () { setStep(3); }, 1500)
    ];

    var cropHint = document.getElementById("crop-type-hint");
    var stageHint = document.getElementById("crop-stage-hint");
    var notesHint = document.getElementById("crop-notes-hint");

    compressImage(selectedFile)
      .then(function (dataUrl) {
        return AgriAPI.analyzeCrop({
          file: selectedFile,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          imageDataUrl: dataUrl,
          cropHint: cropHint ? cropHint.value : "",
          growthStage: stageHint ? stageHint.value : "",
          symptoms: selectedSymptoms.join(", "),
          notes: notesHint ? notesHint.value : ""
        });
      })
      .then(function (result) {
        timers.forEach(clearTimeout);
        setStep(3);
        var progressFill = document.getElementById("scan-progress-fill");
        if (progressFill) progressFill.style.width = "100%";
        setTimeout(function () {
          window.location.href = "result.html?id=" + encodeURIComponent(result.id);
        }, 400);
      })
      .catch(function (err) {
        timers.forEach(clearTimeout);
        if (loadingPanel) loadingPanel.classList.add("hidden");
        if (previewPanel) previewPanel.classList.remove("hidden");
        showAlert((err && err.message) || "Analysis could not be completed. Please check your image and try again.");
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var dropzone = document.getElementById("dropzone");
    var fileInput = document.getElementById("file-input");
    var cameraInput = document.getElementById("camera-input");
    var chooseBtn = document.getElementById("choose-btn");
    var cameraBtn = document.getElementById("camera-btn");
    var cameraCard = document.getElementById("camera-card");
    var uploadCard = document.getElementById("upload-card");
    var removeBtn = document.getElementById("remove-btn");
    var analyzeBtn = document.getElementById("analyze-btn");
    var symptomChips = document.querySelectorAll(".symptom-chip");

    if (chooseBtn && fileInput) {
      chooseBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (uploadCard && fileInput) {
      uploadCard.addEventListener("click", function () {
        fileInput.click();
      });
    }

    var cameraModal = document.getElementById("camera-permission-modal");
    var allowCameraBtn = document.getElementById("btn-allow-camera");
    var chooseFileInsteadBtn = document.getElementById("btn-choose-file-instead");
    var cancelCameraBtn = document.getElementById("btn-cancel-camera");

    function promptCameraPermission(e) {
      if (e) e.stopPropagation();
      if (cameraModal) {
        cameraModal.classList.remove("hidden");
      } else if (cameraInput) {
        cameraInput.click();
      }
    }

    function closeCameraModal() {
      if (cameraModal) {
        cameraModal.classList.add("hidden");
      }
    }

    if (cameraBtn) {
      cameraBtn.addEventListener("click", promptCameraPermission);
    }

    if (cameraCard) {
      cameraCard.addEventListener("click", promptCameraPermission);
    }

    if (allowCameraBtn && cameraInput) {
      allowCameraBtn.addEventListener("click", function () {
        closeCameraModal();
        // Check / request user media permission
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function (stream) {
              // Permission granted! Stop test stream and launch camera capture
              stream.getTracks().forEach(function (track) { track.stop(); });
              cameraInput.click();
            })
            .catch(function (err) {
              // Permission was denied or error, inform farmer gracefully
              console.warn("Camera permission rejected or unavailable:", err);
              showAlert("Camera permission was denied in your browser settings. You can grant access or choose a leaf image from your files.");
            });
        } else {
          // Direct fallback
          cameraInput.click();
        }
      });
    }

    if (chooseFileInsteadBtn && fileInput) {
      chooseFileInsteadBtn.addEventListener("click", function () {
        closeCameraModal();
        fileInput.click();
      });
    }

    if (cancelCameraBtn) {
      cancelCameraBtn.addEventListener("click", closeCameraModal);
    }

    if (cameraModal) {
      cameraModal.addEventListener("click", function (e) {
        if (e.target === cameraModal) closeCameraModal();
      });
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", function () {
        fileInput.click();
      });

      ["dragenter", "dragover"].forEach(function (name) {
        dropzone.addEventListener(name, function (e) {
          e.preventDefault();
          dropzone.classList.add("dragover");
        });
      });

      ["dragleave", "drop"].forEach(function (name) {
        dropzone.addEventListener(name, function (e) {
          e.preventDefault();
          dropzone.classList.remove("dragover");
        });
      });

      dropzone.addEventListener("drop", function (e) {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          acceptFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", function () {
        if (fileInput.files && fileInput.files[0]) {
          acceptFile(fileInput.files[0]);
        }
      });
    }

    if (cameraInput) {
      cameraInput.addEventListener("change", function () {
        if (cameraInput.files && cameraInput.files[0]) {
          acceptFile(cameraInput.files[0]);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", clearSelection);
    }

    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", runAnalysis);
    }

    symptomChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var tag = chip.getAttribute("data-tag");
        var active = chip.classList.toggle("active");
        if (active) {
          if (selectedSymptoms.indexOf(tag) === -1) selectedSymptoms.push(tag);
        } else {
          selectedSymptoms = selectedSymptoms.filter(function (t) { return t !== tag; });
        }
      });
    });
  });
})();
