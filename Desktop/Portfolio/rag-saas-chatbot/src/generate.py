import httpx
import json
from typing import Iterator
from src.config import OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_API_URL

_SYSTEM = """\
You are a Ghana Legal Information Assistant. You provide accurate, \
plain-language information about Ghanaian law based strictly on the \
retrieved legal documents provided with each question. You are not a \
lawyer and this is not legal advice.

Instructions:
- Answer using ONLY the information in the retrieved context.
- Cite section numbers and Act names explicitly \
(e.g. "Section 20 of the Labour Act 2003 (Act 651)").
- Keep your answer concise — no more than 4 sentences.
- If the context does not contain relevant information, respond only with: \
"I don't have enough information on that topic in the available documents. \
Please consult a qualified legal professional or contact the Ghana Legal \
Aid Commission on 0302 664 951."
- Always end your answer with exactly (on its own line, preceded by a blank line): \
"Source: [document name]"
- This response is for informational purposes only and does not constitute \
legal advice."""


def _build_messages(question: str, context: str, history: list[dict]) -> list[dict]:
    messages: list[dict] = [{"role": "system", "content": _SYSTEM}]

    # Last 6 messages = 3 prior exchanges for multi-turn context
    for msg in history[-6:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({
        "role": "user",
        "content": f"Retrieved context:\n{context}\n\nQuestion: {question}",
    })
    return messages


def generate_answer(question: str, context: str, history: list[dict] | None = None) -> str:
    messages = _build_messages(question, context, history or [])
    response = httpx.post(
        OPENROUTER_API_URL,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={"model": OPENROUTER_MODEL, "messages": messages, "max_tokens": 300},
        timeout=30,
        verify=False,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()


def stream_answer(question: str, context: str, history: list[dict] | None = None) -> Iterator[str]:
    messages = _build_messages(question, context, history or [])
    with httpx.stream(
        "POST",
        OPENROUTER_API_URL,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={"model": OPENROUTER_MODEL, "messages": messages, "max_tokens": 300, "stream": True},
        timeout=60,
        verify=False,
    ) as resp:
        resp.raise_for_status()
        for line in resp.iter_lines():
            if not line.startswith("data: "):
                continue
            payload = line[6:].strip()
            if payload == "[DONE]":
                break
            try:
                chunk = json.loads(payload)
                delta = chunk["choices"][0]["delta"].get("content") or ""
                if delta:
                    yield delta
            except (json.JSONDecodeError, KeyError, IndexError):
                continue
