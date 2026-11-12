"""Vector-store backends. Both expose fit(texts) and scores(query) -> np.ndarray of similarity scores."""
import hashlib
import json
from pathlib import Path

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer


class TfidfStore:
    """Offline default: word + character n-gram TF-IDF (robust to spelling variants and transliteration)."""
    name = "tfidf"
    min_score = 0.06

    def __init__(self):
        self.word = TfidfVectorizer(analyzer="word", ngram_range=(1, 2), stop_words="english", sublinear_tf=True)
        self.char = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), sublinear_tf=True)

    def fit(self, texts):
        self.Xw = self.word.fit_transform(texts)
        self.Xc = self.char.fit_transform(texts)

    def scores(self, query: str) -> np.ndarray:
        sw = (self.Xw @ self.word.transform([query]).T).toarray().ravel()
        sc = (self.Xc @ self.char.transform([query]).T).toarray().ravel()
        return 0.6 * sw + 0.4 * sc


class ChromaStore:
    """Semantic multilingual search: sentence-transformers embeddings + ChromaDB.
    Requires: pip install chromadb sentence-transformers  (downloads the model on first run)."""
    name = "chroma"
    min_score = 0.35

    def __init__(self, model_name: str, persist_dir):
        import chromadb
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model_name)
        self.client = chromadb.PersistentClient(path=str(persist_dir))
        self.n = 0

    def fit(self, texts):
        try:
            self.client.delete_collection("schemebridge")
        except Exception:
            pass
        self.col = self.client.create_collection("schemebridge", metadata={"hnsw:space": "cosine"})
        emb = self.model.encode(texts, normalize_embeddings=True).tolist()
        self.col.add(ids=[str(i) for i in range(len(texts))], embeddings=emb, documents=texts)
        self.n = len(texts)

    def scores(self, query: str) -> np.ndarray:
        q = self.model.encode([query], normalize_embeddings=True).tolist()
        res = self.col.query(query_embeddings=q, n_results=self.n)
        out = np.zeros(self.n)
        for i, d in zip(res["ids"][0], res["distances"][0]):
            out[int(i)] = 1.0 - d
        return out


class GeminiStore:
    """Semantic multilingual search using Gemini embeddings (free tier). Embeddings are cached on disk,
    so the API is only called for new/changed chunks and for each user query."""
    name = "gemini"
    min_score = 0.55  # cosine similarity floor for "no match"; calibrate with scripts/build_index.py
    DIM = 768

    def __init__(self, model: str, cache_dir):
        from . import gemini
        self.g = gemini
        self.model = model
        self.cache_path = Path(cache_dir) / f"gemini_{model}_{self.DIM}.json"
        try:
            self.cache = json.loads(self.cache_path.read_text())
        except Exception:
            self.cache = {}
        self.M = None

    @staticmethod
    def _key(text, task):
        return hashlib.sha1(f"{task}|{text}".encode("utf-8")).hexdigest()

    def _embed(self, texts, task):
        keys = [self._key(t, task) for t in texts]
        missing = [(k, t) for k, t in zip(keys, texts) if k not in self.cache]
        for i in range(0, len(missing), 50):
            batch = missing[i:i + 50]
            reqs = [{"model": f"models/{self.model}", "content": {"parts": [{"text": t}]},
                     "taskType": task, "outputDimensionality": self.DIM} for _, t in batch]
            data = self.g.post(f"models/{self.model}:batchEmbedContents", {"requests": reqs})
            for (k, _), e in zip(batch, data["embeddings"]):
                self.cache[k] = e["values"]
        if missing:
            self.cache_path.parent.mkdir(parents=True, exist_ok=True)
            self.cache_path.write_text(json.dumps(self.cache))
        M = np.array([self.cache[k] for k in keys], dtype=float)
        return M / np.maximum(np.linalg.norm(M, axis=1, keepdims=True), 1e-9)  # re-normalise (truncated dims)

    def fit(self, texts):
        self.M = self._embed(texts, "RETRIEVAL_DOCUMENT")

    def scores(self, query: str) -> np.ndarray:
        q = self._embed([query], "RETRIEVAL_QUERY")[0]
        return self.M @ q


def make_store(backend: str, model_name: str, persist_dir):
    if backend == "gemini":
        from . import config, gemini
        if gemini.api_key():
            try:
                return GeminiStore(config.GEMINI_EMBED_MODEL, persist_dir)
            except Exception as e:
                print(f"[schemebridge] gemini backend unavailable ({e}); falling back to tfidf")
        else:
            print("[schemebridge] GEMINI_API_KEY not set; falling back to tfidf")
        return TfidfStore()
    if backend == "chroma":
        try:
            return ChromaStore(model_name, persist_dir)
        except Exception as e:  # missing deps / no internet -> safe fallback
            print(f"[schemebridge] chroma backend unavailable ({e}); falling back to tfidf")
    return TfidfStore()
