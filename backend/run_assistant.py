"""
Run this file directly (Run button in your IDE, or `python run_assistant.py`)
instead of using the command line. Just edit the settings below.

Use this when you already have a prediction (and optionally a crop
recommendation) and just want the farmer-facing explanation — e.g. to
preview it in Hindi/Gujarati without re-running the model.
"""
from src.assistant import FarmerAssistant

# ============================ EDIT THESE ============================
PREDICTED_CLASS = "Tomato_Early_blight"     # from run_predict.py's output
CONFIDENCE = 0.91                            # 0.0-1.0, from run_predict.py's output
LANGUAGE = "en"                              # "en" | "hi" | "gu"

# Optional — paste in crop names from run_crop_recommend.py's output to
# include them in the same message. Leave as None to skip.
RECOMMENDED_CROPS = ["Wheat", "Soybean"]     # or None
# ======================================================================

assistant = FarmerAssistant(language=LANGUAGE)
crop_recs = [{"crop": c} for c in RECOMMENDED_CROPS] if RECOMMENDED_CROPS else None

message = assistant.explain_full_report(
    predicted_class=PREDICTED_CLASS,
    confidence=CONFIDENCE,
    crop_recommendations=crop_recs,
)
print(message)
