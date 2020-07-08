const pool = require('../modules/pool');
const table = 'social';
const table2 = 'user';

const social = {
    /*
        팔로잉 하는 사람들의 목록
        - 토큰으로 유저에 해당하는 소셜의 정보를 가져온다.
        - 가져오기: 팔로잉한 사람들의 idx, name, profile_image
    */
    getFollowing: async (userIdx) => {
        const query = `SELECT user_idx, name, profile_image FROM ${table2} WHERE user_idx IN (SELECT following_idx FROM ${table} WHERE user_idx = "${userIdx}")`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getFollowingList ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getFollowingList ERROR : ', err);
            throw err;
        }
    },
    /*
        팔로워하는 사람들의 목록
        - 토큰으로 유저에 해당하는 소셜의 정보를 가져온다.
        - 가져오기: 팔로워한 사람들의 idx, name, profile_image
    */
    getFollower: async (userIdx) => {
        const query = `SELECT user_idx, name, profile_image FROM ${table2} WHERE user_idx IN (SELECT user_idx FROM ${table} WHERE following_idx = "${userIdx}")`;
        try {
            const result = await pool.queryParam(query);
            console.log('쿼리로 뽑아온 데이터: ', result);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getFollowerList ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getFollowerList ERROR : ', err);
            throw err;
        }
    },
    /*
        팔로잉하는 사람 추가하기
    */
    postFollowing: async (userIdx, idx) => {
        const fields = 'user_idx, following_idx';
        const questions = '?,?';
        const values = [userIdx, idx];
        const query = `INSERT INTO ${table}(${fields}) VALUES (${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const followingIdx = result.following_idx;
            return followingIdx;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('postFollowing ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('postFollowing ERROR : ', err);
            throw err;
        }
    },
    /*
        팔로잉 하는 사람 중복 체크
    */
    checkFollowing: async (userIdx, idx) => {
        const query = `SELECT * FROM ${table} WHERE following_idx = "${idx}" AND user_idx = "${userIdx}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.length === 0) {
                return false;
            } else {
                return true;
            }
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkFollowing ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('checkFollowing ERROR: ', err);
            throw err;
        }
    },
    /*
        팔로잉 하는 사람 삭제
    */
    deleteFollowing: async (idx) => {
        const query = `DELETE FROM ${table} WHERE following_idx = "${idx}"`;
        try {
            const result = await pool.queryParamArr(query);
            console.log('Delete post - result: ', result);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteFollowing ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('deleteFollowing ERROR: ', err);
            throw err;
        }
    },
}

module.exports = social;