"""
Tiny SQLite data-access layer for EchoNote entries.
No ORM, no native deps beyond the Python standard library — easy to run anywhere.
"""

import json
import sqlite3
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).parent / "echonote.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_connection()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS entries (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                transcript TEXT NOT NULL,
                mood TEXT,
                energy TEXT,
                tags TEXT,      -- JSON array
                tasks TEXT,     -- JSON array
                people TEXT,    -- JSON array
                summary TEXT,
                highlight TEXT
            )
            """
        )
        conn.commit()
    finally:
        conn.close()


def _row_to_entry(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "createdAt": row["created_at"],
        "transcript": row["transcript"],
        "mood": row["mood"],
        "energy": row["energy"],
        "tags": json.loads(row["tags"] or "[]"),
        "tasks": json.loads(row["tasks"] or "[]"),
        "people": json.loads(row["people"] or "[]"),
        "summary": row["summary"],
        "highlight": row["highlight"],
    }


def get_all_entries() -> list[dict[str, Any]]:
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM entries ORDER BY created_at DESC"
        ).fetchall()
        return [_row_to_entry(r) for r in rows]
    finally:
        conn.close()


def add_entry(entry: dict[str, Any]) -> dict[str, Any]:
    conn = get_connection()
    try:
        conn.execute(
            """
            INSERT INTO entries
                (id, created_at, transcript, mood, energy, tags, tasks, people, summary, highlight)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                entry["id"],
                entry["createdAt"],
                entry["transcript"],
                entry["mood"],
                entry["energy"],
                json.dumps(entry["tags"]),
                json.dumps(entry["tasks"]),
                json.dumps(entry["people"]),
                entry["summary"],
                entry["highlight"],
            ),
        )
        conn.commit()
        return entry
    finally:
        conn.close()


def delete_entry(entry_id: str) -> list[dict[str, Any]]:
    conn = get_connection()
    try:
        conn.execute("DELETE FROM entries WHERE id = ?", (entry_id,))
        conn.commit()
    finally:
        conn.close()
    return get_all_entries()
