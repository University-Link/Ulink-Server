var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const socialController = require('../controllers/social');

router.get('/following', authUtil.checkToken, socialController.getFollowing);
router.get('/follower', authUtil.checkToken, socialController.getFollower);
router.post('/following/:idx', authUtil.checkToken, socialController.postFollowing);
router.delete('/following/:idx', authUtil.checkToken, socialController.deleteFollowing);

module.exports = router;