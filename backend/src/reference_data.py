"""
Loads data/reference/crop_requirements.csv — the reference table used by
crop_recommend.py.

HONESTY NOTE: the numbers here (temperature/humidity/rainfall/pH ranges,
water demand) are typical agronomic ranges compiled for demo purposes —
they are NOT scraped or verified market/agricultural-extension data.
Good enough to make the rule-based scoring below behave sensibly and
reproducibly; for real deployment, replace this file with figures from a
local agricultural university or Krishi Vigyan Kendra.
"""
import csv
import os
from dataclasses import dataclass
from typing import Dict, List

from . import config

REFERENCE_CSV = os.path.join(config.PROJECT_ROOT, "data", "reference", "crop_requirements.csv")


@dataclass
class CropProfile:
    crop: str
    family: str
    min_temp_c: float
    max_temp_c: float
    min_humidity_pct: float
    max_humidity_pct: float
    min_rainfall_mm: float
    max_rainfall_mm: float
    soil_types: List[str]
    min_ph: float
    max_ph: float
    water_need: str
    base_water_mm_per_week: float


_CACHE: Dict[str, CropProfile] = {}


def load_crop_profiles(csv_path: str = REFERENCE_CSV) -> Dict[str, CropProfile]:
    global _CACHE
    if _CACHE:
        return _CACHE
    if not os.path.exists(csv_path):
        raise FileNotFoundError(
            f"Reference table not found at {csv_path}. It ships with the repo "
            "under data/reference/ — did you move it?"
        )
    profiles: Dict[str, CropProfile] = {}
    with open(csv_path, newline="") as f:
        for row in csv.DictReader(f):
            profiles[row["crop"]] = CropProfile(
                crop=row["crop"],
                family=row["family"],
                min_temp_c=float(row["min_temp_c"]),
                max_temp_c=float(row["max_temp_c"]),
                min_humidity_pct=float(row["min_humidity_pct"]),
                max_humidity_pct=float(row["max_humidity_pct"]),
                min_rainfall_mm=float(row["min_rainfall_mm"]),
                max_rainfall_mm=float(row["max_rainfall_mm"]),
                soil_types=row["soil_types"].split("|"),
                min_ph=float(row["min_ph"]),
                max_ph=float(row["max_ph"]),
                water_need=row["water_need"],
                base_water_mm_per_week=float(row["base_water_mm_per_week"]),
            )
    _CACHE = profiles
    return profiles


def get_crop(crop_name: str, csv_path: str = REFERENCE_CSV) -> CropProfile:
    profiles = load_crop_profiles(csv_path)
    key_map = {k.lower().replace(" ", ""): k for k in profiles}
    lookup = crop_name.lower().replace(" ", "")
    if lookup not in key_map:
        raise KeyError(f"Unknown crop '{crop_name}'. Known crops: {sorted(profiles)}")
    return profiles[key_map[lookup]]
