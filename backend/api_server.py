"""Minimal HTTP API for the AgriSmart AI frontend and Khedut Mitr.

Run from this directory:
    pip install -r requirements.txt
    python api_server.py

The server exposes the real crop-analysis and Khedut Mitr APIs. AI provider keys stay server-side.
"""
from __future__ import annotations

import os
import base64
import re
import tempfile
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv

# Must run before any local `src.*` import -- src/database/connection.py reads
# MONGODB_URI from the environment as soon as it's imported, so loading .env
# any later means it silently falls back to the localhost default even when
# a real (e.g. cloud/Atlas) URI is set in .env.
load_dotenv()

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from src.khedut_mitr import KhedutMitrRouter
from src.infer import LeafPredictor
from src.config import DEFAULT_OUTPUT_DIR, VALID_EXTENSIONS
from src.disease_advisory import get_disease_advisory
from src.irrigation import evaluate_irrigation
from src.sustainability import compute_sustainability_score
from src import database as db
from src.database.models import PredictionModel, ChatHistoryModel, UserModel

app = Flask(__name__)

if db.is_configured():
    try:
        db.init_db()
        app.logger.info("MongoDB persistence enabled (db=%s)", db.get_db().name)
    except Exception:
        app.logger.exception(
            "MONGODB_URI is set but the database could not be reached; "
            "continuing without persistence."
        )
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        # A wider default set of common local static-server ports, since the
        # launcher script (start.bat) auto-picks whichever of these is free
        # on the machine it's run on (5500 is VS Code Live Server's default
        # and is often already taken by it).
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:5500,http://127.0.0.1:5500,"
        "http://localhost:5501,http://127.0.0.1:5501,"
        "http://localhost:5502,http://127.0.0.1:5502,"
        "http://localhost:8080,http://127.0.0.1:8080,"
        "http://localhost:3000,http://127.0.0.1:3000"
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


# The Crop Type dropdown on the scan form offers more crops than the trained
# model actually knows. Map each supported hint to the crop-name prefix(es)
# used in the model's class labels (e.g. "Corn___..." / "Corn_(maize)___...").
# Hints not listed here (Wheat, Cotton, Rice) aren't in the training data at
# all, so we're upfront about that instead of silently mislabeling the crop.
CROP_HINT_MODEL_MAP = {
    "tomato": ["Tomato"],
    "potato": ["Potato"],
    "corn": ["Corn", "Corn (maize)"],
    # Closest available class -- bell pepper, not chilli pepper -- so this
    # match is approximate, not a species-exact identification.
    "chilli": ["Pepper, bell", "Pepper bell", "Pepper"],
}
UNSUPPORTED_CROP_HINTS = {"wheat", "cotton", "rice"}


def apply_crop_hint(prediction: dict, crop_hint: str):
    """Use an optional farmer-provided crop hint to sanity-check the model's
    guess. This never invents a class the model didn't already propose --
    it only re-ranks among the model's own top-k candidates, or flags a
    mismatch so the farmer isn't misled by a confident-looking wrong answer.
    """
    info = {
        "cropHint": crop_hint or None,
        "cropHintSupported": None,
        "cropHintMatched": False,
        "cropMismatch": False,
        "cropMismatchMessage": None,
    }
    if not crop_hint:
        return prediction, info

    key = crop_hint.strip().lower()
    top_k = prediction.get("top_k") or [{"class": prediction["predicted_class"], "confidence": prediction["confidence"]}]

    if key in UNSUPPORTED_CROP_HINTS:
        info["cropHintSupported"] = False
        info["cropMismatch"] = True
        info["cropMismatchMessage"] = (
            f"The AI model isn't trained on {crop_hint} yet, so this is its best guess from the "
            "crops it does recognize (tomato, potato, corn, apple, grape, cherry, bell pepper). "
            "Treat this diagnosis as unreliable for your crop."
        )
        return prediction, info

    aliases = CROP_HINT_MODEL_MAP.get(key)
    info["cropHintSupported"] = aliases is not None
    if not aliases:
        # Unrecognized or "Other" hint -- nothing to cross-check against.
        return prediction, info

    def crop_matches(class_name: str) -> bool:
        crop_part = class_name.split("___", 1)[0].replace("_", " ").strip().lower()
        return any(crop_part == alias.lower() for alias in aliases)

    if crop_matches(top_k[0]["class"]):
        info["cropHintMatched"] = True
        return prediction, info

    for candidate in top_k[1:]:
        if crop_matches(candidate["class"]):
            promoted = dict(prediction)
            promoted["predicted_class"] = candidate["class"]
            promoted["confidence"] = candidate["confidence"]
            info["cropHintMatched"] = True
            info["cropMismatch"] = True
            info["cropMismatchMessage"] = (
                f"The model's top guess wasn't {crop_hint}, so we used its next-best match for "
                f"{crop_hint} instead (confidence {candidate['confidence']:.0%})."
            )
            return promoted, info

    fallback_crop, _ = split_prediction_class(top_k[0]["class"])
    info["cropMismatch"] = True
    info["cropMismatchMessage"] = (
        f"This photo doesn't look like {crop_hint} to the AI -- its top guess was {fallback_crop}. "
        "Double-check the crop selection or retake the photo."
    )
    return prediction, info


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


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _public_user(doc: dict) -> dict:
    """Never send password_hash or raw Mongo internals to the browser."""
    return {
        "id": str(doc.get("_id")),
        "name": doc.get("name"),
        "email": doc.get("email"),
    }


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
        "database_configured": db.is_configured(),
        "database_connected": db.ping_db() if db.is_configured() else False,
    })


@app.post("/api/irrigation")
def irrigation():
    """Bonus Module B — Smart Irrigation. See src/irrigation.py for the
    published decision logic and its validation method."""
    data = request.get_json(silent=True) or {}
    try:
        moisture = float(data.get("moisture_pct"))
        rain_prob = float(data.get("rain_probability_pct"))
    except (TypeError, ValueError):
        return jsonify({
            "error": "INVALID_INPUT",
            "message": "moisture_pct and rain_probability_pct (numbers, 0-100) are required.",
        }), 400

    result = evaluate_irrigation(
        moisture,
        rain_prob,
        crop=data.get("crop", "Tomato"),
        growth_stage=data.get("growth_stage", "Vegetative"),
    )
    return jsonify(result)


@app.post("/api/sustainability")
def sustainability():
    """Bonus Module D — Sustainability Score. See src/sustainability.py for
    the published, exact scoring formula."""
    data = request.get_json(silent=True) or {}
    result = compute_sustainability_score(
        irrigation_method=data.get("irrigation_method", "drip"),
        advice_followed_pct=float(data.get("advice_followed_pct", 100.0)),
        disease_free_scan_pct=data.get("disease_free_scan_pct"),
        rotated_from_different_family=bool(data.get("rotated_from_different_family", True)),
        crop_diversity=int(data.get("crop_diversity", 1)),
        uses_organic_compost=bool(data.get("uses_organic_compost", False)),
        mulching=bool(data.get("mulching", False)),
        soil_type=data.get("soil_type", "Loamy"),
        pesticide_use=data.get("pesticide_use", "moderate"),
    )
    return jsonify(result)


@app.post("/api/auth/signup")
def signup():
    """Create a farmer account. Password is hashed before it ever touches the database."""
    if not db.is_configured():
        return jsonify({
            "error": "ACCOUNT_STORAGE_NOT_CONFIGURED",
            "message": "Sign-up requires the server to have MONGODB_URI configured. You can still continue as a guest.",
        }), 503

    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name:
        return jsonify({"error": "NAME_REQUIRED", "message": "Please enter your name."}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"error": "INVALID_EMAIL", "message": "Please enter a valid email address."}), 400
    if len(password) < 6:
        return jsonify({"error": "WEAK_PASSWORD", "message": "Password must be at least 6 characters."}), 400

    users = db.get_users()
    if users.find_one({"email": email}):
        return jsonify({
            "error": "EMAIL_EXISTS",
            "message": "An account with this email already exists. Please sign in instead.",
        }), 409

    doc = UserModel(name=name, email=email, password_hash=generate_password_hash(password)).model_dump()
    try:
        result = users.insert_one(doc)
    except Exception as exc:
        # Covers a duplicate-key race (two signups for the same email at once)
        # and any other insert failure.
        if "duplicate key" in str(exc).lower():
            return jsonify({
                "error": "EMAIL_EXISTS",
                "message": "An account with this email already exists. Please sign in instead.",
            }), 409
        app.logger.exception("Signup failed")
        return jsonify({"error": "SIGNUP_FAILED", "message": "Could not create the account right now."}), 500

    doc["_id"] = result.inserted_id
    return jsonify({"user": _public_user(doc)}), 201


@app.post("/api/auth/login")
def login():
    """Verify credentials against the stored (hashed) password. Never returns the hash."""
    if not db.is_configured():
        return jsonify({
            "error": "ACCOUNT_STORAGE_NOT_CONFIGURED",
            "message": "Sign-in requires the server to have MONGODB_URI configured. You can still continue as a guest.",
        }), 503

    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "CREDENTIALS_REQUIRED", "message": "Email and password are required."}), 400

    user = db.get_users().find_one({"email": email})
    if not user or not check_password_hash(user.get("password_hash", ""), password):
        return jsonify({"error": "INVALID_CREDENTIALS", "message": "Incorrect email or password."}), 401
    if not user.get("is_active", True):
        return jsonify({"error": "ACCOUNT_DISABLED", "message": "This account has been disabled."}), 403

    return jsonify({"user": _public_user(user)}), 200


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

        crop_hint = (request.form.get("cropHint") or "").strip()
        # Widen top-k when a hint is given so there's something to cross-check against.
        prediction = get_predictor().predict(temp_path, topk=5 if crop_hint else 3)
        prediction, crop_hint_info = apply_crop_hint(prediction, crop_hint)
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
        response.update(crop_hint_info)

        if db.is_configured():
            try:
                doc = PredictionModel(
                    crop=crop,
                    disease=disease,
                    confidence=confidence,
                    image_path=filename,
                    model_class=predicted_class,
                    model_architecture="EfficientNet-B0",
                    risk=risk,
                    top_k=prediction.get("top_k", []),
                ).model_dump()
                db.get_predictions().insert_one(doc)
            except Exception:
                app.logger.exception("Failed to persist prediction; continuing without it")

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
        resolved_language = language if language in {"en", "hi", "gu"} else "en"
        answer = assistant.ask(
            question=question,
            context=context,
            history=history,
            language=resolved_language,
        )

        if db.is_configured():
            try:
                doc = ChatHistoryModel(
                    message=question,
                    response=answer,
                    provider=assistant.last_provider,
                    model=assistant.last_model,
                    language=resolved_language,
                    context=context,
                ).model_dump()
                db.get_chat_history().insert_one(doc)
            except Exception:
                app.logger.exception("Failed to persist chat history; continuing without it")

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
