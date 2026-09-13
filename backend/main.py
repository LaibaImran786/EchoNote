import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import db
from structure import structure_transcript, StructuringError

load_dotenv()

app = FastAPI(title="EchoNote API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://echo-note-eight.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    db.init_db()


class NewEntry(BaseModel):
    transcript: str


class UpdateEntry(BaseModel):
    transcript: str


def get_or_create_user_id(
    request: Request,
    response: Response,
) -> str:
    """
    Get the private browser session ID.

    If the browser does not have one, create a new UUID.
    """

    user_id = request.cookies.get("echonote_session")

    if not user_id:
        user_id = str(uuid.uuid4())

        response.set_cookie(
            key="echonote_session",
            value=user_id,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=60 * 60 * 24 * 365,
        )

    return user_id


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "hasApiKey": bool(
            os.environ.get("GEMINI_API_KEY")
        ),
    }


@app.get("/api/entries")
def list_entries(
    request: Request,
    response: Response,
):
    user_id = get_or_create_user_id(
        request,
        response,
    )

    return db.get_all_entries(user_id)


@app.post("/api/entries", status_code=201)
def create_entry(
    payload: NewEntry,
    request: Request,
    response: Response,
):
    transcript = (payload.transcript or "").strip()

    if not transcript:
        raise HTTPException(
            status_code=400,
            detail="transcript is required",
        )

    user_id = get_or_create_user_id(
        request,
        response,
    )

    try:
        structured = structure_transcript(
            transcript
        )

    except StructuringError:
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
        "userId": user_id,
        "createdAt": datetime.now(
            timezone.utc
        ).isoformat(),
        "transcript": transcript,
        "mood": structured.get("mood")
        or "neutral",
        "energy": structured.get("energy")
        or "medium",
        "tags": structured.get("tags") or [],
        "tasks": structured.get("tasks") or [],
        "people": structured.get("people") or [],
        "summary": structured.get("summary")
        or "",
        "highlight": structured.get("highlight")
        or "",
    }

    db.add_entry(entry)

    return entry


@app.put("/api/entries/{entry_id}")
def update_entry(
    entry_id: str,
    payload: UpdateEntry,
    request: Request,
):
    transcript = (
        payload.transcript or ""
    ).strip()

    if not transcript:
        raise HTTPException(
            status_code=400,
            detail="transcript is required",
        )

    user_id = request.cookies.get(
        "echonote_session"
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Session not found",
        )

    updated_entry = db.update_entry(
        entry_id,
        user_id,
        transcript,
    )

    if updated_entry is None:
        raise HTTPException(
            status_code=404,
            detail="Entry not found",
        )

    return updated_entry


@app.delete("/api/entries/{entry_id}")
def delete_entry(
    entry_id: str,
    request: Request,
):
    user_id = request.cookies.get(
        "echonote_session"
    )

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Session not found",
        )

    return db.delete_entry(
        entry_id,
        user_id,
    )


if __name__ == "__main__":
    import uvicorn

    port = int(
        os.environ.get("PORT", 4000)
    )

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )