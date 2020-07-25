var express = require('express');
var router = express.Router();

router.use('/user', require('./user'));
router.use('/schedule', require('./schedule'));
router.use('/chat', require('./chat'));
router.use('/notice', require('./notice'));
router.use('/cart', require('./cart'));
router.use('/subject', require('./subject'));
router.use('/university', require('./university'));

module.exports = router;
