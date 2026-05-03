require('dotenv').config();
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

async function seed() {
  console.log('Clearing existing data...');
  Task.deleteAll();
  Project.deleteAll();
  User.deleteAll();

  console.log('Creating users...');
  const admin = await User.create({ name: 'Alice Admin', email: 'alice@demo.com', password: 'password123' });
  const bob = await User.create({ name: 'Bob Member', email: 'bob@demo.com', password: 'password123' });
  const carol = await User.create({ name: 'Carol Member', email: 'carol@demo.com', password: 'password123' });

  console.log('Creating project...');
  const project = Project.create({
    name: 'Website Redesign',
    description: 'Demo project seeded for testing',
    createdBy: admin.id,
  });
  Project.addMember(project.id, bob.id, 'Member');
  Project.addMember(project.id, carol.id, 'Member');

  console.log('Creating tasks...');
  const yesterday = new Date(Date.now() - 86400000).toISOString();
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();

  Task.create({ title: 'Design homepage mockup', projectId: project.id, assignedTo: bob.id, priority: 'High', status: 'In Progress', dueDate: nextWeek });
  Task.create({ title: 'Set up CI pipeline', projectId: project.id, assignedTo: carol.id, priority: 'Medium', status: 'To Do', dueDate: nextWeek });
  Task.create({ title: 'Write API documentation', projectId: project.id, assignedTo: bob.id, priority: 'Low', status: 'Done' });
  Task.create({ title: 'Fix login bug', projectId: project.id, assignedTo: carol.id, priority: 'High', status: 'To Do', dueDate: yesterday });
  Task.create({ title: 'Plan launch event', projectId: project.id, priority: 'Medium', status: 'To Do' });

  console.log('\nSeed complete!');
  console.log('Login as:');
  console.log('  alice@demo.com / password123  (Admin)');
  console.log('  bob@demo.com / password123    (Member)');
  console.log('  carol@demo.com / password123  (Member)');
}

seed().catch((err) => { console.error(err); process.exit(1); });
