const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const socialModel = require('../models/social');

const social = {
    /** 
    * 팔로잉 정보 가져오기
    * @summary 유저의 팔로잉 리스트 가져오기
    * @param 토큰
    * @return 유저의 팔로잉 리스트
    */
    getFollowing: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const followingList = await socialModel.getFollowing(userIdx);
        if (followingList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.SOCIAL_SUCCESS, {
                followingList
            }));
    },
    /** 
    * 팔로워 정보 가져오기
    * @summary 유저의 팔로워 리스트 가져오기
    * @param 토큰
    * @return 유저의 팔로워 리스트
    */
    getFollower: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const followerList = await socialModel.getFollower(userIdx);
        if (followerList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.SOCIAL_SUCCESS, {
                followerList
            }));
    },
    /** 
    * 팔로잉하기
    * @summary 유저 팔로잉
    * @param 토큰, 팔로잉 할 유저의 인덱스
    * @return 팔로잉 한 유저의 인덱스
    */
    postFollowing: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const idx = req.params.idx;
        if (!userIdx || !idx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if (await socialModel.checkFollowing(userIdx, idx)) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SOCIAL_POST_FAIL));
        }
        if (userIdx != idx) {
            const followingIdx = await socialModel.postFollowing(userIdx, idx);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SOCIAL_POST_SUCCESS, {
                followingIdx: idx
            }))
        }
    },
    /** 
    * 팔로잉 취소하기
    * @summary 유저 팔로잉 취소
    * @param 토큰, 팔로잉 취소 할 유저의 인덱스
    * @return 팔로잉 취소 한 유저의 인덱스
    */
    deleteFollowing: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const idx = req.params.idx;

        var result = await socialModel.getFollowing(userIdx)
        if (result.length == 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.SOCIAL_DELETE_FAIL));
        }
        const deleteIdx = await socialModel.deleteFollowing(userIdx, idx);
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.SOCIAL_DELETE_SUCCESS, {
                deleteIdx: idx
            }));
    },
}

module.exports = social;