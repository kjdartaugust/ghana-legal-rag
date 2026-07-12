from typing import Iterator
from src.safety import safety_check
from src.retrieve import load_retriever, retrieve_context
from src.generate import generate_answer, stream_answer
from src.skills import classify_intent, handle_skill, INTENT_LABELS

retriever = load_retriever()


def run_chain(question: str, history: list[dict] | None = None) -> str:
    safe_response = safety_check(question)
    if safe_response:
        return safe_response

    intent = classify_intent(question)
    skill_response = handle_skill(intent)
    if skill_response:
        return skill_response

    context = retrieve_context(question, retriever)
    return generate_answer(question, context, history)


def stream_chain(question: str, history: list[dict] | None = None) -> Iterator[dict]:
    safe_response = safety_check(question)
    if safe_response:
        yield {"meta": {"intent": "safety", "label": INTENT_LABELS["safety"]}}
        yield {"token": safe_response}
        return

    intent = classify_intent(question)
    yield {"meta": {"intent": intent, "label": INTENT_LABELS.get(intent, "Legal Knowledge Base")}}

    skill_response = handle_skill(intent)
    if skill_response:
        yield {"token": skill_response}
        return

    context = retrieve_context(question, retriever)
    for token in stream_answer(question, context, history):
        yield {"token": token}
