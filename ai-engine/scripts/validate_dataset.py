"""Checks schemes.json for structural errors and lists what still needs manual verification.
Run:  python scripts/validate_dataset.py"""
import sys
from pathlib import Path
from urllib.parse import urlparse
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from schemebridge_ai.data_loader import load_schemes, load_guides
from schemebridge_ai.eligibility import check_value  # noqa: F401
from schemebridge_ai.i18n import BOOL_TEXT, COND_TEXT

REQUIRED = ["id", "name", "name_hi", "category", "summary", "summary_hi", "benefits", "eligibility_text",
            "eligibility_pathways", "documents", "how_to_apply", "official_url", "sources"]
KNOWN_KEYS = set(BOOL_TEXT) | set(COND_TEXT)
OFFICIAL_SUFFIXES = (".gov.in", ".nic.in", ".org.in")
OFFICIAL_EXCEPT = {"www.mudra.org.in", "www.standupmitra.in", "www.udyamimitra.in"}

schemes, guides = load_schemes(), load_guides()
errors, warnings = [], []
for sid, s in schemes.items():
    for f in REQUIRED:
        if not s.get(f):
            errors.append(f"{sid}: missing '{f}'")
    for pw in s["eligibility_pathways"]:
        for k in pw["conditions"]:
            if k not in KNOWN_KEYS:
                errors.append(f"{sid}: unknown condition key '{k}'")
    for ex in s.get("exclusions", []):
        for k in ex["conditions"]:
            if k not in KNOWN_KEYS:
                errors.append(f"{sid}: unknown exclusion key '{k}'")
    for d in s["documents"]:
        key = d if isinstance(d, str) else d["key"]
        if key not in guides:
            errors.append(f"{sid}: document '{key}' has no entry in document_guides.json")
    for url in [s["official_url"], s["apply_url"]] + [x["url"] for x in s["sources"]]:
        host = urlparse(url).netloc
        if not (host.endswith(OFFICIAL_SUFFIXES) or host in OFFICIAL_EXCEPT):
            warnings.append(f"{sid}: '{host}' is not a recognised government domain – double-check")
    if s["verification_status"] != "verified" or not s["last_verified"]:
        warnings.append(f"{sid}: NOT yet manually verified (set verification_status='verified' and last_verified=YYYY-MM-DD)")

print(f"{len(schemes)} schemes, {len(guides)} document guides")
for e in errors:
    print("ERROR  ", e)
unverified = [w for w in warnings if "NOT yet" in w]
for w in warnings:
    if "NOT yet" not in w:
        print("WARNING", w)
print(f"{len(unverified)}/{len(schemes)} schemes still need manual verification against the official portal")
sys.exit(1 if errors else 0)
