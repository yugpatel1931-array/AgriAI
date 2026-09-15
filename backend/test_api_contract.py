"""Small offline API smoke test for the HTTP contract.

Run from backend/: python test_api_contract.py
This replaces model/Gemini calls with local stubs, so it needs no API key.
"""
from __future__ import annotations

import io
import os

from PIL import Image

import api_server


class FakePredictor:
    def predict(self, image_path: str, topk: int = 3):
        assert os.path.exists(image_path)
        return {
            "predicted_class": "Potato___Late_blight",
            "confidence": 0.6415,
            "top_k": [
                {"class": "Potato___Late_blight", "confidence": 0.6415},
                {"class": "Potato___Early_blight", "confidence": 0.2541},
            ],
        }

    def predict_with_gradcam(self, image_path: str, out_path: str, target_class=None):
        # A tiny valid image is enough to verify that the API can package a
        # model-focus image without loading a real CNN in this smoke test.
        Image.new("RGB", (8, 8), (90, 140, 90)).save(out_path, format="JPEG", quality=70)
        return {"gradcam_path": out_path}


api_server._predictor = FakePredictor()
client = api_server.app.test_client()

response = client.post(
    "/api/analyze",
    data={
        "image": (io.BytesIO(b"not-used-by-fake-predictor"), "leaf.jpg"),
    },
    content_type="multipart/form-data",
)
assert response.status_code == 200, response.get_data(as_text=True)
data = response.get_json()
assert data["crop"] == "Potato"
assert data["disease"] == "Late Blight"
assert data["confidence"] == 0.6415
assert data["demo"] is False
assert data["modelArchitecture"] == "EfficientNet-B0"
assert data["organicRecommendations"]
assert data["chemicalRecommendations"]
assert data["gradcamAvailable"] is True

missing = client.post("/api/analyze")
assert missing.status_code == 400
assert missing.get_json()["error"] == "IMAGE_REQUIRED"

print("API contract smoke test: PASS")
