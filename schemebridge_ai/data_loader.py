import json
from functools import lru_cache
from . import config


@lru_cache(maxsize=1)
def load_schemes() -> dict:
    with open(config.SCHEMES_FILE, encoding="utf-8") as f:
        return {s["id"]: s for s in json.load(f)}


@lru_cache(maxsize=1)
def load_guides() -> dict:
    with open(config.GUIDES_FILE, encoding="utf-8") as f:
        return json.load(f)
