const crypto = require('crypto');
const db = require('../config/db');

exports.create = ({ name, description, createdBy }) => {
  const id = crypto.randomUUID();
  db.exec('BEGIN');
  try {
    db.prepare('INSERT INTO projects (id, name, description, createdBy) VALUES (?, ?, ?, ?)')
      .run(id, name, description || '', createdBy);
    db.prepare('INSERT INTO project_members (projectId, userId, role) VALUES (?, ?, ?)')
      .run(id, createdBy, 'Admin');
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return exports.findById(id);
};

exports.findById = (id) => db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

exports.listForUser = (userId) =>
  db.prepare(`
    SELECT p.*
    FROM projects p
    JOIN project_members pm ON pm.projectId = p.id
    WHERE pm.userId = ?
    ORDER BY p.createdAt DESC
  `).all(userId);

exports.getMemberRole = (projectId, userId) => {
  const row = db.prepare('SELECT role FROM project_members WHERE projectId = ? AND userId = ?')
    .get(projectId, userId);
  return row ? row.role : null;
};

exports.listMembers = (projectId) =>
  db.prepare(`
    SELECT u.id, u.name, u.email, pm.role
    FROM project_members pm
    JOIN users u ON u.id = pm.userId
    WHERE pm.projectId = ?
    ORDER BY pm.role DESC, u.name
  `).all(projectId);

exports.addMember = (projectId, userId, role = 'Member') => {
  db.prepare('INSERT INTO project_members (projectId, userId, role) VALUES (?, ?, ?)')
    .run(projectId, userId, role);
};

exports.removeMember = (projectId, userId) => {
  db.prepare('DELETE FROM project_members WHERE projectId = ? AND userId = ?')
    .run(projectId, userId);
};

exports.deleteAll = () => {
  db.prepare('DELETE FROM project_members').run();
  db.prepare('DELETE FROM projects').run();
};
