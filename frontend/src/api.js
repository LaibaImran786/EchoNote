const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://echonote-u5hs.onrender.com";

function getUserId() {
  let userId = localStorage.getItem("echonote_user_id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("echonote_user_id", userId);
  }

  return userId;
}

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

export async function checkHealth() {
  const response = await fetch(
    `${API_URL}/api/health`
  );

  return handleResponse(response);
}

export async function fetchEntries() {
  const userId = getUserId();

  const response = await fetch(
    `${API_URL}/api/entries?user_id=${encodeURIComponent(
      userId
    )}`
  );

  return handleResponse(response);
}

export async function createEntry(entry) {
  const userId = getUserId();

  const response = await fetch(
    `${API_URL}/api/entries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...entry,
        user_id: userId,
      }),
    }
  );

  return handleResponse(response);
}

export async function updateEntry(
  entryId,
  transcript
) {
  const userId = getUserId();

  const response = await fetch(
    `${API_URL}/api/entries/${entryId}?user_id=${encodeURIComponent(
      userId
    )}`,
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

  return handleResponse(response);
}

export async function removeEntry(entryId) {
  const userId = getUserId();

  const response = await fetch(
    `${API_URL}/api/entries/${entryId}?user_id=${encodeURIComponent(
      userId
    )}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
}

export async function structureTranscript(
  transcript
) {
  const response = await fetch(
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

  return handleResponse(response);
}