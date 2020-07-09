var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const chatController = require('../controllers/chat');

router.get('/', authUtil.checkToken, chatController.chat);

module.exports = router;