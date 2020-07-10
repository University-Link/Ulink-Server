const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const cartModel = require('../models/cart');
const moment = require('../modules/moment');

const cart = {
    getCartList: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const semester = req.query.semester;
        if (!semester || !userIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const getCartList = await cartModel.getCartList(userIdx, semester);
        if (getCartList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CART_SUCCESS,
                getCartList
            ));
    },
    createCart: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const subjectIdx = req.params.idx;
        const {
            semester
        } = req.body;
        let createCart;
        if (!userIdx || !subjectIdx || !semester) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if (createCart < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        if (await cartModel.checkCart(userIdx, subjectIdx, semester)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.CART_POST_FAIL));
        } else {
            createCart = await cartModel.createCart(userIdx, subjectIdx, semester);
            return res.status(statusCode.OK)
                .send(util.success(statusCode.OK, resMessage.CART_POST_SUCCESS, {
                    subjectIdx: subjectIdx
                }));
        }
    },
    deleteCart: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const subjectIdx = req.params.idx;
        const {
            semester
        } = req.body;
        if (!userIdx || !subjectIdx || !semester) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if (!await cartModel.checkCart(userIdx, subjectIdx, semester)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.CART_DELETE_FAIL));
        }
        const deleteCart = await cartModel.deleteCart(userIdx, subjectIdx, semester);
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CART_DELETE_SUCCESS, {
                deleteIdx: subjectIdx
            }));
    },
}

module.exports = cart;
