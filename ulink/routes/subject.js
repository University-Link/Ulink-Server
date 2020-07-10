var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const subjectController = require('../controllers/subject');

router.get('/', authUtil.checkToken, subjectController.getSubject);
router.post('/recommend', authUtil.checkToken, subjectController.getLikeSubject);
router.post('/search', authUtil.checkToken, subjectController.getSearchSubject);

module.exports = router;