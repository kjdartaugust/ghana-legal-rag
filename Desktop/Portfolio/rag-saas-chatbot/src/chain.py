from src.safety import safety_check
from src.retrieve import load_retriever, retrieve_context
from src.generate import generate_answer

#  chain.py connects them all in order

# Load the retriever once at startup — not on every question
retriever = load_retriever()


def run_chain(question: str) -> str:
    """
    The main pipeline — connects everything in the correct order:
    1. Safety check first — blocks emergencies and medication requests
    2. Retrieve relevant chunks from the vector store
    3. Generate a grounded answer using the retrieved context
    """

    # Step 1 — Safety always runs first, before RAG
    safe_response = safety_check(question)
    if safe_response:
        return safe_response

    # Step 2 — Retrieve the most relevant chunks for this question
    context = retrieve_context(question, retriever)

    # Step 3 — Generate and return a grounded answer
    return generate_answer(question, context)