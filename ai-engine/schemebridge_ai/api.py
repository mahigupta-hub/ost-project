"""FastAPI app exposing the AI engine. Run:  uvicorn schemebridge_ai.api:app --reload --port 8001
Mahi can also mount `router` inside his backend:  app.include_router(router)"""
from functools import lru_cache
from typing import List, Optional
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .engine import SchemeBridgeAI
from .models import UserProfile

router = APIRouter(prefix="/ai", tags=["SchemeBridge AI"])


@lru_cache(maxsize=1)
def get_engine() -> SchemeBridgeAI:
    return SchemeBridgeAI()


class AskRequest(BaseModel):
    query: str
    profile: Optional[UserProfile] = None
    language: Optional[str] = None  # en | hi | hinglish | bn | ta | te | ... (auto-detected if omitted)


class ExplainRequest(BaseModel):
    scheme_id: str
    profile: UserProfile
    language: str = "en"


class ChecklistRequest(BaseModel):
    scheme_ids: List[str]
    profile: UserProfile = UserProfile()
    language: str = "en"


class AnalyzeRequest(BaseModel):
    profile: UserProfile
    scheme_ids: Optional[List[str]] = None  # pass the ids from the backend matcher; omit to let the AI engine match
    language: str = "en"
    include_ineligible: bool = False


@router.get("/health")
def health():
    return {"ok": True, **get_engine().status}


@router.get("/schemes")
def schemes(category: Optional[str] = None):
    return get_engine().list_schemes(category)


@router.get("/schemes/{scheme_id}")
def scheme(scheme_id: str):
    s = get_engine().get_scheme(scheme_id)
    if not s:
        raise HTTPException(404, "Unknown scheme_id")
    return s


@router.post("/ask")
def ask(req: AskRequest):
    return get_engine().ask(req.query, req.profile, req.language)


@router.post("/explain")
def explain(req: ExplainRequest):
    if not get_engine().get_scheme(req.scheme_id):
        raise HTTPException(404, "Unknown scheme_id")
    return get_engine().explain(req.scheme_id, req.profile, req.language)


@router.post("/checklist")
def checklist(req: ChecklistRequest):
    return get_engine().checklist(req.scheme_ids, req.profile, req.language)


@router.post("/analyze")
def analyze(req: AnalyzeRequest):
    return get_engine().analyze(req.profile, req.scheme_ids, req.language, req.include_ineligible)


app = FastAPI(title="SchemeBridge AI Engine", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(router)
