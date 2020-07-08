var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const noticeController = require('../controllers/notice');

router.get('/', authUtil.checkToken, noticeController.getNoticeList);

router.get('/subject/:idx', authUtil.checkToken, noticeController.getNotice);
router.post('/subject/:idx', authUtil.checkToken, noticeController.createNotice);

router.get('/:idx', authUtil.checkToken, noticeController.getSpecificNotice);
router.put('/:idx', authUtil.checkToken, noticeController.updateSpecificNotice);

module.exports = router;