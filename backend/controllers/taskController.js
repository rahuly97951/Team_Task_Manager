const Task = require('../models/Task');
const Project = require('../models/Project');

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
    res.status(201).json(task);
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
    const raw = Task.findRawById(req.params.id);
    if (!raw) return res.status(404).json({ message: 'Task not found' });
    const role = Project.getMemberRole(raw.projectId, req.user.id);
    if (!role) return res.status(403).json({ message: 'Not a project member' });
    const isAssignee = raw.assignedTo && raw.assignedTo === req.user.id;
    if (role !== 'Admin' && !isAssignee) {
      return res.status(403).json({ message: 'Only assignee or Admin can update' });
    }
    const updated = Task.update(raw.id, { status });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const raw = Task.findRawById(req.params.id);
    if (!raw) return res.status(404).json({ message: 'Task not found' });
    if (Project.getMemberRole(raw.projectId, req.user.id) !== 'Admin') {
      return res.status(403).json({ message: 'Admin role required' });
    }
    const updated = Task.update(raw.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const raw = Task.findRawById(req.params.id);
    if (!raw) return res.status(404).json({ message: 'Task not found' });
    if (Project.getMemberRole(raw.projectId, req.user.id) !== 'Admin') {
      return res.status(403).json({ message: 'Admin role required' });
    }
    Task.remove(raw.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
