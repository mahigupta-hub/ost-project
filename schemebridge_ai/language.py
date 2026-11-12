"""Language detection + offline multilingual query normalisation (Hindi / Hinglish -> English keywords)."""
import re

SCRIPTS = [("hi", 0x0900, 0x097F), ("bn", 0x0980, 0x09FF), ("pa", 0x0A00, 0x0A7F), ("gu", 0x0A80, 0x0AFF),
           ("or", 0x0B00, 0x0B7F), ("ta", 0x0B80, 0x0BFF), ("te", 0x0C00, 0x0C7F), ("kn", 0x0C80, 0x0CFF),
           ("ml", 0x0D00, 0x0D7F)]

LANG_NAMES = {"en": "English", "hi": "Hindi", "hinglish": "Hinglish (Hindi written in English letters)",
              "bn": "Bengali", "pa": "Punjabi", "gu": "Gujarati", "or": "Odia", "ta": "Tamil",
              "te": "Telugu", "kn": "Kannada", "ml": "Malayalam", "mr": "Marathi"}

HINGLISH_HINTS = {"mujhe", "chahiye", "kya", "hai", "kaise", "mere", "meri", "nahi", "milega", "milegi", "kitna",
                  "ke", "liye", "yojana", "paise", "kab", "kaun", "karna", "kar", "sakta", "sakti"}

# keyword -> English expansion (substring match so Hindi inflections still hit)
GLOSSARY = {
    "किसान": "farmer agriculture", "खेती": "farmer agriculture land", "फसल": "crop insurance farmer",
    "पेंशन": "pension", "वृद्ध": "old age senior citizen pension", "बुजुर्ग": "old age senior citizen pension",
    "छात्रवृत्ति": "scholarship student", "स्कॉलरशिप": "scholarship student", "विद्यार्थी": "student scholarship",
    "घर": "house housing awas", "आवास": "house housing awas", "मकान": "house housing",
    "बीमा": "insurance", "स्वास्थ्य": "health hospital treatment", "इलाज": "health hospital treatment",
    "अस्पताल": "health hospital treatment", "गर्भवती": "pregnant maternity mother", "गर्भावस्था": "pregnant maternity",
    "बेटी": "daughter girl child savings", "बालिका": "girl child daughter", "गैस": "lpg gas cylinder",
    "सिलेंडर": "lpg gas cylinder", "कर्ज": "loan credit", "ऋण": "loan credit", "लोन": "loan credit",
    "व्यापार": "business self employed loan", "दुकान": "business shop loan vendor", "रेहड़ी": "street vendor loan",
    "ठेला": "street vendor loan", "कारीगर": "artisan craftsperson toolkit", "विश्वकर्मा": "artisan vishwakarma",
    "रोजगार": "employment wages job", "मजदूरी": "wage employment rural job", "नौकरी": "employment job",
    "महिला": "women", "विधवा": "widow pension", "दिव्यांग": "disability", "विकलांग": "disability", "बैंक": "bank account",
    "kisan": "farmer agriculture", "kheti": "farmer agriculture", "fasal": "crop insurance farmer",
    "ghar": "house housing awas", "makaan": "house housing", "bima": "insurance", "beti": "daughter girl child savings",
    "gas": "lpg gas cylinder", "karj": "loan credit", "loan": "loan credit", "dukan": "business shop loan",
    "rehdi": "street vendor loan", "kaarigar": "artisan craftsperson", "rozgar": "employment wages job",
    "mahila": "women", "vidhwa": "widow pension", "buzurg": "old age senior citizen pension",
    "scholarship": "scholarship student", "padhai": "student scholarship education", "garbhwati": "pregnant maternity",
    "gaon": "rural village", "gram": "rural village", "गाँव": "rural village", "गांव": "rural village", "shahar": "urban city", "शहर": "urban city",
    "ilaaj": "health hospital treatment", "aspatal": "health hospital treatment",
}


def detect_language(text: str) -> str:
    letters = [c for c in text if c.isalpha()]
    if not letters:
        return "en"
    counts = {}
    for c in letters:
        cp = ord(c)
        for code, lo, hi in SCRIPTS:
            if lo <= cp <= hi:
                counts[code] = counts.get(code, 0) + 1
    if counts:
        code, n = max(counts.items(), key=lambda kv: kv[1])
        if n / len(letters) >= 0.3:
            return code
    words = set(re.findall(r"[a-z]+", text.lower()))
    if len(words & HINGLISH_HINTS) >= 2:
        return "hinglish"
    return "en"


def normalize_query(query: str) -> str:
    """Append English keywords for Hindi/Hinglish terms so offline retrieval works on non-English input."""
    low = query.lower()
    extra = [en for k, en in GLOSSARY.items() if k in low]
    return query if not extra else f"{query} {' '.join(extra)}"


def offline_lang(lang: str) -> str:
    """Language code for offline templates (only en/hi exist offline)."""
    return "hi" if lang == "hi" else "en"
