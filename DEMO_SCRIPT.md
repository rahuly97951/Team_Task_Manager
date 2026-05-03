# Team Task Manager — Demo Video Script (8–10 min)

> Total target: ~9 minutes. Each section has timing, what to show on screen, and what to say. Speak conversationally — these are talking points, not lines to memorize.

---

## 0:00 – 0:45 | Intro (45 sec)

**SHOW:** Your face / GitHub repo home page (`github.com/rahuly97951/Team_Task_Manager`)

**SAY:**
> "Hi, I'm Rahul. I built a full-stack Team Task Management web application as part of this assignment. It's a collaborative tool — kind of like a simplified Trello or Asana — where users can create projects, invite team members, assign tasks, track progress, and view a dashboard of their team's work.
>
> The app is live, deployed on Railway, and the link is in the README. In the next few minutes I'll walk you through the live demo, the architecture, the code, and how I deployed it."

---

## 0:45 – 3:30 | Live Demo (~2 min 45 sec)

**SHOW:** Browser at `https://frontend-production-6854e.up.railway.app`

**SAY (while clicking):**
> "Let me start with the live demo. Here's the signup page. I'll create an account as the project Admin."

**DO:** Sign up as `alice@demo.com` / `password123` (name: Alice)

**SAY:**
> "After signup I'm logged in automatically — the JWT token is saved in localStorage. Now I'm on the projects page. Let me create a new project."

**DO:** Click into "Create New Project", name it "Website Redesign", create it.

**SAY:**
> "Whoever creates the project becomes the Admin automatically. Now let me click into the project."

**DO:** Click the project name.

**SAY:**
> "Here's the project detail page. You can see the dashboard at the top — total tasks, overdue tasks, status breakdown, and tasks per user. Right now it's empty, so let me add team members and tasks."

**DO:** Open a second incognito window. Sign up as `bob@demo.com` / `password123` (name: Bob). Switch back to first window.

**DO (in first window):** In the Members section, type `bob@demo.com` and click Add.

**SAY:**
> "I just added Bob as a member. Notice his role is 'Member', mine is 'Admin'. Members can only update their own tasks — they can't create or delete tasks. Let me show that."

**DO:** Create a task: title "Design homepage mockup", priority High, due date a few days from now, assign to Bob.

**SAY:**
> "I created this task as Admin and assigned it to Bob. Let me create one more — assigned to me, due yesterday — to demonstrate the overdue functionality."

**DO:** Create another task with yesterday's date, assign to yourself.

**SAY:**
> "See the red 'overdue' badge — the system flags any task past its due date that isn't Done. The dashboard updated too: 2 total tasks, 1 overdue."

**DO:** Switch to Bob's window. Refresh.

**SAY:**
> "Now as Bob — notice the 'Create Task' form is hidden. Members can't create tasks. But Bob CAN update the status of his assigned task."

**DO:** Change Bob's task status to "In Progress" using the dropdown.

**SAY:**
> "And the dashboard updates to reflect 1 task in progress. That's the core flow — auth, projects, role-based access, tasks, and live dashboard."

---

## 3:30 – 4:30 | Tech Stack & Architecture (1 min)

**SHOW:** README at the top of the file (or open `README.md` in VS Code)

**SAY:**
> "Let me explain the tech stack. The frontend is React with Vite for fast builds, React Router for navigation, and Axios for API calls. The backend is Node.js with Express for the REST API, JWT and bcrypt for authentication, and SQLite as the database — using Node 22's built-in `node:sqlite` module, so there's no native compilation, no separate database server, and no MongoDB Atlas signup needed.
>
> The architecture is two services on Railway: a backend that exposes a REST API, and a frontend that builds the React app and serves it. They're connected via environment variables — the frontend knows the backend URL through `VITE_API_URL`, and the backend allows the frontend's origin via CORS using `CLIENT_URL`."

**SHOW:** Folder structure in VS Code or README's "Project Structure" section.

**SAY:**
> "Here's the structure: backend has the typical Express layout — routes, controllers, models, middleware. Frontend follows a standard React pattern with pages, components, and a context for auth state."

---

## 4:30 – 6:00 | Backend Code Walkthrough (1 min 30 sec)

**SHOW:** `backend/server.js` (very brief)

**SAY:**
> "The backend entry point — just loads the app and starts listening on the PORT Railway provides."

**SHOW:** `backend/app.js`

**SAY:**
> "Here's the Express app setup. CORS is configured to allow the frontend's origin. We have four route groups: auth, projects, tasks, and dashboard, plus a global error handler at the end."

**SHOW:** `backend/config/db.js`

**SAY:**
> "This is the database setup — opening SQLite, enabling foreign keys, and creating the schema if it doesn't exist. Three main tables: users, projects, tasks, plus a junction table `project_members` that holds the many-to-many relationship between users and projects, including their role per project. Notice the constraints — role is Admin or Member, status is To Do / In Progress / Done."

**SHOW:** `backend/middleware/auth.js`

**SAY:**
> "The auth middleware — pulls the JWT from the Authorization header, verifies it, loads the user, and attaches it to the request. If anything fails, it returns 401. This middleware runs on every protected route."

**SHOW:** `backend/middleware/projectAccess.js`

**SAY:**
> "Role-based access — `loadProject` ensures the user is a member of the project before they can see anything, and `requireAdmin` is used on routes only Admins can hit, like adding members or creating tasks."

**SHOW:** `backend/controllers/taskController.js` (the `updateStatus` function)

**SAY:**
> "Here's the role logic in action — when a Member tries to update a task, this checks: are they the assignee? If they're not Admin and not the assignee, it returns 403. This enforces the rule that Members can only update tasks assigned to them."

**SHOW:** `backend/controllers/dashboardController.js` and `models/Task.js` (the `statsForProject` function)

**SAY:**
> "The dashboard endpoint runs four queries in one call — total task count, breakdown by status, tasks per assignee, and overdue count. The overdue query checks `dueDate < datetime('now') AND status != 'Done'` so completed tasks don't show as overdue."

---

## 6:00 – 7:15 | Frontend Code Walkthrough (1 min 15 sec)

**SHOW:** `frontend/src/App.jsx`

**SAY:**
> "Frontend routing — five pages: Login, Signup, Projects list, and Project Detail. The `<Private>` wrapper redirects to /login if there's no logged-in user."

**SHOW:** `frontend/src/context/AuthContext.jsx`

**SAY:**
> "The auth context manages login state across the app. When you sign up or log in, the JWT goes into localStorage and the user object goes into context. On page reload, it calls `/auth/me` with the saved token to restore the session."

**SHOW:** `frontend/src/api/axios.js`

**SAY:**
> "Axios interceptor — automatically attaches the JWT to every request, so I never have to pass it manually anywhere in the app."

**SHOW:** `frontend/src/pages/ProjectDetail.jsx` (scroll through quickly)

**SAY:**
> "The Project Detail page is the heart of the app — dashboard at the top, members list, task creation form for Admins, and the task list with inline status updates. Every action calls `load()` which re-fetches everything to keep the UI in sync."

---

## 7:15 – 8:15 | Deployment (1 min)

**SHOW:** Railway dashboard — your project page

**SAY:**
> "I deployed this on Railway. There are two services in the same project: the backend and the frontend. Both auto-deploy when I push to the main branch on GitHub.
>
> The backend has its root directory set to `/backend` and one environment variable: JWT_SECRET. The frontend has its root set to `/frontend` and one variable: VITE_API_URL pointing to the backend.
>
> Because I used SQLite instead of an external database, there's no MongoDB or Postgres service to provision — the database is just a file inside the backend container. That made deployment simpler and the project free to host."

**SHOW:** GitHub repo Actions tab or commit list.

**SAY:**
> "Railway is connected to GitHub — every push to main triggers a build. You can see deployment status here. The README has full setup and deploy instructions for anyone who wants to clone and run it."

---

## 8:15 – 9:00 | Wrap-up (45 sec)

**SHOW:** Your face or the GitHub repo

**SAY:**
> "To summarize what I built: a full-stack collaborative task manager with secure JWT authentication, role-based access control where Admins manage projects and Members work on assigned tasks, a real-time dashboard with task statistics, RESTful APIs with proper validation and error handling, integration tests for the critical flows, and a live deployment on Railway.
>
> All the code is on GitHub at the link below — github dot com slash rahul-y-97951 slash Team underscore Task underscore Manager. Thanks for watching."

---

## Tips for recording

1. **Practice the demo flow once before recording** — timing the clicks helps a lot.
2. **Have 2 browser windows open** — one regular, one incognito — before you start, so the demo flows smoothly.
3. **Have VS Code open with the relevant files in tabs** — `db.js`, `auth.js`, `taskController.js`, `App.jsx`, `AuthContext.jsx`, `ProjectDetail.jsx`. Switching tabs is faster than navigating folders on screen.
4. **Talk slowly** — better to fill 9 minutes well than rush through 8.
5. **If you make a mistake during demo, just continue** — saying "let me try that again" is fine.
6. **Use a simple screen recorder** — OBS Studio (free), or Windows Game Bar (Win+G), or just Loom.

## Key talking points if you run short

- Mention the **integration tests** (`npm test` runs 12 tests covering auth, role checks, task ownership)
- Mention the **seed script** (`npm run seed`) for demo data
- Show the README's API reference table
- Show the role-check logic in `projectAccess.js`
- Talk about why you chose SQLite (no external DB needed, deployment simplicity)
- Mention the production CORS setup with `CLIENT_URL`
