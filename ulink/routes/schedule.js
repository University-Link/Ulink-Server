var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const scheduleController = require('../controllers/schedule');

router.post('/', authUtil.checkToken, scheduleController.createSchedule);

router.get('/main', authUtil.checkToken, scheduleController.getMainSchedule);
router.put('/main/:idx', authUtil.checkToken, scheduleController.updateMainSchedule);
router.delete('/main/:idx', authUtil.checkToken, scheduleController.deleteMainSchedule);

router.put('/name/:idx', authUtil.checkToken, scheduleController.updateNameSchedule);

router.get('/list', authUtil.checkToken, scheduleController.getScheduleList);

router.post('/school', authUtil.checkToken, scheduleController.createScheduleSchool);

router.post('/personal', authUtil.checkToken, scheduleController.createSchedulePersonal);
router.put('/personal/:idx', authUtil.checkToken, scheduleController.updateSchedulePersonal);

router.get('/specific/:idx', authUtil.checkToken, scheduleController.getSpecificSchedule);
router.delete('/specific/:idx', authUtil.checkToken, scheduleController.deleteSpecificSchedule);
router.put('/specific/:idx', authUtil.checkToken, scheduleController.updateSpecificSchedule);

router.get('/:idx', authUtil.checkToken, scheduleController.getSchedule);

module.exports = router;