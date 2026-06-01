# CodeCollab

> Learn Together. Code Together. Build Together.

A collaborative coding & study platform — real-time Monaco editor, study rooms,
live chat, AI assistant (Gemini Flash), notes, and Pomodoro timer.

**Live demo:** https://codecollab.hatchable.site

---

## Project Structure

```
codecollab/
├── api/
│   ├── ai/chat.js                  AI assistant (Gemini Flash)
│   ├── notes/
│   │   ├── list.js                 GET list / POST create notes
│   │   └── [id].js  → id.js        Update note by ID
│   ├── profile/
│   │   ├── me.js                   Get/sync current user
│   │   └── update.js               Update profile fields
│   ├── rooms/
│   │   ├── list.js                 List public rooms
│   │   ├── create.js               Create a new room
│   │   ├── [id].js    → id.js      Room details + members + snippets
│   │   └── [id]/
│   │       ├── join.js             Join a room
│   │       ├── messages.js         Fetch chat messages
│   │       └── send.js             Send a chat message
│   ├── snippets/
│   │   ├── [id].js    → id.js      Get snippet by ID
│   │   └── save.js                 Create or update snippet
│   └── search.js                   Global search (rooms + users)
├── migrations/001_initial.sql      Full PostgreSQL schema
├── public/
│   ├── index.html                  Landing page
│   └── app/index.html              Full app SPA
├── seed.sql                        Sample room data
├── hatchable.toml                  AI provider config
└── README.md
```

> **Note on filenames:** Hatchable uses `[param]` bracket syntax for dynamic
> routes. In this zip the bracket files are named `id.js` — rename them back
> to `[id].js` when uploading to Hatchable.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Vanilla HTML/CSS/JS, Tailwind CDN, Monaco Editor |
| Backend    | Hatchable serverless functions (Node.js ESM)    |
| Database   | PostgreSQL via Hatchable `db` SDK               |
| AI         | Google Gemini Flash via Hatchable `ai` SDK      |
| Auth       | Hatchable identity (built-in, no code needed)   |

---

## Database Tables

| Table            | Purpose                                           |
|------------------|---------------------------------------------------|
| users            | Profiles synced from Hatchable identity           |
| rooms            | Study rooms (public/private, tags, max members)   |
| room_members     | Membership with roles (owner/moderator/member)    |
| messages         | Chat messages with reply threading                |
| code_snippets    | Per-room editor tabs                              |
| notes            | Personal and shared markdown notes                |
| projects         | Project workspaces                                |
| project_files    | Files within projects                             |
| notifications    | User notifications                                |
| friend_requests  | Friend request system                             |
| study_sessions   | Pomodoro / study session tracking                 |

---

## API Reference

| Method | Route                        | Access  | Description                    |
|--------|------------------------------|---------|--------------------------------|
| GET    | /api/rooms/list              | public  | List all public rooms          |
| POST   | /api/rooms/create            | member  | Create a new room              |
| GET    | /api/rooms/[id]              | public  | Room details, members, snippets|
| POST   | /api/rooms/[id]/join         | member  | Join a room                    |
| GET    | /api/rooms/[id]/messages     | public  | Fetch chat messages            |
| POST   | /api/rooms/[id]/send         | member  | Send a chat message            |
| POST   | /api/snippets/save           | member  | Create or update snippet       |
| GET    | /api/snippets/[id]           | public  | Get snippet by ID              |
| GET    | /api/notes/list              | member  | List user notes                |
| POST   | /api/notes/list              | member  | Create a note                  |
| POST   | /api/notes/[id]              | member  | Update a note                  |
| GET    | /api/profile/me              | member  | Get / sync current user        |
| POST   | /api/profile/update          | member  | Update profile                 |
| GET    | /api/search?q=               | public  | Search rooms and users         |
| POST   | /api/ai/chat                 | member  | AI assistant (chat/code help)  |

---

## Features

- Monaco Code Editor — 14 languages, syntax highlighting, auto-complete
- Study Rooms — public/private with tags, member roles, invite links
- Live Chat — real-time polling (4 s interval), reply threading
- AI Assistant — Gemini Flash: explain / debug / optimize / review code
- Notes — markdown notes with auto-save
- Pomodoro Timer — focus / short / long break modes with daily stats
- Collapsible UI — main sidebar, members panel, chat panel all collapsible
- Global Search — search rooms and users

---

## Deployment

1. Fork or upload this project to [hatchable.com](https://hatchable.com)
2. Project Settings → AI → paste your **Google AI Studio** API key
3. Hit **Deploy** — migrations run automatically on first deploy

---

## AI Key Setup

No `.env` needed. Declare the AI key via `hatchable.toml`:

```toml
[ai]
required = true
pin = "google"
```

Add the key in your Hatchable project dashboard under **Setup → AI**.
Google AI Studio free tier: 1 500 requests/day — plenty for personal use.

---

## Getting the Frontend HTML Files

The two frontend files are large and best downloaded directly from the live site:

```bash
# Landing page
curl -L https://codecollab.hatchable.site > public/index.html

# Full app (dashboard, room, AI, notes, timer)
curl -L https://codecollab.hatchable.site/app > public/app/index.html
```

Or right-click **View Page Source** in your browser on each URL.
