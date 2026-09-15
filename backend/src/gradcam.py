"""
Grad-CAM: shows which region of the leaf drove the prediction.
Works for any of the CNN backbones in model.py by hooking their last
convolutional block. Kept fully decoupled from the core prediction
path — infer.py runs fine with --gradcam omitted.
"""
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image

from .model import get_last_conv_layer


class GradCAM:
    def __init__(self, model: torch.nn.Module, arch: str):
        self.model = model
        self.activations = None
        self.gradients = None
        layer = get_last_conv_layer(model, arch)
        layer.register_forward_hook(self._save_activation)
        layer.register_full_backward_hook(self._save_gradient)

    def _save_activation(self, module, inp, out):
        self.activations = out.detach()

    def _save_gradient(self, module, grad_in, grad_out):
        self.gradients = grad_out[0].detach()

    def generate(self, input_tensor: torch.Tensor, target_class: int = None):
        self.model.eval()
        input_tensor = input_tensor.unsqueeze(0)
        input_tensor.requires_grad_(True)

        output = self.model(input_tensor)
        if target_class is None:
            target_class = output.argmax(dim=1).item()

        self.model.zero_grad()
        output[0, target_class].backward()

        weights = self.gradients.mean(dim=(2, 3), keepdim=True)   # global-avg-pool of gradients
        cam = F.relu((weights * self.activations).sum(dim=1, keepdim=True))
        cam = F.interpolate(cam, size=input_tensor.shape[-2:], mode="bilinear", align_corners=False)
        cam = cam.squeeze().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        return cam, target_class


def heat_coverage_pct(cam: np.ndarray, threshold: float = 0.5) -> float:
    """Fraction of the image the model actually weighted heavily for this
    prediction (cam values are already normalized to [0, 1]). A small
    percentage on a leaf-filling image suggests a localized lesion drove
    the call; a very large percentage suggests the model may be keying off
    something diffuse (background, overall color cast) rather than a
    specific lesion — useful context alongside the heatmap itself, not a
    correctness guarantee."""
    return round(float((cam >= threshold).mean() * 100), 1)


def overlay_heatmap(pil_image: Image.Image, cam: np.ndarray, alpha: float = 0.45) -> Image.Image:
    """Blends a Grad-CAM heatmap onto the original image without any extra deps (pure PIL/numpy)."""
    heatmap = (cam * 255).astype(np.uint8)
    heatmap_img = Image.fromarray(heatmap).resize(pil_image.size, resample=Image.BILINEAR)
    heatmap_arr = np.array(heatmap_img).astype(np.float32) / 255.0

    # Simple red-yellow colormap without matplotlib/cv2 dependency.
    r = np.clip(1.5 * heatmap_arr, 0, 1)
    g = np.clip(1.5 * heatmap_arr - 0.5, 0, 1)
    b = np.zeros_like(heatmap_arr)
    color = np.stack([r, g, b], axis=-1) * 255

    base = np.array(pil_image.convert("RGB")).astype(np.float32)
    blended = (1 - alpha) * base + alpha * color
    return Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))
