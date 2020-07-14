var express = require('express');
var router = express.Router();

const authUtil = require('../middlewares/auth');
const cartController = require('../controllers/cart');

router.get('/', authUtil.checkToken, cartController.getCartList);
router.post('/', authUtil.checkToken, cartController.createCart);
router.delete('/:idx', authUtil.checkToken, cartController.deleteCart);


module.exports = router;