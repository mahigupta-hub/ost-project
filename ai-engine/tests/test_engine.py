import pytest
from fastapi.testclient import TestClient
from schemebridge_ai import SchemeBridgeAI, UserProfile
from schemebridge_ai.api import app
from schemebridge_ai.language import detect_language, normalize_query


@pytest.fixture(scope="module")
def ai():
    return SchemeBridgeAI(backend="tfidf", use_llm=False)


FARMER = dict(age=40, gender="male", residence="rural", annual_income=100000, occupation="farmer",
              owns_agricultural_land=True, is_income_tax_payer=False, is_govt_employee=False, has_bank_account=True)


def test_dataset_loads(ai):
    assert ai.status["schemes"] >= 15 and ai.status["chunks"] > 60


def test_retrieval_farmer_income(ai):
    assert ai.search("income support for farmers", 3)[0]["scheme_id"] == "pm-kisan"


def test_retrieval_scholarship(ai):
    assert ai.ask("scholarship for SC students")["related_schemes"][0]["scheme_id"] == "post-matric-sc"


def test_hindi_query_retrieval(ai):
    ids = [r["scheme_id"] for r in ai.ask("मुझे बेटी के लिए बचत योजना चाहिए")["related_schemes"]]
    assert "ssy" in ids


def test_hinglish_detection_and_retrieval(ai):
    q = "mujhe ghar chahiye gaon mein"
    assert detect_language(q) == "hinglish"
    assert "pmay-g" in [r["scheme_id"] for r in ai.ask(q)["related_schemes"]]


def test_language_detection():
    assert detect_language("किसान योजना") == "hi"
    assert detect_language("தமிழ் மொழி") == "ta"
    assert detect_language("income support") == "en"


def test_eligible_pm_kisan(ai):
    assert ai.explain("pm-kisan", FARMER)["status"] == "eligible"


def test_exclusion_income_tax(ai):
    r = ai.explain("pm-kisan", {**FARMER, "is_income_tax_payer": True})
    assert r["status"] == "not_eligible" and r["not_met"]


def test_missing_info_is_reported(ai):
    r = ai.explain("apy", {"age": 30})
    assert r["status"] == "likely" and r["need_info"]


def test_age_limit(ai):
    assert ai.explain("apy", {"age": 45, "has_bank_account": True})["status"] == "not_eligible"


def test_multi_pathway(ai):
    assert ai.explain("ab-pmjay", {"age": 72})["status"] == "eligible"          # senior pathway
    assert ai.explain("ab-pmjay", {"age": 30, "is_bpl": True})["status"] == "eligible"  # BPL pathway


def test_hindi_explanation(ai):
    assert "पात्र" in ai.explain("pm-kisan", FARMER, "hi")["headline"]


def test_checklist_conditional_docs(ai):
    sc = ai.checklist(["stand-up-india"], {"category": "SC", "gender": "male"})["per_scheme"]["stand-up-india"]
    general = ai.checklist(["stand-up-india"], {"category": "General", "gender": "female"})["per_scheme"]["stand-up-india"]
    assert "caste_certificate" in [d["key"] for d in sc]
    assert "caste_certificate" not in [d["key"] for d in general]


def test_combined_checklist_dedup(ai):
    keys = [d["key"] for d in ai.checklist(["pm-kisan", "pmfby", "kcc"], FARMER)["combined"]]
    assert len(keys) == len(set(keys)) and keys[0] == "aadhaar"


def test_analyze_sorted_with_links(ai):
    out = ai.analyze(FARMER)
    scores = [r["score"] for r in out["results"]]
    assert scores == sorted(scores, reverse=True)
    assert all(r["official_url"].startswith("http") and r["sources"] for r in out["results"])
    assert out["disclaimer"]


def test_analyze_with_backend_supplied_ids(ai):
    out = ai.analyze(FARMER, scheme_ids=["pm-kisan", "ssy"])
    assert {r["scheme_id"] for r in out["results"]} == {"pm-kisan", "ssy"}


def test_ask_no_match_is_safe(ai):
    assert ai.ask("zzzz qqqq xxxx")["mode"] == "no_match"


def test_api_endpoints():
    c = TestClient(app)
    assert c.get("/ai/health").json()["ok"]
    assert len(c.get("/ai/schemes").json()) >= 15
    assert c.get("/ai/schemes/nope").status_code == 404
    r = c.post("/ai/analyze", json={"profile": FARMER, "language": "en"}).json()
    assert r["results"]
    r = c.post("/ai/ask", json={"query": "crop insurance"}).json()
    assert r["sources"]
    r = c.post("/ai/checklist", json={"scheme_ids": ["pm-kisan"], "profile": FARMER}).json()
    assert r["combined"]
    assert c.post("/ai/explain", json={"scheme_id": "pm-kisan", "profile": FARMER}).json()["status"] == "eligible"


# ---------------- Gemini (mocked – no network needed) ----------------
def test_llm_disabled_without_key(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    from schemebridge_ai.llm import LLM
    assert not LLM().available and LLM().generate("s", "u") is None


def test_llm_generate_parses_gemini_response(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "fake")
    from schemebridge_ai import gemini
    seen = {}

    def fake_post(path, payload, **kw):
        seen["path"], seen["payload"] = path, payload
        return {"candidates": [{"content": {"parts": [{"text": "Namaste "}, {"text": "answer"}]}}]}

    monkeypatch.setattr(gemini, "post", fake_post)
    from schemebridge_ai.llm import LLM
    assert LLM().generate("sys", "user") == "Namaste answer"
    assert seen["path"].endswith(":generateContent")
    assert seen["payload"]["system_instruction"]["parts"][0]["text"] == "sys"


def test_llm_failure_falls_back(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "fake")
    from schemebridge_ai import gemini

    def boom(*a, **k):
        raise RuntimeError("429")
    monkeypatch.setattr(gemini, "post", boom)
    from schemebridge_ai.llm import LLM
    assert LLM().generate("s", "u") is None


def test_engine_uses_llm_answer_and_hides_name(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "fake")
    from schemebridge_ai import gemini
    prompts = []

    def fake_post(path, payload, **kw):
        prompts.append(payload["contents"][0]["parts"][0]["text"])
        return {"candidates": [{"content": {"parts": [{"text": "LLM says hi [1]"}]}}]}

    monkeypatch.setattr(gemini, "post", fake_post)
    e = SchemeBridgeAI(backend="tfidf", use_llm=True)
    r = e.ask("crop insurance for farmers", {"name": "SECRETNAME", "age": 40})
    assert r["mode"] == "llm" and r["answer"].startswith("LLM says")
    assert all("SECRETNAME" not in p for p in prompts)
    assert e.explain("pm-kisan", FARMER)["plain_language"] == "LLM says hi [1]"


def test_gemini_embedding_store_with_cache(monkeypatch, tmp_path):
    monkeypatch.setenv("GEMINI_API_KEY", "fake")
    from schemebridge_ai import gemini
    from schemebridge_ai.vector_store import GeminiStore
    vocab = ["farmer", "loan", "pension", "scholarship"]
    calls = []

    def fake_post(path, payload, **kw):
        calls.append(len(payload["requests"]))
        return {"embeddings": [{"values": [float(r["content"]["parts"][0]["text"].count(w)) + 0.01 for w in vocab]}
                               for r in payload["requests"]]}

    monkeypatch.setattr(gemini, "post", fake_post)
    s = GeminiStore("gemini-embedding-001", tmp_path)
    s.fit(["farmer income", "pension for old age", "loan for business"])
    assert s.scores("farmer").argmax() == 0 and s.scores("pension").argmax() == 1
    n = len(calls)
    s2 = GeminiStore("gemini-embedding-001", tmp_path)  # new instance reads the disk cache
    s2.fit(["farmer income", "pension for old age", "loan for business"])
    assert len(calls) == n  # no new document-embedding calls


def test_gemini_backend_falls_back_when_embedding_fails(monkeypatch, tmp_path):
    monkeypatch.setenv("GEMINI_API_KEY", "fake")
    from schemebridge_ai import gemini, config
    monkeypatch.setattr(config, "INDEX_DIR", tmp_path)

    def boom(*a, **k):
        raise RuntimeError("network down")
    monkeypatch.setattr(gemini, "post", boom)
    e = SchemeBridgeAI(backend="gemini", use_llm=False)
    assert e.status["retrieval_backend"] == "tfidf"
    assert e.search("income support for farmers", 1)[0]["scheme_id"] == "pm-kisan"
