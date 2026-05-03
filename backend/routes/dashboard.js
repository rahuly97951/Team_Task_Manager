const router = require('express').Router();
const auth = require('../middleware/auth');
const { loadProject } = require('../middleware/projectAccess');
const c = require('../controllers/dashboardController');

router.use(auth);
router.get('/:id', loadProject, c.stats);

module.exports = router;
