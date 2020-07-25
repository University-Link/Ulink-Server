var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const universityController = require('../controllers/university');

router.get('/school/:name', universityController.getSearchUniversityName);
router.post('/major', universityController.getSearchUniversityMajor);

module.exports = router;