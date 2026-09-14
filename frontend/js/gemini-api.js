(function (global) {
  "use strict";

  // Override with a global before loading this file if the API is hosted elsewhere.
  var API_BASE = global.AGRI_GEMINI_API_BASE || "http://127.0.0.1:8000";
  var history = [];

  function getFarmContext() {
    try {
      return (global.AgriAPI && AgriAPI.getFarmContext) ? AgriAPI.getFarmContext() : {};
    } catch (e) {
      return {};
    }
  }

  function getLastResult() {
    try {
      return (global.AgriAPI && AgriAPI.getLastResult) ? AgriAPI.getLastResult() : null;
    } catch (e) {
      return null;
    }
  }

  function buildContext(customContext) {
    var farm = getFarmContext();
    var result = getLastResult() || {};
    var ctx = Object.assign({}, farm, customContext || {});

    // Give Gemini the latest actual scan result when available.
    if (result.crop) ctx.crop = result.crop;
    if (result.disease) ctx.disease = result.disease;
    if (result.confidence != null) ctx.confidence = result.confidence;
    if (result.risk) ctx.risk = result.risk;
    if (result.symptoms) ctx.symptoms = result.symptoms;
    if (result.recommendations) ctx.recommendations = result.recommendations;

    return ctx;
  }

  function getLanguage() {
    try {
      return (global.AgriApp && AgriApp.getLanguage) ? AgriApp.getLanguage() : (localStorage.getItem("agrismart_lang") || "en");
    } catch (e) {
      return "en";
    }
  }

  async function ask(message, customContext) {
    var response = await fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        context: buildContext(customContext),
        history: history.slice(-8),
        language: getLanguage()
      })
    });

    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      var err = new Error(data.message || "Khedut Mitr backend request failed");
      err.status = response.status;
      throw err;
    }

    var answer = data.answer || "I could not generate an answer right now.";
    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: answer });
    history = history.slice(-8);
    return answer;
  }

  function reset() {
    history = [];
  }

  global.AgriGemini = {
    ask: ask,
    reset: reset,
    getContext: buildContext
  };
})(window);
