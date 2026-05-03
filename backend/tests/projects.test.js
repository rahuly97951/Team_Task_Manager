const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const request = require('supertest');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.DB_PATH = path.join(__dirname, 'test_projects.db');
try { fs.unlinkSync(process.env.DB_PATH); } catch {}

const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

let adminToken, memberToken, memberId;

test.beforeEach(async () => {
  Task.deleteAll();
  Project.deleteAll();
  User.deleteAll();
  const a = await request(app).post('/api/auth/signup')
    .send({ name: 'Admin', email: 'admin@t.com', password: 'password123' });
  adminToken = a.body.token;
  const m = await request(app).post('/api/auth/signup')
    .send({ name: 'Member', email: 'member@t.com', password: 'password123' });
  memberToken = m.body.token;
  memberId = m.body.user._id;
});

test.after(() => {
  try { fs.unlinkSync(process.env.DB_PATH); } catch {}
  try { fs.unlinkSync(process.env.DB_PATH + '-wal'); } catch {}
  try { fs.unlinkSync(process.env.DB_PATH + '-shm'); } catch {}
});

test('create project sets creator as Admin', async () => {
  const res = await request(app).post('/api/projects')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'P1', description: 'desc' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.name, 'P1');
  assert.strictEqual(res.body.members[0].role, 'Admin');
});

test('non-member cannot view project', async () => {
  const p = await request(app).post('/api/projects')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Private' });
  const res = await request(app).get(`/api/projects/${p.body._id}`)
    .set('Authorization', `Bearer ${memberToken}`);
  assert.strictEqual(res.status, 403);
});

test('Admin can add member by email', async () => {
  const p = await request(app).post('/api/projects')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Team' });
  const res = await request(app).post(`/api/projects/${p.body._id}/members`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ email: 'member@t.com' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.members.length, 2);
});

test('Member cannot create task (admin only)', async () => {
  const p = await request(app).post('/api/projects')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Team' });
  await request(app).post(`/api/projects/${p.body._id}/members`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ email: 'member@t.com' });
  const res = await request(app).post(`/api/projects/${p.body._id}/tasks`)
    .set('Authorization', `Bearer ${memberToken}`)
    .send({ title: 'Sneaky' });
  assert.strictEqual(res.status, 403);
});

test('Member can update own assigned task status', async () => {
  const p = await request(app).post('/api/projects')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Team' });
  await request(app).post(`/api/projects/${p.body._id}/members`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ email: 'member@t.com' });
  const t = await request(app).post(`/api/projects/${p.body._id}/tasks`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ title: 'Do this', assignedTo: memberId });
  const res = await request(app).patch(`/api/tasks/${t.body._id}`)
    .set('Authorization', `Bearer ${memberToken}`)
    .send({ status: 'In Progress' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'In Progress');
});

test('dashboard returns stats', async () => {
  const p = await request(app).post('/api/projects')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Stats' });
  await request(app).post(`/api/projects/${p.body._id}/tasks`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ title: 'T1', priority: 'High' });
  await request(app).post(`/api/projects/${p.body._id}/tasks`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ title: 'T2', priority: 'Low' });
  const res = await request(app).get(`/api/dashboard/${p.body._id}`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.total, 2);
});
