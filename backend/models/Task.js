const crypto = require('crypto');
const db = require('../config/db');

exports.create = ({ title, description, projectId, assignedTo, priority, status, dueDate }) => {
  const id = crypto.randomUUID();
  db.prepare(`
    INSERT INTO tasks (id, title, description, projectId, assignedTo, priority, status, dueDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    title,
    description || '',
    projectId,
    assignedTo || null,
    priority || 'Medium',
    status || 'To Do',
    dueDate || null
  );
  return exports.findById(id);
};

exports.findById = (id) => db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

exports.listForProject = (projectId) =>
  db.prepare(`
    SELECT t.*, u.name AS assigneeName, u.email AS assigneeEmail
    FROM tasks t
    LEFT JOIN users u ON u.id = t.assignedTo
    WHERE t.projectId = ?
    ORDER BY t.createdAt DESC
  `).all(projectId).map((t) => ({
    ...t,
    assignedTo: t.assignedTo
      ? { _id: t.assignedTo, name: t.assigneeName, email: t.assigneeEmail }
      : null,
  }));

exports.update = (id, fields) => {
  const allowed = ['title', 'description', 'priority', 'status', 'dueDate', 'assignedTo'];
  const sets = [];
  const values = [];
  for (const k of allowed) {
    if (fields[k] !== undefined) {
      sets.push(`${k} = ?`);
      values.push(fields[k] === '' ? null : fields[k]);
    }
  }
  if (sets.length === 0) return exports.findById(id);
  values.push(id);
  db.prepare(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return exports.findById(id);
};

exports.remove = (id) => db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

exports.statsForProject = (projectId) => {
  const total = db.prepare('SELECT COUNT(*) AS c FROM tasks WHERE projectId = ?').get(projectId).c;
  const byStatus = db.prepare(`
    SELECT status AS _id, COUNT(*) AS count
    FROM tasks WHERE projectId = ?
    GROUP BY status
  `).all(projectId);
  const perUser = db.prepare(`
    SELECT t.assignedTo AS userId, u.name, u.email, COUNT(*) AS count
    FROM tasks t
    JOIN users u ON u.id = t.assignedTo
    WHERE t.projectId = ?
    GROUP BY t.assignedTo
  `).all(projectId);
  const overdue = db.prepare(`
    SELECT COUNT(*) AS c FROM tasks
    WHERE projectId = ? AND dueDate IS NOT NULL AND dueDate < datetime('now') AND status != 'Done'
  `).get(projectId).c;
  return { total, byStatus, perUser, overdue };
};

exports.deleteAll = () => db.prepare('DELETE FROM tasks').run();
