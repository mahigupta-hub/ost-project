# SchemeBridge

**Bridging citizens to the government schemes they are entitled to.**

Millions of eligible people miss out on welfare schemes because the information is scattered, written in
complicated language, and available mostly in English. SchemeBridge lets a citizen enter a simple profile and
instantly see **which schemes they qualify for, why, what documents to collect, and where to apply**, in their own language.

---

## Features

- **Smart eligibility matching** – enter age, income, occupation, category, location, etc. and get matching schemes.
- **Plain-language explanations** – complicated eligibility rules turned into short, simple sentences.
- **Personalised document checklist** – only the documents you need, with tips on how to get each one.
- **Multilingual** – English, Hindi, Hinglish out of the box; more languages via Gemini.
- **Ask in your own words** – free-text questions answered with RAG, always with source links.
- **Official links and sources** – every result links to the official portal; nothing is answered from memory.
- **Trustworthy by design** – eligibility verdicts come from rules, not the LLM; low-confidence questions return "not found" instead of a guess.

## How it works

```
 Citizen                 React Frontend              Python Backend               AI / RAG Engine
 ───────                 ──────────────              ──────────────               ───────────────
 fills profile  ───►  profile form, results   ───►  user profiles, eligibility  ───►  retrieves scheme info,
 reads results  ◄───  dashboard, scheme pages ◄───  matching, APIs, database    ◄───  explains rules, builds
                                                                                       document checklists
```


## Repository structure

```
ost-project/
├── frontend/      # React website (landing page, profile form, results dashboard, scheme pages)
├── backend/       # APIs, user profile system, eligibility matching, database
├── ai-engine/     # scheme dataset, RAG retrieval, explanations, checklists, /ai/* API
│   ├── schemebridge_ai/   # engine source code
│   ├── data/              # schemes.json, document_guides.json
│   ├── docs/              # integration contract, demo script
│   ├── scripts/           # demo, dataset validator, index builder
│   └── tests/
└── README.md
```

## Getting started

### 1. AI engine (`ai-engine/`)

```bash
cd ai-engine
python -m venv venv
venv\Scripts\activate          # macOS/Linux: source venv/bin/activate
pip install -r requirements-dev.txt

python scripts/demo.py                                 # end-to-end demo
pytest -q                                              # run the tests
uvicorn schemebridge_ai.api:app --reload --port 8001   # API docs: http://localhost:8001/docs
```

It runs fully offline by default. For fluent, multilingual answers, add a **free Gemini API key**
(<https://aistudio.google.com/apikey>) to `ai-engine/.env`:

```
GEMINI_API_KEY=your_key_here
```

> Never commit `.env`. It is already listed in `.gitignore`.

More details: [`ai-engine/README.md`](ai-engine/README.md) and [`ai-engine/docs/INTEGRATION_CONTRACT.md`](ai-engine/docs/INTEGRATION_CONTRACT.md).

### 2. Backend (`backend/`)

```bash
cd backend
# TODO (Mahi): install dependencies and start the server
```

### 3. Frontend (`frontend/`)

```bash
cd frontend
# TODO (Nandini): install dependencies and start the dev server
```

## API overview

The AI engine exposes these endpoints (base URL `http://localhost:8001/ai`):

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/analyze` | eligibility explanations, document checklist and official links for a profile |
| POST | `/explain` | plain-language explanation for one scheme |
| POST | `/checklist` | per-scheme and combined document checklist |
| POST | `/ask` | free-text question in any language (RAG) |
| GET | `/schemes` | list all schemes |
| GET | `/schemes/{id}` | full details of one scheme |
| GET | `/health` | engine status |

Example profile:

```json
{
  "age": 34,
  "gender": "female",
  "residence": "rural",
  "annual_income": 120000,
  "category": "SC",
  "occupation": "farmer",
  "owns_agricultural_land": true,
  "is_bpl": true
}
```

## Schemes covered

PM-KISAN, Ayushman Bharat PM-JAY, PMAY-Gramin, PMAY-Urban, Sukanya Samriddhi Yojana, PM Ujjwala Yojana,
Atal Pension Yojana, PMJJBY, PMSBY, PM MUDRA Yojana, Stand-Up India, PM SVANidhi, PM Vishwakarma,
MGNREGA, IGNOAPS, PMMVY, Post Matric Scholarship (SC), PM Fasal Bima Yojana and Kisan Credit Card.

The dataset is in `ai-engine/data/schemes.json`. Each record has a `verification_status` and
`last_verified` date. Always confirm amounts and eligibility on the official portal before applying.

## Tech stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Python, FastAPI/Flask, SQL
- **AI:** Retrieval-Augmented Generation (RAG), TF-IDF / Gemini embeddings, Google Gemini API, scikit-learn, Pydantic


## Disclaimer

SchemeBridge provides guidance only and is not an official government service. Scheme rules, benefits and
deadlines change, so always confirm on the official portal linked in each result before applying.
