(function (global) {
  "use strict";

  var KEYS = {
    history: "agrismart_scan_history",
    settings: "agrismart_settings",
    lastResult: "agrismart_last_result",
    seeded: "agrismart_demo_seeded"
  };

  var DEMO_CATALOG = [
    {
      crop: "Tomato",
      disease: "Early Blight",
      confidence: 0.92,
      risk: "Moderate",
      explanation: "The analysis indicates visual patterns commonly associated with Early Blight.",
      symptoms: [
        "Dark circular lesions",
        "Yellowing around affected areas",
        "Progressive leaf damage"
      ],
      recommendations: [
        "Remove severely affected leaves.",
        "Improve airflow between plants.",
        "Avoid prolonged leaf wetness.",
        "Monitor nearby plants for similar symptoms."
      ]
    },
    {
      crop: "Cotton",
      disease: "Healthy",
      confidence: 0.96,
      risk: "Low",
      explanation: "Leaf color and texture appear consistent with a healthy cotton plant in this demonstration result.",
      symptoms: ["No significant lesions detected", "Even leaf coloration"],
      recommendations: [
        "Continue routine crop monitoring.",
        "Keep records of weather and irrigation.",
        "Scan again if new spots or wilting appear."
      ]
    },
    {
      crop: "Chilli",
      disease: "Leaf Spot",
      confidence: 0.88,
      risk: "Moderate",
      explanation: "Spotted patterns on the leaf resemble common chilli leaf spot in this mock analysis.",
      symptoms: ["Small dark spots on leaves", "Possible yellow halos", "Localized tissue damage"],
      recommendations: [
        "Isolate heavily affected leaves when practical.",
        "Avoid overhead watering late in the day.",
        "Check neighboring plants for spread.",
        "Consult a local agri-extension officer for confirmation."
      ]
    },
    {
      crop: "Wheat",
      disease: "Healthy",
      confidence: 0.94,
      risk: "Low",
      explanation: "No strong disease signatures were flagged in this demonstration scan.",
      symptoms: ["Uniform leaf appearance", "No rust-like pustules detected"],
      recommendations: [
        "Maintain current field hygiene practices.",
        "Watch for rust during humid periods.",
        "Repeat scans across different plants."
      ]
    },
    {
      crop: "Potato",
      disease: "Late Blight",
      confidence: 0.9,
      risk: "High",
      explanation: "The mock model associated this sample with Late Blight-like visual cues.",
      symptoms: ["Water-soaked lesions", "Rapid browning", "Possible stem involvement"],
      recommendations: [
        "Treat this as a high-priority field check.",
        "Remove and destroy severely infected foliage if advised locally.",
        "Reduce leaf wetness where possible.",
        "Seek expert confirmation before applying any treatment."
      ]
    },
    {
      crop: "Rice",
      disease: "Healthy",
      confidence: 0.91,
      risk: "Low",
      explanation: "This demonstration result suggests generally healthy rice foliage.",
      symptoms: ["Green leaf tissue", "No blast-like lesions flagged"],
      recommendations: [
        "Continue balanced water management.",
        "Inspect lower canopy periodically.",
        "Keep a scan history across the season."
      ]
    },
    {
      crop: "Tomato",
      disease: "Powdery Mildew",
      confidence: 0.86,
      risk: "Moderate",
      explanation: "Whitish patterns in the sample resemble powdery mildew in this demo dataset.",
      symptoms: ["Powdery white patches", "Leaf yellowing", "Reduced vigor"],
      recommendations: [
        "Improve plant spacing and airflow.",
        "Avoid dense, humid microclimates.",
        "Monitor new growth weekly."
      ]
    },
    {
      crop: "Wheat",
      disease: "Rust",
      confidence: 0.87,
      risk: "High",
      explanation: "Orange-brown cues in the demonstration image were mapped to rust-like conditions.",
      symptoms: ["Rust-colored pustules", "Leaf drying", "Patchy field stress"],
      recommendations: [
        "Inspect the wider plot for spread.",
        "Note weather conditions around the scan.",
        "Get a local expert diagnosis before acting."
      ]
    }
  ];

  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function uid() {
    return "scan_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function hoursAgo(hours) {
    return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  }

  function buildSeedHistory() {
    var samples = [
      { catalog: 0, hours: 2, fileName: "tomato-leaf.jpg" },
      { catalog: 1, hours: 8, fileName: "cotton-healthy.jpg" },
      { catalog: 2, hours: 20, fileName: "chilli-spot.jpg" },
      { catalog: 3, hours: 30, fileName: "wheat-field.jpg" },
      { catalog: 4, hours: 48, fileName: "potato-leaf.jpg" },
      { catalog: 5, hours: 72, fileName: "rice-leaf.jpg" }
    ];
    return samples.map(function (item) {
      var base = DEMO_CATALOG[item.catalog];
      return Object.assign({}, base, {
        id: uid(),
        scannedAt: hoursAgo(item.hours),
        fileName: item.fileName,
        imageDataUrl: "",
        demo: true,
        saved: true
      });
    });
  }

  function ensureSeed() {
    if (!localStorage.getItem(KEYS.history)) {
      writeJson(KEYS.history, buildSeedHistory());
      localStorage.setItem(KEYS.seeded, "1");
    }
    if (!localStorage.getItem(KEYS.settings)) {
      writeJson(KEYS.settings, {
        farmerName: "Farmer",
        farmName: "Greenfield Farm",
        location: "India",
        language: "en",
        notifications: true,
        theme: "light"
      });
    }
  }

  function hashString(value) {
    var hash = 0;
    var text = String(value || "");
    for (var i = 0; i < text.length; i += 1) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getSettings() {
    ensureSeed();
    return readJson(KEYS.settings, {
      farmerName: "Farmer",
      farmName: "",
      location: "",
      language: "en",
      notifications: true,
      theme: "light"
    });
  }

  function saveSettings(next) {
    var current = getSettings();
    var merged = Object.assign({}, current, next);
    var ok = writeJson(KEYS.settings, merged);
    if (!ok) {
      return { ok: false, error: "Could not save settings on this device." };
    }
    return { ok: true, settings: merged };
  }

  function getScanHistory() {
    ensureSeed();
    var list = readJson(KEYS.history, []);
    return list.slice().sort(function (a, b) {
      return new Date(b.scannedAt) - new Date(a.scannedAt);
    });
  }

  function getScanById(id) {
    var match = getScanHistory().find(function (item) {
      return item.id === id;
    });
    if (match) return match;
    var last = getLastResult();
    if (last && last.id === id) return last;
    return null;
  }

  function getLastResult() {
    return readJson(KEYS.lastResult, null);
  }

  function setLastResult(result) {
    var ok = writeJson(KEYS.lastResult, result);
    if (!ok && result && result.imageDataUrl) {
      var lite = Object.assign({}, result, { imageDataUrl: "" });
      writeJson(KEYS.lastResult, lite);
      return { ok: true, trimmed: true };
    }
    return { ok: ok };
  }

  function saveScan(scan) {
    var history = getScanHistory();
    var record = Object.assign({}, scan, { saved: true });
    var existing = history.findIndex(function (item) {
      return item.id === record.id;
    });
    if (existing >= 0) {
      history[existing] = record;
    } else {
      history.unshift(record);
    }
    var ok = writeJson(KEYS.history, history);
    if (!ok) {
      record.imageDataUrl = "";
      if (existing >= 0) history[existing] = record;
      else history[0] = record;
      ok = writeJson(KEYS.history, history);
      if (!ok) {
        return { ok: false, error: "Storage is full. Try clearing old history." };
      }
      setLastResult(record);
      return { ok: true, scan: record, trimmed: true };
    }
    setLastResult(record);
    return { ok: true, scan: record };
  }

  function deleteScan(id) {
    var next = getScanHistory().filter(function (item) {
      return item.id !== id;
    });
    writeJson(KEYS.history, next);
    return { ok: true };
  }

  function clearHistory() {
    writeJson(KEYS.history, []);
    localStorage.removeItem(KEYS.lastResult);
    return { ok: true };
  }

  function getDashboardStats() {
    var history = getScanHistory();
    var healthy = history.filter(function (item) {
      return item.disease === "Healthy" || item.risk === "Low";
    }).length;
    var issues = history.filter(function (item) {
      return item.disease !== "Healthy";
    }).length;
    var crops = {};
    history.forEach(function (item) {
      crops[item.crop] = true;
    });
    return {
      totalScans: history.length,
      healthyCrops: healthy,
      issuesDetected: issues,
      cropsMonitored: Object.keys(crops).length,
      recent: history.slice(0, 4),
      weekly: [2, 4, 3, 5, 6, 4, history.length ? Math.min(8, history.length) : 1]
    };
  }

  function getInsights() {
    var history = getScanHistory();
    var total = history.length || 1;
    var healthy = history.filter(function (item) {
      return item.disease === "Healthy";
    }).length;
    var high = history.filter(function (item) {
      return item.risk === "High";
    }).length;
    var attention = Math.max(0, history.length - healthy - high);
    var counts = {};
    history.forEach(function (item) {
      if (item.disease !== "Healthy") {
        counts[item.disease] = (counts[item.disease] || 0) + 1;
      }
    });
    var common = ["Early Blight", "Leaf Spot", "Powdery Mildew", "Rust"].map(function (name) {
      return { name: name, count: counts[name] || 0 };
    });
    var cropCounts = {};
    history.forEach(function (item) {
      if (item.disease !== "Healthy") {
        cropCounts[item.crop] = (cropCounts[item.crop] || 0) + 1;
      }
    });
    var topCrop = Object.keys(cropCounts).sort(function (a, b) {
      return cropCounts[b] - cropCounts[a];
    })[0];
    var healthyPct = Math.round((healthy / total) * 100);
    var highPct = Math.round((high / total) * 100);
    var attentionPct = Math.max(0, 100 - healthyPct - highPct);
    return {
      healthyPct: healthyPct,
      attentionPct: attentionPct,
      highPct: highPct,
      common: common,
      cards: [
        topCrop
          ? topCrop + " crops showed the highest number of recent alerts."
          : "No disease alerts are stored yet.",
        healthy >= attention
          ? "Most recent scans indicate generally healthy crop conditions."
          : "Several recent scans need attention. Review history and rescan affected fields."
      ],
      trend: [62, 64, 66, 63, 68, 70, Math.max(40, Math.round((healthy / total) * 100))]
    };
  }

  function analyzeCrop(payload) {
    ensureSeed();
    var wait = 1700 + Math.floor(Math.random() * 900);
    return delay(wait).then(function () {
      if (payload && payload.forceError) {
        return Promise.reject({
          code: "ANALYSIS_FAILED",
          message: "Analysis could not be completed. Please try again."
        });
      }
      var key = (payload && (payload.fileName + payload.fileSize)) || String(Date.now());
      var pick = DEMO_CATALOG[hashString(key) % DEMO_CATALOG.length];
      var result = Object.assign({}, pick, {
        id: uid(),
        scannedAt: new Date().toISOString(),
        fileName: payload && payload.fileName ? payload.fileName : "crop-image",
        imageDataUrl: payload && payload.imageDataUrl ? payload.imageDataUrl : "",
        demo: true,
        saved: false
      });
      setLastResult(result);
      return result;
    });
  }

  ensureSeed();

  global.AgriAPI = {
    KEYS: KEYS,
    analyzeCrop: analyzeCrop,
    getScanHistory: getScanHistory,
    getScanById: getScanById,
    getDashboardStats: getDashboardStats,
    getInsights: getInsights,
    saveScan: saveScan,
    deleteScan: deleteScan,
    clearHistory: clearHistory,
    getLastResult: getLastResult,
    setLastResult: setLastResult,
    getSettings: getSettings,
    saveSettings: saveSettings
  };
})(window);
