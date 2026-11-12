# Integration contract – AI engine ⇄ backend ⇄ frontend

Base URL (dev): `http://localhost:8001/ai`  ·  Interactive docs: `/docs`  ·  Freeze this contract early.

## Option A – HTTP (separate service)
| Method | Path | Purpose |
|---|---|---|
| GET | `/ai/health` | engine status (schemes, chunks, retrieval backend, LLM on/off) |
| GET | `/ai/schemes?category=` | list of schemes (id, name, name_hi, category, summary, official_url) |
| GET | `/ai/schemes/{id}` | full scheme record |
| POST | `/ai/analyze` | **main call** – eligibility explanations + docs + links for a profile |
| POST | `/ai/explain` | explanation for one scheme |
| POST | `/ai/checklist` | per-scheme and merged document checklist |
| POST | `/ai/ask` | free-text question (RAG) in any language |

## Option B – Python import (inside Mahi's FastAPI app)
```python
from schemebridge_ai import SchemeBridgeAI
ai = SchemeBridgeAI()                         # create once at startup
ai.analyze(profile_dict, scheme_ids=ids, language="hi")
# or:  from schemebridge_ai.api import router ; app.include_router(router)
```

## Profile object (all fields optional – unknown ones are reported as "need_info")
```json
{
  "age": 34,
  "gender": "female",
  "residence": "rural",
  "annual_income": 120000,
  "category": "SC",
  "occupation": "farmer",
  "owns_agricultural_land": true,
  "is_bpl": true,
  "has_bank_account": true,
  "is_income_tax_payer": false
}
```
Allowed values: `gender` male|female|other · `residence` rural|urban · `category` General|OBC|SC|ST|EWS ·
`occupation` farmer|student|street_vendor|artisan|self_employed|entrepreneur|unemployed|salaried|homemaker|other ·
`education_level` school|post_matric|graduate|postgraduate · `annual_income` integer INR.
Other booleans: `owns_agricultural_land, is_student, is_bpl, has_pucca_house, has_bank_account, has_lpg_connection,
has_daughter_under_10, is_pregnant_or_lactating, is_income_tax_payer, is_govt_employee, has_disability`.

## `POST /ai/analyze`
Request: `{"profile": {...}, "scheme_ids": ["pm-kisan"], "language": "en", "include_ineligible": false}`
- `scheme_ids` = the ids returned by **Mahi's eligibility matcher** (all are explained). Omit it to let the AI engine run its own matching.
- `language`: `en`, `hi`, `hinglish`, `bn`, `ta`, `te`, `mr`, … (en/hi work offline; others need `GEMINI_API_KEY` – otherwise English is returned).

Response (real output, trimmed):
```json
{
  "language": "en",
  "results": [
    {
      "scheme_id": "pm-kisan",
      "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      "status": "eligible",
      "score": 1.0,
      "explanation": {
        "status": "eligible",
        "status_label": "Eligible",
        "pathway": "Landholding farmer family",
        "headline": "You appear eligible for PM-KISAN (Pradhan Mantri Kisan Samman Nidhi). Income support of Rs 6,000 per year to landholding farmer families, paid directly to the bank account.",
        "plain_language": null,
        "met": [
          "Owns cultivable agricultural land"
        ],
        "not_met": [],
        "need_info": []
      },
      "documents": [
        {
          "key": "aadhaar",
          "name": "Aadhaar card",
          "how_to_get": "Enrol or update at an Aadhaar centre or at uidai.gov.in; carry proof of identity and address.",
          "conditional": false
        },
        {
          "key": "land_records",
          "name": "Land ownership records (Khasra/Khatauni/Jamabandi)",
          "how_to_get": "Download from your state land-records portal or get a copy from the Patwari / Tehsil office.",
          "conditional": false
        },
        {
          "key": "bank_passbook",
          "name": "Bank passbook / account details (Aadhaar-linked)",
          "how_to_get": "Open a savings account at any bank or post office (a Jan Dhan account needs only Aadhaar) and link it with Aadhaar.",
          "conditional": false
        },
        {
          "key": "mobile_number",
          "name": "Mobile number (preferably linked with Aadhaar)",
          "how_to_get": "Use your own active number; update it at an Aadhaar centre if it is not linked.",
          "conditional": false
        }
      ],
      "official_url": "https://pmkisan.gov.in/",
      "apply_url": "https://pmkisan.gov.in/",
      "sources": [
        {
          "title": "PM-KISAN official portal",
          "url": "https://pmkisan.gov.in/"
        }
      ]
    }
  ],
  "combined_checklist": [
    {
      "key": "aadhaar",
      "name": "Aadhaar card",
      "how_to_get": "Enrol or update at an Aadhaar centre or at uidai.gov.in; carry proof of identity and address.",
      "conditional": false,
      "needed_for": [
        "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)"
      ]
    },
    {
      "key": "bank_passbook",
      "name": "Bank passbook / account details (Aadhaar-linked)",
      "how_to_get": "Open a savings account at any bank or post office (a Jan Dhan account needs only Aadhaar) and link it with Aadhaar.",
      "conditional": false,
      "needed_for": [
        "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)"
      ]
    },
    {
      "key": "land_records",
      "name": "Land ownership records (Khasra/Khatauni/Jamabandi)",
      "how_to_get": "Download from your state land-records portal or get a copy from the Patwari / Tehsil office.",
      "conditional": false,
      "needed_for": [
        "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)"
      ]
    },
    {
      "key": "mobile_number",
      "name": "Mobile number (preferably linked with Aadhaar)",
      "how_to_get": "Use your own active number; update it at an Aadhaar centre if it is not linked.",
      "conditional": false,
      "needed_for": [
        "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)"
      ]
    }
  ],
  "disclaimer": "This is guidance only. Always confirm eligibility and amounts on the official portal before applying."
}
```
`status` ∈ `eligible | likely | not_eligible`. `likely` means no rule failed but some information is missing (see `explanation.need_info`).
`explanation.plain_language` is filled only when the LLM is enabled; `explanation.headline` is always present.

## `POST /ai/ask`
Request: `{"query": "मुझे बेटी की पढ़ाई के लिए कौन सी योजना मिलेगी?", "profile": {...optional}, "language": null}`
Response: `{query, language, answer, mode: "llm"|"extractive"|"no_match", sources:[{scheme_id, scheme, title, url}], related_schemes:[{scheme_id, name, official_url, eligibility?}], disclaimer}`

## Frontend notes (Nandini)
- Show `status` as a badge, `explanation.headline` as the main text, `met/not_met` as ✓/✗ lists, `need_info` as "tell us more" prompts.
- Always render `official_url`/`apply_url` as the "Apply" button and `sources` + `disclaimer` at the bottom of each card.
- Send the UI language selection as `language`.

## Backend notes (Mahi)
- Keep `scheme_id` values from `data/schemes.json` as the primary keys in your database.
- Errors: unknown `scheme_id` → HTTP 404; invalid profile values → HTTP 422 (pydantic).
