require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

async function seed() {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Task.deleteMany({})]);

  console.log('Creating users...');
  const admin = await User.create({ name: 'Alice Admin', email: 'alice@demo.com', password: 'password123' });
  const bob = await User.create({ name: 'Bob Member', email: 'bob@demo.com', password: 'password123' });
  const carol = await User.create({ name: 'Carol Member', email: 'carol@demo.com', password: 'password123' });

  console.log('Creating project...');
  const project = await Project.create({
    name: 'Website Redesign',
    description: 'Demo project seeded for testing',
    createdBy: admin._id,
    members: [
      { user: admin._id, role: 'Admin' },
      { user: bob._id, role: 'Member' },
      { user: carol._id, role: 'Member' },
    ],
  });

  console.log('Creating tasks...');
  const yesterday = new Date(Date.now() - 86400000);
  const nextWeek = new Date(Date.now() + 7 * 86400000);

  await Task.insertMany([
    { title: 'Design homepage mockup', project: project._id, assignedTo: bob._id, priority: 'High', status: 'In Progress', dueDate: nextWeek },
    { title: 'Set up CI pipeline', project: project._id, assignedTo: carol._id, priority: 'Medium', status: 'To Do', dueDate: nextWeek },
    { title: 'Write API documentation', project: project._id, assignedTo: bob._id, priority: 'Low', status: 'Done' },
    { title: 'Fix login bug', project: project._id, assignedTo: carol._id, priority: 'High', status: 'To Do', dueDate: yesterday },
    { title: 'Plan launch event', project: project._id, priority: 'Medium', status: 'To Do' },
  ]);

  console.log('\nSeed complete!');
  console.log('Login as:');
  console.log('  alice@demo.com / password123  (Admin)');
  console.log('  bob@demo.com / password123    (Member)');
  console.log('  carol@demo.com / password123  (Member)');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
