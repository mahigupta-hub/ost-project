"""Interactive-style demo for the project evaluation.  Usage: python scripts/demo.py"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from schemebridge_ai import SchemeBridgeAI

ai = SchemeBridgeAI()
print("ENGINE:", ai.status, "\n")

profile = {"name": "Sunita", "age": 34, "gender": "female", "state": "Haryana", "residence": "rural",
           "annual_income": 120000, "category": "SC", "occupation": "farmer", "owns_agricultural_land": True,
           "is_bpl": True, "has_bank_account": True, "has_lpg_connection": False, "has_pucca_house": False,
           "has_daughter_under_10": True, "is_income_tax_payer": False, "is_govt_employee": False}

for lang in ("en", "hi"):
    out = ai.analyze(profile, language=lang)
    print(f"===== Recommendations ({lang}) =====")
    for r in out["results"][:4]:
        print(f"- [{r['status']}] {r['name']}\n    {r['explanation']['headline']}\n    apply: {r['apply_url']}")
    print("\nCombined document checklist:")
    for d in out["combined_checklist"][:6]:
        print(f"  [ ] {d['name']}  (needed for {len(d['needed_for'])} scheme(s))")
    print()

for q in ["Which scheme gives me money for my farm?", "मुझे बेटी की पढ़ाई के लिए कौन सी योजना मिलेगी?",
          "mujhe ghar banane ke liye paise chahiye gaon mein"]:
    r = ai.ask(q, profile)
    print(f"Q: {q}\nA ({r['mode']}): {r['answer'][:300]}...\nSources: {[s['url'] for s in r['sources'][:2]]}\n")
