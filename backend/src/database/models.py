"""
AgriSmart AI - MongoDB document models.

These Pydantic models describe documents stored in the MongoDB collections
created by database/connection.py. They are intentionally independent of Flask routes,
so they can be imported without changing the existing ML/Multi-AI pipeline.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


# -----------------------------
# User
# -----------------------------

class UserModel(BaseModel):
    name: str
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=utcnow)
    is_active: bool = True


# -----------------------------
# Disease Prediction / Scan
# -----------------------------

class PredictionModel(BaseModel):
    user_id: Optional[str] = None
    crop: str
    disease: str
    confidence: float = Field(ge=0.0, le=1.0)
    image_path: Optional[str] = None
    model_class: Optional[str] = None
    model_architecture: Optional[str] = None
    risk: Optional[str] = None
    top_k: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=utcnow)


# -----------------------------
# Feedback
# -----------------------------

class FeedbackModel(BaseModel):
    user_id: Optional[str] = None
    prediction_id: Optional[str] = None
    message: str
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    created_at: datetime = Field(default_factory=utcnow)


# -----------------------------
# Crop Recommendation
# -----------------------------

class CropRecommendationModel(BaseModel):
    user_id: Optional[str] = None
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    soil_type: Optional[str] = None
    water_availability: Optional[str] = None
    season: Optional[str] = None
    location: Optional[str] = None
    previous_crop: Optional[str] = None
    recommended_crop: str
    score: Optional[float] = None
    created_at: datetime = Field(default_factory=utcnow)


# -----------------------------
# Smart Irrigation
# -----------------------------

class IrrigationRecommendationModel(BaseModel):
    user_id: Optional[str] = None
    crop: Optional[str] = None
    growth_stage: Optional[str] = None
    soil_moisture_pct: Optional[float] = Field(default=None, ge=0, le=100)
    temperature: Optional[float] = None
    humidity: Optional[float] = Field(default=None, ge=0, le=100)
    rain_probability_pct: Optional[float] = Field(default=None, ge=0, le=100)
    irrigation_needed: bool
    recommendation: str
    created_at: datetime = Field(default_factory=utcnow)


# -----------------------------
# Weather
# -----------------------------

class WeatherRecordModel(BaseModel):
    user_id: Optional[str] = None
    latitude: float
    longitude: float
    temperature_c: Optional[float] = None
    humidity_pct: Optional[float] = Field(default=None, ge=0, le=100)
    rain_probability_pct: Optional[float] = Field(default=None, ge=0, le=100)
    source: str
    fetched_at: datetime = Field(default_factory=utcnow)


# -----------------------------
# Sustainability
# -----------------------------

class SustainabilityScoreModel(BaseModel):
    user_id: Optional[str] = None
    overall_score: float = Field(ge=0, le=100)
    water_efficiency: Optional[float] = Field(default=None, ge=0, le=100)
    resource_use: Optional[float] = Field(default=None, ge=0, le=100)
    crop_health: Optional[float] = Field(default=None, ge=0, le=100)
    formula_version: str = "v1"
    suggestions: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=utcnow)


# -----------------------------
# Khedut Mitr Chat History
# -----------------------------

class ChatHistoryModel(BaseModel):
    user_id: Optional[str] = None
    message: str
    response: str
    provider: Optional[str] = None
    model: Optional[str] = None
    language: str = "en"
    context: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=utcnow)
