import os
from dotenv import load_dotenv

load_dotenv()

# OpenRouter settings
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "mistralai/mistral-7b-instruct:free")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# RAG settings
VECTORSTORE_PATH = "./vectorstore"
EMBEDDING_MODEL = "text-embedding-3-small"
TOP_K_CHUNKS = 3

# Auth / deployment
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")