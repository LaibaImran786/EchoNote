const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:4000";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Something went wrong"
    );
  }

  return data;
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  return handleResponse(response);
}

export async function checkHealth() {
  return apiFetch(`${API_URL}/api/health`);
}

export async function fetchEntries() {
  return apiFetch(
    `${API_URL}/api/entries`
  );
}

export async function createEntry(entry) {
  return apiFetch(
    `${API_URL}/api/entries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: entry.transcript,
      }),
    }
  );
}

export async function updateEntry(
  entryId,
  transcript
) {
  return apiFetch(
    `${API_URL}/api/entries/${entryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript,
      }),
    }
  );
}

export async function removeEntry(entryId) {
  return apiFetch(
    `${API_URL}/api/entries/${entryId}`,
    {
      method: "DELETE",
    }
  );
}

export async function structureTranscript(
  transcript
) {
  return apiFetch(
    `${API_URL}/api/structure`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript,
      }),
    }
  );
}