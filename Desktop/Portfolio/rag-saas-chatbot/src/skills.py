from typing import Optional

LEGAL_AID_RESPONSE = """\
**Ghana Legal Aid Commission**
• National hotline: **0302 664 951**
• Available Monday–Friday, 8am–5pm
• Offices in all 16 regional capitals — free legal services for those who cannot afford a lawyer.

**Ghana Bar Association**
• Tel: **0302 221440 / 0302 221441**
• Can refer you to a licensed private lawyer in your area.

**University Law Clinics** (free consultations)
• University of Ghana School of Law
• KNUST Faculty of Law

⚠️ For urgent legal situations, call the Ghana Police on **191** or Legal Aid on **0302 664 951**.

Source: Ghana Legal Aid Commission"""

TEMPLATE_RESPONSE = """\
Here are the key elements required for common legal documents under Ghanaian law:

**Employment Contract** — parties' details, job title, start date, salary, working hours, leave entitlements, and notice period (Labour Act 2003, Act 651, Section 17).

**Tenancy Agreement** — landlord and tenant details, property address, rent amount, payment frequency, duration, and conditions for termination.

**Business Partnership / Company** — partners' names, capital contributions, profit-sharing ratio, and dissolution terms. A private company requires at least one shareholder and one director registered at the Registrar General's Department (Companies Act 2019, Act 992).

⚠️ For legally binding documents, always use a licensed lawyer. Contact the Ghana Bar Association at **0302 221440** for a referral.

Source: Labour Act 2003, Companies Act 2019"""

_FIND_HELP_TRIGGERS = [
    "find a lawyer", "find lawyer", "need a lawyer", "legal aid",
    "legal assistance", "legal help", "hire a lawyer", "get a lawyer",
    "recommend a lawyer", "legal representation", "law firm",
    "solicitor", "attorney",
]

_TEMPLATE_TRIGGERS = [
    "template", "draft a", "write a contract", "sample contract",
    "letter template", "employment contract template",
    "tenancy agreement", "legal document template", "what goes in",
]

INTENT_LABELS = {
    "rag": "Legal Knowledge Base",
    "find_help": "Legal Aid Directory",
    "template": "Document Templates",
    "safety": "Safety Check",
}


def classify_intent(question: str) -> str:
    q = question.lower()
    for t in _FIND_HELP_TRIGGERS:
        if t in q:
            return "find_help"
    for t in _TEMPLATE_TRIGGERS:
        if t in q:
            return "template"
    return "rag"


def handle_skill(intent: str) -> Optional[str]:
    if intent == "find_help":
        return LEGAL_AID_RESPONSE
    if intent == "template":
        return TEMPLATE_RESPONSE
    return None
