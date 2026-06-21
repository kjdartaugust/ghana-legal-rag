from langchain_chroma import Chroma
from src.config import VECTORSTORE_PATH, TOP_K_CHUNKS
from src.embeddings import HttpxEmbeddings

# retrieve.py finds relevant chunks
def load_retriever():
    """
    Loads the saved ChromaDB vector store and returns a retriever.
    Called once at startup in chain.py — not on every question.
    """

    embeddings = HttpxEmbeddings()

    # Load the existing vector store from disk
    vectorstore = Chroma(
        persist_directory=VECTORSTORE_PATH,
        embedding_function=embeddings,
    )

    # Return a retriever that fetches top-k most similar chunks
    return vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": TOP_K_CHUNKS},
    )


def retrieve_context(question: str, retriever) -> str:
    """
    Given a question, fetches the most relevant chunks from the vector store.
    Returns a formatted string ready to be injected into the prompt.
    Each chunk is labeled with its source document for citation.
    """

    # Fetch the top-k most relevant document chunks
    docs = retriever.invoke(question)

    # Format each chunk with its source document name
    parts = []
    for doc in docs:
        source = doc.metadata.get("source", "Unknown")
        parts.append(f"[{source}]\n{doc.page_content}")

    # Join chunks with a separator for clarity in the prompt
    return "\n\n---\n\n".join(parts)