"""Minimal HTTP API for the AgriSmart AI frontend and Khedut Mitr.

Run from this directory:
    pip install -r requirements.txt
    python api_server.py

The server exposes the real crop-analysis and Khedut Mitr APIs. AI provider keys stay server-side.
"""
from __future__ import annotations

import os
import base64
import tempfile
import uuid
from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from src.khedut_mitr import KhedutMitrRouter
from src.infer import LeafPredictor
from src.config import DEFAULT_OUTPUT_DIR, VALID_EXTENSIONS
from src.disease_advisory import get_disease_advisory

load_dotenv()

app = Flask(__name__)
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5500,http://127.0.0.1:5500"
    ).split(",")
    if origin.strip()
]
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})


def get_assistant() -> KhedutMitrRouter:
    return KhedutMitrRouter()


MODEL_PATH = os.path.join(DEFAULT_OUTPUT_DIR, "best_model.pt")
_predictor = None


def get_predictor() -> LeafPredictor:
    global _predictor
    if _predictor is None:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError(f"Trained model not found: {MODEL_PATH}")
        _predictor = LeafPredictor(MODEL_PATH)
    return _predictor


def split_prediction_class(predicted_class: str):
    if "___" in predicted_class:
        crop, disease = predicted_class.split("___", 1)
    else:
        crop, disease = predicted_class, "Unknown"
    crop = crop.replace("_", " ").strip()
    disease = disease.replace("_", " ").strip()
    if disease.lower() == "healthy":
        disease = "Healthy"
    else:
        disease = disease.title()
    return crop, disease


def calculate_risk(disease: str, confidence: float) -> str:
    # This is an action-priority label based on model confidence, not a
    # measurement of biological disease severity.
    if disease.lower() == "healthy":
        return "Low"
    if confidence >= 0.80:
        return "High"
    if confidence >= 0.60:
        return "Moderate"
    return "Low"


def _image_data_url(path: str) -> str:
    mime = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".webp": "image/webp",
        ".bmp": "image/bmp", ".tif": "image/tiff",
        ".tiff": "image/tiff",
    }.get(os.path.splitext(path)[1].lower(), "image/png")
    with open(path, "rb") as fh:
        encoded = base64.b64encode(fh.read()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


@app.get("/api/health")
def health():
    return jsonify({
        "ok": True,
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "openrouter_configured": bool(os.getenv("OPENROUTER_API_KEY")),
        "mistral_configured": bool(os.getenv("MISTRAL_API_KEY")),
        "groq_configured": bool(os.getenv("GROQ_API_KEY")),
        "khedut_mitr_providers": [
            name for name, key in (
                ("OpenRouter", "OPENROUTER_API_KEY"),
                ("Mistral", "MISTRAL_API_KEY"),
                ("Groq", "GROQ_API_KEY"),
                ("Google Gemini", "GEMINI_API_KEY"),
            ) if os.getenv(key)
        ],
        "model": os.getenv("GEMINI_MODEL", "gemini-3.6-flash"),
        "ml_model": os.path.basename(MODEL_PATH),
        "ml_model_exists": os.path.exists(MODEL_PATH),
    })


@app.post("/api/analyze")
def analyze():
    """Run the packaged trained leaf classifier on an uploaded image."""
    uploaded = request.files.get("image")
    if uploaded is None:
        return jsonify({
            "error": "IMAGE_REQUIRED",
            "message": "Please upload a crop or leaf image.",
        }), 400

    filename = uploaded.filename or "crop-image"
    extension = os.path.splitext(filename)[1].lower()
    if extension not in VALID_EXTENSIONS:
        return jsonify({
            "error": "INVALID_IMAGE_TYPE",
            "message": f"Unsupported image type. Allowed: {', '.join(sorted(VALID_EXTENSIONS))}",
        }), 400

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            uploaded.save(temp_file)
            temp_path = temp_file.name

        prediction = get_predictor().predict(temp_path, topk=3)
        predicted_class = prediction["predicted_class"]
        confidence = float(prediction["confidence"])
        crop, disease = split_prediction_class(predicted_class)
        risk = calculate_risk(disease, confidence)
        advisory = get_disease_advisory(predicted_class, crop, disease)

        # Grad-CAM is generated from the same classifier and is used only as
        # a visual explanation of model focus; it is not a lesion detector.
        gradcam_data_url = ""
        try:
            gradcam_path = os.path.join(
                tempfile.gettempdir(), f"agrismart_gradcam_{uuid.uuid4().hex}.png"
            )
            get_predictor().predict_with_gradcam(
                temp_path, gradcam_path, target_class=predicted_class
            )
            gradcam_data_url = _image_data_url(gradcam_path)
            try:
                os.remove(gradcam_path)
            except OSError:
                pass
        except Exception:
            app.logger.exception("Grad-CAM generation failed; returning prediction without explanation image")

        response = {
            "id": str(uuid.uuid4()),
            "crop": crop,
            "disease": disease,
            "confidence": confidence,
            "risk": risk,
            "explanation": advisory["explanation"],
            "symptoms": advisory["symptoms"],
            "recommendations": advisory["organicRecommendations"] + advisory["chemicalRecommendations"],
            "organicRecommendations": advisory["organicRecommendations"],
            "chemicalRecommendations": advisory["chemicalRecommendations"],
            "prevention": advisory["prevention"],
            "monitoring": advisory["monitoring"],
            "whenToSeekHelp": advisory["whenToSeekHelp"],
            "scannedAt": datetime.now(timezone.utc).isoformat(),
            "modelClass": predicted_class,
            "modelArchitecture": "EfficientNet-B0",
            "top_k": prediction.get("top_k", []),
            "gradcamDataUrl": gradcam_data_url,
            "gradcamAvailable": bool(gradcam_data_url),
            "demo": False,
        }
        return jsonify(response), 200

    except RuntimeError as exc:
        app.logger.exception("Model error")
        return jsonify({"error": "MODEL_ERROR", "message": str(exc)}), 500
    except Exception:
        app.logger.exception("Crop analysis failed")
        return jsonify({
            "error": "ANALYSIS_FAILED",
            "message": "The crop image could not be analyzed.",
        }), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass


@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    question = data.get("message", "")
    context = data.get("context") or {}
    history = data.get("history") or []
    language = data.get("language", "en")

    if not isinstance(question, str) or not question.strip():
        return jsonify({"error": "MESSAGE_REQUIRED", "message": "A message is required."}), 400
    if not isinstance(context, dict):
        return jsonify({"error": "INVALID_CONTEXT", "message": "Context must be an object."}), 400
    if not isinstance(history, list):
        history = []

    try:
        assistant = get_assistant()
        answer = assistant.ask(
            question=question,
            context=context,
            history=history,
            language=language if language in {"en", "hi", "gu"} else "en",
        )
        return jsonify({
            "answer": answer,
            "model": assistant.last_model or "unknown",
            "provider": assistant.last_provider or "AI provider",
        })
    except RuntimeError as exc:
        return jsonify({"error": "AI_PROVIDERS_NOT_CONFIGURED", "message": str(exc)}), 503
    except Exception:
        # Do not leak credentials or SDK internals to the browser.
        app.logger.exception("Khedut Mitr provider chain failed")
        return jsonify({
            "error": "AI_REQUEST_FAILED",
            "message": "Khedut Mitr could not reach an AI provider right now. Please try again."
        }), 502


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.getenv("PORT", "8000")), debug=False)
