"""
Run this file directly (Run button in your IDE, or `python run_genai_assistant.py`)
instead of using the command line. Just edit the settings below.

REQUIRES an Anthropic API key (get one at https://console.anthropic.com)
and `pip install anthropic`. This is the one part of the project that
needs internet + an API key — everything else works fully offline.
"""
from src.genai_assistant import GenAIFarmerAssistant

# ============================ EDIT THESE ============================
# Preferred: set this as a real environment variable instead of pasting
# it here, especially if you'll ever share/commit this file:
#   Windows (PowerShell):  $env:ANTHROPIC_API_KEY="sk-ant-..."
#   Mac/Linux:              export ANTHROPIC_API_KEY="sk-ant-..."
# Leave this as None to read from that environment variable.
API_KEY = None

PREDICTED_CLASS = "Tomato_Early_blight"     # from run_predict.py's output
CONFIDENCE = 0.91                            # 0.0-1.0, from run_predict.py's output
RECOMMENDED_CROPS = ["Wheat", "Soybean"]     # from run_crop_recommend.py's output, or None

MODE = "single_question"     # "single_question" | "chat"
QUESTION = "Will this spread to my other tomato plants?"   # used when MODE = "single_question"
# ======================================================================

crop_recs = [{"crop": c} for c in RECOMMENDED_CROPS] if RECOMMENDED_CROPS else None
assistant = GenAIFarmerAssistant(api_key=API_KEY)

if MODE == "chat":
    assistant.chat_loop(PREDICTED_CLASS, CONFIDENCE, crop_recs)
elif MODE == "single_question":
    print(assistant.ask(QUESTION, PREDICTED_CLASS, CONFIDENCE, crop_recs))
else:
    raise ValueError(f"Unknown MODE: {MODE!r}")
