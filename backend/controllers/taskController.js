const Task = require('../models/Task');
const Project = require('../models/Project');

const shape = (t) => ({
  _id: t.id,
  title: t.title,
  description: t.description,
  project: t.projectId,
  assignedTo: t.assignedTo || null,
  priority: t.priority,
  status: t.status,
  dueDate: t.dueDate,
  createdAt: t.createdAt,
});

exports.create = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    if (assignedTo && !Project.getMemberRole(req.project.id, assignedTo)) {
      return res.status(400).json({ message: 'Assignee must be a project member' });
    }
    const task = Task.create({
      title,
      description,
      projectId: req.project.id,
      assignedTo: assignedTo || null,
      priority,
      dueDate,
    });
    res.status(201).json(shape(task));
  } catch (err) {
    next(err);
  }
};

exports.listForProject = async (req, res, next) => {
  try {
    res.json(Task.listForProject(req.project.id));
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const role = Project.getMemberRole(task.projectId, req.user.id);
    if (!role) return res.status(403).json({ message: 'Not a project member' });
    const isAssignee = task.assignedTo && task.assignedTo === req.user.id;
    if (role !== 'Admin' && !isAssignee) {
      return res.status(403).json({ message: 'Only assignee or Admin can update' });
    }
    const updated = Task.update(task.id, { status });
    res.json(shape(updated));
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (Project.getMemberRole(task.projectId, req.user.id) !== 'Admin') {
      return res.status(403).json({ message: 'Admin role required' });
    }
    const updated = Task.update(task.id, req.body);
    res.json(shape(updated));
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const task = Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (Project.getMemberRole(task.projectId, req.user.id) !== 'Admin') {
      return res.status(403).json({ message: 'Admin role required' });
    }
    Task.remove(task.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
