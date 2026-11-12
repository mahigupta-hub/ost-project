"""Small offline i18n layer (English + Hindi). Other languages use the LLM translator when available."""

LABELS = {
    "en": {
        "eligible": "Eligible", "likely": "Possibly eligible – more details needed", "not_eligible": "Not eligible",
        "benefits": "Benefits", "documents": "Documents needed", "how_to_apply": "How to apply",
        "official_link": "Official link", "you_meet": "You meet", "you_dont_meet": "You do not meet",
        "need_info": "We need to know", "conditional": "only if applicable to you",
        "no_answer": "I could not find this in the verified scheme data. Please check the official portal.",
        "sources": "Sources",
        "s_eligible": "You appear eligible for {name}. {summary}",
        "s_likely": "You may be eligible for {name}, but we need a few more details: {missing}.",
        "s_not": "You may not be eligible for {name}. Reason: {reasons}.",
    },
    "hi": {
        "eligible": "पात्र", "likely": "संभवतः पात्र – कुछ और जानकारी चाहिए", "not_eligible": "पात्र नहीं",
        "benefits": "लाभ", "documents": "ज़रूरी दस्तावेज़", "how_to_apply": "आवेदन कैसे करें",
        "official_link": "आधिकारिक लिंक", "you_meet": "आप ये शर्तें पूरी करते हैं", "you_dont_meet": "आप ये शर्तें पूरी नहीं करते",
        "need_info": "हमें ये जानकारी चाहिए", "conditional": "केवल तभी जब आप पर लागू हो",
        "no_answer": "यह जानकारी सत्यापित योजना डेटा में नहीं मिली। कृपया आधिकारिक पोर्टल देखें।",
        "sources": "स्रोत",
        "s_eligible": "आप {name} के लिए पात्र प्रतीत होते हैं। {summary}",
        "s_likely": "आप {name} के लिए पात्र हो सकते हैं, पर हमें कुछ और जानकारी चाहिए: {missing}।",
        "s_not": "आप {name} के लिए पात्र नहीं हो सकते। कारण: {reasons}।",
    },
}

VALUE_HI = {
    "female": "महिला", "male": "पुरुष", "other": "अन्य", "rural": "ग्रामीण", "urban": "शहरी",
    "farmer": "किसान", "student": "विद्यार्थी", "street_vendor": "रेहड़ी-पटरी विक्रेता", "artisan": "कारीगर",
    "self_employed": "स्वरोज़गार", "entrepreneur": "उद्यमी", "post_matric": "कक्षा 10 के बाद",
    "graduate": "स्नातक", "postgraduate": "स्नातकोत्तर",
}

# (text if condition requires True, text if requires False) per language
BOOL_TEXT = {
    "owns_agricultural_land": {"en": ("Owns cultivable agricultural land", "Does not own agricultural land"),
                               "hi": ("खेती योग्य ज़मीन के मालिक हैं", "खेती की ज़मीन के मालिक नहीं हैं")},
    "is_student": {"en": ("Currently studying", "Not a student"), "hi": ("वर्तमान में पढ़ाई कर रहे हैं", "विद्यार्थी नहीं हैं")},
    "is_bpl": {"en": ("Belongs to a BPL / economically deprived household", "Not a BPL household"),
               "hi": ("बीपीएल / आर्थिक रूप से कमज़ोर परिवार से हैं", "बीपीएल परिवार से नहीं हैं")},
    "has_pucca_house": {"en": ("Owns a pucca (permanent) house", "Does not own a pucca (permanent) house"),
                        "hi": ("पक्का मकान है", "पक्का मकान नहीं है")},
    "has_bank_account": {"en": ("Has a bank account", "Does not have a bank account"),
                         "hi": ("बैंक खाता है", "बैंक खाता नहीं है")},
    "has_lpg_connection": {"en": ("Already has an LPG connection", "No existing LPG connection in the household"),
                           "hi": ("पहले से एलपीजी कनेक्शन है", "घर में पहले से एलपीजी कनेक्शन नहीं है")},
    "has_daughter_under_10": {"en": ("Has a daughter below 10 years", "No daughter below 10 years"),
                              "hi": ("10 वर्ष से कम की बेटी है", "10 वर्ष से कम की बेटी नहीं है")},
    "is_pregnant_or_lactating": {"en": ("Is pregnant or breastfeeding", "Is not pregnant or breastfeeding"),
                                 "hi": ("गर्भवती या स्तनपान कराने वाली माँ हैं", "गर्भवती/स्तनपान कराने वाली माँ नहीं हैं")},
    "is_income_tax_payer": {"en": ("Pays income tax", "Does not pay income tax"),
                            "hi": ("आयकर देते हैं", "आयकर नहीं देते")},
    "is_govt_employee": {"en": ("Is a government employee", "Is not a regular government employee"),
                         "hi": ("सरकारी कर्मचारी हैं", "नियमित सरकारी कर्मचारी नहीं हैं")},
    "has_disability": {"en": ("Has a disability", "Does not have a disability"),
                       "hi": ("दिव्यांगता है", "दिव्यांगता नहीं है")},
}

COND_TEXT = {
    "min_age": {"en": "Age {v} years or above", "hi": "आयु {v} वर्ष या अधिक"},
    "max_age": {"en": "Age {v} years or below", "hi": "आयु {v} वर्ष या कम"},
    "max_income": {"en": "Annual family income up to ₹{v}", "hi": "वार्षिक पारिवारिक आय ₹{v} तक"},
    "gender": {"en": "Gender: {v}", "hi": "लिंग: {v}"},
    "category": {"en": "Category: {v}", "hi": "श्रेणी: {v}"},
    "occupation": {"en": "Occupation: {v}", "hi": "व्यवसाय: {v}"},
    "residence": {"en": "Lives in a {v} area", "hi": "{v} क्षेत्र में रहते हैं"},
    "education_level": {"en": "Education level: {v}", "hi": "शिक्षा स्तर: {v}"},
}

FIELD_ASK = {  # human-friendly topics for "missing info"
    "min_age": {"en": "your age", "hi": "आपकी आयु"}, "max_age": {"en": "your age", "hi": "आपकी आयु"},
    "max_income": {"en": "your annual family income", "hi": "आपकी वार्षिक पारिवारिक आय"},
    "gender": {"en": "your gender", "hi": "आपका लिंग"},
    "category": {"en": "your category (General/OBC/SC/ST/EWS)", "hi": "आपकी श्रेणी"},
    "occupation": {"en": "your occupation", "hi": "आपका व्यवसाय"},
    "residence": {"en": "whether you live in a rural or urban area", "hi": "आप ग्रामीण या शहरी क्षेत्र में रहते हैं"},
    "education_level": {"en": "your education level", "hi": "आपका शिक्षा स्तर"},
}


def t(key: str, lang: str) -> str:
    return LABELS.get(lang, LABELS["en"]).get(key) or LABELS["en"][key]


def _val(v, lang):
    vals = v if isinstance(v, list) else [v]
    out = [(VALUE_HI.get(str(x), str(x)) if lang == "hi" else str(x).replace("_", " ")) for x in vals]
    return " / ".join(out)


def describe_condition(key: str, value, lang: str = "en") -> str:
    lg = "hi" if lang == "hi" else "en"
    if key in BOOL_TEXT:
        return BOOL_TEXT[key][lg][0 if value else 1]
    if key == "max_income":
        return COND_TEXT[key][lg].format(v=f"{int(value):,}")
    if key in COND_TEXT:
        return COND_TEXT[key][lg].format(v=value if isinstance(value, int) else _val(value, lg))
    return f"{key}: {value}"


def ask_topic(key: str, lang: str = "en") -> str:
    lg = "hi" if lang == "hi" else "en"
    if key in FIELD_ASK:
        return FIELD_ASK[key][lg]
    if key in BOOL_TEXT:
        return BOOL_TEXT[key][lg][0].lower() if lg == "en" else BOOL_TEXT[key][lg][0]
    return key
