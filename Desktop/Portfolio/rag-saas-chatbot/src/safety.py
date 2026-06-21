# safety.py blocks risky questions, 
REPRESENTATION_KEYWORDS = [
    "represent me",
    "be my lawyer",
    "be my attorney",
    "represent me in court",
    "file on my behalf",
    "draft my contract",
    "draft a contract for me",
    "write my will",
    "draft my will",
    "draft a deed",
    "prepare a legal document for me",
    "sign on my behalf",
    "act as my counsel",
]

# Phrases indicating a real-time legal crisis where a human is needed immediately.
# Using full phrases rather than single words to avoid false positives
# (e.g. "I need a lawyer's explanation" must not trigger this).
EMERGENCY_KEYWORDS = [
    "i have been arrested",
    "i am being arrested",
    "they are arresting me",
    "i am in police custody",
    "i am detained",
    "i am being detained",
    "they are detaining me",
    "police are here",
    "police are at my door",
    "i need a lawyer right now",
    "i need legal help right now",
]


def safety_check(question: str) -> str | None:
    """
    Runs before RAG and generation on every question.
    Returns a safety response string if the question is flagged.
    Returns None if the question is safe to proceed.
    """
    q = question.lower()

    # Check for real-time legal emergency first — highest priority
    for keyword in EMERGENCY_KEYWORDS:
        if keyword in q:
            return (
                "This sounds like an urgent legal situation requiring immediate help. "
                "Please call the Ghana Police Service on 191 or the Ghana Legal Aid "
                "Commission on 0302 664 951 right away. Do not rely on a chatbot "
                "in a live emergency — contact a qualified legal professional immediately."
            )

    # Check for requests to act as legal counsel or draft binding documents
    for keyword in REPRESENTATION_KEYWORDS:
        if keyword in q:
            return (
                "I'm not able to represent you, act as your lawyer, or draft binding "
                "legal documents on your behalf. I provide legal information only, "
                "which is not the same as legal advice. For representation or document "
                "preparation, please contact the Ghana Legal Aid Commission "
                "(0302 664 951) or a licensed legal practitioner."
            )

    # Question is safe — return None to continue to RAG
    return None
