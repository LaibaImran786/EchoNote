import React from "react";
import { moodColor, formatDate, formatTime } from "../utils.js";
import { styles } from "../styles.js";

export default function DailyCard({ entry, onDelete }) {
  const color = moodColor(entry.mood);
  return (
    <div style={{ ...styles.card, borderLeftColor: color }}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.cardDate}>{formatDate(entry.createdAt)}</div>
          <div style={styles.cardTime}>{formatTime(entry.createdAt)}</div>
        </div>
        <div style={{ ...styles.moodPill, background: color + "26", color }}>
          {entry.mood || "neutral"}
        </div>
      </div>

      <p style={styles.cardSummary}>{entry.summary}</p>

      {entry.highlight ? (
        <p style={styles.cardHighlight}>&ldquo;{entry.highlight}&rdquo;</p>
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
          <div style={styles.sectionLabel}>Tasks</div>
          <ul style={styles.list}>
            {entry.tasks.map((t, i) => (
              <li key={i} style={styles.listItem}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {entry.people && entry.people.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionLabel}>People</div>
          <div style={styles.tagRow}>
            {entry.people.map((p, i) => (
              <span key={i} style={styles.personTag}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={styles.cardFooter}>
        <details style={styles.transcriptDetails}>
          <summary style={styles.transcriptSummary}>Full transcript</summary>
          <p style={styles.transcriptText}>{entry.transcript}</p>
        </details>
        <button onClick={() => onDelete(entry.id)} style={styles.deleteBtn}>
          Delete
        </button>
      </div>
    </div>
  );
}
