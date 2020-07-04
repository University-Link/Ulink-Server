var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const scheduleController = require('../controllers/schedule');

router.get('/main', authUtil.checkToken, scheduleController.getMainSchedule);
router.get('/', authUtil.checkToken, scheduleController.getSchedule);
router.get('/subject', authUtil.checkToken, scheduleController.getSubject);

module.exports = router;