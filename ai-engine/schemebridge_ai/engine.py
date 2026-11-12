"""SchemeBridgeAI – the single entry point Mahi's backend (or the bundled FastAPI app) calls."""
from typing import List, Optional, Union
from . import config
from .checklist import combined_checklist, scheme_documents
from .data_loader import load_schemes
from .eligibility import evaluate_scheme
from .explainer import explain_eligibility
from .i18n import t
from .language import LANG_NAMES, detect_language, normalize_query, offline_lang
from .llm import LLM
from .models import UserProfile
from .retriever import Retriever

ASK_SYSTEM = ("You are SchemeBridge, an assistant that helps Indian citizens understand government welfare schemes. "
              "Answer ONLY from the numbered context. If the context does not contain the answer, say you could not "
              "find it and suggest checking the official portal. Never invent amounts, dates, deadlines or links. "
              "Use short, simple sentences (class 6 reading level). Reply in {language}. "
              "Cite the context numbers you used like [1] or [2][3].")


def _profile(p: Union[UserProfile, dict, None]) -> UserProfile:
    if p is None:
        return UserProfile()
    return p if isinstance(p, UserProfile) else UserProfile(**p)


class SchemeBridgeAI:
    def __init__(self, backend: Optional[str] = None, use_llm: bool = True):
        self.schemes = load_schemes()
        self.retriever = Retriever(backend)
        self.llm = LLM(use_llm)

    # ---------- info ----------
    @property
    def status(self) -> dict:
        return {"schemes": len(self.schemes), "chunks": len(self.retriever.chunks),
                "retrieval_backend": self.retriever.backend, "llm_available": self.llm.available}

    def list_schemes(self, category: Optional[str] = None) -> List[dict]:
        return [{"id": s["id"], "name": s["name"], "name_hi": s["name_hi"], "category": s["category"],
                 "summary": s["summary"], "official_url": s["official_url"]}
                for s in self.schemes.values() if not category or s["category"].lower() == category.lower()]

    def get_scheme(self, scheme_id: str) -> Optional[dict]:
        return self.schemes.get(scheme_id)

    # ---------- retrieval ----------
    def search(self, query: str, k: int = config.TOP_K) -> List[dict]:
        hits = self.retriever.retrieve(normalize_query(query), k)
        return [{"scheme_id": c.scheme_id, "scheme": c.scheme_name, "section": c.section, "text": c.text,
                 "score": round(score, 4), "source_url": c.source_url} for c, score in hits]

    # ---------- eligibility explanation ----------
    def explain(self, scheme_id: str, profile, language: str = "en") -> dict:
        s = self.schemes[scheme_id]
        p = _profile(profile)
        res = evaluate_scheme(s, p, offline_lang(language))
        out = explain_eligibility(s, res, p, language, self.llm)
        out.update({"scheme_id": scheme_id, "language": language})
        return out

    # ---------- checklist ----------
    def checklist(self, scheme_ids: List[str], profile, language: str = "en") -> dict:
        p = _profile(profile)
        lg = offline_lang(language)
        per = {sid: scheme_documents(self.schemes[sid], p, lg) for sid in scheme_ids if sid in self.schemes}
        return {"language": language, "per_scheme": per,
                "combined": combined_checklist(list(per), p, lg)}

    # ---------- full pipeline ----------
    def analyze(self, profile, scheme_ids: Optional[List[str]] = None, language: str = "en",
                include_ineligible: bool = False) -> dict:
        """Full result for the UI. If scheme_ids come from Mahi's matcher they are all explained;
        otherwise the engine's own rule check is run over the whole dataset (useful for demos / fallback)."""
        p = _profile(profile)
        lg = offline_lang(language)
        given = scheme_ids is not None
        rows = []
        for sid in (scheme_ids if given else self.schemes):
            s = self.schemes.get(sid)
            if not s:
                continue
            res = evaluate_scheme(s, p, lg)
            if res.status == "not_eligible" and not (include_ineligible or given):
                continue
            ex = explain_eligibility(s, res, p, language, self.llm)
            rows.append({
                "scheme_id": sid, "name": s["name_hi"] if lg == "hi" else s["name"], "category": s["category"],
                "status": res.status, "score": round(res.score, 3), "explanation": ex,
                "benefits": s["benefits"], "how_to_apply": s["how_to_apply"],
                "documents": scheme_documents(s, p, lg), "official_url": s["official_url"],
                "apply_url": s["apply_url"], "sources": s["sources"],
                "verification_status": s["verification_status"], "last_verified": s["last_verified"],
            })
        rows.sort(key=lambda r: r["score"], reverse=True)
        ids = [r["scheme_id"] for r in rows if r["status"] != "not_eligible"]
        return {"language": language, "results": rows,
                "combined_checklist": combined_checklist(ids, p, lg),
                "disclaimer": config.DISCLAIMER.get(lg, config.DISCLAIMER["en"])}

    # ---------- RAG question answering ----------
    def ask(self, query: str, profile=None, language: Optional[str] = None, k: int = config.TOP_K) -> dict:
        lang = language or detect_language(query)
        lg = offline_lang(lang)
        p = _profile(profile)
        hits = self.retriever.retrieve(normalize_query(query), k)
        if not hits or hits[0][1] < self.retriever.min_score:
            return {"query": query, "language": lang, "answer": t("no_answer", lg), "mode": "no_match",
                    "sources": [], "related_schemes": []}

        context = "\n\n".join(f"[{i + 1}] ({c.scheme_name} – {c.section}) {c.text}" for i, (c, _) in enumerate(hits))
        answer, mode = None, "extractive"
        if self.llm.available:
            profile_txt = p.model_dump(exclude_none=True, exclude={"name"})  # never send the name to the LLM
            answer = self.llm.generate(ASK_SYSTEM.format(language=LANG_NAMES.get(lang, "English")),
                                       f"Citizen question: {query}\nCitizen profile (may be empty): {profile_txt}\n\nContext:\n{context}")
            mode = "llm" if answer else "extractive"
        if not answer:
            answer = "\n\n".join(f"• {c.scheme_name} – {c.section}: {c.text}" for c, _ in hits[:2])

        seen, sources = set(), []
        for c, sc in hits:
            if (c.scheme_id, c.source_url) not in seen:
                seen.add((c.scheme_id, c.source_url))
                sources.append({"scheme_id": c.scheme_id, "scheme": c.scheme_name, "title": c.source_title, "url": c.source_url})

        related = []
        for sid, score in self.retriever.rank_schemes(normalize_query(query), 3):
            s = self.schemes[sid]
            item = {"scheme_id": sid, "name": s["name_hi"] if lg == "hi" else s["name"], "official_url": s["official_url"]}
            if p.model_dump(exclude_none=True):
                item["eligibility"] = evaluate_scheme(s, p, lg).status
            related.append(item)
        return {"query": query, "language": lang, "answer": answer, "mode": mode, "sources": sources,
                "related_schemes": related, "disclaimer": config.DISCLAIMER.get(lg, config.DISCLAIMER["en"])}
