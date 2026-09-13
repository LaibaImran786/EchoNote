import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  fetchEntries,
  createEntry,
  removeEntry,
  updateEntry,
  checkHealth,
} from "./api.js";

const EntriesContext = createContext(null);

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [backendWarning, setBackendWarning] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const health = await checkHealth();

        if (!health.hasApiKey) {
          setBackendWarning(
            "Gemini is not configured. Your voice notes will still be saved; add GEMINI_API_KEY to enable automatic mood, tags, tasks and summaries."
          );
        }
      } catch {
        setBackendWarning(
          "Can't reach the backend. Please check that the Render backend is running."
        );
      }

      try {
        const data = await fetchEntries();
        setEntries(data);
      } catch {
        // Health message already explains the likely issue.
      } finally {
        setLoadingHistory(false);
      }
    })();
  }, []);

  const createJournalEntry = async (transcript) => {
    const entry = await createEntry({
      transcript,
    });

    setEntries((prev) => [entry, ...prev]);

    return entry;
  };

  const updateJournalEntry = async (id, transcript) => {
    const updatedEntry = await updateEntry(id, transcript);

    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? updatedEntry : entry
      )
    );

    return updatedEntry;
  };

  const deleteJournalEntry = async (id) => {
    const previousEntries = entries;

    setEntries((current) =>
      current.filter((entry) => entry.id !== id)
    );

    try {
      await removeEntry(id);
    } catch (error) {
      setEntries(previousEntries);
      throw error;
    }
  };

  return (
    <EntriesContext.Provider
      value={{
        entries,
        loadingHistory,
        backendWarning,
        createJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const ctx = useContext(EntriesContext);

  if (!ctx) {
    throw new Error(
      "useEntries must be used within EntriesProvider"
    );
  }

  return ctx;
}