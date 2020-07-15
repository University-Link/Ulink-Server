var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const scheduleController = require('../controllers/schedule');

router.post('/', authUtil.checkToken, scheduleController.createSchedule);
router.get('/main', authUtil.checkToken, scheduleController.getMainSchedule);
router.put('/main/:idx', authUtil.checkToken, scheduleController.updateMainSchedule);
router.delete('/main/:idx', authUtil.checkToken, scheduleController.deleteMainSchedule);
router.put('/name/:idx', authUtil.checkToken, scheduleController.updateNameSchedule);

router.get('/list', authUtil.checkToken, scheduleController.getSemesterList);

router.post('/school', authUtil.checkToken, scheduleController.createScheduleSchool);
router.get('/school/:idx', authUtil.checkToken, scheduleController.getSpecificScheduleSchool);
router.delete('/school/:idx', authUtil.checkToken, scheduleController.deleteScheduleSchool);

router.post('/personal', authUtil.checkToken, scheduleController.createSchedulePersonal);
router.get('/personal/:idx', authUtil.checkToken, scheduleController.getSpecificSchedulePersonal);
router.put('/personal/:idx', authUtil.checkToken, scheduleController.updateSchedulePersonal);
router.delete('/personal/:idx', authUtil.checkToken, scheduleController.deleteSchedulePersonal);

router.get('/specific/:idx', authUtil.checkToken, scheduleController.getSpecificSchedule);
router.delete('/specific/:idx', authUtil.checkToken, scheduleController.deleteSpecificSchedule);
router.put('/specific/:idx', authUtil.checkToken, scheduleController.updateSpecificSchedule);

router.get('/:idx', authUtil.checkToken, scheduleController.getSchedule);

module.exports = router;