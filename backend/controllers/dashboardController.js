const Task = require('../models/Task');

exports.stats = async (req, res, next) => {
  try {
    const projectId = req.project._id;
    const now = new Date();

    const [total, byStatus, perUser, overdue] = await Promise.all([
      Task.countDocuments({ project: projectId }),
      Task.aggregate([
        { $match: { project: projectId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { project: projectId, assignedTo: { $ne: null } } },
        { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { _id: 0, userId: '$_id', name: '$user.name', email: '$user.email', count: 1 } },
      ]),
      Task.countDocuments({
        project: projectId,
        dueDate: { $lt: now },
        status: { $ne: 'Done' },
      }),
    ]);

    res.json({ total, byStatus, perUser, overdue });
  } catch (err) {
    next(err);
  }
};
