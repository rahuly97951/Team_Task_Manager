const router = require('express').Router();
const auth = require('../middleware/auth');
const { loadProject, requireAdmin } = require('../middleware/projectAccess');
const c = require('../controllers/projectController');
const taskC = require('../controllers/taskController');

router.use(auth);

router.post('/', c.create);
router.get('/', c.listMine);
router.get('/:id', loadProject, c.detail);
router.post('/:id/members', loadProject, requireAdmin, c.addMember);
router.delete('/:id/members/:uid', loadProject, requireAdmin, c.removeMember);

router.post('/:id/tasks', loadProject, requireAdmin, taskC.create);
router.get('/:id/tasks', loadProject, taskC.listForProject);

module.exports = router;
