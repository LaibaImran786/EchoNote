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
        # Create the table if it doesn't exist
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS entries (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                transcript TEXT NOT NULL,
                mood TEXT,
                energy TEXT,
                tags TEXT,
                tasks TEXT,
                people TEXT,
                summary TEXT,
                highlight TEXT
            )
            """
        )

        # If an older database already exists, add user_id to it.
        columns = [
            row["name"]
            for row in conn.execute("PRAGMA table_info(entries)").fetchall()
        ]

        if "user_id" not in columns:
            conn.execute(
                "ALTER TABLE entries ADD COLUMN user_id TEXT NOT NULL DEFAULT ''"
            )

        conn.commit()
    finally:
        conn.close()


def _row_to_entry(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "userId": row["user_id"],
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


def get_all_entries(user_id: str) -> list[dict[str, Any]]:
    """
    Return only entries belonging to the current user.
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            """
            SELECT *
            FROM entries
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,),
        ).fetchall()

        return [_row_to_entry(row) for row in rows]
    finally:
        conn.close()


def add_entry(entry: dict[str, Any]) -> dict[str, Any]:
    """
    Save a new entry for the current user.
    """
    conn = get_connection()
    try:
        conn.execute(
            """
            INSERT INTO entries
                (
                    id,
                    user_id,
                    created_at,
                    transcript,
                    mood,
                    energy,
                    tags,
                    tasks,
                    people,
                    summary,
                    highlight
                )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                entry["id"],
                entry["userId"],
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


def update_entry(
    entry_id: str,
    user_id: str,
    transcript: str,
) -> dict[str, Any] | None:
    """
    Update the transcript of an entry only if it belongs to the current user.
    """
    conn = get_connection()
    try:
        conn.execute(
            """
            UPDATE entries
            SET transcript = ?
            WHERE id = ? AND user_id = ?
            """,
            (transcript, entry_id, user_id),
        )

        conn.commit()

        row = conn.execute(
            """
            SELECT *
            FROM entries
            WHERE id = ? AND user_id = ?
            """,
            (entry_id, user_id),
        ).fetchone()

        if row is None:
            return None

        return _row_to_entry(row)
    finally:
        conn.close()


def delete_entry(entry_id: str, user_id: str) -> list[dict[str, Any]]:
    """
    Delete an entry only if it belongs to the current user.
    """
    conn = get_connection()
    try:
        conn.execute(
            """
            DELETE FROM entries
            WHERE id = ? AND user_id = ?
            """,
            (entry_id, user_id),
        )

        conn.commit()
    finally:
        conn.close()

    return get_all_entries(user_id)