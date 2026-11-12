"""Personalised document checklists (per scheme and merged across schemes)."""
from typing import List, Optional
from .data_loader import load_schemes, load_guides
from .eligibility import check_conditions
from .models import UserProfile


def scheme_documents(scheme: dict, p: UserProfile, lang: str = "en") -> List[dict]:
    guides = load_guides()
    docs = []
    for d in scheme["documents"]:
        key, cond = (d, None) if isinstance(d, str) else (d["key"], d.get("required_if"))
        conditional = False
        if cond:
            res = check_conditions(cond, p)
            if any(c.status == "fail" for c in res):
                continue  # clearly not needed for this person
            conditional = any(c.status == "unknown" for c in res)
        g = guides.get(key, {"name": key, "how_to_get": ""})
        name = g.get("name_hi", g["name"]) if lang == "hi" else g["name"]
        docs.append({"key": key, "name": name, "how_to_get": g.get("how_to_get", ""),
                     "conditional": conditional})
    return docs


def combined_checklist(scheme_ids: List[str], p: UserProfile, lang: str = "en") -> List[dict]:
    schemes = load_schemes()
    merged = {}
    for sid in scheme_ids:
        s = schemes.get(sid)
        if not s:
            continue
        for d in scheme_documents(s, p, lang):
            row = merged.setdefault(d["key"], {**d, "needed_for": []})
            row["needed_for"].append(s["name_hi"] if lang == "hi" else s["name"])
            row["conditional"] = row["conditional"] and d["conditional"]
    # most commonly needed documents first = collect these first
    return sorted(merged.values(), key=lambda r: (-len(r["needed_for"]), r["name"]))
