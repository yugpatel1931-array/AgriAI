# Khedut Mitr — Gemini setup

## 1. Create the key
Open Google AI Studio: https://aistudio.google.com/apikey
Create an API key and keep it private.

## 2. Configure
Copy `.env.example` to `.env` and set:

GEMINI_API_KEY=YOUR_REAL_KEY
GEMINI_MODEL=gemini-2.5-flash

`.env` is ignored by Git.

## 3. Install
Windows PowerShell:

    cd backend
    python -m pip install -r requirements.txt

## 4. Run

    python api_server.py

Health check:

    http://127.0.0.1:8000/api/health

It should report `gemini_configured: true` when the key is loaded.

## 5. Frontend
Serve the `frontend` directory with any local HTTP server. For example:

    cd frontend
    python -m http.server 5500

Then open:

    http://127.0.0.1:5500/dashboard.html

Khedut Mitr calls:

    POST http://127.0.0.1:8000/api/chat

The browser never receives the Gemini API key.
