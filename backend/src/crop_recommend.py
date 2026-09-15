"""
Crop Recommendation.

Recommends suitable crops from soil type, pH, temperature, humidity,
rainfall, water availability, and previous crop (for rotation).

Two modes
---------
1. Rule-based scorer (default, always available, no extra data needed)
   Scores every crop in data/reference/crop_requirements.csv against your
   farm's conditions with a transparent weighted formula (see
   `score_crop`). Data source: data/reference/crop_requirements.csv (see
   reference_data.py's honesty note).

2. Trained ML model (optional)
   If you have the standard Kaggle "Crop Recommendation Dataset" (columns:
   N, P, K, temperature, humidity, ph, rainfall, label) or an equivalent
   CSV, `train_ml_recommender()` trains a RandomForestClassifier, reports
   held-out accuracy + macro-F1, and saves the model. Once trained,
   predictions automatically use it when N/P/K values are supplied.

CLI:
    python -m src.crop_recommend --soil "Loamy" --ph 6.4 --temperature 27 \
        --humidity 55 --rainfall 550 --water_availability medium \
        --previous_crop Rice

    # optional ML training:
    python -m src.crop_recommend --train_csv path/to/Crop_recommendation.csv
"""
import argparse
import json
import os
import pickle
from typing import Dict, List, Optional

from . import config
from .reference_data import CropProfile, load_crop_profiles

DEFAULT_MODEL_PATH = os.path.join(config.DEFAULT_OUTPUT_DIR, "crop_recommender_rf.pkl")


def _range_fit(value: float, lo: float, hi: float) -> float:
    """1.0 inside [lo, hi]; falls off linearly to 0 over a margin equal to
    the range width outside the bounds."""
    if lo <= value <= hi:
        return 1.0
    width = max(hi - lo, 1e-6)
    dist = (lo - value) if value < lo else (value - hi)
    return max(0.0, 1.0 - dist / width)


def score_crop(
    profile: CropProfile,
    soil_type: str,
    ph: float,
    temperature: float,
    humidity: float,
    rainfall_mm: float,
    water_availability: str,
    previous_crop: Optional[str] = None,
) -> Dict:
    """
    Weighted-sum scoring formula (published for reproducibility):

        score = 0.30 * temperature_fit
              + 0.15 * humidity_fit
              + 0.20 * rainfall_fit
              + 0.15 * soil_match           (1.0 exact match, 0.3 otherwise)
              + 0.10 * ph_fit
              + 0.10 * water_availability_match
              - 0.30 * rotation_penalty     (same botanical family as the
                                              previous crop -> pest/disease
                                              carry-over risk)

    All sub-scores are in [0, 1]; the final score is clipped to [0, 1].
    """
    temp_fit = _range_fit(temperature, profile.min_temp_c, profile.max_temp_c)
    humidity_fit = _range_fit(humidity, profile.min_humidity_pct, profile.max_humidity_pct)
    rainfall_fit = _range_fit(rainfall_mm, profile.min_rainfall_mm, profile.max_rainfall_mm)
    ph_fit = _range_fit(ph, profile.min_ph, profile.max_ph)

    soil_norm = soil_type.strip().lower()
    soil_match = 1.0 if soil_norm in [s.lower() for s in profile.soil_types] else 0.3

    water_rank = {"low": 0, "medium": 1, "high": 2}
    user_rank = water_rank.get(water_availability.lower(), 1)
    crop_rank = water_rank.get(profile.water_need.lower(), 1)
    shortfall = max(0, crop_rank - user_rank)
    water_match = max(0.0, 1.0 - 0.5 * shortfall)

    rotation_penalty = 0.0
    reasons = []
    if previous_crop:
        try:
            prev_profile = load_crop_profiles().get(previous_crop) or load_crop_profiles().get(
                previous_crop.strip().title()
            )
        except Exception:
            prev_profile = None
        if prev_profile and prev_profile.family == profile.family:
            rotation_penalty = 0.3
            reasons.append(
                f"Same family as previous crop ({profile.family}) — "
                "rotating out is recommended to break pest/disease cycles."
            )

    raw = (
        0.30 * temp_fit
        + 0.15 * humidity_fit
        + 0.20 * rainfall_fit
        + 0.15 * soil_match
        + 0.10 * ph_fit
        + 0.10 * water_match
        - rotation_penalty
    )
    score = max(0.0, min(1.0, raw))

    if temp_fit < 0.5:
        reasons.append("Temperature is outside this crop's comfortable range.")
    if rainfall_fit < 0.5:
        reasons.append("Rainfall is a poor match for this crop's typical needs.")
    if soil_match < 1.0:
        reasons.append(f"Soil type differs from preferred {profile.soil_types}.")
    if water_match < 1.0:
        reasons.append("Water availability may be insufficient for this crop's demand.")

    return {
        "crop": profile.crop,
        "score": round(score, 3),
        "breakdown": {
            "temperature_fit": round(temp_fit, 2),
            "humidity_fit": round(humidity_fit, 2),
            "rainfall_fit": round(rainfall_fit, 2),
            "soil_match": round(soil_match, 2),
            "ph_fit": round(ph_fit, 2),
            "water_availability_match": round(water_match, 2),
            "rotation_penalty": rotation_penalty,
        },
        "notes": reasons,
    }


def recommend_rule_based(
    soil_type: str,
    ph: float,
    temperature: float,
    humidity: float,
    rainfall_mm: float,
    water_availability: str = "medium",
    previous_crop: Optional[str] = None,
    top_k: int = 3,
) -> List[Dict]:
    profiles = load_crop_profiles()
    scored = [
        score_crop(p, soil_type, ph, temperature, humidity, rainfall_mm, water_availability, previous_crop)
        for p in profiles.values()
    ]
    scored.sort(key=lambda r: r["score"], reverse=True)
    return scored[:top_k]


# ---------------------------------------------------------------------------
# Optional ML mode
# ---------------------------------------------------------------------------

def train_ml_recommender(
    csv_path: str,
    model_out: str = DEFAULT_MODEL_PATH,
    test_size: float = 0.2,
    seed: int = config.SEED,
) -> Dict:
    """
    Trains a RandomForestClassifier on a labelled crop-recommendation CSV
    (N, P, K, temperature, humidity, ph, rainfall, label columns — matches
    the widely-used Kaggle "Crop Recommendation Dataset" schema). Reports
    accuracy and macro-F1 on a held-out split, and saves the model.
    """
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score, f1_score, classification_report

    df = pd.read_csv(csv_path)
    feature_cols = [c for c in ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"] if c in df.columns]
    label_col = "label" if "label" in df.columns else df.columns[-1]
    if len(feature_cols) < 4:
        raise ValueError(
            f"Expected N/P/K/temperature/humidity/ph/rainfall columns, found {list(df.columns)}. "
            "Point --train_csv at the Kaggle Crop Recommendation Dataset or an equivalent schema."
        )

    X, y = df[feature_cols], df[label_col]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=seed, stratify=y
    )
    clf = RandomForestClassifier(n_estimators=200, random_state=seed, n_jobs=-1)
    clf.fit(X_train, y_train)
    preds = clf.predict(X_test)

    metrics = {
        "data_source": os.path.abspath(csv_path),
        "n_samples": len(df),
        "features_used": feature_cols,
        "accuracy": round(accuracy_score(y_test, preds), 4),
        "macro_f1": round(f1_score(y_test, preds, average="macro"), 4),
        "classification_report": classification_report(y_test, preds, output_dict=True),
    }

    os.makedirs(os.path.dirname(model_out), exist_ok=True)
    with open(model_out, "wb") as f:
        pickle.dump({"model": clf, "feature_cols": feature_cols}, f)
    with open(model_out + ".metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    return metrics


class CropRecommender:
    """Uses the trained ML model when available and N/P/K inputs are
    supplied, otherwise falls back to the rule-based scorer (which never
    needs N/P/K)."""

    def __init__(self, model_path: str = DEFAULT_MODEL_PATH):
        self.ml_model = None
        self.feature_cols = None
        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                payload = pickle.load(f)
            self.ml_model = payload["model"]
            self.feature_cols = payload["feature_cols"]

    def recommend(self, top_k: int = 3, npk: Optional[Dict[str, float]] = None, **kwargs) -> Dict:
        if self.ml_model is not None and npk and all(k in npk for k in ("N", "P", "K")):
            row = {
                "N": npk["N"], "P": npk["P"], "K": npk["K"],
                "temperature": kwargs["temperature"], "humidity": kwargs["humidity"],
                "ph": kwargs["ph"], "rainfall": kwargs["rainfall_mm"],
            }
            import pandas as pd
            X = pd.DataFrame([row])[self.feature_cols]
            proba = self.ml_model.predict_proba(X)[0]
            classes = self.ml_model.classes_
            ranked = sorted(zip(classes, proba), key=lambda t: t[1], reverse=True)[:top_k]
            return {"mode": "ml", "recommendations": [{"crop": c, "score": round(float(p), 3)} for c, p in ranked]}
        return {"mode": "rule_based", "recommendations": recommend_rule_based(top_k=top_k, **kwargs)}


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd")

    p_rec = sub.add_parser("recommend", help="Get crop recommendations (default)")
    p_rec.add_argument("--soil", required=True)
    p_rec.add_argument("--ph", type=float, required=True)
    p_rec.add_argument("--temperature", type=float, required=True)
    p_rec.add_argument("--humidity", type=float, required=True)
    p_rec.add_argument("--rainfall", type=float, required=True)
    p_rec.add_argument("--water_availability", default="medium", choices=["low", "medium", "high"])
    p_rec.add_argument("--previous_crop", default=None)
    p_rec.add_argument("--top_k", type=int, default=3)

    p_train = sub.add_parser("train", help="Train the optional ML recommender")
    p_train.add_argument("--train_csv", required=True)
    p_train.add_argument("--model_out", default=DEFAULT_MODEL_PATH)

    args, unknown = parser.parse_known_args()
    if args.cmd is None:
        args = parser.parse_args((["recommend"] + unknown) if unknown else ["recommend"])

    if args.cmd == "train":
        metrics = train_ml_recommender(args.train_csv, args.model_out)
        print(json.dumps(metrics, indent=2))
        return

    result = recommend_rule_based(
        soil_type=args.soil, ph=args.ph, temperature=args.temperature,
        humidity=args.humidity, rainfall_mm=args.rainfall,
        water_availability=args.water_availability,
        previous_crop=args.previous_crop, top_k=args.top_k,
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
