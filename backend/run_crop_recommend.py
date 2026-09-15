"""
Run this file directly (Run button in your IDE, or `python run_crop_recommend.py`)
instead of using the command line. Just edit the settings below.
"""
import json
from src.crop_recommend import recommend_rule_based, train_ml_recommender, CropRecommender

# ============================ EDIT THESE ============================
ACTION = "recommend"     # "recommend" | "train_ml"

# --- used when ACTION = "recommend" ---
SOIL_TYPE = "Loamy"              # e.g. Loamy, Sandy Loam, Clay, Clay Loam, Black Soil, Red Soil
PH = 6.4
TEMPERATURE_C = 27
HUMIDITY_PCT = 55
RAINFALL_MM = 550                 # seasonal rainfall
WATER_AVAILABILITY = "medium"    # "low" | "medium" | "high"
PREVIOUS_CROP = "Rice"           # or None if not rotating
TOP_K = 3

# Optional: set these three if you've trained the ML model (ACTION = "train_ml"
# below) and have soil N/P/K test values — otherwise leave as None to use the
# rule-based scorer above.
NITROGEN_N = None
PHOSPHORUS_P = None
POTASSIUM_K = None

# --- used when ACTION = "train_ml" ---
TRAIN_CSV_PATH = "path/to/Crop_recommendation.csv"   # Kaggle-style N,P,K,temperature,humidity,ph,rainfall,label
# ======================================================================

if ACTION == "train_ml":
    metrics = train_ml_recommender(TRAIN_CSV_PATH)
    print(json.dumps(metrics, indent=2))

elif ACTION == "recommend":
    npk = None
    if NITROGEN_N is not None and PHOSPHORUS_P is not None and POTASSIUM_K is not None:
        npk = {"N": NITROGEN_N, "P": PHOSPHORUS_P, "K": POTASSIUM_K}

    recommender = CropRecommender()
    result = recommender.recommend(
        top_k=TOP_K,
        npk=npk,
        soil_type=SOIL_TYPE,
        ph=PH,
        temperature=TEMPERATURE_C,
        humidity=HUMIDITY_PCT,
        rainfall_mm=RAINFALL_MM,
        water_availability=WATER_AVAILABILITY,
        previous_crop=PREVIOUS_CROP,
    )
    print(json.dumps(result, indent=2))

else:
    raise ValueError(f"Unknown ACTION: {ACTION!r}")
