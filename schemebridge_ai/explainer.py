"""Turns rule results into plain-language explanations (LLM when available, templates otherwise)."""
from .eligibility import EligibilityResult, missing_topics
from .i18n import t
from .language import LANG_NAMES, offline_lang
from .llm import LLM
from .models import UserProfile

SYSTEM = ("You are SchemeBridge, a helper that explains Indian government welfare schemes to ordinary citizens. "
          "Use ONLY the facts provided. Never invent amounts, dates, deadlines, links or conditions. "
          "Write 3-5 short, simple sentences (reading level of a class 6 student). Say clearly whether the person "
          "appears eligible and why, and what to do next. Reply in {language}.")


def explain_eligibility(scheme: dict, result: EligibilityResult, p: UserProfile, lang: str, llm: LLM) -> dict:
    lg = offline_lang(lang)
    name = scheme["name_hi"] if lg == "hi" else scheme["name"]
    summary = scheme["summary_hi"] if lg == "hi" else scheme["summary"]
    excl_suffix = " (अनुमत नहीं)" if lg == "hi" else " (not allowed)"

    if result.status == "eligible":
        headline = t("s_eligible", lg).format(name=name, summary=summary)
    elif result.status == "likely":
        headline = t("s_likely", lg).format(name=name, missing=", ".join(missing_topics(result, lg)))
    else:
        reasons = [c.text + excl_suffix for c in result.excluded_by] or [c.text for c in result.unmet]
        headline = t("s_not", lg).format(name=name, reasons="; ".join(reasons))

    plain = None
    if llm.available:
        facts = (f"Scheme: {scheme['name']}\nBenefit: {scheme['benefits']}\nOfficial eligibility rule: {scheme['eligibility_text']}\n"
                 f"Verdict: {result.status}\nConditions met: {[c.text for c in result.met]}\n"
                 f"Conditions not met: {[c.text for c in result.unmet]}\nExcluded because: {[c.text for c in result.excluded_by]}\n"
                 f"Information still missing: {missing_topics(result, 'en')}")
        plain = llm.generate(SYSTEM.format(language=LANG_NAMES.get(lang, "English")), facts, max_tokens=450)

    return {
        "status": result.status,
        "status_label": t(result.status if result.status != "not_eligible" else "not_eligible", lg),
        "pathway": result.pathway,
        "headline": headline,
        "plain_language": plain,
        "met": [c.text for c in result.met],
        "not_met": [c.text for c in result.unmet] if not result.excluded_by else [c.text + excl_suffix for c in result.excluded_by],
        "need_info": missing_topics(result, lg),
    }
