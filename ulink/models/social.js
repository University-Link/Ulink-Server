const pool = require('../modules/pool');
const table = 'social';
const table2 = 'user';

const social = {
    /** 
    * 팔로잉 하는 사람들의 목록
    * @type SELECT
    * @param 유저 인덱스
    * @return 팔로잉한 사람들의 인덱스, 이름, 프로필 이미지
    */
    getFollowing: async (userIdx) => {
        const query = `SELECT userIdx, name, profileImage FROM ${table2} WHERE userIdx 
        IN (SELECT followingIdx FROM ${table} WHERE userIdx = ${userIdx})`;
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
    /** 
    * 팔로워하는 사람들의 목록
    * @type SELECT
    * @param 유저 인덱스
    * @return 팔로워한 사람들의 인덱스, 이름, 프로필 이미지
    */
    getFollower: async (userIdx) => {
        const query = `SELECT userIdx, name, profileImage FROM ${table2} WHERE userIdx 
        IN (SELECT userIdx FROM ${table} WHERE followingIdx = ${userIdx})`;
        try {
            const result = await pool.queryParam(query);
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
    /** 
    * 팔로잉 정보 추가
    * @type INSERT
    * @param 유저 인덱스 (자신), 팔로잉 할 유저 인덱스
    * @return 팔로잉 할 유저 인덱스
    */
    postFollowing: async (userIdx, idx) => {
        const fields = 'userIdx, followingIdx';
        const questions = '?,?';
        const values = [userIdx, idx];
        const query = `INSERT INTO ${table}(${fields}) VALUES (${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const followingIdx = result.followingIdx;
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
    /** 
    * 팔로잉 정보 찾기
    * @type SELECT
    * @param 유저 인덱스 (자신), 팔로잉 확인하고 싶은 유저 인덱스
    * @return 팔로잉 상태 (Boolean)
    */
    checkFollowing: async (userIdx, idx) => {
        const query = `SELECT * FROM ${table} WHERE followingIdx = ${idx} AND userIdx = ${userIdx}`;
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
    /** 
    * 팔로잉 정보 삭제
    * @type DELETE
    * @param 유저 인덱스 (자신), 팔로잉 취소하고 싶은 유저 인덱스
    * @return 정보 삭제 정보
    */
    deleteFollowing: async (userIdx, idx) => {
        const query = `DELETE FROM ${table} WHERE followingIdx = ${idx} AND userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParamArr(query);
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