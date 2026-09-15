"""
Run this file directly (Run button in your IDE, or `python run_irrigation.py`)
instead of using the command line. Just edit the settings below.

Bonus Module B — Smart Irrigation. See src/irrigation.py for the published
decision logic and its validation method.
"""
import json
from src.irrigation import evaluate_irrigation, validate_decision_grid

# ============================ EDIT THESE ============================
SOIL_MOISTURE_PCT = 22
RAIN_PROBABILITY_PCT = 65
CROP = "Tomato"
GROWTH_STAGE = "Flowering"

# Set True to instead run the decision-grid consistency check (validation
# method described in src/irrigation.py) and ignore the settings above.
RUN_VALIDATION_INSTEAD = False
# ======================================================================

if RUN_VALIDATION_INSTEAD:
    print(json.dumps(validate_decision_grid(), indent=2))
else:
    result = evaluate_irrigation(
        SOIL_MOISTURE_PCT, RAIN_PROBABILITY_PCT, crop=CROP, growth_stage=GROWTH_STAGE
    )
    print(json.dumps(result, indent=2))
