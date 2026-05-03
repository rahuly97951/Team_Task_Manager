const Project = require('../models/Project');
const User = require('../models/User');

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'Admin' }],
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

exports.listMine = async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const project = await Project.findById(req.project._id)
      .populate('members.user', 'name email')
      .populate('createdBy', 'name email');
    res.json({ project, role: req.projectRole });
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.project.getMemberRole(user._id)) {
      return res.status(409).json({ message: 'Already a member' });
    }
    req.project.members.push({ user: user._id, role: 'Member' });
    await req.project.save();
    res.json(req.project);
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { uid } = req.params;
    if (req.project.createdBy.toString() === uid) {
      return res.status(400).json({ message: 'Cannot remove project creator' });
    }
    req.project.members = req.project.members.filter((m) => m.user.toString() !== uid);
    await req.project.save();
    res.json(req.project);
  } catch (err) {
    next(err);
  }
};
