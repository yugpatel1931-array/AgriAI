"""
Builds a leakage-safe train/val/test split and wraps it in a PyTorch
Dataset. Classes are discovered automatically — never hard-coded.

Supports TWO dataset layouts, auto-detected from what's on disk:

1. "presplit"  — data_dir already contains train/ val/ test/ (or
   train/valid/test, train/test, etc.) subfolders, each holding one
   folder per class. This is used AS-IS: we do not re-shuffle images
   across the splits you already made. If no val/ folder exists, a
   validation set is carved out of train/ only (test/ is never
   touched). A hash-based check flags any image that leaks across
   your train/val/test folders (e.g. an accidental copy).

2. "flat"      — data_dir contains one folder per class directly
   (no train/val/test subfolders). We deduplicate and then perform a
   stratified train/val/test split ourselves.
"""
import os
from dataclasses import dataclass

from PIL import Image, UnidentifiedImageError
from sklearn.model_selection import train_test_split
from torch.utils.data import Dataset

from . import config
from .data_inspect import discover_classes, list_images, file_hash

SPLIT_ALIASES = {
    "train": ["train", "training"],
    "val": ["val", "valid", "validation", "dev"],
    "test": ["test", "testing"],
}


@dataclass
class Split:
    paths: list
    labels: list


def _find_split_dirs(data_dir: str) -> dict:
    """Detects existing train/val/test subfolders under data_dir (case-insensitive)."""
    data_dir = os.path.normpath(data_dir)

    if not os.path.exists(data_dir):
        raise FileNotFoundError(
            f"[dataset] Data directory not found:\n    {data_dir}\n\n"
            "Possible causes:\n"
            "  - The path is wrong or the drive/folder was renamed or moved.\n"
            "  - On the command line, a path with spaces or parentheses must be "
            'quoted, e.g. --data_dir "C:\\Users\\me\\Downloads\\archive (1)\\image data"\n'
            "  - A relative path is being resolved from the wrong working directory "
            f"(current working directory: {os.getcwd()})."
        )
    if not os.path.isdir(data_dir):
        raise NotADirectoryError(
            f"[dataset] Expected a directory but found a file at:\n    {data_dir}"
        )

    entries = {
        d.lower(): d for d in os.listdir(data_dir)
        if os.path.isdir(os.path.join(data_dir, d)) and not d.startswith(".")
    }
    found = {}
    for split, aliases in SPLIT_ALIASES.items():
        for alias in aliases:
            if alias in entries:
                found[split] = os.path.join(data_dir, entries[alias])
                break
    return found


def _load_labeled_paths(root: str, class_names: list):
    """Loads (path, label) pairs from a class-per-folder directory, skipping corrupted files."""
    paths, labels = [], []
    skipped_corrupt = 0
    for label_idx, cls in enumerate(class_names):
        cls_dir = os.path.join(root, cls)
        if not os.path.isdir(cls_dir):
            continue  # class missing from this split — fine, just means 0 samples here
        for p in list_images(cls_dir):
            try:
                with Image.open(p) as img:
                    img.verify()
            except (UnidentifiedImageError, OSError, ValueError):
                skipped_corrupt += 1
                continue
            paths.append(p)
            labels.append(label_idx)
    return paths, labels, skipped_corrupt


def _check_cross_split_leakage(named_splits: dict) -> None:
    """Warns (does not modify) if the exact same image file appears in more than one split."""
    hash_to_splits = {}
    for split_name, split in named_splits.items():
        for p in split.paths:
            try:
                h = file_hash(p)
            except OSError:
                continue
            hash_to_splits.setdefault(h, set()).add(split_name)

    leaking = {h: s for h, s in hash_to_splits.items() if len(s) > 1}
    if leaking:
        print(f"[dataset] WARNING: {len(leaking)} image(s) appear identically in more than one "
              f"of your pre-made splits (e.g. {list(leaking.values())[0]}). This is data leakage "
              "and will inflate your test/val scores — consider removing the duplicates from your "
              "raw dataset.")
    else:
        print("[dataset] Cross-split leakage check: no identical images found across "
              "train/val/test. Good.")


def _build_presplit(split_dirs: dict, val_frac: float, seed: int):
    class_names = discover_classes(split_dirs["train"])
    if not class_names:
        raise ValueError(
            f"[dataset] No class subfolders found under:\n    {split_dirs['train']}\n"
            "Expected one folder per class (e.g. train/healthy/, train/blight/, ...)."
        )

    train_paths, train_labels, corrupt_train = _load_labeled_paths(split_dirs["train"], class_names)
    test_paths, test_labels, corrupt_test = _load_labeled_paths(split_dirs["test"], class_names)
    total_corrupt = corrupt_train + corrupt_test

    if not train_paths:
        raise ValueError(
            f"[dataset] Found 0 usable images in:\n    {split_dirs['train']}\n"
            f"Classes detected: {class_names}\n"
            "Check that images sit directly inside each class folder and use one of "
            f"the supported extensions: {sorted(config.VALID_EXTENSIONS)}"
        )
    if not test_paths:
        raise ValueError(
            f"[dataset] Found 0 usable images in:\n    {split_dirs['test']}\n"
            f"Classes detected: {class_names}"
        )

    if "val" in split_dirs:
        val_paths, val_labels, corrupt_val = _load_labeled_paths(split_dirs["val"], class_names)
        total_corrupt += corrupt_val
    else:
        print("[dataset] No val/ folder found — carving a validation set out of train/ only "
              f"(test/ is left untouched). val_frac={val_frac}")
        train_paths, val_paths, train_labels, val_labels = train_test_split(
            train_paths, train_labels, test_size=val_frac, stratify=train_labels, random_state=seed
        )

    if total_corrupt:
        print(f"[dataset] Skipped {total_corrupt} corrupted/unreadable images across your splits.")

    print(f"[dataset] Using your existing splits -> train: {len(train_paths)}, "
          f"val: {len(val_paths)}, test: {len(test_paths)}")

    result = (
        class_names,
        Split(train_paths, train_labels),
        Split(val_paths, val_labels),
        Split(test_paths, test_labels),
    )
    _check_cross_split_leakage({"train": result[1], "val": result[2], "test": result[3]})
    return result


def _build_flat(data_dir: str, val_frac: float, test_frac: float, seed: int, dedupe: bool):
    class_names = discover_classes(data_dir)
    if not class_names:
        raise ValueError(
            f"[dataset] No class subfolders found under:\n    {data_dir}\n"
            "Expected one folder per class (e.g. data_dir/healthy/, data_dir/blight/, ...)."
        )
    all_paths, all_labels = [], []
    seen_hashes = set()
    skipped_corrupt = 0
    skipped_dupe = 0

    for label_idx, cls in enumerate(class_names):
        cls_dir = os.path.join(data_dir, cls)
        for p in list_images(cls_dir):
            try:
                with Image.open(p) as img:
                    img.verify()
            except (UnidentifiedImageError, OSError, ValueError):
                skipped_corrupt += 1
                continue

            if dedupe:
                h = file_hash(p)
                if h in seen_hashes:
                    skipped_dupe += 1
                    continue
                seen_hashes.add(h)

            all_paths.append(p)
            all_labels.append(label_idx)

    if skipped_corrupt:
        print(f"[dataset] Skipped {skipped_corrupt} corrupted/unreadable images.")
    if skipped_dupe:
        print(f"[dataset] Skipped {skipped_dupe} exact-duplicate images (leakage prevention).")

    if not all_paths:
        raise ValueError(
            f"[dataset] Found 0 usable images under:\n    {data_dir}\n"
            f"Classes detected: {class_names}\n"
            f"Skipped as corrupted: {skipped_corrupt}, skipped as duplicates: {skipped_dupe}.\n"
            f"Supported extensions: {sorted(config.VALID_EXTENSIONS)}"
        )

    # First split off test, then split remainder into train/val.
    train_val_paths, test_paths, train_val_labels, test_labels = train_test_split(
        all_paths, all_labels, test_size=test_frac, stratify=all_labels, random_state=seed
    )
    val_relative = val_frac / (1.0 - test_frac)
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        train_val_paths, train_val_labels, test_size=val_relative,
        stratify=train_val_labels, random_state=seed
    )

    print(f"[dataset] Split sizes -> train: {len(train_paths)}, "
          f"val: {len(val_paths)}, test: {len(test_paths)}")

    return (
        class_names,
        Split(train_paths, train_labels),
        Split(val_paths, val_labels),
        Split(test_paths, test_labels),
    )


def build_splits(data_dir: str, val_frac: float = config.VAL_FRACTION,
                  test_frac: float = config.TEST_FRACTION,
                  seed: int = config.SEED, dedupe: bool = True,
                  split_mode: str = "auto"):
    """
    Returns (class_names, train_split, val_split, test_split).

    split_mode:
      "auto"     — detect train/(val/)test subfolders under data_dir; use
                   them as-is if found, otherwise fall back to a flat
                   class-per-folder layout and split it ourselves.
      "presplit" — force presplit mode (error if train/test aren't found).
      "flat"     — force flat mode (ignore any train/val/test subfolders).

    Leakage prevention:
      - flat mode: exact-duplicate images are collapsed BEFORE splitting.
      - presplit mode: your splits are respected as-is, but a hash check
        warns you if the same image accidentally appears in more than
        one of your folders.
      - In both modes, the test set is only ever touched by evaluate.py.
    """
    split_dirs = _find_split_dirs(data_dir) if split_mode in ("auto", "presplit") else {}

    if split_mode == "presplit" or (split_mode == "auto" and "train" in split_dirs and "test" in split_dirs):
        if "train" not in split_dirs or "test" not in split_dirs:
            raise ValueError(
                f"split_mode='presplit' requires train/ and test/ subfolders under '{data_dir}'. "
                f"Found: {list(split_dirs.keys())}"
            )
        return _build_presplit(split_dirs, val_frac, seed)

    return _build_flat(data_dir, val_frac, test_frac, seed, dedupe)


class LeafDataset(Dataset):
    def __init__(self, split: Split, transform=None):
        self.paths = split.paths
        self.labels = split.labels
        self.transform = transform

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, idx):
        path = self.paths[idx]
        image = Image.open(path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, self.labels[idx]
