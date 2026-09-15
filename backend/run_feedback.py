"""
Run this file directly (Run button in your IDE, or `python run_feedback.py`)
instead of using the command line. Set ACTION below, edit the matching
settings block, and run.
"""
import json
from src.feedback import FeedbackStore

# ============================ EDIT THESE ============================
ACTION = "report"    # one of: "log_prediction" | "log_feedback" | "history" | "report"

# --- used when ACTION = "log_prediction" ---
IMAGE_PATH = "path/to/leaf.jpg"
PREDICTED_CLASS = "Tomato_Early_Blight"
CONFIDENCE = 0.91

# --- used when ACTION = "log_feedback" ---
ENTRY_ID = "a1b2c3d4"            # printed when you ran "log_prediction"
CONFIRMED_CORRECT = True         # was the prediction right?
ACTUAL_CLASS = None              # fill in if CONFIRMED_CORRECT is False
TREATMENT_APPLIED = "removed affected leaves"
TREATMENT_HELPED = True          # or False, or None if not yet known
NOTES = None

# --- used when ACTION = "history" ---
HISTORY_LIMIT = 20

# --- used when ACTION = "report" ---
REPORT_RECENT_N = 20
# ======================================================================

store = FeedbackStore()

if ACTION == "log_prediction":
    entry_id = store.log_prediction(IMAGE_PATH, PREDICTED_CLASS, CONFIDENCE)
    print(f"Logged prediction. Feedback ID: {entry_id}")
    print("Once you know the outcome, set ACTION = \"log_feedback\" and ENTRY_ID to this value.")

elif ACTION == "log_feedback":
    store.log_feedback(
        ENTRY_ID,
        farmer_confirmed_correct=CONFIRMED_CORRECT,
        actual_class=ACTUAL_CLASS,
        treatment_applied=TREATMENT_APPLIED,
        treatment_helped=TREATMENT_HELPED,
        notes=NOTES,
    )
    print(f"Logged feedback for {ENTRY_ID}.")

elif ACTION == "history":
    for h in store.get_history()[-HISTORY_LIMIT:]:
        fb = h["feedback"][-1] if h["feedback"] else None
        status = "pending" if fb is None else ("correct" if fb.get("farmer_confirmed_correct") else "incorrect")
        print(f"[{h['entry_id']}] {h['predicted_class']} ({h['confidence']:.2%}) — {status}")

elif ACTION == "report":
    print(json.dumps(store.report(recent_n=REPORT_RECENT_N), indent=2))

else:
    raise ValueError(f"Unknown ACTION: {ACTION!r}")
