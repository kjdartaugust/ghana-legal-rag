import os
import shutil

os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["CHROMA_TELEMETRY"] = "False"

DATA_DIR = "./data"

# ingest.py reads PDFs and stores them

def _extract_page(page):
    from concurrent.futures import ThreadPoolExecutor, TimeoutError
    with ThreadPoolExecutor(max_workers=1) as ex:
        future = ex.submit(page.extract_text)
        try:
            return future.result(timeout=10) or ""
        except (TimeoutError, Exception):
            return ""


def _load_pdf(filepath: str):
    from pypdf import PdfReader
    from langchain_core.documents import Document
    print(f"  Opening {os.path.basename(filepath)}...", flush=True)
    reader = PdfReader(filepath, strict=False)
    print(f"  {len(reader.pages)} pages...", flush=True)
    docs = []
    for i, page in enumerate(reader.pages):
        if i % 50 == 0:
            print(f"  Page {i + 1}/{len(reader.pages)}", flush=True)
        text = _extract_page(page)
        if text.strip():
            docs.append(Document(
                page_content=text,
                metadata={"source": os.path.basename(filepath), "page": i + 1},
            ))
    return docs


def load_documents():
    from langchain_community.document_loaders import TextLoader
    docs = []
    for filename in os.listdir(DATA_DIR):
        filepath = os.path.join(DATA_DIR, filename)
        if filename.endswith(".pdf"):
            docs.extend(_load_pdf(filepath))
        elif filename.endswith(".txt") or filename.endswith(".md"):
            loader = TextLoader(filepath, encoding="utf-8")
            docs.extend(loader.load())
        else:
            print(f"Skipping: {filename}", flush=True)
            continue
        print(f"Loaded: {filename}", flush=True)
    return docs


def ingest():
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_chroma import Chroma
    from src.config import VECTORSTORE_PATH
    from src.embeddings import HttpxEmbeddings

    if os.path.exists(VECTORSTORE_PATH):
        shutil.rmtree(VECTORSTORE_PATH)
        print("Cleared existing vector store.", flush=True)

    print("Loading documents...", flush=True)
    documents = load_documents()

    if not documents:
        print("No documents found in data/.")
        return

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
    chunks = splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.", flush=True)

    embeddings = HttpxEmbeddings()

    print("Embedding and saving to vector store...", flush=True)
    Chroma.from_documents(chunks, embeddings, persist_directory=VECTORSTORE_PATH)

    print(f"Done — vector store saved to {VECTORSTORE_PATH}")


if __name__ == "__main__":
    ingest()
