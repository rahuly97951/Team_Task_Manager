# Team Task Manager

A full-stack collaborative Team Task Management web application.
Users can create projects, assign tasks, track progress, and manage teams with role-based access (Admin / Member).

> Built as a simplified version of tools like Trello / Asana.

**Repository:** https://github.com/rahuly97951/Team_Task_Manager.git

---

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React (Vite), React Router, Axios |
| Backend  | Node.js, Express                  |
| Database | MongoDB (Mongoose)                |
| Auth     | JWT + bcrypt                      |
| Deploy   | Railway                           |

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
│   ├── config/db.js
│   ├── models/        # User, Project, Task
│   ├── controllers/   # auth, project, task, dashboard
│   ├── middleware/    # auth, role, errorHandler
│   ├── routes/        # /api/auth, /api/projects, /api/tasks, /api/dashboard
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/     # Login, Signup, Dashboard, Projects, ProjectDetail
│   │   ├── components/
│   │   ├── context/   # AuthContext
│   │   └── api/axios.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster)

### 1. Clone
```bash
git clone https://github.com/rahuly97951/Team_Task_Manager.git
cd Team_Task_Manager
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env       # then fill in MONGO_URI and JWT_SECRET
npm run dev                # starts on http://localhost:5000
npm run seed               # (optional) populate demo users + project + tasks
npm test                   # run integration tests (needs local MongoDB)
```

### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev                # starts on http://localhost:5173
```

The frontend reads `VITE_API_URL` (defaults to `http://localhost:5000/api`).

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/teamtaskmanager
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:5173
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

## Deployment (Railway)

1. Push the repo to GitHub.
2. On [Railway](https://railway.app) → **New Project → Deploy from GitHub** → select this repo.
3. Create **two services**:
   - **Backend service** — Root: `backend`, Start: `npm start`. Add env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
   - **Frontend service** — Root: `frontend`, Build: `npm run build`, Start: `npm run preview -- --host 0.0.0.0 --port $PORT`. Add env: `VITE_API_URL=<your backend public URL>/api`.
4. Generate a public domain for each service. Update `CLIENT_URL` (backend) and `VITE_API_URL` (frontend) accordingly and redeploy.

---

## Submission Checklist

- [ ] Live URL (Railway)
- [ ] GitHub repo: https://github.com/rahuly97951/Team_Task_Manager.git
- [ ] README with setup + deploy steps (this file)
- [ ] 2–5 minute demo video

---

## Demo Credentials (after `npm run seed`)

| Email           | Password    | Role    |
| --------------- | ----------- | ------- |
| alice@demo.com  | password123 | Admin   |
| bob@demo.com    | password123 | Member  |
| carol@demo.com  | password123 | Member  |

---

## Time

Estimated effort: **8–12 hours** · Recommended timeline: **1–2 days**
