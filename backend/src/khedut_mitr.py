"""Provider-independent Khedut Mitr assistant with automatic free-tier fallbacks.

Providers are attempted in configured order. A provider is skipped when its API
key is absent, and transient/provider errors (429/5xx/timeouts) fall through to
the next configured provider.
"""
from __future__ import annotations

import ast
import os
from typing import Any, Dict, List, Optional, Tuple

import requests

from src.gemini_assistant import GeminiKhedutMitr, SYSTEM_INSTRUCTION, _clean_context


class ProviderError(RuntimeError):
    def __init__(self, provider: str, message: str, status: Optional[int] = None):
        super().__init__(message)
        self.provider = provider
        self.status = status


def _build_prompt(question: str, context: Optional[Dict[str, Any]], history: Optional[List[Dict[str, str]]], language: str) -> Tuple[str, str]:
    farm_context = _clean_context(context)
    farm_context["response_language"] = language
    system = SYSTEM_INSTRUCTION.format(farm_context=farm_context)

    safe_history: List[Dict[str, str]] = []
    for item in (history or [])[-8:]:
        role = item.get("role")
        content = item.get("content")
        if role in ("user", "assistant") and isinstance(content, str):
            safe_history.append({"role": role, "content": content[:2000]})

    conversation = []
    for item in safe_history:
        conversation.append(f"{item['role'].upper()}: {item['content']}")
    conversation.append(f"FARMER: {question.strip()[:4000]}")
    return system, "\n\n".join(conversation)


def _extract_text(payload: Dict[str, Any]) -> str:
    choices = payload.get("choices") or []
    if choices:
        message = choices[0].get("message") or {}
        content = message.get("content")
        if isinstance(content, str):
            return content.strip()
        if isinstance(content, list):
            parts = []
            for part in content:
                if isinstance(part, dict) and isinstance(part.get("text"), str):
                    parts.append(part["text"])
            return "\n".join(parts).strip()
    text = payload.get("output_text")
    return text.strip() if isinstance(text, str) else ""


class KhedutMitrRouter:
    """Try multiple configured AI providers without changing /api/chat."""

    def __init__(self):
        self.last_provider = None
        self.last_model = None
        self.providers = []

        # OpenRouter's free router is intentionally first: it routes to currently
        # available zero-cost models and requires only an OpenRouter key.
        if os.getenv("OPENROUTER_API_KEY"):
            self.providers.append(self._ask_openrouter)
        if os.getenv("MISTRAL_API_KEY"):
            self.providers.append(self._ask_mistral)
        if os.getenv("GROQ_API_KEY"):
            self.providers.append(self._ask_groq)
        if os.getenv("GEMINI_API_KEY"):
            self.providers.append(self._ask_gemini)

        if not self.providers:
            raise RuntimeError(
                "No Khedut Mitr provider is configured. Set at least one of "
                "OPENROUTER_API_KEY, MISTRAL_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY."
            )

    @staticmethod
    def _post_openai_compatible(url: str, key: str, body: Dict[str, Any], provider: str) -> Tuple[str, str]:
        try:
            response = requests.post(
                url,
                headers={
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                },
                json=body,
                timeout=(8, 35),
            )
        except requests.RequestException as exc:
            raise ProviderError(provider, f"network error: {exc}") from exc

        if response.status_code >= 400:
            detail = ""
            try:
                data = response.json()
                detail = str(data.get("error", data))[:500]
            except Exception:
                detail = response.text[:500]
            raise ProviderError(provider, f"HTTP {response.status_code}: {detail}", response.status_code)

        try:
            data = response.json()
        except ValueError as exc:
            raise ProviderError(provider, "invalid JSON response", response.status_code) from exc

        text = _extract_text(data)
        if not text:
            raise ProviderError(provider, "empty model response", response.status_code)
        return text, str(data.get("model") or body.get("model") or "unknown")

    def _ask_openrouter(self, system: str, prompt: str) -> Tuple[str, str]:
        model = os.getenv("OPENROUTER_MODEL", "openrouter/free")
        return self._post_openai_compatible(
            "https://openrouter.ai/api/v1/chat/completions",
            os.environ["OPENROUTER_API_KEY"],
            {
                "model": model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
                "max_tokens": 800,
            },
            "OpenRouter",
        )

    def _ask_mistral(self, system: str, prompt: str) -> Tuple[str, str]:
        model = os.getenv("MISTRAL_MODEL", "mistral-small-latest")
        return self._post_openai_compatible(
            "https://api.mistral.ai/v1/chat/completions",
            os.environ["MISTRAL_API_KEY"],
            {
                "model": model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
                "max_tokens": 800,
            },
            "Mistral",
        )

    def _ask_groq(self, system: str, prompt: str) -> Tuple[str, str]:
        model = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
        return self._post_openai_compatible(
            "https://api.groq.com/openai/v1/chat/completions",
            os.environ["GROQ_API_KEY"],
            {
                "model": model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
                "max_tokens": 800,
            },
            "Groq",
        )

    def _ask_gemini(self, system: str, prompt: str) -> Tuple[str, str]:
        # The public helper below supplies the original farm context/history to
        # Gemini. This method is only a marker for the provider chain.
        assistant = GeminiKhedutMitr(model=os.getenv("GEMINI_MODEL", "gemini-3.6-flash"))
        return assistant.ask(question=prompt, context={}), assistant.model

    def ask(
        self,
        question: str,
        context: Optional[Dict[str, Any]] = None,
        history: Optional[List[Dict[str, str]]] = None,
        language: str = "en",
    ) -> str:
        if not question or not question.strip():
            raise ValueError("question must not be empty")

        system, prompt = _build_prompt(question, context, history, language)
        failures = []
        for provider in self.providers:
            name = provider.__name__.replace("_ask_", "")
            try:
                if name == "gemini":
                    # Reuse the exact farm context/history path of the existing
                    # Gemini implementation instead of flattening it into text.
                    assistant = GeminiKhedutMitr(model=os.getenv("GEMINI_MODEL", "gemini-3.6-flash"))
                    text = assistant.ask(question=question, context=context, history=history, language=language)
                    model = assistant.model
                else:
                    text, model = provider(system, prompt)
                self.last_provider = name.title() if name != "gemini" else "Google Gemini"
                self.last_model = model
                return text
            except ProviderError as exc:
                failures.append(f"{exc.provider}: {exc}")
                continue
            except Exception as exc:
                # Gemini SDK and unexpected provider errors are deliberately
                # swallowed here so the next free provider can rescue the chat.
                failures.append(f"{name}: {type(exc).__name__}: {str(exc)[:300]}")
                continue

        raise RuntimeError("All configured Khedut Mitr providers failed: " + " | ".join(failures))
