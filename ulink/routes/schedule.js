var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const scheduleController = require('../controllers/schedule');

router.get('/', authUtil.checkToken, scheduleController.getMainSchedule);

router.get('/list', authUtil.checkToken, scheduleController.getSemesterList);

router.post('/school', authUtil.checkToken, scheduleController.createScheduleSchool);
router.get('/school/:idx', authUtil.checkToken, scheduleController.getSpecificScheduleSchool);
router.delete('/school/:idx', authUtil.checkToken, scheduleController.deleteScheduleSchool);

router.post('/personal', authUtil.checkToken, scheduleController.createSchedulePersonal);
router.get('/personal/:idx', authUtil.checkToken, scheduleController.getSpecificSchedulePersonal);
router.put('/personal/:idx', authUtil.checkToken, scheduleController.updateSchedulePersonal);
router.delete('/personal/:idx', authUtil.checkToken, scheduleController.deleteSchedulePersonal);

router.get('/:idx', authUtil.checkToken, scheduleController.getSpecificSchedule);
router.delete('/:idx', authUtil.checkToken, scheduleController.deleteSpecificSchedule);

module.exports = router;