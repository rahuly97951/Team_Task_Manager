# Team Task Manager

A full-stack collaborative Team Task Management web application.
Users can create projects, assign tasks, track progress, and manage teams with role-based access (Admin / Member).

> Built as a simplified version of tools like Trello / Asana.

## 🚀 Live Demo

**👉 https://frontend-production-6854e.up.railway.app**

| Resource | URL |
| --- | --- |
| Live App | https://frontend-production-6854e.up.railway.app |
| Backend API | https://teamtaskmanager-production-2598.up.railway.app/api |
| Health Check | https://teamtaskmanager-production-2598.up.railway.app/api/health |
| Repository | https://github.com/rahuly97951/Team_Task_Manager |

---

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | React (Vite), React Router, Axios              |
| Backend  | Node.js 22+, Express                           |
| Database | SQLite (`node:sqlite` — built-in, no install)  |
| Auth     | JWT + bcrypt                                   |
| Deploy   | Railway                                        |

> **Why SQLite?** Zero external services to set up — the database is a single file inside the backend container. No MongoDB Atlas, no separate database service, no connection strings. The assignment allows SQL or NoSQL.

---

## Features

- **Auth:** Signup / Login (JWT)
- **Projects:** Create projects (creator = Admin), add/remove members
- **Tasks:** Create, assign, set priority & due date, update status (To Do / In Progress / Done)
- **Roles:** Admin manages tasks & users; Member views and updates only assigned tasks
- **Dashboard:** Total tasks, tasks by status, tasks per user, overdue tasks

---

## Project Structure

```
Team_Task_Manager/
├── backend/
│   ├── config/db.js         # SQLite connection + schema
│   ├── models/              # User, Project, Task (query helpers)
│   ├── controllers/         # auth, project, task, dashboard
│   ├── middleware/          # auth, projectAccess, errorHandler
│   ├── routes/              # /api/auth, /api/projects, /api/tasks, /api/dashboard
│   ├── tests/               # node:test + supertest integration tests
│   ├── server.js
│   ├── seed.js              # populate demo data
│   ├── nixpacks.toml        # Railway: Node 22
│   ├── railway.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Signup, Projects, ProjectDetail
│   │   ├── components/Navbar.jsx
│   │   ├── context/AuthContext.jsx
│   │   └── api/axios.js
│   ├── index.html
│   ├── vite.config.js
│   ├── railway.json
│   └── package.json
└── README.md
```

---

## Local Setup

### Prerequisites
- **Node.js 22.5+** (uses built-in `node:sqlite`)

### 1. Clone
```bash
git clone https://github.com/rahuly97951/Team_Task_Manager.git
cd Team_Task_Manager
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env       # edit JWT_SECRET (any long random string)
npm run seed               # (optional) populate demo users + project + tasks
npm run dev                # http://localhost:5000
npm test                   # 12 integration tests
```

### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev                # http://localhost:5173
```

The frontend reads `VITE_API_URL` (defaults to `http://localhost:5000/api`).

---

## Demo Credentials (after `npm run seed`)

| Email           | Password    | Role    |
| --------------- | ----------- | ------- |
| alice@demo.com  | password123 | Admin   |
| bob@demo.com    | password123 | Member  |
| carol@demo.com  | password123 | Member  |

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:5173
# Optional: DB_PATH=/data/app.db   (Railway volume mount path)
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## API Reference (REST)

### Auth
| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | `/api/auth/signup`   | Register user   |
| POST   | `/api/auth/login`    | Login, get JWT  |
| GET    | `/api/auth/me`       | Current user    |

### Projects
| Method | Endpoint                          | Role   | Description          |
| ------ | --------------------------------- | ------ | -------------------- |
| POST   | `/api/projects`                   | Any    | Create project       |
| GET    | `/api/projects`                   | Any    | List my projects     |
| GET    | `/api/projects/:id`               | Member | Project details      |
| POST   | `/api/projects/:id/members`       | Admin  | Add member by email  |
| DELETE | `/api/projects/:id/members/:uid`  | Admin  | Remove member        |

### Tasks
| Method | Endpoint                       | Role   | Description           |
| ------ | ------------------------------ | ------ | --------------------- |
| POST   | `/api/projects/:id/tasks`      | Admin  | Create task           |
| GET    | `/api/projects/:id/tasks`      | Member | List project tasks    |
| PATCH  | `/api/tasks/:id`               | Member | Update status (own)   |
| PUT    | `/api/tasks/:id`               | Admin  | Edit task fully       |
| DELETE | `/api/tasks/:id`               | Admin  | Delete task           |

### Dashboard
| Method | Endpoint                       | Description                      |
| ------ | ------------------------------ | -------------------------------- |
| GET    | `/api/dashboard/:projectId`    | Stats: totals, by-status, overdue |

---

## Deployment (Railway) — minimal click sequence

Because we use SQLite, **no separate database service is needed.** Just two web services from the same repo.

### Backend service
1. **New Project → Deploy from GitHub repo** → pick `Team_Task_Manager`
2. Click into the service → **Settings**:
   - **Root Directory:** `backend`
3. **Variables** tab → add:
   - `JWT_SECRET` = any long random string
4. **Settings → Networking → Generate Domain** → copy URL (e.g. `backend-prod.up.railway.app`)
5. *(Optional but recommended for data persistence across redeploys)* **Settings → Volumes → + New Volume**:
   - **Mount path:** `/data`
   - Then **Variables** → add `DB_PATH = /data/app.db`

### Frontend service (same project, same repo)
1. Project canvas → **+ Create → GitHub Repo** → same repo
2. **Settings**:
   - **Service Name:** `frontend`
   - **Root Directory:** `frontend`
3. **Variables**:
   - `VITE_API_URL = https://<your-backend-url>/api`
4. **Settings → Networking → Generate Domain** → copy URL

### Wire CORS
Go back to **backend service → Variables**:
- `CLIENT_URL = https://<your-frontend-url>`

Backend redeploys automatically. Open the frontend URL — done.

---

## Submission Checklist

- [x] **Live URL:** https://frontend-production-6854e.up.railway.app
- [x] GitHub repo: https://github.com/rahuly97951/Team_Task_Manager
- [x] README with setup + deploy steps
- [ ] 2–5 minute demo video

---

## Time

Estimated effort: **8–12 hours** · Recommended timeline: **1–2 days**
