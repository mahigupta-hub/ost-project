# Demo / viva cheat-sheet (Millyshree)

**One-line pitch:** "My module turns raw scheme rules into trustworthy, plain-language, multilingual guidance with
sources – using RAG so the AI never answers from memory."

## 5-minute flow
1. `python scripts/validate_dataset.py` – show the structured, source-linked dataset (19 schemes, official URLs).
2. `python scripts/demo.py` – show eligibility + explanation + merged checklist, in English then Hindi.
3. Open `http://localhost:8001/docs` → `POST /ai/ask` with a Hindi question and with Hinglish.
4. Show a "not eligible" case (income-tax payer vs PM-KISAN) → explanation names the exact reason.
5. Show `mode: "no_match"` for a nonsense query → proves it refuses to hallucinate.

## Questions you should be ready for
- **Why RAG, not just an LLM?** Schemes change; RAG grounds answers in verified data and lets us cite sources.
- **How do you stop hallucination?** Retrieval-only context, strict system prompt, rule-based verdicts, no-match fallback, source links.
- **How is retrieval done?** Scheme data is split into section chunks (overview/benefits/eligibility/documents/how-to-apply);
  TF-IDF word+char n-grams offline, or Gemini multilingual embeddings (cached).
- **How do you handle Hindi/other languages?** Script-based language detection; Hindi/Hinglish keyword normalisation
  for retrieval; Hindi templates offline; Gemini translates/explains in any other language.
- **How does it split with the backend?** Mahi owns matching + APIs; I expose `/ai/*` (or import `SchemeBridgeAI`)
  for retrieval, explanations and checklists. Contract in `INTEGRATION_CONTRACT.md`.
- **How do you keep data reliable?** `verification_status` + `last_verified` per scheme, validator script, official-domain check.
- **Limitations?** Central schemes only so far; rules simplified from official text; offline Hindi limited to templates.
