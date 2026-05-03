const Task = require('../models/Task');
const Project = require('../models/Project');

exports.create = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    if (assignedTo && !req.project.getMemberRole(assignedTo)) {
      return res.status(400).json({ message: 'Assignee must be a project member' });
    }
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignedTo || null,
      project: req.project._id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.listForProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.project._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await Project.findById(task.project);
    const role = project.getMemberRole(req.user._id);
    if (!role) return res.status(403).json({ message: 'Not a project member' });
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    if (role !== 'Admin' && !isAssignee) {
      return res.status(403).json({ message: 'Only assignee or Admin can update' });
    }
    task.status = status || task.status;
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await Project.findById(task.project);
    if (project.getMemberRole(req.user._id) !== 'Admin') {
      return res.status(403).json({ message: 'Admin role required' });
    }
    const fields = ['title', 'description', 'dueDate', 'priority', 'assignedTo', 'status'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const project = await Project.findById(task.project);
    if (project.getMemberRole(req.user._id) !== 'Admin') {
      return res.status(403).json({ message: 'Admin role required' });
    }
    await task.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
