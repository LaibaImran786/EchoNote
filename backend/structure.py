"""Use Gemini to turn a raw voice-journal transcript into structured memory."""
import json
import os
import re
from google import genai

SYSTEM_PROMPT = """You turn a rambling spoken journal entry into structured memory.
Given the raw transcript, extract:
- mood: one or two words for the overall emotional tone (e.g. calm, anxious, hopeful)
- energy: low, medium, or high
- tags: 3-5 short topic tags
- tasks: array of concrete action items or to-dos mentioned
- people: array of names of people mentioned
- summary: one warm, plain sentence capturing the gist, written as a short caption
- highlight: the single most notable or emotionally significant moment, one short sentence

Return ONLY a JSON object with exactly these keys:
mood, energy, tags, tasks, people, summary, highlight.
No markdown fences, preamble, or explanation."""

class StructuringError(Exception):
    pass


def structure_transcript(transcript: str) -> dict:
    """Structure a transcript with Gemini when configured.

    If Gemini is unavailable, return safe defaults so the core journal
    feature can still save the user's transcript to SQLite.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {
            "mood": "neutral",
            "energy": "medium",
            "tags": ["journal"],
            "tasks": [],
            "people": [],
            "summary": transcript[:160],
            "highlight": "",
        }

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{SYSTEM_PROMPT}\n\nRaw transcript:\n{transcript}",
            config={"response_mime_type": "application/json"},
        )
        text = (response.text or "").strip()
        clean = re.sub(r"```json|```", "", text).strip()
        data = json.loads(clean)

        # Keep the database shape predictable even if the model omits a field.
        return {
            "mood": data.get("mood") or "neutral",
            "energy": data.get("energy") or "medium",
            "tags": data.get("tags") or ["journal"],
            "tasks": data.get("tasks") or [],
            "people": data.get("people") or [],
            "summary": data.get("summary") or transcript[:160],
            "highlight": data.get("highlight") or "",
        }
    except json.JSONDecodeError as e:
        raise StructuringError(f"Gemini returned invalid JSON: {text}") from e
    except Exception as e:
        raise StructuringError(f"Gemini API error: {str(e)}") from e
