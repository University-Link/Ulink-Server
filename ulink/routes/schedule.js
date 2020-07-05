var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const scheduleController = require('../controllers/schedule');

router.get('/', authUtil.checkToken, scheduleController.getMainSchedule);

router.post('/school', authUtil.checkToken, scheduleController.createScheduleSchool);
router.get('/school/:idx', authUtil.checkToken, scheduleController.getSpecificScheduleSchool);
router.delete('/school/:idx', authUtil.checkToken, scheduleController.deleteScheduleSchool);

router.post('/personal', authUtil.checkToken, scheduleController.createSchedulePersonal);
router.get('/personal/:idx', authUtil.checkToken, scheduleController.getSpecificSchedulePersonal);
router.delete('/personal/:idx', authUtil.checkToken, scheduleController.deleteSchedulePersonal);

router.get('/subject', authUtil.checkToken, scheduleController.getSubject);

module.exports = router;