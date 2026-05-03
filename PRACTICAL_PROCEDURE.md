# Team Task Manager — Practical Demonstration Procedure

> Follow this step-by-step. Each procedure is a feature you'll demonstrate. Total time: ~10 minutes.

---

## Before you start (Setup — do this BEFORE recording)

1. Close all unnecessary browser tabs
2. Open **two browser windows side by side**:
   - Window A → regular browser
   - Window B → **Incognito/Private** window
3. In **both** windows, open: `https://frontend-production-6854e.up.railway.app`
4. Open **VS Code** with the project folder
5. Have your screen recorder ready (OBS, Loom, or Win+G)

---

## PROCEDURE 1 — Introduction (45 seconds)

**Action:**
- Show your face / show the GitHub repo

**Say:**
> "Good morning. Today I will demonstrate my full-stack project — Team Task Manager. It is a collaborative web application where teams can create projects, assign tasks, and track work. The application is built using React, Node.js, Express, and SQLite, and is deployed live on Railway. Let me show you the live application now."

**Switch to:** Browser Window A (the live app)

---

## PROCEDURE 2 — User Registration (Signup)

**Aim:** Demonstrate the signup feature.

**Steps:**
1. On the homepage, click **"Sign up"**
2. Fill in:
   - Name: `Alice Admin`
   - Email: `alice@demo.com`
   - Password: `password123`
3. Click **"Create account"**

**Expected result:** You are logged in and redirected to the Projects page.

**Say:**
> "First I am registering a new user. The password is securely hashed using bcrypt before being stored in the database. After signup, the server returns a JWT token which is stored in the browser's localStorage. The user is automatically logged in."

---

## PROCEDURE 3 — Create a Second User (for member demo)

**Aim:** Create a second account to demonstrate role-based access.

**Steps:**
1. **Switch to Window B (Incognito)**
2. Click **"Sign up"**
3. Fill in:
   - Name: `Bob Member`
   - Email: `bob@demo.com`
   - Password: `password123`
4. Click **"Create account"**
5. **Switch back to Window A**

**Say:**
> "I created a second user, Bob, in another browser window. We will use Bob to demonstrate the Member role later."

---

## PROCEDURE 4 — Create a Project

**Aim:** Demonstrate project creation and Admin role assignment.

**Steps (in Window A):**
1. In the "Create New Project" form, enter:
   - Project name: `Website Redesign`
   - Description: `Demo project for practical`
2. Click **"Create"**

**Expected result:** Project appears in the list. You become the Admin automatically.

**Say:**
> "Now I am creating a project. The user who creates the project becomes the Admin automatically. This is enforced on the backend — when a project is created, the creator's role is set to Admin in the project_members table."

---

## PROCEDURE 5 — Open Project & View Dashboard

**Aim:** Show the project detail page and dashboard.

**Steps:**
1. Click on the project name **"Website Redesign"**

**Expected result:** Project detail page opens with:
- Empty dashboard (0 tasks)
- Members list (only Alice — Admin)
- Task creation form (visible because you are Admin)

**Say:**
> "This is the project dashboard. It shows total tasks, overdue tasks, and breakdown by status. Currently it is empty because no tasks exist. Below the dashboard you can see the members list — currently I am the only Admin."

---

## PROCEDURE 6 — Add a Team Member

**Aim:** Demonstrate adding a member to the project.

**Steps:**
1. In the **Members** section, type: `bob@demo.com`
2. Click **"Add"**

**Expected result:** Bob appears in the members list with role "Member".

**Say:**
> "I am adding Bob as a member by his email address. Now Bob has access to this project, but with a Member role — meaning he cannot create or delete tasks. He can only update tasks assigned to him."

---

## PROCEDURE 7 — Create a Task (Assigned to Bob)

**Aim:** Demonstrate task creation with priority, due date, and assignee.

**Steps:**
1. In the **Create Task** form:
   - Title: `Design homepage mockup`
   - Description: `Create wireframe for the new homepage`
   - Priority: **High**
   - Due date: pick a date 5–7 days in the future
   - Assigned to: **Bob Member**
2. Click **"Create Task"**

**Expected result:** Task appears in the list with red "High" badge, "To Do" status, and assignment to Bob.

**Say:**
> "Now I am creating a task and assigning it to Bob. Each task has a title, description, priority — Low, Medium, or High — a due date, and a status which can be To Do, In Progress, or Done. The dashboard at the top is updating in real time."

---

## PROCEDURE 8 — Create an Overdue Task

**Aim:** Demonstrate the overdue detection feature.

**Steps:**
1. Create another task:
   - Title: `Fix urgent login bug`
   - Priority: **High**
   - Due date: pick **yesterday's date**
   - Assigned to: yourself (Alice)
2. Click **"Create Task"**

**Expected result:** Task appears with "(overdue)" label in red.

**Say:**
> "I created a task with yesterday's due date to demonstrate the overdue feature. The system automatically flags tasks that are past their due date AND not yet completed. Look at the dashboard — it now shows 1 overdue task."

---

## PROCEDURE 9 — Demonstrate Member's Limited Access

**Aim:** Show that Members cannot create tasks but can update their assigned tasks.

**Steps:**
1. **Switch to Window B (Bob's window)**
2. Refresh the page (F5)
3. Open the project "Website Redesign"

**Expected observations to point out:**
- Bob can SEE the project and tasks
- Bob CANNOT see the "Create Task" form (it's only for Admins)
- Bob CANNOT see "Remove" buttons next to members
- Bob's role badge shows **"Member"**

**Say:**
> "Now I am viewing the same project as Bob. Notice that Bob cannot see the Create Task form because he is not an Admin. He also cannot remove members. This role-based restriction is enforced in two places — first in the user interface to hide the controls, and second on the backend API which returns 403 Forbidden if a Member tries to perform an Admin action."

---

## PROCEDURE 10 — Member Updates Own Task Status

**Aim:** Show that a Member CAN update the status of a task assigned to them.

**Steps (still in Window B as Bob):**
1. Find Bob's assigned task — `Design homepage mockup`
2. Click the **status dropdown** for that task
3. Change from **"To Do"** to **"In Progress"**

**Expected result:** Status updates immediately, dashboard updates.

**Say:**
> "Bob can update the status of his assigned task. Let me change it to In Progress. The change is saved to the database, and the dashboard updates to reflect the new status."

---

## PROCEDURE 11 — Verify Dashboard Updates

**Aim:** Show that the dashboard reflects all changes in real time.

**Steps:**
1. **Switch back to Window A (Alice's window)**
2. Refresh the page (F5)
3. Click into the project

**Expected observations:**
- Dashboard shows: **Total = 2**, **Overdue = 1**, **In Progress = 1**, **To Do = 1**
- "Tasks per User" shows both Alice and Bob with their counts

**Say:**
> "Refreshing as Alice — the Admin sees the same data. The dashboard correctly shows: 2 total tasks, 1 overdue, 1 in progress, and tasks distributed between Alice and Bob. This dashboard runs four database queries in a single API call — total count, group by status, group by assignee, and overdue check."

---

## PROCEDURE 12 — Show the Backend API is Live (Optional)

**Aim:** Prove the backend is a real, deployed REST API.

**Steps:**
1. Open a new browser tab
2. Visit: `https://teamtaskmanager-production-2598.up.railway.app/api/health`

**Expected result:** Browser shows `{"status":"ok"}`.

**Say:**
> "This is the health check endpoint of my backend API, deployed on Railway. The frontend communicates with this backend over HTTPS using REST endpoints."

---

## PROCEDURE 13 — Code Walkthrough (Brief)

**Aim:** Show the actual code briefly.

**Switch to:** VS Code

**Open and explain ONE line about each:**

1. **`backend/config/db.js`**
   > "This file sets up SQLite and creates the four database tables — users, projects, project_members, and tasks — with all foreign key relationships."

2. **`backend/middleware/auth.js`**
   > "This middleware verifies the JWT token on every protected request and loads the user."

3. **`backend/middleware/projectAccess.js`**
   > "This middleware enforces project membership and the Admin role check."

4. **`backend/controllers/taskController.js`** (scroll to `updateStatus`)
   > "This is the role check in action — only the Admin or the assigned member can update a task."

5. **`frontend/src/context/AuthContext.jsx`**
   > "This React Context stores the logged-in user across all pages and persists the JWT in localStorage."

6. **`frontend/src/pages/ProjectDetail.jsx`**
   > "This is the main page where everything happens — dashboard, members, and tasks."

---

## PROCEDURE 14 — GitHub Repository

**Aim:** Show the source code is on GitHub.

**Switch to:** Browser → `https://github.com/rahuly97951/Team_Task_Manager`

**Show:**
- Repository structure
- README file with live link badge at the top
- Recent commits

**Say:**
> "All my source code is on GitHub. The README contains the live demo link, setup instructions, the API reference, and deployment steps."

---

## PROCEDURE 15 — Conclusion

**Switch to:** Your face / projects page

**Say:**
> "To summarize — this project demonstrates: secure user authentication with JWT and bcrypt, role-based access control with Admin and Member roles, full CRUD operations on projects and tasks, a real-time dashboard with statistics, RESTful API design with proper validation, and live deployment on Railway with continuous integration from GitHub.
>
> The live application is at frontend-production-6854e dot up dot railway dot app, and the source code is on my GitHub. Thank you."

**Stop recording.**

---

## Quick Checklist (use this during recording)

- [ ] Procedure 1 — Intro
- [ ] Procedure 2 — Signup as Alice
- [ ] Procedure 3 — Signup as Bob (incognito)
- [ ] Procedure 4 — Create project
- [ ] Procedure 5 — Open project, show dashboard
- [ ] Procedure 6 — Add Bob as member
- [ ] Procedure 7 — Create task assigned to Bob
- [ ] Procedure 8 — Create overdue task
- [ ] Procedure 9 — Show Bob's limited UI
- [ ] Procedure 10 — Bob updates his task status
- [ ] Procedure 11 — Verify dashboard updates
- [ ] Procedure 12 — Backend health check
- [ ] Procedure 13 — Code walkthrough
- [ ] Procedure 14 — Show GitHub
- [ ] Procedure 15 — Conclusion

---

## Tips

1. **Speak slowly and clearly** — natural pace fills time better than rushing
2. **Pause after each action** — let the viewer see the result
3. **If something goes wrong** — say "let me try again" and continue (don't stop the recording)
4. **Keep both browser windows visible** when switching between Alice and Bob
5. **Refresh pages** when needed — it's normal in a demo
6. **Total expected time: 8–10 minutes** if you follow each procedure naturally
