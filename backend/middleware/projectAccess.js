const Project = require('../models/Project');

function loadProject(req, res, next) {
  try {
    const projectId = req.params.id || req.params.projectId;
    const project = Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const role = Project.getMemberRole(project.id, req.user.id);
    if (!role) return res.status(403).json({ message: 'Not a member of this project' });
    req.project = project;
    req.projectRole = role;
    next();
  } catch (err) {
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (req.projectRole !== 'Admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  next();
}

module.exports = { loadProject, requireAdmin };
