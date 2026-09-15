"""
Run this file directly (Run button in your IDE, or `python run_sustainability.py`)
instead of using the command line. Just edit the settings below.

Bonus Module D — Sustainability Score. See src/sustainability.py for the
published, exact scoring formula.
"""
import json
from src.sustainability import compute_sustainability_score

# ============================ EDIT THESE ============================
IRRIGATION_METHOD = "drip"          # "drip" | "sprinkler" | "flood"
ADVICE_FOLLOWED_PCT = 90            # % of Smart Irrigation alerts followed

DISEASE_FREE_SCAN_PCT = None        # e.g. 88, from real scan history, or None to
                                     # use the neutral default (no history yet)

ROTATED_FROM_DIFFERENT_FAMILY = True
CROP_DIVERSITY = 2                  # distinct crops grown this year

USES_ORGANIC_COMPOST = True
MULCHING = True
SOIL_TYPE = "Loamy"

PESTICIDE_USE = "organic"           # "organic" | "moderate" | "chemical_heavy"
# ======================================================================

result = compute_sustainability_score(
    irrigation_method=IRRIGATION_METHOD,
    advice_followed_pct=ADVICE_FOLLOWED_PCT,
    disease_free_scan_pct=DISEASE_FREE_SCAN_PCT,
    rotated_from_different_family=ROTATED_FROM_DIFFERENT_FAMILY,
    crop_diversity=CROP_DIVERSITY,
    uses_organic_compost=USES_ORGANIC_COMPOST,
    mulching=MULCHING,
    soil_type=SOIL_TYPE,
    pesticide_use=PESTICIDE_USE,
)
print(json.dumps(result, indent=2))
