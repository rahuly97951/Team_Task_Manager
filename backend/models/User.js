const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');

const stripPwd = (u) => {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
};

exports.create = async ({ name, email, password }) => {
  const id = crypto.randomUUID();
  const hashed = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)')
    .run(id, name, email.toLowerCase(), hashed);
  return stripPwd(exports.findRawById(id));
};

exports.findRawById = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id);

exports.findById = (id) => stripPwd(exports.findRawById(id));

exports.findByEmail = (email) =>
  db.prepare('SELECT * FROM users WHERE email = ?').get((email || '').toLowerCase());

exports.matchPassword = (raw, hash) => bcrypt.compare(raw, hash);

exports.deleteAll = () => db.prepare('DELETE FROM users').run();
