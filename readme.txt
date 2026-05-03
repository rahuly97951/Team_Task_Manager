================================================================
                     TEAM TASK MANAGER
              Full-Stack Collaborative Web App
================================================================

A simplified version of Trello / Asana, built as a full-stack
coding assignment.

Author       : Rahul Yadav
GitHub       : https://github.com/rahuly97951/Team_Task_Manager
Live Demo    : https://frontend-production-6854e.up.railway.app
Backend API  : https://teamtaskmanager-production-2598.up.railway.app/api


================================================================
1. WHAT IT DOES
================================================================

Users can:
  - Sign up and log in securely
  - Create projects (creator becomes Admin)
  - Add or remove team members
  - Create tasks with title, description, priority, due date
  - Assign tasks to team members
  - Update task status: To Do, In Progress, Done
  - View a real-time dashboard showing:
      * Total tasks
      * Tasks by status
      * Tasks per user
      * Overdue tasks


================================================================
2. ROLES (Role-Based Access Control)
================================================================

ADMIN (project creator)
  - Manage members (add/remove)
  - Create/edit/delete tasks
  - Update any task status

MEMBER
  - View the project and tasks
  - Update status only on tasks assigned to them


================================================================
3. TECH STACK
================================================================

Frontend  : React (Vite), React Router, Axios
Backend   : Node.js, Express
Database  : SQLite (Node 22+ built-in node:sqlite)
Auth      : JWT + bcrypt
Deploy    : Railway (auto-deploy from GitHub)
VCS       : Git + GitHub


================================================================
4. PROJECT STRUCTURE
================================================================

Team_Task_Manager/
  +-- backend/
  |   +-- config/db.js          (SQLite + schema)
  |   +-- models/               (User, Project, Task)
  |   +-- controllers/          (auth, project, task, dashboard)
  |   +-- middleware/           (auth, projectAccess, errors)
  |   +-- routes/               (REST endpoints)
  |   +-- tests/                (12 integration tests)
  |   +-- server.js
  |   +-- seed.js               (demo data)
  |   +-- package.json
  +-- frontend/
  |   +-- src/
  |   |   +-- pages/            (Login, Signup, Projects, Detail)
  |   |   +-- components/Navbar.jsx
  |   |   +-- context/AuthContext.jsx
  |   |   +-- api/axios.js
  |   +-- index.html
  |   +-- vite.config.js
  +-- README.md
  +-- DEMO_SCRIPT.md
  +-- PRACTICAL_PROCEDURE.md
  +-- readme.txt


================================================================
5. LOCAL SETUP
================================================================

PREREQUISITES
  - Node.js version 22.5 or higher

STEP 1 - CLONE
  git clone https://github.com/rahuly97951/Team_Task_Manager.git
  cd Team_Task_Manager

STEP 2 - BACKEND
  cd backend
  npm install
  copy .env.example .env       (then set JWT_SECRET)
  npm run seed                 (optional - loads demo data)
  npm run dev                  (starts on http://localhost:5000)
  npm test                     (runs 12 integration tests)

STEP 3 - FRONTEND
  cd ../frontend
  npm install
  npm run dev                  (starts on http://localhost:5173)


================================================================
6. DEMO LOGIN CREDENTIALS (after npm run seed)
================================================================

Email             | Password    | Role
------------------|-------------|--------
alice@demo.com    | password123 | Admin
bob@demo.com      | password123 | Member
carol@demo.com    | password123 | Member


================================================================
7. ENVIRONMENT VARIABLES
================================================================

BACKEND (backend/.env)
  PORT=5000
  JWT_SECRET=any_long_random_string
  CLIENT_URL=http://localhost:5173

FRONTEND (frontend/.env)
  VITE_API_URL=http://localhost:5000/api


================================================================
8. REST API ENDPOINTS
================================================================

AUTH
  POST   /api/auth/signup        Register a new user
  POST   /api/auth/login         Log in and receive JWT
  GET    /api/auth/me            Get current user

PROJECTS
  POST   /api/projects                          Create project
  GET    /api/projects                          List my projects
  GET    /api/projects/:id                      Project details
  POST   /api/projects/:id/members              Add member (Admin)
  DELETE /api/projects/:id/members/:uid         Remove member (Admin)

TASKS
  POST   /api/projects/:id/tasks                Create task (Admin)
  GET    /api/projects/:id/tasks                List project tasks
  PATCH  /api/tasks/:id                         Update status
  PUT    /api/tasks/:id                         Edit task (Admin)
  DELETE /api/tasks/:id                         Delete task (Admin)

DASHBOARD
  GET    /api/dashboard/:projectId              Get statistics


================================================================
9. DEPLOYMENT (Railway)
================================================================

The application is deployed as TWO services on Railway:

BACKEND SERVICE
  Root Directory : backend
  Environment    : JWT_SECRET, CLIENT_URL
  Public Domain  : Generated by Railway

FRONTEND SERVICE
  Root Directory : frontend
  Environment    : VITE_API_URL (points to backend)
  Public Domain  : Generated by Railway

Both services auto-deploy when changes are pushed to the
"main" branch on GitHub.


================================================================
10. KEY FEATURES IMPLEMENTED
================================================================

[x] User authentication (Signup, Login, JWT, bcrypt)
[x] Project management (Create, View, Member management)
[x] Task management (CRUD, Priority, Due Date, Assignment)
[x] Role-based access (Admin / Member)
[x] Real-time dashboard with statistics
[x] RESTful APIs with validation and error handling
[x] Database with proper relationships and constraints
[x] 12 integration tests
[x] Live deployment on Railway
[x] Continuous deployment from GitHub
[x] CORS configured for production
[x] Demo data seed script


================================================================
11. SUBMISSION CHECKLIST
================================================================

[x] Live application URL
[x] GitHub repository
[x] README with setup and deploy steps
[x] Demo video script (DEMO_SCRIPT.md)
[x] Practical procedure (PRACTICAL_PROCEDURE.md)
[ ] 2 to 5 minute demo video


================================================================
12. ASSIGNMENT TIME
================================================================

Estimated effort  : 8 - 12 hours
Recommended time  : 1 - 2 days


================================================================
                        END OF README
================================================================
