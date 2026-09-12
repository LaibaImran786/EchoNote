# EchoNote (Python backend + multi-page frontend)

Speak about your day → get back a structured daily card (mood, tags, to-dos, people, a highlight moment) — speak naturally and save the resulting text.

This version swaps the backend for **Python/FastAPI + SQLite**, and the frontend is now a proper multi-page app: a sticky **navbar**, a reusable **page header**, a **Home** page (recorder + recent entries), and a searchable **History** page.

## Architecture

```
┌────────────────────────────┐        ┌──────────────────────────┐        ┌──────────────────┐
│   Frontend (Vite + Router)  │  HTTP  │   Backend (FastAPI)        │  HTTP  │  Gemini API     │
│  Navbar · Home · History     │ ─────► │  /api/entries               │ ─────► │  gemini-2.5-flash │
│  Web Speech API (on-device)  │ ◄───── │  /api/health                 │ ◄───── │  (structuring)     │
└────────────────────────────┘        └──────────────┬────────────┘        └──────────────────┘
                                                        │
                                                        ▼
                                                  echonote.db
                                                  (SQLite)
```

- **Speech-to-text** happens through the browser Web Speech API. The app sends only the resulting transcript to FastAPI, which saves the text in SQLite. On-device Whisper.cpp can slot into this same spot later.
- **Structuring** is the one network call per entry: FastAPI sends the raw transcript to Claude and gets back mood, tags, tasks, people, a summary, and a highlight as JSON.
- **Storage** is SQLite (`backend/echonote.db`), created automatically on first run — no external database needed for the hackathon, but a real one to grow into.

## Frontend structure

```
frontend/src/
├── components/
│   ├── Navbar.jsx        sticky top nav — wordmark + Home/History links
│   ├── Header.jsx         reusable eyebrow + title + subtitle block
│   ├── DailyCard.jsx       the structured entry card
│   ├── Waveform.jsx        recording animation
│   └── MicIcon.jsx
├── pages/
│   ├── Home.jsx            mic recorder hero + last 3 entries
│   └── History.jsx          full archive with search + mood filter chips
├── EntriesContext.jsx      shared entries state so Home and History stay in sync
├── useSpeechRecognition.js  Web Speech API hook
├── api.js                   fetch client for the backend
├── utils.js, styles.js
└── App.jsx, main.jsx         router setup
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- An [Gemini API key](https://console.google.com/settings/keys)
- Chrome or Edge (for live speech recognition — other browsers fall back to a text box automatically)

## Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# edit .env and paste your GEMINI_API_KEY (optional)
python main.py
```

Runs on `http://localhost:4000`. (Or `uvicorn main:app --reload --port 4000`.)

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # defaults already point at localhost:4000
npm run dev
```

Open `http://localhost:5173`, grant microphone permission, and tap the mic.

## API

| Method | Route              | Body                    | Description                                  |
|--------|---------------------|--------------------------|-----------------------------------------------|
| GET    | `/api/health`        | —                         | Backend status + whether an API key is set   |
| GET    | `/api/entries`        | —                         | All entries, most recent first                |
| POST   | `/api/entries`        | `{ "transcript": "…" }`   | Structures + saves a new entry                |
| DELETE | `/api/entries/{id}`   | —                         | Deletes an entry                              |

FastAPI also serves interactive API docs at `http://localhost:4000/docs`.

## Demo tips

- Use Chrome or Edge — Safari and Firefox don't support the Web Speech API yet, so the app falls back to a typing box (still fully functional, just not voice-first).
- The banner at the top of Home will tell you immediately if the backend is unreachable or missing its API key.
- Try the mood filter chips on the History page after a few entries — they're generated from whatever moods actually show up in your data.

## Roadmap ideas

- Weekly mood-trend chart on a new `/insights` page
- Swap SQLite for Postgres for multi-device sync
- On-device Whisper.cpp instead of Web Speech API for offline + non-Chrome support
- Auth so entries are per-user instead of a single shared archive
