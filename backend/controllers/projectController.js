const Project = require('../models/Project');
const User = require('../models/User');

const shapeProject = (p, members = null, role = null) => ({
  _id: p.id,
  name: p.name,
  description: p.description,
  createdBy: p.createdBy,
  createdAt: p.createdAt,
  members: members || [],
  ...(role !== null ? { role } : {}),
});

const shapeMember = (m) => ({
  user: { _id: m.id, name: m.name, email: m.email },
  role: m.role,
});

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });
    const project = Project.create({ name, description, createdBy: req.user.id });
    const members = Project.listMembers(project.id).map(shapeMember);
    res.status(201).json(shapeProject(project, members));
  } catch (err) {
    next(err);
  }
};

exports.listMine = async (req, res, next) => {
  try {
    const projects = Project.listForUser(req.user.id).map((p) => {
      const members = Project.listMembers(p.id).map(shapeMember);
      const creator = User.findById(p.createdBy);
      return {
        ...shapeProject(p, members),
        createdBy: creator ? { _id: creator.id, name: creator.name, email: creator.email } : null,
      };
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const members = Project.listMembers(req.project.id).map(shapeMember);
    const creator = User.findById(req.project.createdBy);
    const project = {
      ...shapeProject(req.project, members),
      createdBy: creator ? { _id: creator.id, name: creator.name, email: creator.email } : null,
    };
    res.json({ project, role: req.projectRole });
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = User.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (Project.getMemberRole(req.project.id, user.id)) {
      return res.status(409).json({ message: 'Already a member' });
    }
    Project.addMember(req.project.id, user.id, 'Member');
    const members = Project.listMembers(req.project.id).map(shapeMember);
    res.json(shapeProject(req.project, members));
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { uid } = req.params;
    if (req.project.createdBy === uid) {
      return res.status(400).json({ message: 'Cannot remove project creator' });
    }
    Project.removeMember(req.project.id, uid);
    const members = Project.listMembers(req.project.id).map(shapeMember);
    res.json(shapeProject(req.project, members));
  } catch (err) {
    next(err);
  }
};
