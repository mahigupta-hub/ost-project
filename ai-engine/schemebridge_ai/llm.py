"""Gemini (free tier) wrapper. If there is no API key or a call fails, available/generate fall back
gracefully and the engine uses its offline templates."""
import logging
from . import config, gemini

log = logging.getLogger("schemebridge.llm")


class LLM:
    def __init__(self, enabled: bool = True):
        self._on = bool(enabled and gemini.api_key())

    @property
    def available(self) -> bool:
        return self._on

    def generate(self, system: str, user: str, max_tokens: int = 700) -> str | None:
        if not self._on:
            return None
        gen_cfg = {"maxOutputTokens": max_tokens, "temperature": 0.2}
        if "2.5-flash" in config.LLM_MODEL:  # turn off hidden "thinking" so it doesn't eat the output budget
            gen_cfg["thinkingConfig"] = {"thinkingBudget": 0}
        payload = {"system_instruction": {"parts": [{"text": system}]},
                   "contents": [{"role": "user", "parts": [{"text": user}]}],
                   "generationConfig": gen_cfg}
        try:
            data = gemini.post(f"models/{config.LLM_MODEL}:generateContent", payload)
            parts = data["candidates"][0]["content"]["parts"]
            return "".join(p.get("text", "") for p in parts).strip() or None
        except Exception as e:  # rate limit, no network, blocked content, ...
            log.warning("Gemini call failed, using offline fallback: %s", e)
            return None
