"""Builds RAG chunks from the verified dataset (+ optional extra official documents) and retrieves them."""
import re
from dataclasses import dataclass
from typing import List, Optional, Tuple
from . import config
from .data_loader import load_schemes, load_guides
from .vector_store import make_store


@dataclass
class Chunk:
    id: int
    scheme_id: str
    scheme_name: str
    section: str
    text: str
    source_url: str
    source_title: str

    @property
    def search_text(self) -> str:
        return f"{self.scheme_name}. {self.section}. {self.text}"


def build_scheme_chunks(schemes: dict, guides: dict) -> List[Chunk]:
    chunks: List[Chunk] = []

    def add(s, section, text):
        src = s["sources"][0]
        chunks.append(Chunk(len(chunks), s["id"], s["name"], section, text, src["url"], src["title"]))

    for s in schemes.values():
        add(s, "overview", f"{s['summary']} Category: {s['category']}. Ministry: {s['ministry']}. {s.get('keywords', '')}")
        add(s, "benefits", s["benefits"])
        add(s, "eligibility", s["eligibility_text"])
        docs = []
        for d in s["documents"]:
            key = d if isinstance(d, str) else d["key"]
            docs.append(guides.get(key, {}).get("name", key))
        add(s, "documents", "Documents required: " + "; ".join(docs) + ".")
        add(s, "how to apply", s["how_to_apply"])
    return chunks


def ingest_documents(schemes: dict, start_id: int, docs_dir) -> List[Chunk]:
    """Optional: official guideline text files named '<scheme-id>__*.txt' (first line 'SOURCE: <url>')."""
    out: List[Chunk] = []
    if not docs_dir.exists():
        return out
    for path in sorted(docs_dir.glob("*.txt")) + sorted(docs_dir.glob("*.md")):
        sid = path.stem.split("__")[0]
        if sid not in schemes:
            continue
        raw = path.read_text(encoding="utf-8")
        url = schemes[sid]["official_url"]
        m = re.match(r"\s*SOURCE:\s*(\S+)", raw)
        if m:
            url = m.group(1)
            raw = raw[m.end():]
        paras = [p.strip() for p in re.split(r"\n\s*\n", raw) if p.strip()]
        buf = ""
        for p in paras + [""]:
            if p and len(buf) + len(p) < 900:
                buf = f"{buf}\n{p}".strip()
                continue
            if buf:
                out.append(Chunk(start_id + len(out), sid, schemes[sid]["name"], f"official document: {path.stem}",
                                 buf, url, f"Official document ({path.name})"))
            buf = p
    return out


class Retriever:
    def __init__(self, backend: Optional[str] = None):
        schemes, guides = load_schemes(), load_guides()
        self.chunks = build_scheme_chunks(schemes, guides)
        self.chunks += ingest_documents(schemes, len(self.chunks), config.EXTRA_DOCS_DIR)
        self.store = make_store(backend or config.VECTOR_BACKEND, config.EMBED_MODEL, config.INDEX_DIR)
        texts = [c.search_text for c in self.chunks]
        try:
            self.store.fit(texts)
        except Exception as e:  # e.g. rate limit / offline while embedding -> keep the app working
            print(f"[schemebridge] {self.store.name} indexing failed ({e}); falling back to tfidf")
            from .vector_store import TfidfStore
            self.store = TfidfStore()
            self.store.fit(texts)

    @property
    def min_score(self) -> float:
        return config.MIN_RETRIEVAL_SCORE if config.MIN_RETRIEVAL_SCORE is not None else self.store.min_score

    @property
    def backend(self) -> str:
        return self.store.name

    def retrieve(self, query: str, k: int = config.TOP_K, scheme_ids: Optional[List[str]] = None) -> List[Tuple[Chunk, float]]:
        try:
            scores = self.store.scores(query)
        except Exception as e:  # query-time embedding failure -> degrade to tfidf for this call
            print(f"[schemebridge] {self.store.name} query failed ({e}); using tfidf")
            if not hasattr(self, "_fallback"):
                from .vector_store import TfidfStore
                self._fallback = TfidfStore()
                self._fallback.fit([c.search_text for c in self.chunks])
            scores = self._fallback.scores(query)
        order = scores.argsort()[::-1]
        out = []
        for i in order:
            c = self.chunks[int(i)]
            if scheme_ids and c.scheme_id not in scheme_ids:
                continue
            out.append((c, float(scores[i])))
            if len(out) >= k:
                break
        return out

    def rank_schemes(self, query: str, k: int = 5) -> List[Tuple[str, float]]:
        """Scheme-level relevance: best chunk score plus a small bonus for additional matching chunks."""
        agg = {}
        for c, s in self.retrieve(query, k=len(self.chunks)):
            agg.setdefault(c.scheme_id, []).append(s)
        ranked = {sid: max(v) + 0.25 * sum(sorted(v, reverse=True)[1:3]) for sid, v in agg.items()}
        return sorted(ranked.items(), key=lambda kv: kv[1], reverse=True)[:k]
