import React, { useEffect, useState } from "react";
import { moodColor, formatDate, formatTime } from "../utils.js";
import { styles } from "../styles.js";

export default function DailyCard({ entry, onDelete, onUpdate }) {
  const color = moodColor(entry.mood);

  const [isEditing, setIsEditing] = useState(false);
  const [transcript, setTranscript] = useState(
    entry.transcript || ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTranscript(entry.transcript || "");
  }, [entry.transcript]);

  async function handleSave() {
    const cleanedTranscript = transcript.trim();

    if (!cleanedTranscript) {
      setError("Transcript cannot be empty.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (!onUpdate) {
        throw new Error("Update function is not available.");
      }

      const updatedEntry = await onUpdate(
        entry.id,
        cleanedTranscript
      );

      setTranscript(updatedEntry.transcript);
      setIsEditing(false);
    } catch (err) {
      setError(
        err.message || "Could not save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setTranscript(entry.transcript || "");
    setError("");
    setIsEditing(false);
  }

  return (
    <div
      style={{
        ...styles.card,
        borderLeftColor: color,
      }}
    >
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.cardDate}>
            {formatDate(entry.createdAt)}
          </div>

          <div style={styles.cardTime}>
            {formatTime(entry.createdAt)}
          </div>
        </div>

        <div
          style={{
            ...styles.moodPill,
            background: color + "26",
            color,
          }}
        >
          {entry.mood || "neutral"}
        </div>
      </div>

      <p style={styles.cardSummary}>
        {entry.summary}
      </p>

      {entry.highlight ? (
        <p style={styles.cardHighlight}>
          &ldquo;{entry.highlight}&rdquo;
        </p>
      ) : null}

      {entry.tags && entry.tags.length > 0 ? (
        <div style={styles.tagRow}>
          {entry.tags.map((t, i) => (
            <span key={i} style={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {entry.tasks && entry.tasks.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            Tasks
          </div>

          <ul style={styles.list}>
            {entry.tasks.map((t, i) => (
              <li
                key={i}
                style={styles.listItem}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {entry.people && entry.people.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionLabel}>
            People
          </div>

          <div style={styles.tagRow}>
            {entry.people.map((p, i) => (
              <span
                key={i}
                style={styles.personTag}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={styles.cardFooter}>
        <details style={styles.transcriptDetails}>
          <summary style={styles.transcriptSummary}>
            Full transcript
          </summary>

          {isEditing ? (
            <div>
              <textarea
                value={transcript}
                onChange={(e) =>
                  setTranscript(e.target.value)
                }
                style={{
                  ...styles.transcriptText,
                  width: "100%",
                  minHeight: "140px",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                autoFocus
              />

              {error ? (
                <p
                  style={{
                    margin: "8px 0",
                    fontSize: "13px",
                    color: "#d32f2f",
                  }}
                >
                  {error}
                </p>
              ) : null}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={styles.editBtn}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={saving}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p style={styles.transcriptText}>
              {transcript}
            </p>
          )}
        </details>

        {!isEditing && (
          <button
            onClick={() => {
              setError("");
              setIsEditing(true);
            }}
            style={styles.editBtn}
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(entry.id)}
          style={styles.deleteBtn}
        >
          Delete
        </button>
      </div>
    </div>
  );
}