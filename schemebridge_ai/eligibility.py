"""Rule evaluation used to *explain* eligibility (pass / fail / unknown for each condition)."""
from dataclasses import dataclass, field
from typing import List, Optional
from .models import UserProfile
from .i18n import describe_condition, ask_topic


@dataclass
class ConditionResult:
    key: str
    text: str
    status: str  # pass | fail | unknown

    def as_dict(self):
        return {"key": self.key, "text": self.text, "status": self.status}


@dataclass
class EligibilityResult:
    status: str  # eligible | likely | not_eligible
    pathway: Optional[str] = None
    met: List[ConditionResult] = field(default_factory=list)
    unmet: List[ConditionResult] = field(default_factory=list)
    unknown: List[ConditionResult] = field(default_factory=list)
    excluded_by: List[ConditionResult] = field(default_factory=list)
    score: float = 0.0


def check_value(key: str, expected, p: UserProfile) -> Optional[bool]:
    """True / False, or None when the profile does not contain the needed information."""
    if key == "min_age":
        return None if p.age is None else p.age >= expected
    if key == "max_age":
        return None if p.age is None else p.age <= expected
    if key == "max_income":
        return None if p.annual_income is None else p.annual_income <= expected
    if key == "occupation":
        o = p.occ()
        return None if o is None else o in expected
    actual = getattr(p, key, None)
    if actual is None:
        return None
    if isinstance(expected, list):
        return str(actual).lower() in [str(e).lower() for e in expected]
    return str(actual).lower() == str(expected).lower() if isinstance(expected, str) else actual == expected


def check_conditions(conditions: dict, p: UserProfile, lang: str = "en") -> List[ConditionResult]:
    out = []
    for key, expected in conditions.items():
        r = check_value(key, expected, p)
        out.append(ConditionResult(key, describe_condition(key, expected, lang),
                                   "unknown" if r is None else ("pass" if r else "fail")))
    return out


def evaluate_scheme(scheme: dict, p: UserProfile, lang: str = "en") -> EligibilityResult:
    # 1. exclusions: all conditions of an exclusion block match -> not eligible
    for ex in scheme.get("exclusions", []):
        res = check_conditions(ex["conditions"], p, lang)
        if res and all(c.status == "pass" for c in res):
            return EligibilityResult("not_eligible", excluded_by=res, unmet=res, score=0.0)

    # 2. pick the best pathway (fewest failures, then fewest unknowns)
    best = None
    for pw in scheme["eligibility_pathways"]:
        res = check_conditions(pw["conditions"], p, lang)
        fails = sum(c.status == "fail" for c in res)
        unk = sum(c.status == "unknown" for c in res)
        if best is None or (fails, unk) < best[0]:
            best = ((fails, unk), pw, res)
    (fails, unk), pw, res = best
    met = [c for c in res if c.status == "pass"]
    unmet = [c for c in res if c.status == "fail"]
    unknown = [c for c in res if c.status == "unknown"]
    if fails == 0 and unk == 0:
        status, score = "eligible", 1.0
    elif fails == 0:
        status, score = "likely", 0.5 + 0.4 * len(met) / max(len(res), 1)
    else:
        status, score = "not_eligible", 0.0
    return EligibilityResult(status, pw.get("label"), met, unmet, unknown, [], score)


def missing_topics(result: EligibilityResult, lang: str = "en") -> List[str]:
    seen, out = set(), []
    for c in result.unknown:
        topic = ask_topic(c.key, lang)
        if topic not in seen:
            seen.add(topic)
            out.append(topic)
    return out
