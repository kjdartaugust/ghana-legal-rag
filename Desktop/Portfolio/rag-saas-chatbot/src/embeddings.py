import httpx
from langchain_core.embeddings import Embeddings
from src.config import OPENROUTER_API_KEY, EMBEDDING_MODEL

EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings"


class HttpxEmbeddings(Embeddings):
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        results = []
        for i in range(0, len(texts), 512):
            batch = texts[i : i + 512]
            response = httpx.post(
                EMBEDDINGS_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={"model": EMBEDDING_MODEL, "input": batch},
                timeout=60,
                verify=False,
            )
            response.raise_for_status()
            body = response.json()
            if "data" not in body:
                raise ValueError(f"Embedding API error: {body}")
            data = sorted(body["data"], key=lambda x: x["index"])
            results.extend(item["embedding"] for item in data)
        return results

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]
