const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const cartModel = require('../models/cart');
const moment = require('../modules/moment');

const cart = {
    /** 
     * 장바구니(후보) 목록 조회
     * @summary 현재 유저가 선택한 학기 시간표의 과목들의 장바구니 목록 가져오기
     * @param 토큰, 해당 학기
     * @return 선택 학기의 장바구니 목록(각 과목의 대한 정보)
     */
    getCartList: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const semester = req.query.semester;
        if (!semester || !userIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const getCartList = await cartModel.getCartList(userIdx, semester);
        if (getCartList < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CART_SUCCESS,
                getCartList
            ));
    },
    /** 
     * 장바구니 과목 추가하기
     * @summary 장바구니에 과목 추가하기
     * @param 토큰, 과목 인덱스, 학기
     * @return 추가한 데이터 인덱스
     */
    createCart: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const {
            semester,
            subjectIdx
        } = req.body;
        if (!userIdx || !subjectIdx || !semester) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if (await cartModel.checkCart(userIdx, subjectIdx, semester)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.CREATE_CART_FAIL));
        } else {
            const cart = await cartModel.createCart(userIdx, subjectIdx, semester);
            if (cart < 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }
            return res.status(statusCode.CREATED)
                .send(util.success(statusCode.CREATED, resMessage.CREATE_CART_SUCCESS));
        }
    },
    /** 
     * 장바구니 과목 삭제하기
     * @summary 장바구니 과목 삭제하기
     * @param 토큰, 과목 인덱스, 학기
     * @return 삭제한 데이터 인덱스
     */
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
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_CART_FAIL));
        }
        const cart = await cartModel.deleteCart(userIdx, subjectIdx, semester);
        if (cart < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DELETE_CART_FAIL));
        }
        return res.status(statusCode.NO_CONTENT)
            .send(util.success(statusCode.NO_CONTENT, resMessage.DELETE_CART_SUCCESS));
    },
}

module.exports = cart;
