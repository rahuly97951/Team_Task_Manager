const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/taskController');

router.use(auth);

router.patch('/:id', c.updateStatus);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
