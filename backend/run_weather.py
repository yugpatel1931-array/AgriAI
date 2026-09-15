"""
Run this file directly (Run button in your IDE, or `python run_weather.py`)
instead of using the command line. Just edit the settings below.

Uses Open-Meteo (free, no API key needed). Falls back automatically to a
clearly-labelled mock reading if there's no internet connection.
"""
import json
from src.weather import WeatherProvider, fuse_weather_with_farm

# ============================ EDIT THESE ============================
LATITUDE = 23.03      # e.g. Ahmedabad, Gujarat
LONGITUDE = 72.58

SOIL_MOISTURE_PCT = None   # e.g. 22, or None to skip that signal

# Optional — paste in the predicted_class from run_predict.py's output to
# get a disease-risk-aware weather action. Leave as None to skip.
PREDICTED_CLASS = None     # e.g. "Tomato_Early_blight"
# ======================================================================

weather = WeatherProvider().get_weather(LATITUDE, LONGITUDE)
disease_result = {"predicted_class": PREDICTED_CLASS} if PREDICTED_CLASS else None

result = fuse_weather_with_farm(weather, disease_result=disease_result, soil_moisture_pct=SOIL_MOISTURE_PCT)
print(json.dumps(result, indent=2))
