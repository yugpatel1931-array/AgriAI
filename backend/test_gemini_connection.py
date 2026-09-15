import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()
base = f"http://127.0.0.1:{os.getenv('PORT', '8000')}"

try:
    health = requests.get(base + "/api/health", timeout=5)
    print("Health:", health.status_code, health.json())
    if not health.ok or not health.json().get("gemini_configured"):
        sys.exit("Gemini is not configured. Put GEMINI_API_KEY in backend/.env.")

    chat = requests.post(
        base + "/api/chat",
        json={
            "message": "Give me one short farming tip for a tomato farmer.",
            "language": "en",
            "context": {"crop": "Tomato"},
            "history": [],
        },
        timeout=30,
    )
    print("Chat:", chat.status_code)
    print(chat.json())
except requests.RequestException as exc:
    sys.exit(f"Could not reach backend: {exc}")
