"""
Treatment Feedback Loop.

The core pipeline is one-shot: predict once, done. In the field, that
throws away the most valuable signal there is — what actually happened
afterwards. This module closes the loop:

  1. Every prediction can be logged with a short feedback ID.
  2. Later (once the farmer/agronomist knows the real outcome), feedback is
     logged against that ID: was the prediction correct, what treatment was
     applied, did it help.
  3. `report()` turns accumulated feedback into two things a team can act
     on: a confirmed-accuracy trend (recent vs historical, to catch model
     drift / distribution shift in the field) and a treatment-effectiveness
     breakdown per predicted class.

Storage: a single append-only JSONL file (default outputs/feedback_log.jsonl).
Append-only means logging a prediction and logging feedback are both just
"add a line" — no read-modify-write race, safe to call from a web backend.
Records are joined by `entry_id` when read back.

CLI:
    # after a prediction, get an ID to reference later
    python -m src.feedback log-prediction --image leaf.jpg \
        --predicted_class Tomato_Early_Blight --confidence 0.91

    # once you know what happened
    python -m src.feedback log-feedback --id <entry_id> --correct \
        --treatment_applied "removed affected leaves" --treatment_helped

    python -m src.feedback log-feedback --id <entry_id> --incorrect \
        --actual_class Tomato_Late_Blight

    # accuracy trend + treatment effectiveness + drift flag
    python -m src.feedback report

Also directly usable from infer.py via `--log_feedback` (see infer.py),
and importable:
    from src.feedback import FeedbackStore
    store = FeedbackStore()
    entry_id = store.log_prediction("leaf.jpg", "Tomato_Early_Blight", 0.91)
    store.log_feedback(entry_id, farmer_confirmed_correct=True, treatment_helped=True)
"""
import argparse
import json
import os
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from . import config

DEFAULT_LOG_PATH = os.path.join(config.DEFAULT_OUTPUT_DIR, "feedback_log.jsonl")

# If confirmed accuracy over the most recent window drops by more than this
# many percentage points relative to the historical window, flag possible
# drift. Deliberately simple and stated plainly, same spirit as the
# irrigation/sustainability thresholds elsewhere in this repo.
DRIFT_DROP_THRESHOLD_PP = 15.0


class FeedbackStore:
    def __init__(self, log_path: str = DEFAULT_LOG_PATH):
        self.log_path = log_path
        os.makedirs(os.path.dirname(log_path) or ".", exist_ok=True)

    def _append(self, record: Dict) -> None:
        with open(self.log_path, "a") as f:
            f.write(json.dumps(record) + "\n")

    def log_prediction(
        self,
        image_path: str,
        predicted_class: str,
        confidence: float,
        top_k: Optional[List[Dict]] = None,
    ) -> str:
        entry_id = uuid.uuid4().hex[:8]
        self._append({
            "type": "prediction",
            "entry_id": entry_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "image_path": image_path,
            "predicted_class": predicted_class,
            "confidence": confidence,
            "top_k": top_k,
        })
        return entry_id

    def log_feedback(
        self,
        entry_id: str,
        farmer_confirmed_correct: Optional[bool] = None,
        actual_class: Optional[str] = None,
        treatment_applied: Optional[str] = None,
        treatment_helped: Optional[bool] = None,
        notes: Optional[str] = None,
    ) -> None:
        self._append({
            "type": "feedback",
            "entry_id": entry_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "farmer_confirmed_correct": farmer_confirmed_correct,
            "actual_class": actual_class,
            "treatment_applied": treatment_applied,
            "treatment_helped": treatment_helped,
            "notes": notes,
        })

    def _load_records(self) -> List[Dict]:
        if not os.path.exists(self.log_path):
            return []
        records = []
        with open(self.log_path) as f:
            for line in f:
                line = line.strip()
                if line:
                    records.append(json.loads(line))
        return records

    def get_history(self) -> List[Dict]:
        """Joins prediction + feedback records by entry_id into one row per
        prediction, ordered by prediction timestamp (oldest first)."""
        predictions: Dict[str, Dict] = {}
        order: List[str] = []
        for rec in self._load_records():
            eid = rec["entry_id"]
            if rec["type"] == "prediction":
                predictions[eid] = {**rec, "feedback": []}
                order.append(eid)
            elif rec["type"] == "feedback" and eid in predictions:
                predictions[eid]["feedback"].append(rec)
        return [predictions[eid] for eid in order]

    def report(self, recent_n: int = 20) -> Dict:
        history = self.get_history()
        confirmed = [
            h for h in history
            if h["feedback"] and h["feedback"][-1].get("farmer_confirmed_correct") is not None
        ]

        def accuracy(rows: List[Dict]) -> Optional[float]:
            if not rows:
                return None
            correct = sum(1 for r in rows if r["feedback"][-1]["farmer_confirmed_correct"])
            return round(100 * correct / len(rows), 1)

        historical = confirmed[:-recent_n] if len(confirmed) > recent_n else []
        recent = confirmed[-recent_n:]

        recent_acc = accuracy(recent)
        historical_acc = accuracy(historical)

        drift_flag = False
        drift_message = None
        if recent_acc is not None and historical_acc is not None:
            drop = historical_acc - recent_acc
            if drop >= DRIFT_DROP_THRESHOLD_PP:
                drift_flag = True
                drift_message = (
                    f"Confirmed accuracy dropped {drop:.1f}pp (historical {historical_acc}% -> "
                    f"recent {recent_acc}%) — possible model drift or a shift in field conditions. "
                    "Recommend reviewing recent misclassifications and, if the pattern holds, "
                    "retraining or expanding the training set."
                )

        # Treatment effectiveness, broken down by predicted class.
        treated = [
            h for h in history
            if h["feedback"] and h["feedback"][-1].get("treatment_helped") is not None
        ]
        by_class: Dict[str, Dict] = {}
        for h in treated:
            cls = h["predicted_class"]
            helped = bool(h["feedback"][-1]["treatment_helped"])
            entry = by_class.setdefault(cls, {"treated_count": 0, "helped_count": 0})
            entry["treated_count"] += 1
            entry["helped_count"] += 1 if helped else 0
        treatment_effectiveness = {
            cls: {
                **stats,
                "helped_pct": round(100 * stats["helped_count"] / stats["treated_count"], 1),
            }
            for cls, stats in by_class.items()
        }

        return {
            "total_predictions_logged": len(history),
            "total_confirmed": len(confirmed),
            "confirmed_accuracy_recent_pct": recent_acc,
            "confirmed_accuracy_historical_pct": historical_acc,
            "drift_flag": drift_flag,
            "drift_message": drift_message,
            "treatment_effectiveness_by_class": treatment_effectiveness,
        }


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_pred = sub.add_parser("log-prediction")
    p_pred.add_argument("--image", required=True)
    p_pred.add_argument("--predicted_class", required=True)
    p_pred.add_argument("--confidence", type=float, required=True)

    p_fb = sub.add_parser("log-feedback")
    p_fb.add_argument("--id", required=True, dest="entry_id")
    correctness = p_fb.add_mutually_exclusive_group()
    correctness.add_argument("--correct", action="store_true")
    correctness.add_argument("--incorrect", action="store_true")
    p_fb.add_argument("--actual_class", default=None)
    p_fb.add_argument("--treatment_applied", default=None)
    treated = p_fb.add_mutually_exclusive_group()
    treated.add_argument("--treatment_helped", action="store_true")
    treated.add_argument("--treatment_not_helped", action="store_true")
    p_fb.add_argument("--notes", default=None)

    p_hist = sub.add_parser("history")
    p_hist.add_argument("--limit", type=int, default=20)

    sub.add_parser("report")

    parser.add_argument("--log_path", default=DEFAULT_LOG_PATH)
    args = parser.parse_args()

    store = FeedbackStore(args.log_path)

    if args.cmd == "log-prediction":
        entry_id = store.log_prediction(args.image, args.predicted_class, args.confidence)
        print(f"Logged prediction. Feedback ID: {entry_id}")
        print(f"Once you know the outcome:\n"
              f"  python -m src.feedback log-feedback --id {entry_id} --correct --treatment_helped")

    elif args.cmd == "log-feedback":
        confirmed_correct = True if args.correct else (False if args.incorrect else None)
        treatment_helped = True if args.treatment_helped else (False if args.treatment_not_helped else None)
        store.log_feedback(
            args.entry_id,
            farmer_confirmed_correct=confirmed_correct,
            actual_class=args.actual_class,
            treatment_applied=args.treatment_applied,
            treatment_helped=treatment_helped,
            notes=args.notes,
        )
        print(f"Logged feedback for {args.entry_id}.")

    elif args.cmd == "history":
        history = store.get_history()
        for h in history[-args.limit:]:
            fb = h["feedback"][-1] if h["feedback"] else None
            status = "pending" if fb is None else (
                "correct" if fb.get("farmer_confirmed_correct") else "incorrect"
            )
            print(f"[{h['entry_id']}] {h['predicted_class']} ({h['confidence']:.2%}) — {status}")

    elif args.cmd == "report":
        print(json.dumps(store.report(), indent=2))


if __name__ == "__main__":
    main()
