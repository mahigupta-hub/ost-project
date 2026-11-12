"""Rebuild / inspect the retrieval index.  Usage:
  python scripts/build_index.py                      # default (tfidf, offline)
  SB_VECTOR_BACKEND=chroma python scripts/build_index.py   # semantic multilingual index (needs chromadb + sentence-transformers)"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from schemebridge_ai.retriever import Retriever

r = Retriever()
print(f"Index built: {len(r.chunks)} chunks, backend = {r.backend}")
for q in ["farmer income support", "बेटी की पढ़ाई के लिए बचत", "loan for street vendor"]:
    top = r.retrieve(q, 1)[0]
    print(f"  {q!r} -> {top[0].scheme_id} / {top[0].section} ({top[1]:.3f})")
