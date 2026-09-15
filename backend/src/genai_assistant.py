"""
Bonus Module E (GenAI upgrade) — real conversational assistant.

src/assistant.py is a fixed-template engine — safe, offline, but it can
only fill in blanks in pre-written sentences; it cannot answer a free-form
question like "will this spread to my other plants?" or "what is the
weather?". This module calls a real LLM (Anthropic's Claude) so farmers
can actually ask things.

Grounding — so it doesn't hallucinate farm advice
----------------------------------------------------
Every call sends the model a system prompt containing ONLY the facts this
project has actually computed (the detected disease + confidence, crop
recommendations, and now real weather data from src/weather.py — Bonus
Module C — if you pass them in) and explicitly instructs it:
  - never invent facts not in that list (no made-up soil test results or
    market prices, and no weather beyond what src/weather.py actually
    fetched),
  - say plainly when something is outside what it knows,
  - keep answers short and practical.
This keeps the "grounded answers score higher than free-form generation"
property from the problem statement even though a real LLM is now doing
the talking, not a template.

Setup (this is the one module in the repo that needs an API key + internet)
-------------------------------------------------------------------------------
    pip install anthropic
    # get a key at https://console.anthropic.com
    # Windows (PowerShell):  $env:ANTHROPIC_API_KEY="sk-ant-..."
    # Mac/Linux:              export ANTHROPIC_API_KEY="sk-ant-..."

If no key is set, this module raises a clear error immediately rather
than failing confusingly mid-call. The offline template assistant
(src/assistant.py) still works with zero setup and no internet if you
don't want to use this module at all.

CLI:
    # one-shot question
    python -m src.genai_assistant --predicted_class Tomato_Early_blight \
        --confidence 0.91 --question "Will this spread to my other tomato plants?"

    # interactive back-and-forth
    python -m src.genai_assistant --predicted_class Tomato_Early_blight \
        --confidence 0.91 --chat

    # ground weather questions in real data (Bonus Module C):
    python -m src.genai_assistant --predicted_class Tomato_Early_blight \
        --confidence 0.91 --lat 23.03 --lon 72.58 --question "What is the weather like?"
"""
import argparse
import os
from typing import Dict, List, Optional

DEFAULT_MODEL = "claude-sonnet-5"


def _build_system_prompt(
    predicted_class: Optional[str],
    confidence: Optional[float],
    crop_recommendations: Optional[List[Dict]] = None,
    weather: Optional[Dict] = None,
) -> str:
    facts = []
    if predicted_class is not None and confidence is not None:
        facts.append(f"- Detected class (from this project's own trained model): {predicted_class}")
        facts.append(f"- Model confidence: {confidence:.1%}")
    if weather:
        facts.append(
            f"- Current weather ({weather.get('source', 'unknown source')}): "
            f"{weather.get('temperature_c')}\u00b0C, {weather.get('humidity_pct')}% humidity, "
            f"{weather.get('rain_probability_pct')}% chance of rain in the next 24h"
        )
    if crop_recommendations:
        crops = ", ".join(r["crop"] for r in crop_recommendations)
        facts.append(f"- Recommended crops for this farm's conditions (from this project's crop "
                      f"recommendation module): {crops}")

    facts_block = "\n".join(facts) if facts else "(no prediction has been computed yet)"

    return (
        "You are the farmer assistant for AgriSmart AI, an agricultural hackathon project. "
        "You ONLY answer questions related to farming — crop diseases, treatment, crop choice, "
        "irrigation, soil, weather's effect on farming, and similar agricultural topics. "
        "Answer simply, practically, and briefly (2-4 sentences).\n\n"
        "These are the ONLY facts you actually know about this farm's situation:\n"
        f"{facts_block}\n\n"
        "Rules:\n"
        "- If the farmer asks something unrelated to farming/agriculture (general trivia, "
        "coding help, entertainment, unrelated small talk, etc.), politely decline in one "
        "sentence and say you can only help with farming questions — do not answer the "
        "off-topic question itself, even partially.\n"
        "- Do not invent facts that aren't listed above — e.g. do not make up a weather "
        "forecast (use the real weather figures above only if provided), soil test "
        "numbers, or market prices; this project has not computed those unless listed above.\n"
        "- If asked about something not listed in the facts above (e.g. weather, when no "
        "weather figures were provided; or a specific chemical dosage), say plainly that "
        "you don't have that data connected, rather than guessing.\n"
        "- If the farmer writes in Hindi or Gujarati, reply in that language.\n"
        "- General safe agronomic knowledge (e.g. what a disease typically looks like, "
        "general treatment categories) is fine to share — just don't state specifics as "
        "fact when they weren't actually measured for this farm."
    )


class GenAIFarmerAssistant:
    """Thin wrapper around the Anthropic API. Raises immediately (with a
    clear message) if the SDK or API key isn't available, rather than
    failing confusingly on the first real call."""

    def __init__(self, model: str = DEFAULT_MODEL, api_key: Optional[str] = None):
        try:
            import anthropic
        except ImportError as exc:
            raise RuntimeError(
                "The 'anthropic' package isn't installed. Run: pip install anthropic"
            ) from exc

        key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not key:
            raise RuntimeError(
                "No Anthropic API key found. Set the ANTHROPIC_API_KEY environment "
                "variable (get a key at https://console.anthropic.com), or pass "
                "api_key= directly."
            )

        self.model = model
        self.client = anthropic.Anthropic(api_key=key)

    def ask(
        self,
        question: str,
        predicted_class: Optional[str] = None,
        confidence: Optional[float] = None,
        crop_recommendations: Optional[List[Dict]] = None,
        weather: Optional[Dict] = None,
        history: Optional[List[Dict]] = None,
    ) -> str:
        system = _build_system_prompt(predicted_class, confidence, crop_recommendations, weather)
        messages = (history or []) + [{"role": "user", "content": question}]

        response = self.client.messages.create(
            model=self.model,
            max_tokens=400,
            system=system,
            messages=messages,
        )
        return "".join(block.text for block in response.content if block.type == "text")

    def chat_loop(
        self,
        predicted_class: Optional[str] = None,
        confidence: Optional[float] = None,
        crop_recommendations: Optional[List[Dict]] = None,
        weather: Optional[Dict] = None,
    ) -> None:
        print("Farmer Assistant (GenAI) — type 'exit' to quit.")
        history: List[Dict] = []
        while True:
            question = input("\nYou: ").strip()
            if question.lower() in ("exit", "quit"):
                break
            answer = self.ask(question, predicted_class, confidence, crop_recommendations, weather, history)
            print(f"Assistant: {answer}")
            history.append({"role": "user", "content": question})
            history.append({"role": "assistant", "content": answer})


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--predicted_class", default=None)
    parser.add_argument("--confidence", type=float, required=False, default=None)
    parser.add_argument("--recommended_crop", action="append", default=None,
                         help="Repeatable — e.g. --recommended_crop Wheat --recommended_crop Soybean")
    parser.add_argument("--lat", type=float, default=None, help="If set (with --lon), fetches real weather (Bonus Module C) to ground weather-related answers.")
    parser.add_argument("--lon", type=float, default=None)
    parser.add_argument("--question", default=None, help="Single question. Omit to use --chat instead.")
    parser.add_argument("--chat", action="store_true", help="Interactive back-and-forth instead of one question.")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--api_key", default=None, help="Overrides the ANTHROPIC_API_KEY environment variable.")
    args = parser.parse_args()

    assistant = GenAIFarmerAssistant(model=args.model, api_key=args.api_key)
    crop_recs = [{"crop": c} for c in args.recommended_crop] if args.recommended_crop else None

    weather = None
    if args.lat is not None and args.lon is not None:
        from .weather import WeatherProvider
        weather = WeatherProvider().get_weather(args.lat, args.lon)

    if args.chat:
        assistant.chat_loop(args.predicted_class, args.confidence, crop_recs, weather)
    elif args.question:
        print(assistant.ask(args.question, args.predicted_class, args.confidence, crop_recs, weather))
    else:
        parser.error("Pass --question \"...\" for a single answer, or --chat for interactive mode.")


if __name__ == "__main__":
    main()
