import os
os.environ.setdefault("ANONYMIZED_TELEMETRY", "False")
os.environ.setdefault("CHROMA_TELEMETRY", "False")

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt
from jwt import PyJWKClient

from src.config import CLERK_JWKS_URL, FRONTEND_URL
from src.chain import run_chain  # loads retriever at startup

app = FastAPI(title="Ghana Legal RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

_jwks_client: PyJWKClient | None = None
if CLERK_JWKS_URL:
    _jwks_client = PyJWKClient(CLERK_JWKS_URL)


def verify_clerk_token(authorization: str = Header(...)) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    if _jwks_client is None:
        raise HTTPException(status_code=500, detail="CLERK_JWKS_URL not configured")
    token = authorization[7:]
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        return jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail=str(exc))


class ChatRequest(BaseModel):
    question: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(body: ChatRequest, _user: dict = Depends(verify_clerk_token)):
    answer = run_chain(body.question)
    return {"answer": answer}
