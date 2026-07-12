import os
import json
os.environ.setdefault("ANONYMIZED_TELEMETRY", "False")
os.environ.setdefault("CHROMA_TELEMETRY", "False")

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import jwt
from jwt import PyJWKClient

from src.config import CLERK_JWKS_URL, FRONTEND_URL
from src.chain import stream_chain

app = FastAPI(title="Ghana Legal RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
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
    except Exception as exc:
        raise HTTPException(status_code=401, detail=str(exc))


class HistoryMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    question: str
    history: list[HistoryMessage] = []


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(body: ChatRequest, _user: dict = Depends(verify_clerk_token)):
    history = [{"role": m.role, "content": m.content} for m in body.history]

    def generate():
        try:
            for event in stream_chain(body.question, history):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
