import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI_ENGINE_DIR = os.path.join(BASE_DIR, "ai-engine")
sys.path.insert(0, AI_ENGINE_DIR)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from schemebridge_ai.api import get_engine, router as ai_router
from schemebridge_ai.models import UserProfile

app = FastAPI(title="SchemeBridge Backend Adapter")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

# --- FRONTEND CONTRACT MODELS ---
class MatchRequest(BaseModel):
    age: int
    gender: str
    state: str
    annualIncome: float  
    category: str
    occupation: str
    education: str       
    language: str = "en"

class SchemeResponse(BaseModel):
    id: str
    name: str
    benefit: str
    why_eligible: str
    documents: List[str]
    apply_link: str
    source: str

# --- FRONTEND ENDPOINTS ---
@app.post("/api/match", response_model=List[SchemeResponse])
def match_schemes(profile: MatchRequest):
    engine = get_engine()
    
    # 1. Convert frontend request to a dictionary
    profile_data = profile.model_dump()
    
    # 2. Rename annual income
    profile_data["annual_income"] = profile_data.pop("annualIncome")
    
    # 3. Format gender to lowercase ("Female" -> "female")
    profile_data["gender"] = profile_data["gender"].lower()
    
    # 4. Map the frontend education strings to the strict AI engine literals
    edu_mapping = {
        "No Formal Education": "school",
        "Below 10th": "school",
        "10th Pass": "school",
        "12th Pass": "school",
        "Diploma / ITI": "post_matric",
        "Graduate": "graduate",
        "Post Graduate": "postgraduate",
        "Doctorate": "postgraduate"
    }
    frontend_edu = profile_data.pop("education")
    profile_data["education_level"] = edu_mapping.get(frontend_edu, "school")
    
    # 5. Pass the cleanly formatted data to the AI engine
    user_profile = UserProfile(**profile_data)
    
    # Run the full pipeline
    analysis = engine.analyze(profile=user_profile, language=profile.language)
    
    frontend_results = []
    for row in analysis.get("results", []):
        if row["status"] != "not_eligible":
            exp = row.get("explanation", "")
            if isinstance(exp, dict):
                if exp.get("summary"):
                    why_text = exp["summary"]
                else:
                    met_conditions = exp.get("met", [])
                    why_text = "Eligible because: " + ", ".join(met_conditions) if met_conditions else "All eligibility criteria met."
            else:
                why_text = str(exp)
            
            # Safely extract strings for documents
            raw_docs = row.get("documents", [])
            docs = []
            if isinstance(raw_docs, dict):
                raw_docs = [item for sublist in raw_docs.values() for item in (sublist if isinstance(sublist, list) else [sublist])]
            
            for d in raw_docs:
                if isinstance(d, dict):
                    docs.append(str(d.get("name", d.get("key", "Required Document"))))
                else:
                    docs.append(str(d))
                
            # Safely extract string for source
            raw_srcs = row.get("sources", ["Official Portal"])
            first_src = raw_srcs[0] if isinstance(raw_srcs, list) and len(raw_srcs) > 0 else raw_srcs
            
            if isinstance(first_src, dict):
                src_str = str(first_src.get("title", first_src.get("url", "Official Portal")))
            else:
                src_str = str(first_src)
            
            frontend_results.append(
                SchemeResponse(
                    id=str(row["scheme_id"]), # Ensure outgoing ID is safely a string
                    name=row["name"],
                    benefit=str(row.get("benefits", "")),
                    why_eligible=why_text,
                    documents=docs,
                    apply_link=row.get("apply_url", row.get("official_url", "")),
                    source=src_str
                )
            )
            
    return frontend_results

@app.get("/api/schemes", response_model=List[SchemeResponse])
def get_all_schemes():
    engine = get_engine()
    frontend_results = []
    
    # Loop through ALL schemes in the AI engine's database, completely ignoring the user profile
    for s in engine.schemes.values():
        # Safely extract string for source
        raw_srcs = s.get("sources", ["Official Portal"])
        first_src = raw_srcs[0] if isinstance(raw_srcs, list) and len(raw_srcs) > 0 else raw_srcs
        if isinstance(first_src, dict):
            src_str = str(first_src.get("title", first_src.get("url", "Official Portal")))
        else:
            src_str = str(first_src)
            
        # Safely extract strings for documents
        raw_docs = s.get("documents", [])
        docs = []
        if isinstance(raw_docs, dict):
            raw_docs = [item for sublist in raw_docs.values() for item in (sublist if isinstance(sublist, list) else [sublist])]
        for d in raw_docs:
            if isinstance(d, dict):
                docs.append(str(d.get("name", d.get("key", "Required Document"))))
            else:
                docs.append(str(d))
        
        frontend_results.append(
            SchemeResponse(
                id=str(s["id"]),
                name=s["name"],
                benefit=str(s.get("benefits", s.get("summary", ""))),
                why_eligible="Review details for full eligibility criteria.", # Generic text since we aren't checking a profile here
                documents=docs,
                apply_link=s.get("apply_url", s.get("official_url", "")),
                source=src_str
            )
        )
        
    return frontend_results

@app.get("/api/schemes/{id}", response_model=SchemeResponse)
def get_scheme(id: str):
    engine = get_engine()

    s = engine.get_scheme(id)
    if not s and id.isdigit():
        s = engine.get_scheme(int(id))
        
    if not s:
        raise HTTPException(status_code=404, detail="Scheme not found")
        
    # Safely extract string for source
    raw_srcs = s.get("sources", ["Official Portal"])
    first_src = raw_srcs[0] if isinstance(raw_srcs, list) and len(raw_srcs) > 0 else raw_srcs
    
    if isinstance(first_src, dict):
        src_str = str(first_src.get("title", first_src.get("url", "Official Portal")))
    else:
        src_str = str(first_src)
        
    # Safely extract strings for documents
    raw_docs = s.get("documents", [])
    docs = []
    if isinstance(raw_docs, dict):
        raw_docs = [item for sublist in raw_docs.values() for item in (sublist if isinstance(sublist, list) else [sublist])]
    
    for d in raw_docs:
        if isinstance(d, dict):
            docs.append(str(d.get("name", d.get("key", "Required Document"))))
        else:
            docs.append(str(d))
    
    return SchemeResponse(
        id=str(s["id"]), # Ensure outgoing ID is safely a string
        name=s["name"],
        benefit=str(s.get("benefits", "")),
        why_eligible="Detailed eligibility criteria applied.",
        documents=docs,
        apply_link=s.get("apply_url", s.get("official_url", "")),
        source=src_str
    )