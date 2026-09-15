"""
Inspects a leaf-disease dataset laid out as:

    data_dir/
        ClassNameA/
            img1.jpg
            img2.jpg
        ClassNameB/
            ...

Reports everything needed before touching the training pipeline:
class list, per-class counts, image dimensions/formats, corrupted
files, exact duplicates, and class imbalance. Nothing here is
hard-coded — classes are whatever subfolders exist.

Usage:
    python -m src.data_inspect --data_dir data/raw
"""
import argparse
import hashlib
import os
from collections import Counter, defaultdict

from PIL import Image, UnidentifiedImageError

from . import config


def _has_images(dir_path: str) -> bool:
    return any(
        os.path.isfile(os.path.join(dir_path, f))
        and os.path.splitext(f)[1].lower() in config.VALID_EXTENSIONS
        for f in os.listdir(dir_path)
    )


def _discover_classes_recursive(data_dir: str, prefix: str = "") -> list:
    classes = []
    subdirs = sorted(
        d for d in os.listdir(data_dir)
        if os.path.isdir(os.path.join(data_dir, d)) and not d.startswith(".")
    )
    for d in subdirs:
        full = os.path.join(data_dir, d)
        name = f"{prefix}{d}"
        if _has_images(full):
            # Images sit directly in this folder -> it IS a class, e.g.
            # train/apple___scab/*.jpg. We do not also recurse into it,
            # even if it happens to contain stray subfolders.
            classes.append(name)
        else:
            # No images directly here -> this is an intermediate folder
            # (e.g. a species like "apple" holding one subfolder per
            # disease). Recurse and use "species/disease" as the class
            # name so labels stay unique and human-readable, with no
            # manual folder reorganizing required.
            nested = _discover_classes_recursive(full, prefix=f"{name}/")
            classes.extend(nested)
    return classes


def discover_classes(data_dir: str) -> list:
    """
    Finds classes under data_dir, auto-handling one extra level of
    nesting (e.g. species/disease/*.jpg) by flattening it into class
    names like "apple/Apple___scab". A folder is treated as a class as
    soon as it directly contains image files; folders that hold only
    further subfolders are recursed into instead of being misread as
    "0 images". Call this separately on train/, val/, and test/ so
    each split resolves the same class names off the same on-disk
    layout.
    """
    classes = sorted(_discover_classes_recursive(data_dir))
    if not classes:
        raise ValueError(
            f"No class folders with images found under '{data_dir}'. "
            "Expected structure: data_dir/<ClassName>/<images>, or "
            "data_dir/<Species>/<Disease>/<images> (one extra nesting "
            "level is auto-detected)."
        )
    return classes


def list_images(class_dir: str) -> list:
    return [
        os.path.join(class_dir, f)
        for f in os.listdir(class_dir)
        if os.path.splitext(f)[1].lower() in config.VALID_EXTENSIONS
    ]


def file_hash(path: str, chunk_size: int = 65536) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()


def inspect(data_dir: str, check_duplicates: bool = True) -> dict:
    classes = discover_classes(data_dir)
    report = {
        "data_dir": data_dir,
        "num_classes": len(classes),
        "classes": classes,
        "per_class_count": {},
        "formats": Counter(),
        "dimensions": Counter(),
        "corrupted": [],
        "duplicates": [],
        "total_images": 0,
    }

    hash_to_paths = defaultdict(list)

    for cls in classes:
        cls_dir = os.path.join(data_dir, cls)
        paths = list_images(cls_dir)
        report["per_class_count"][cls] = len(paths)
        report["total_images"] += len(paths)

        for p in paths:
            ext = os.path.splitext(p)[1].lower()
            report["formats"][ext] += 1
            try:
                with Image.open(p) as img:
                    img.verify()  # cheap corruption check
                with Image.open(p) as img:
                    report["dimensions"][img.size] += 1
            except (UnidentifiedImageError, OSError, ValueError) as e:
                report["corrupted"].append((p, str(e)))
                continue

            if check_duplicates:
                try:
                    hash_to_paths[file_hash(p)].append(p)
                except OSError:
                    pass

    if check_duplicates:
        report["duplicates"] = [paths for paths in hash_to_paths.values() if len(paths) > 1]

    counts = list(report["per_class_count"].values())
    if counts:
        report["imbalance_ratio"] = round(max(counts) / max(1, min(counts)), 2)
    else:
        report["imbalance_ratio"] = None

    return report


def print_report(report: dict) -> None:
    print("=" * 70)
    print(f"Dataset: {report['data_dir']}")
    print(f"Classes found ({report['num_classes']}): {report['classes']}")
    print(f"Total images: {report['total_images']}")
    print("-" * 70)
    print("Per-class counts:")
    for cls, n in sorted(report["per_class_count"].items(), key=lambda x: -x[1]):
        print(f"  {cls:35s} {n:6d}")
    print(f"\nClass imbalance ratio (max/min): {report['imbalance_ratio']}")
    print("-" * 70)
    print(f"File formats: {dict(report['formats'])}")
    top_dims = report["dimensions"].most_common(10)
    print(f"Most common image dimensions (top 10): {top_dims}")
    print("-" * 70)
    print(f"Corrupted/unreadable images: {len(report['corrupted'])}")
    for p, err in report["corrupted"][:20]:
        print(f"  BAD: {p}  ({err})")
    if len(report["corrupted"]) > 20:
        print(f"  ... and {len(report['corrupted']) - 20} more")
    print("-" * 70)
    dup_groups = report["duplicates"]
    dup_files = sum(len(g) - 1 for g in dup_groups)
    print(f"Exact duplicate groups: {len(dup_groups)} (extra redundant files: {dup_files})")
    for g in dup_groups[:10]:
        print(f"  DUP: {g}")
    if len(dup_groups) > 10:
        print(f"  ... and {len(dup_groups) - 10} more groups")
    print("=" * 70)
    if report["imbalance_ratio"] and report["imbalance_ratio"] > 3:
        print("NOTE: significant class imbalance detected -> training pipeline will "
              "apply class-weighted loss automatically.")
    if report["corrupted"]:
        print("NOTE: corrupted images detected -> these are automatically skipped "
              "during dataset construction.")
    if dup_groups:
        print("NOTE: duplicate images detected -> deduped BEFORE the train/val/test "
              "split so no duplicate can leak across splits.")


def _find_split_dirs(data_dir: str) -> dict:
    """Detects existing train/val/test subfolders (mirrors dataset.py's logic)."""
    aliases = {
        "train": ["train", "training"],
        "val": ["val", "valid", "validation", "dev"],
        "test": ["test", "testing"],
    }
    entries = {
        d.lower(): d for d in os.listdir(data_dir)
        if os.path.isdir(os.path.join(data_dir, d)) and not d.startswith(".")
    }
    found = {}
    for split, alias_list in aliases.items():
        for alias in alias_list:
            if alias in entries:
                found[split] = os.path.join(data_dir, entries[alias])
                break
    return found


def inspect_presplit(data_dir: str, split_dirs: dict, check_duplicates: bool = True) -> None:
    print(f"Detected an existing split layout under '{data_dir}': "
          f"{ {k: os.path.basename(v) for k, v in split_dirs.items()} }")
    print("Inspecting each split separately (classes taken from train/):\n")

    reports = {}
    for split_name, split_path in split_dirs.items():
        print(f"\n########## {split_name.upper()} ##########")
        rep = inspect(split_path, check_duplicates=check_duplicates)
        print_report(rep)
        reports[split_name] = rep

    train_classes = set(reports.get("train", {}).get("classes", []))
    for split_name in ("val", "test"):
        if split_name in reports:
            other_classes = set(reports[split_name]["classes"])
            missing = train_classes - other_classes
            extra = other_classes - train_classes
            if missing or extra:
                print(f"\nNOTE: class mismatch between train/ and {split_name}/ -> "
                      f"missing from {split_name}: {missing or 'none'}, "
                      f"unexpected in {split_name}: {extra or 'none'}")

    if check_duplicates:
        print("\n########## CROSS-SPLIT LEAKAGE CHECK ##########")
        hash_to_splits = {}
        for split_name, split_path in split_dirs.items():
            classes = discover_classes(split_path)
            for cls in classes:
                for p in list_images(os.path.join(split_path, cls)):
                    try:
                        h = file_hash(p)
                    except OSError:
                        continue
                    hash_to_splits.setdefault(h, set()).add(split_name)
        leaking = {h: s for h, s in hash_to_splits.items() if len(s) > 1}
        if leaking:
            print(f"WARNING: {len(leaking)} image(s) appear identically in more than one split "
                  f"(e.g. across {list(leaking.values())[0]}). This is data leakage and will "
                  "inflate val/test scores.")
        else:
            print("No identical images found across your train/val/test folders. Good.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", default=config.DEFAULT_DATA_DIR)
    parser.add_argument("--no_duplicate_check", action="store_true")
    args = parser.parse_args()

    split_dirs = _find_split_dirs(args.data_dir)
    if "train" in split_dirs and "test" in split_dirs:
        inspect_presplit(args.data_dir, split_dirs, check_duplicates=not args.no_duplicate_check)
    else:
        rep = inspect(args.data_dir, check_duplicates=not args.no_duplicate_check)
        print_report(rep)
