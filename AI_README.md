# SchemeBridge – AI / RAG Engine (Millyshree's module)

Understands government-scheme information and turns it into **reliable, easy-to-understand answers** in the
citizen's language: scheme retrieval (RAG), eligibility explanations, personalised document checklists, and
official application links with source references.

Works **fully offline** out of the box (TF-IDF retrieval + template explanations). Add a **free Gemini API key**
(<https://aistudio.google.com/apikey>) and the same code switches to Gemini for fluent, plain-language,
multilingual answers – grounded only in retrieved scheme data – and can use Gemini embeddings for semantic search.

## Quick start
```bash
python -m venv venv && source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
python scripts/validate_dataset.py                     # sanity-check the dataset
python scripts/demo.py                                 # end-to-end demo (English + Hindi)
pytest -q                                              # tests (offline; Gemini is mocked)
uvicorn schemebridge_ai.api:app --reload --port 8001   # API docs at http://localhost:8001/docs
```
### Using the Gemini free API
```bash
cp .env.example .env          # then paste your key:  GEMINI_API_KEY=...
# optional, better Hindi/regional retrieval via Gemini embeddings (cached on disk after the first run):
#   SB_VECTOR_BACKEND=gemini
python scripts/demo.py        # engine status should show llm_available: True
```
- Default model `gemini-2.5-flash` (change with `SB_LLM_MODEL`, e.g. `gemini-2.5-flash-lite`).
- No SDK needed – the engine calls the REST API with the standard library.
- Free tier is rate-limited: the client retries on 429, and if Gemini is unavailable the engine silently falls back to
  offline templates / TF-IDF, so the demo never breaks.
- **Privacy:** free-tier prompts may be used by Google to improve its products. The engine never sends the citizen's
  name; only anonymous profile fields and retrieved scheme text go to Gemini. Don't paste real personal data.
- With `SB_VECTOR_BACKEND=gemini` the "no match" cut-off is a similarity floor (default 0.55). Check it with
  `python scripts/build_index.py` and tune via `SB_MIN_SCORE` if it rejects good queries or accepts nonsense.

## What's inside
```
schemebridge_ai/
  engine.py        SchemeBridgeAI – single entry point (ask / explain / checklist / analyze / search)
  retriever.py     builds RAG chunks from schemes.json (+ optional official docs) and retrieves them
  vector_store.py  TF-IDF (offline default), Gemini embeddings, or ChromaDB + sentence-transformers
  eligibility.py   per-condition pass/fail/unknown evaluation (powers the explanations)
  explainer.py     plain-language eligibility explanations (LLM or template)
  checklist.py     personalised + merged document checklists with "how to get it" tips
  language.py      language detection (Hindi, Bengali, Tamil, … + Hinglish) and Hindi/Hinglish query normalisation
  i18n.py          English/Hindi labels and condition text (offline); other languages via the LLM
  gemini.py        tiny Gemini REST client (retries on rate limits)
  llm.py           Gemini text generation with safe offline fallback
  api.py           FastAPI router/app (/ai/ask, /ai/explain, /ai/checklist, /ai/analyze, /ai/schemes)
data/
  schemes.json           19 central schemes: eligibility rules, benefits, documents, links, sources
  document_guides.json   21 documents with "how to obtain" guidance (English + Hindi)
  docs/                  drop official guideline text here to enrich RAG (see docs/README.txt)
docs/
  INTEGRATION_CONTRACT.md   fixed input/output format to share with Mahi and Nandini
  DEMO_SCRIPT.md            what to explain and show in the evaluation
```

## ⚠️ Before you demo: verify the dataset
`data/schemes.json` was drafted from general knowledge of each scheme and every record is marked
`"verification_status": "needs_verification"`. Scheme amounts, income limits and rules change.
For each scheme: open its `official_url`, correct any field, then set
`"verification_status": "verified"` and `"last_verified": "YYYY-MM-DD"`.
`python scripts/validate_dataset.py` reports how many are still unverified. Being able to say
"every record is verified against the official portal on <date>" is a strong point in your evaluation.

## Make it better (suggested next steps)
1. **Add official documents** – paste cleaned guideline/FAQ text into `data/docs/<scheme-id>__guidelines.txt`
   (first line `SOURCE: <official url>`); they are chunked, indexed and cited automatically.
2. **Semantic multilingual retrieval** – `SB_VECTOR_BACKEND=gemini python scripts/build_index.py` (free key needed),
   or the local `chroma` backend (`pip install chromadb sentence-transformers`). Neither could be run against the live
   services in the offline build environment – the TF-IDF default is the fully tested path, Gemini calls are covered by
   mocked tests, and every backend falls back to TF-IDF automatically if it fails.
3. **State schemes** – add records with `"level": "State"`; the schema needs no change.
4. **Add more languages offline** – extend `i18n.py` (labels, `VALUE_*`, `BOOL_TEXT`, `COND_TEXT`) and `language.py` glossary.

## How the guardrails work (good to explain in your demo)
- The LLM only sees retrieved chunks / verified scheme data and is told never to invent amounts, dates or links.
- Every answer carries `sources` (official URLs) and a disclaimer to confirm on the official portal.
- If retrieval confidence is low the engine says it could not find the answer instead of guessing (`mode: "no_match"`).
- Eligibility verdicts come from **deterministic rules**, not the LLM; the LLM only rephrases the verdict simply.
