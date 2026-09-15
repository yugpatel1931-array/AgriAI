"""
Bonus Module D — Sustainability Score.

Computes an indicative 0-100 farm sustainability score from water
efficiency, resource use, and crop health, with improvement suggestions —
and, per Section 3.2's requirement for this module, publishes the exact
formula/rules below so it is reproducible.

Formula
-------
Five components, each scored 0-100 by its own documented rule (below), then
combined with EQUAL weights (0.20 each). Equal weighting is a deliberate
simplification: it keeps the formula auditable by hand rather than tuned to
produce a particular headline number.

    overall = 0.20 * water_management
            + 0.20 * crop_care_and_foliar_health
            + 0.20 * crop_selection_and_rotation
            + 0.20 * soil_organic_health
            + 0.20 * spray_and_medicine_balance

Component rules
----------------
water_management        = 0.6 * irrigation_method_score + 0.4 * pct_of_irrigation_
                           advice_followed
                           irrigation_method_score: drip=90, sprinkler=75, flood=55
                           (drip and sprinkler waste less water to runoff/evaporation
                           than flood irrigation; this is standard agronomic ordering,
                           not a measured local figure)

crop_care_and_foliar_health = percentage of this farm's logged disease-detection
                           scans (Section 3.1's core task) that came back "healthy" or
                           low-risk. Directly reuses the core model's own predictions,
                           so this component is never a guess — it is either backed
                           by real scan history or, with no history yet, defaults to
                           a neutral 75.

crop_selection_and_rotation = 70 base, +15 if the current crop's botanical family
                           differs from the previous season's crop (breaks pest/
                           disease cycles — same rotation rule Bonus A's
                           `crop_recommend.py` already uses), +5 per additional
                           distinct crop grown this year beyond the first, capped
                           at +15.

soil_organic_health      = 65 base, +15 for using organic compost/manure,
                           +10 for mulching, +10 for a soil type good at holding
                           organic matter (Loamy/Clay vs Sandy).

spray_and_medicine_balance = organic/bio-spray only = 92, mixed/moderate
                           chemical use = 74, heavy chemical use = 50.

Every component below 85 also returns a concrete improvement suggestion
with an estimated point gain, so the score is always actionable, not just a
number.

Data sources / honesty note
----------------------------
This is a rule-based indicative score, not a measured index — there is no
public, farm-level "sustainability ground truth" to train or validate
against. Every input above is either (a) a fact the farmer/app already has
(irrigation method, whether compost/mulch is used, crop history) or (b) the
system's own core-task predictions (crop_care). No component is invented or
looked up from an external API.

CLI:
    python -m src.sustainability --irrigation_method drip --disease_free_scan_pct 88 \\
        --rotated --crop_diversity 2 --uses_compost --mulching --soil_type Loamy \\
        --pesticide_use organic
"""
import argparse
import json
from typing import Dict, List, Optional


def _clip(value: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, value))


def score_water_management(
    irrigation_method: str = "drip",
    advice_followed_pct: float = 100.0,
) -> float:
    method_score = {"drip": 90, "sprinkler": 75, "flood": 55}.get(irrigation_method.lower(), 70)
    return round(_clip(0.6 * method_score + 0.4 * advice_followed_pct), 1)


def score_crop_care(disease_free_scan_pct: Optional[float] = None) -> float:
    if disease_free_scan_pct is None:
        return 75.0  # neutral default — no scan history yet
    return round(_clip(disease_free_scan_pct), 1)


def score_crop_selection(rotated_from_different_family: bool = True, crop_diversity: int = 1) -> float:
    score = 70.0
    if rotated_from_different_family:
        score += 15.0
    score += min(15.0, max(0, crop_diversity - 1) * 5.0)
    return round(_clip(score), 1)


def score_soil_health(
    uses_organic_compost: bool = False,
    mulching: bool = False,
    soil_type: str = "Loamy",
) -> float:
    score = 65.0
    if uses_organic_compost:
        score += 15.0
    if mulching:
        score += 10.0
    if soil_type.lower() in ("loamy", "clay"):
        score += 10.0
    return round(_clip(score), 1)


def score_spray_balance(pesticide_use: str = "moderate") -> float:
    return {
        "organic": 92.0,
        "moderate": 74.0,
        "chemical_heavy": 50.0,
    }.get(pesticide_use.lower(), 74.0)


_SUGGESTIONS = {
    "water_management": ("Switch flood/sprinkler irrigation to drip, and follow the Smart Irrigation "
                          "\"wait\" alerts before watering.", "+6 to +12"),
    "crop_care_and_foliar_health": ("Scan leaves more regularly so early-stage disease is caught (and treated) "
                                     "before it spreads.", "+5 to +10"),
    "crop_selection_and_rotation": ("Rotate next season's crop out of the same botanical family, or add another "
                                     "crop to the rotation.", "+5 to +15"),
    "soil_organic_health": ("Add well-rotted compost or vermicompost, and mulch around the base of plants.",
                             "+10 to +25"),
    "spray_and_medicine_balance": ("Replace broad-spectrum chemical sprays with neem oil or Trichoderma "
                                    "bio-sprays where effective.", "+8 to +18"),
}


def compute_sustainability_score(
    irrigation_method: str = "drip",
    advice_followed_pct: float = 100.0,
    disease_free_scan_pct: Optional[float] = None,
    rotated_from_different_family: bool = True,
    crop_diversity: int = 1,
    uses_organic_compost: bool = False,
    mulching: bool = False,
    soil_type: str = "Loamy",
    pesticide_use: str = "moderate",
) -> Dict:
    components = {
        "water_management": score_water_management(irrigation_method, advice_followed_pct),
        "crop_care_and_foliar_health": score_crop_care(disease_free_scan_pct),
        "crop_selection_and_rotation": score_crop_selection(rotated_from_different_family, crop_diversity),
        "soil_organic_health": score_soil_health(uses_organic_compost, mulching, soil_type),
        "spray_and_medicine_balance": score_spray_balance(pesticide_use),
    }

    overall = round(sum(components.values()) / len(components), 1)

    breakdown = {}
    suggestions: List[Dict] = []
    for name, score in components.items():
        status = "Good" if score >= 85 else ("Fair" if score >= 70 else "Can Improve")
        entry = {"score": score, "status": status}
        if score < 85:
            text, gain = _SUGGESTIONS[name]
            entry["suggestion"] = text
            entry["potential_gain"] = gain
            suggestions.append({"component": name, "suggestion": text, "potential_gain": gain})
        breakdown[name] = entry

    return {
        "overall_score": overall,
        "weights": {name: 0.20 for name in components},
        "components": breakdown,
        "improvement_suggestions": suggestions,
        "formula": (
            "overall = 0.20*water_management + 0.20*crop_care_and_foliar_health "
            "+ 0.20*crop_selection_and_rotation + 0.20*soil_organic_health "
            "+ 0.20*spray_and_medicine_balance"
        ),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--irrigation_method", default="drip", choices=["drip", "sprinkler", "flood"])
    parser.add_argument("--advice_followed_pct", type=float, default=100.0)
    parser.add_argument("--disease_free_scan_pct", type=float, default=None)
    parser.add_argument("--rotated", dest="rotated_from_different_family", action="store_true", default=True)
    parser.add_argument("--not_rotated", dest="rotated_from_different_family", action="store_false")
    parser.add_argument("--crop_diversity", type=int, default=1)
    parser.add_argument("--uses_compost", dest="uses_organic_compost", action="store_true", default=False)
    parser.add_argument("--mulching", action="store_true", default=False)
    parser.add_argument("--soil_type", default="Loamy")
    parser.add_argument("--pesticide_use", default="moderate", choices=["organic", "moderate", "chemical_heavy"])
    args = parser.parse_args()

    result = compute_sustainability_score(
        irrigation_method=args.irrigation_method,
        advice_followed_pct=args.advice_followed_pct,
        disease_free_scan_pct=args.disease_free_scan_pct,
        rotated_from_different_family=args.rotated_from_different_family,
        crop_diversity=args.crop_diversity,
        uses_organic_compost=args.uses_organic_compost,
        mulching=args.mulching,
        soil_type=args.soil_type,
        pesticide_use=args.pesticide_use,
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
