"""Shared helpers: reproducibility, transforms, class weighting, checkpoints."""
import os
import random
import json
import numpy as np
import torch
from torchvision import transforms

from . import config


def seed_everything(seed: int = config.SEED) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    # Deterministic-ish behaviour without crippling speed.
    torch.backends.cudnn.benchmark = True


def get_train_transforms(image_size: int = config.IMAGE_SIZE) -> transforms.Compose:
    """
    Generalization-focused augmentation for plant-leaf disease images.

    The goal is to simulate realistic field variation (camera distance,
    viewpoint, lighting, blur and partial occlusion) while preserving the
    lesion/spot patterns that distinguish closely related diseases.
    """
    return transforms.Compose([
        transforms.RandomResizedCrop(
            image_size, scale=(0.70, 1.0), ratio=(0.80, 1.25)
        ),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(degrees=20),
        transforms.ColorJitter(
            brightness=0.25, contrast=0.25, saturation=0.15, hue=0.02
        ),
        transforms.RandomApply(
            [transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 1.5))],
            p=0.15,
        ),
        transforms.RandomAutocontrast(p=0.15),
        transforms.RandomApply(
            [transforms.RandomAffine(
                degrees=0,
                translate=(0.06, 0.06),
                scale=(0.92, 1.08),
                shear=(-5, 5),
            )],
            p=0.20,
        ),
        transforms.ToTensor(),
        transforms.RandomErasing(
            p=0.20, scale=(0.02, 0.10), ratio=(0.5, 2.0), value=0
        ),
        transforms.Normalize(config.IMAGENET_MEAN, config.IMAGENET_STD),
    ])


def get_eval_transforms(image_size: int = config.IMAGE_SIZE) -> transforms.Compose:
    """Deterministic preprocessing used for val/test/inference."""
    return transforms.Compose([
        transforms.Resize(int(image_size * 1.14)),
        transforms.CenterCrop(image_size),
        transforms.ToTensor(),
        transforms.Normalize(config.IMAGENET_MEAN, config.IMAGENET_STD),
    ])


def compute_class_weights(labels: list, num_classes: int) -> torch.Tensor:
    """Inverse-frequency class weights for the loss function (handles imbalance)."""
    counts = np.bincount(labels, minlength=num_classes).astype(np.float64)
    counts[counts == 0] = 1.0  # avoid div-by-zero for any empty class
    weights = counts.sum() / (num_classes * counts)
    return torch.tensor(weights, dtype=torch.float32)


def save_checkpoint(path: str, model, class_names: list, image_size: int, arch: str, extra: dict = None) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    payload = {
        "model_state_dict": model.state_dict(),
        "class_names": class_names,
        "image_size": image_size,
        "arch": arch,
    }
    if extra:
        payload.update(extra)
    torch.save(payload, path)


def load_checkpoint(path: str, map_location=None) -> dict:
    return torch.load(path, map_location=map_location or config.DEVICE)


def save_json(path: str, data: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
