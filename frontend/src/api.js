const API_URL = import.meta.env.VITE_API_URL || "https://echonote-u5hs.onrender.com";

async function handle(response) {
  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body.detail || body.error || "";
    } catch {
      // ignore
    }
    throw new Error(detail || `Request failed (${response.status})`);
  }
  return response.json();
}

export async function fetchEntries() {
  const res = await fetch(`${API_URL}/api/entries`);
  return handle(res);
}

export async function createEntry(transcript) {
  const res = await fetch(`${API_URL}/api/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
  return handle(res);
}

export async function removeEntry(id) {
  const res = await fetch(`${API_URL}/api/entries/${id}`, {
    method: "DELETE",
  });
  return handle(res);
}

export async function checkHealth() {
  const res = await fetch(`${API_URL}/api/health`);
  return handle(res);
}
