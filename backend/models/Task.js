const crypto = require('crypto');
const db = require('../config/db');

// Convert raw DB row → frontend-friendly shape (mongo-style ids, populated assignee)
const toApi = (t) => ({
  _id: t.id,
  title: t.title,
  description: t.description,
  project: t.projectId,
  assignedTo: t.aId ? { _id: t.aId, name: t.aName, email: t.aEmail } : null,
  priority: t.priority,
  status: t.status,
  dueDate: t.dueDate,
  createdAt: t.createdAt,
});

const SELECT_WITH_ASSIGNEE = `
  SELECT t.*, u.id AS aId, u.name AS aName, u.email AS aEmail
  FROM tasks t
  LEFT JOIN users u ON u.id = t.assignedTo
`;

// "YYYY-MM-DD" from <input type="date"> -> end-of-day UTC ISO so comparisons work
const normalizeDueDate = (d) => {
  if (!d) return null;
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    return d + 'T23:59:59.999Z';
  }
  return d;
};

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
    normalizeDueDate(dueDate)
  );
  return exports.findById(id);
};

exports.findById = (id) => {
  const row = db.prepare(`${SELECT_WITH_ASSIGNEE} WHERE t.id = ?`).get(id);
  return row ? toApi(row) : null;
};

// Internal: needed by controllers to check task ownership without populating
exports.findRawById = (id) => db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

exports.listForProject = (projectId) =>
  db.prepare(`${SELECT_WITH_ASSIGNEE} WHERE t.projectId = ? ORDER BY t.createdAt DESC`)
    .all(projectId)
    .map(toApi);

exports.update = (id, fields) => {
  const allowed = ['title', 'description', 'priority', 'status', 'dueDate', 'assignedTo'];
  const sets = [];
  const values = [];
  for (const k of allowed) {
    if (fields[k] !== undefined) {
      sets.push(`${k} = ?`);
      let v = fields[k] === '' ? null : fields[k];
      if (k === 'dueDate') v = normalizeDueDate(v);
      values.push(v);
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
