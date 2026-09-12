import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import db
from structure import structure_transcript, StructuringError

load_dotenv()

app = FastAPI(title="EchoNote API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    db.init_db()


class NewEntry(BaseModel):
    transcript: str


@app.get("/api/health")
def health():
    return {"ok": True, "hasApiKey": bool(os.environ.get("GEMINI_API_KEY"))}


@app.get("/api/entries")
def list_entries():
    return db.get_all_entries()


@app.post("/api/entries", status_code=201)
def create_entry(payload: NewEntry):
    transcript = (payload.transcript or "").strip()
    if not transcript:
        raise HTTPException(status_code=400, detail="transcript is required")

    try:
        structured = structure_transcript(transcript)
    except StructuringError:
        # The transcript is the user's actual memory. Never discard it just
        # because the optional AI structuring service failed.
        structured = {
            "mood": "neutral",
            "energy": "medium",
            "tags": ["journal"],
            "tasks": [],
            "people": [],
            "summary": transcript[:160],
            "highlight": "",
        }

    entry = {
        "id": str(uuid.uuid4()),
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "transcript": transcript,
        "mood": structured.get("mood") or "neutral",
        "energy": structured.get("energy") or "medium",
        "tags": structured.get("tags") or [],
        "tasks": structured.get("tasks") or [],
        "people": structured.get("people") or [],
        "summary": structured.get("summary") or "",
        "highlight": structured.get("highlight") or "",
    }
    db.add_entry(entry)
    return entry


@app.delete("/api/entries/{entry_id}")
def delete_entry(entry_id: str):
    return db.delete_entry(entry_id)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 4000))
    uvicorn.run("main:app", host="0.0.0.0", port=port) 
    # uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
