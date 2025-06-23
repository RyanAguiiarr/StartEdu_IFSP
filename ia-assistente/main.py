# Arquivo principal FastAPI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_agent import process_question

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Para produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    user_id: str
    question: str

@app.post("/ask")
def ask_ia(query: Query):
    resposta = process_question(query.user_id, query.question)
    return {"response": resposta}