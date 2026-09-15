"""
Bonus Module C — Weather-Based Intelligence.

Combines live/forecast weather with farm conditions (and, optionally, the
core disease-detection result) to produce clear, farmer-facing actions —
e.g. "delay irrigation — rain likely" or "raised disease risk — monitor".

This is also what lets src/genai_assistant.py answer "what is the
weather" truthfully instead of declining — pass its output in as
extra_context and the LLM will use real numbers instead of saying it
doesn't have that data.

Weather data source
--------------------
Open-Meteo (https://open-meteo.com) — a free, no-API-key weather API.
Cited here and in the README as required. If the network is unavailable,
`WeatherProvider` falls back to a seeded, deterministic
`MockWeatherProvider` and clearly marks the result as
`"source": "mock (offline fallback)"` — it never silently pretends to be
live data.

CLI:
    python -m src.weather --lat 23.03 --lon 72.58
    python -m src.weather --lat 23.03 --lon 72.58 --soil_moisture_pct 22
"""
import argparse
import json
import random
from datetime import datetime
from typing import Dict, Optional

import requests

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


class WeatherProvider:
    """Fetches current + next-24h forecast weather for a lat/lon via
    Open-Meteo. Falls back to a deterministic mock on any network error so
    the rest of the pipeline never breaks offline."""

    def __init__(self, timeout_s: float = 5.0):
        self.timeout_s = timeout_s

    def get_weather(self, lat: float, lon: float) -> Dict:
        try:
            resp = requests.get(
                OPEN_METEO_URL,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": "temperature_2m,relative_humidity_2m,precipitation",
                    "hourly": "precipitation_probability",
                    "forecast_days": 1,
                    "timezone": "auto",
                },
                timeout=self.timeout_s,
            )
            resp.raise_for_status()
            data = resp.json()
            current = data.get("current", {})
            hourly_probs = data.get("hourly", {}).get("precipitation_probability", [])
            rain_probability_24h = max(hourly_probs) if hourly_probs else 0
            return {
                "source": "open-meteo.com (live)",
                "temperature_c": current.get("temperature_2m"),
                "humidity_pct": current.get("relative_humidity_2m"),
                "rain_probability_pct": rain_probability_24h,
                "fetched_at": datetime.utcnow().isoformat() + "Z",
            }
        except Exception as exc:
            fallback = MockWeatherProvider().get_weather(lat, lon)
            fallback["fallback_reason"] = str(exc)
            return fallback


class MockWeatherProvider:
    """Deterministic (seeded by lat/lon + date) mock so repeated calls in a
    demo are stable, clearly labelled as non-live."""

    def get_weather(self, lat: float, lon: float) -> Dict:
        seed = int(abs(lat * 1000) + abs(lon * 1000)) + datetime.utcnow().toordinal()
        rng = random.Random(seed)
        return {
            "source": "mock (offline fallback)",
            "temperature_c": round(rng.uniform(18, 34), 1),
            "humidity_pct": round(rng.uniform(35, 90), 1),
            "rain_probability_pct": round(rng.uniform(0, 100), 1),
            "fetched_at": datetime.utcnow().isoformat() + "Z",
        }


def fuse_weather_with_farm(
    weather: Dict,
    disease_result: Optional[Dict] = None,
    soil_moisture_pct: Optional[float] = None,
) -> Dict:
    """Turns raw weather + farm signals into short, farmer-facing actions."""
    actions = []
    rain_prob = weather.get("rain_probability_pct", 0) or 0
    humidity = weather.get("humidity_pct", 0) or 0
    temp = weather.get("temperature_c", 0) or 0

    if rain_prob >= 60:
        actions.append("Delay irrigation — rain likely in the next 24h.")
    elif soil_moisture_pct is not None and soil_moisture_pct < 25 and rain_prob < 30:
        actions.append("Soil is drying out and rain is unlikely — plan irrigation soon.")

    high_humidity = humidity >= 75
    warm = 20 <= temp <= 30
    disease_detected = bool(
        disease_result and "healthy" not in disease_result.get("predicted_class", "").lower()
    )
    if high_humidity and warm:
        if disease_detected:
            actions.append(
                f"Raised disease risk — humid, warm conditions favor spread of "
                f"{disease_result['predicted_class']}. Monitor closely and consider prompt treatment."
            )
        else:
            actions.append("Raised disease risk — humid, warm conditions. Monitor crops closely.")

    if temp >= 35:
        actions.append("Heat stress risk — consider shading or extra watering during peak heat.")

    if not actions:
        actions.append("Conditions look normal — no special weather-driven action needed today.")

    return {"weather": weather, "actions": actions}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--lat", type=float, required=True)
    parser.add_argument("--lon", type=float, required=True)
    parser.add_argument("--soil_moisture_pct", type=float, default=None)
    args = parser.parse_args()
    weather = WeatherProvider().get_weather(args.lat, args.lon)
    print(json.dumps(fuse_weather_with_farm(weather, soil_moisture_pct=args.soil_moisture_pct), indent=2))


if __name__ == "__main__":
    main()
