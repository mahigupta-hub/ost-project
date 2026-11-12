import os
from pathlib import Path

try:  # optional .env support
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
SCHEMES_FILE = DATA_DIR / "schemes.json"
GUIDES_FILE = DATA_DIR / "document_guides.json"
EXTRA_DOCS_DIR = DATA_DIR / "docs"
INDEX_DIR = BASE_DIR / ".index"

# tfidf = offline, no downloads | gemini = Gemini embeddings (free tier, best for Hindi/regional) | chroma = local sentence-transformers
VECTOR_BACKEND = os.getenv("SB_VECTOR_BACKEND", "tfidf")
GEMINI_EMBED_MODEL = os.getenv("SB_GEMINI_EMBED_MODEL", "gemini-embedding-001")
EMBED_MODEL = os.getenv("SB_EMBED_MODEL", "paraphrase-multilingual-MiniLM-L12-v2")
LLM_MODEL = os.getenv("SB_LLM_MODEL", "gemini-2.5-flash")  # free-tier model; gemini-2.5-flash-lite is faster/cheaper
TOP_K = int(os.getenv("SB_TOP_K", "5"))
# None -> each backend uses its own default (tfidf 0.06, gemini 0.55). Override with SB_MIN_SCORE.
_ms = os.getenv("SB_MIN_SCORE")
MIN_RETRIEVAL_SCORE = float(_ms) if _ms else None

DISCLAIMER = {
    "en": "This is guidance only. Always confirm eligibility and amounts on the official portal before applying.",
    "hi": "यह केवल मार्गदर्शन है। आवेदन से पहले पात्रता और राशि की पुष्टि आधिकारिक पोर्टल पर अवश्य करें।",
}
