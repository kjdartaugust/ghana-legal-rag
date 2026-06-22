import httpx
from src.config import OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_API_URL

# generate.py writes the answer
def generate_answer(question: str, context: str) -> str:
    """
    Generates a grounded answer using the retrieved context.
    Context comes from retrieve.py — not from a static skill file.
    The LLM is instructed to answer ONLY from the context provided.
    """

    # Build the prompt — context is injected here, not a skill file
    prompt = f"""You are a Ghana Legal Information Assistant. You provide accurate, \
plain-language information about Ghanaian law based strictly on the retrieved \
legal documents below. You are not a lawyer and this is not legal advice.

Retrieved context:
{context}

User question: {question}

Instructions:
- Answer using ONLY the information in the retrieved context above.
- Where the context includes a section number or Act name, cite it explicitly \
(e.g. "Section 14(1) of the 1992 Constitution" or "Section 52 of the Labour Act, 2003 (Act 651)").
- Keep your answer concise — no more than 4 sentences.
- If the context does not contain relevant information to answer the question, \
respond only with: "I don't have enough information on that topic in the available \
documents. Please consult a qualified legal professional or contact the Ghana Legal \
Aid Commission on 0302 664 951."
- Always end your answer on its own line with exactly: "Source: [document name]" (put a blank line before it)
- Reminder: This response is for informational purposes only and does not \
constitute legal advice."""

    # Build the messages array for the chat completions API
    messages = [
        {"role": "user", "content": prompt}
    ]

    # Send the request to OpenRouter
    response = httpx.post(
        OPENROUTER_API_URL,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": OPENROUTER_MODEL,
            "messages": messages,
            "max_tokens": 300,
        },
        timeout=30,
        verify=False,
    )

    # Raise an error if the request failed
    response.raise_for_status()

    # Extract and return the answer text
    return response.json()["choices"][0]["message"]["content"].strip()