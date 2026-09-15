"""
Model factory.

Architecture choice (why EfficientNet-B0 is the default):
  - Leaf-disease datasets in hackathons are typically small-to-medium
    (thousands to tens of thousands of images) -> training a
    Vision Transformer from scratch is not viable, and ViTs only beat
    CNNs with transfer learning once fine-tuning data is fairly large
    or heavily augmented. A pretrained CNN is the safer, stronger bet.
  - EfficientNet-B0 gives the best accuracy-per-FLOP of the
    torchvision CNN family, runs comfortably on CPU for inference,
    and is small enough to fine-tune fully even without a GPU.
  - ResNet50 is kept as a comparison candidate: more parameters, often
    more robust to noisy/blurry field images because of its simpler,
    more redundant feature extractor, at higher compute cost.
  - MobileNetV3-Large is included as a lightweight CPU-friendly option
    if hardware turns out to be very constrained.

train.py can train several of these back-to-back (--compare) and pick
the winner by validation Macro-F1, per the hackathon's own advice not
to commit to one architecture blindly.
"""
import torch.nn as nn
from torchvision import models

SUPPORTED_ARCHS = ("efficientnet_b0", "resnet50", "mobilenet_v3_large")


def build_model(arch: str, num_classes: int, pretrained: bool = True) -> nn.Module:
    if arch == "efficientnet_b0":
        weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
        net = models.efficientnet_b0(weights=weights)
        in_features = net.classifier[-1].in_features
        net.classifier[-1] = nn.Sequential(
            nn.Dropout(p=0.30),
            nn.Linear(in_features, num_classes),
        )
        return net

    if arch == "resnet50":
        weights = models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None
        net = models.resnet50(weights=weights)
        net.fc = nn.Linear(net.fc.in_features, num_classes)
        return net

    if arch == "mobilenet_v3_large":
        weights = models.MobileNet_V3_Large_Weights.IMAGENET1K_V2 if pretrained else None
        net = models.mobilenet_v3_large(weights=weights)
        in_features = net.classifier[-1].in_features
        net.classifier[-1] = nn.Linear(in_features, num_classes)
        return net

    raise ValueError(f"Unsupported arch '{arch}'. Choose from {SUPPORTED_ARCHS}")


def get_last_conv_layer(model: nn.Module, arch: str):
    """Returns the layer to hook for Grad-CAM, per architecture."""
    if arch == "efficientnet_b0":
        return model.features[-1]
    if arch == "resnet50":
        return model.layer4[-1]
    if arch == "mobilenet_v3_large":
        return model.features[-1]
    raise ValueError(f"Unsupported arch '{arch}'")
