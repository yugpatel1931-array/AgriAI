"""
Loads a trained checkpoint and predicts on a single new leaf image.
Uses exactly the same preprocessing the model was validated with.

CLI:
    python -m src.infer --image path/to/leaf.jpg --checkpoint outputs/best_model.pt
    python -m src.infer --image path/to/leaf.jpg --checkpoint outputs/best_model.pt --gradcam

    # Explain the top-k candidates individually, not just the winner — useful
    # when two diseases are close in confidence and you want to see what
    # evidence the model saw for each:
    python -m src.infer --image leaf.jpg --checkpoint outputs/best_model.pt --gradcam_topk 3

    # Log this prediction so it can be followed up on later (treatment
    # feedback loop — see src/feedback.py):
    python -m src.infer --image leaf.jpg --checkpoint outputs/best_model.pt --log_feedback

    # Plain-language explanation for the farmer, in English/Hindi/Gujarati
    # (see src/assistant.py):
    python -m src.infer --image leaf.jpg --checkpoint outputs/best_model.pt --explain --language hi

Programmatic (for a web backend):
    from src.infer import LeafPredictor
    predictor = LeafPredictor("outputs/best_model.pt")
    result = predictor.predict("path/to/leaf.jpg")
    # {"class": "...", "confidence": 0.97, "all_probs": {...}}
"""
import argparse
import os

import torch
from PIL import Image

from . import config
from .model import build_model
from .utils import get_eval_transforms, load_checkpoint
from .gradcam import GradCAM, overlay_heatmap, heat_coverage_pct
from .feedback import FeedbackStore
from .assistant import FarmerAssistant, TEMPLATES


class LeafPredictor:
    def __init__(self, checkpoint_path: str, device: torch.device = None):
        self.device = device or config.DEVICE
        ckpt = load_checkpoint(checkpoint_path, map_location=self.device)
        self.class_names = ckpt["class_names"]
        self.arch = ckpt["arch"]
        self.image_size = ckpt["image_size"]

        self.model = build_model(self.arch, len(self.class_names), pretrained=False).to(self.device)
        self.model.load_state_dict(ckpt["model_state_dict"])
        self.model.eval()

        self.transform = get_eval_transforms(self.image_size)

    def _load_tensor(self, image_path: str):
        pil_image = Image.open(image_path).convert("RGB")
        tensor = self.transform(pil_image).to(self.device)
        return pil_image, tensor

    @torch.no_grad()
    def predict(self, image_path: str, topk: int = 3) -> dict:
        # Small test-time ensemble: original + horizontal flip. Averaging logits
        # makes predictions less sensitive to leaf orientation and image framing,
        # while keeping preprocessing identical to validation.
        _, tensor = self._load_tensor(image_path)
        batch = torch.stack([tensor, torch.flip(tensor, dims=[2])], dim=0)
        logits = self.model(batch).mean(dim=0, keepdim=True)
        probs = torch.softmax(logits, dim=1).squeeze(0).cpu()

        top_probs, top_idxs = probs.topk(min(topk, len(self.class_names)))
        return {
            "predicted_class": self.class_names[top_idxs[0].item()],
            "confidence": round(top_probs[0].item(), 4),
            "top_k": [
                {"class": self.class_names[i], "confidence": round(p.item(), 4)}
                for p, i in zip(top_probs, top_idxs)
            ],
        }

    def predict_with_gradcam(self, image_path: str, out_path: str, target_class: str = None) -> dict:
        """target_class: optional class name to explain instead of the
        top prediction — e.g. "why did you consider Late Blight even
        though you picked Early Blight?"."""
        pil_image, tensor = self._load_tensor(image_path)
        cam_tool = GradCAM(self.model, self.arch)
        target_idx_in = self.class_names.index(target_class) if target_class else None
        cam, target_idx = cam_tool.generate(tensor, target_class=target_idx_in)
        overlay = overlay_heatmap(pil_image, cam)
        os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
        overlay.save(out_path)

        result = self.predict(image_path)
        result["gradcam_path"] = out_path
        result["gradcam_explains_class"] = self.class_names[target_idx]
        result["gradcam_heat_coverage_pct"] = heat_coverage_pct(cam)
        return result

    def explain_topk(self, image_path: str, out_dir: str, k: int = 3) -> dict:
        """Generates one Grad-CAM heatmap per top-k candidate class, so a
        farmer or judge can see what visual evidence supports each
        candidate — most useful when the top-2 confidences are close."""
        result = self.predict(image_path, topk=k)
        os.makedirs(out_dir, exist_ok=True)
        pil_image, tensor = self._load_tensor(image_path)
        cam_tool = GradCAM(self.model, self.arch)

        explanations = []
        for item in result["top_k"]:
            cls = item["class"]
            target_idx = self.class_names.index(cls)
            cam, _ = cam_tool.generate(tensor, target_class=target_idx)
            overlay = overlay_heatmap(pil_image, cam)
            safe_name = cls.replace(" ", "_").replace("/", "_")
            path = os.path.join(out_dir, f"gradcam_{safe_name}.png")
            overlay.save(path)
            explanations.append({
                "class": cls,
                "confidence": item["confidence"],
                "gradcam_path": path,
                "heat_coverage_pct": heat_coverage_pct(cam),
            })

        result["explanations"] = explanations
        return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True)
    parser.add_argument("--checkpoint", default=os.path.join(config.DEFAULT_OUTPUT_DIR, "best_model.pt"))
    parser.add_argument("--topk", type=int, default=3)
    parser.add_argument("--gradcam", action="store_true")
    parser.add_argument("--gradcam_out", default=os.path.join(config.DEFAULT_OUTPUT_DIR, "gradcam_result.png"))
    parser.add_argument("--target_class", default=None,
                         help="Explain a specific class instead of the top prediction (used with --gradcam).")
    parser.add_argument("--gradcam_topk", type=int, default=0,
                         help="If >0, generate a separate Grad-CAM heatmap for each of the top-N candidates.")
    parser.add_argument("--gradcam_topk_dir", default=os.path.join(config.DEFAULT_OUTPUT_DIR, "gradcam_topk"))
    parser.add_argument("--log_feedback", action="store_true",
                         help="Log this prediction for later farmer feedback (see src/feedback.py).")
    parser.add_argument("--explain", action="store_true",
                         help="Print a plain-language explanation for the farmer (see src/assistant.py).")
    parser.add_argument("--language", default="en", choices=list(TEMPLATES),
                         help="Language for --explain output.")
    args = parser.parse_args()

    predictor = LeafPredictor(args.checkpoint)

    if args.gradcam_topk > 0:
        result = predictor.explain_topk(args.image, args.gradcam_topk_dir, k=args.gradcam_topk)
    elif args.gradcam:
        result = predictor.predict_with_gradcam(args.image, args.gradcam_out, target_class=args.target_class)
    else:
        result = predictor.predict(args.image, topk=args.topk)

    print("=" * 50)
    print(f"Predicted class : {result['predicted_class']}")
    print(f"Confidence      : {result['confidence']:.2%}")
    print("Top-k:")
    for item in result["top_k"]:
        print(f"  {item['class']:30s} {item['confidence']:.2%}")
    if "gradcam_path" in result:
        print(f"Grad-CAM heatmap saved to: {result['gradcam_path']} "
              f"(explains: {result['gradcam_explains_class']}, "
              f"heat coverage: {result['gradcam_heat_coverage_pct']}%)")
    if "explanations" in result:
        print("Per-candidate Grad-CAM heatmaps:")
        for item in result["explanations"]:
            print(f"  {item['class']:30s} {item['confidence']:.2%} -> {item['gradcam_path']} "
                  f"(heat coverage: {item['heat_coverage_pct']}%)")
    if args.explain:
        assistant = FarmerAssistant(language=args.language)
        message = assistant.explain_disease_result(result["predicted_class"], result["confidence"])
        print("-" * 50)
        print(message)
    if args.log_feedback:
        store = FeedbackStore()
        entry_id = store.log_prediction(args.image, result["predicted_class"], result["confidence"], result.get("top_k"))
        print(f"Feedback ID: {entry_id}  (log the outcome later with `python -m src.feedback log-feedback --id {entry_id} ...`)")
    print("=" * 50)


if __name__ == "__main__":
    main()
