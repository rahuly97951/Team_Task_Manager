const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const request = require('supertest');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teamtaskmanager_test';

const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

test.beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Task.deleteMany({})]);
});

test.after(async () => {
  await mongoose.disconnect();
});

test('health check returns ok', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
});

test('signup creates user and returns token', async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
  assert.strictEqual(res.status, 201);
  assert.ok(res.body.token);
  assert.strictEqual(res.body.user.email, 'test@example.com');
  assert.strictEqual(res.body.user.password, undefined);
});

test('signup rejects duplicate email', async () => {
  await request(app).post('/api/auth/signup')
    .send({ name: 'A', email: 'dup@example.com', password: 'password123' });
  const res = await request(app).post('/api/auth/signup')
    .send({ name: 'B', email: 'dup@example.com', password: 'password123' });
  assert.strictEqual(res.status, 409);
});

test('login returns token with valid creds', async () => {
  await request(app).post('/api/auth/signup')
    .send({ name: 'Login User', email: 'login@example.com', password: 'password123' });
  const res = await request(app).post('/api/auth/login')
    .send({ email: 'login@example.com', password: 'password123' });
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.token);
});

test('login rejects bad password', async () => {
  await request(app).post('/api/auth/signup')
    .send({ name: 'X', email: 'x@example.com', password: 'password123' });
  const res = await request(app).post('/api/auth/login')
    .send({ email: 'x@example.com', password: 'wrong' });
  assert.strictEqual(res.status, 401);
});

test('protected route rejects without token', async () => {
  const res = await request(app).get('/api/auth/me');
  assert.strictEqual(res.status, 401);
});
