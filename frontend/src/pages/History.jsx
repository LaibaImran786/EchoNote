import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEntries } from "../EntriesContext.jsx";
import DailyCard from "../components/DailyCard.jsx";
import Header from "../components/Header.jsx";
import { styles } from "../styles.js";

export default function History() {
  const { entries, loadingHistory, deleteJournalEntry } = useEntries();
  const [query, setQuery] = useState("");
  const [activeMood, setActiveMood] = useState("all");

  const moods = useMemo(() => {
    const set = new Set(entries.map((e) => (e.mood || "neutral").toLowerCase()));
    return ["all", ...Array.from(set)];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesMood =
        activeMood === "all" || (entry.mood || "neutral").toLowerCase() === activeMood;
      if (!matchesMood) return false;
      if (!q) return true;
      const haystack = [
        entry.transcript,
        entry.summary,
        entry.highlight,
        ...(entry.tags || []),
        ...(entry.people || []),
        ...(entry.tasks || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query, activeMood]);

  return (
    <div style={styles.page}>
      <Header
        eyebrow="Archive"
        title="Your days"
        subtitle={`${entries.length} ${entries.length === 1 ? "entry" : "entries"} recorded so far.`}
      />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search transcripts, tasks, people…"
        style={styles.searchBar}
      />

      {moods.length > 2 && (
        <div style={styles.filterRow}>
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMood(m)}
              style={{
                ...styles.filterChip,
                ...(activeMood === m ? styles.filterChipActive : {}),
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {loadingHistory && <p style={styles.emptyState}>Loading your entries…</p>}

      {!loadingHistory && entries.length === 0 && (
        <p style={styles.emptyState}>
          No entries yet. <Link to="/" style={styles.linkInline}>Record your first one</Link>.
        </p>
      )}

      {!loadingHistory && entries.length > 0 && (
        <p style={styles.resultsMeta}>
          Showing {filtered.length} of {entries.length}
        </p>
      )}

      {!loadingHistory && entries.length > 0 && filtered.length === 0 && (
        <p style={styles.emptyState}>Nothing matches that search. Try a different word or mood.</p>
      )}

      <div style={styles.historySection}>
        {filtered.map((entry) => (
          <DailyCard key={entry.id} entry={entry} onDelete={deleteJournalEntry} />
        ))}
      </div>
    </div>
  );
}
