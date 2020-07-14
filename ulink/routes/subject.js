var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const subjectController = require('../controllers/subject');

router.get('/', authUtil.checkToken, subjectController.getSubject);
router.get('/course', authUtil.checkToken, subjectController.getCourse);
router.get('/recommend', authUtil.checkToken, subjectController.getRecommendSubject);
router.get('/search', authUtil.checkToken, subjectController.getSearchSubject);

module.exports = router;