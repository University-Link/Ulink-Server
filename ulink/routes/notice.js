var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const noticeController = require('../controllers/notice');

router.get('/', authUtil.checkToken, noticeController.getNoticeList);

// schedule_school_idx 에 대한 notice를 가져온다
router.get('/school/:idx', authUtil.checkToken, noticeController.getNotice);

router.get('/:idx', authUtil.checkToken, noticeController.getSpecificNotice);
router.put('/:idx', authUtil.checkToken, noticeController.updateSpecificNotice);

module.exports = router;