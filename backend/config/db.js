const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    createdBy TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS project_members (
    projectId TEXT NOT NULL,
    userId TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Admin', 'Member')),
    PRIMARY KEY (projectId, userId),
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    projectId TEXT NOT NULL,
    assignedTo TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK(priority IN ('Low','Medium','High')),
    status TEXT NOT NULL DEFAULT 'To Do' CHECK(status IN ('To Do','In Progress','Done')),
    dueDate TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(projectId);
  CREATE INDEX IF NOT EXISTS idx_members_user ON project_members(userId);
`);

module.exports = db;
