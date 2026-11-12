"""Minimal Gemini REST client (no SDK needed – only the standard library).
Get a free key at https://aistudio.google.com/apikey and set GEMINI_API_KEY."""
import json
import os
import time
import urllib.error
import urllib.request

BASE = "https://generativelanguage.googleapis.com/v1beta"


def api_key() -> str | None:
    return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")


def post(path: str, payload: dict, retries: int = 3, timeout: int = 30) -> dict:
    """POST to the Gemini API; retries on rate-limit (429) / transient (500, 503) errors with backoff."""
    req = urllib.request.Request(
        f"{BASE}/{path}", data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key() or ""})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 503) and attempt < retries - 1:
                time.sleep(2 ** (attempt + 1))
                continue
            raise
