const Task = require('../models/Task');

exports.stats = async (req, res, next) => {
  try {
    res.json(Task.statsForProject(req.project.id));
  } catch (err) {
    next(err);
  }
};
