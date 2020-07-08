const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const socialModel = require('../models/social');

const social = {
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
    deleteFollowing: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const idx = req.params.idx;

        var result = await socialModel.getFollowing(userIdx)
        if (result.length == 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.SOCIAL_DELETE_FAIL));
        }
        const deleteIdx = await socialModel.deleteFollowing(idx);
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.SOCIAL_DELETE_SUCCESS, {
                deleteIdx: idx
            }));
    },
}

module.exports = social;