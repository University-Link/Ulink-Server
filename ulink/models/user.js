const pool = require('../modules/pool');
const encrypt = require('../modules/encryption');
const table = 'user';

const user = {
    /** 
    * 유저정보 추가
    * @type INSERT
    * @param 아이디, 비밀번호, Salt, 이름, 이메일, 별명, 학교명
    * @return 추가된 Idx
    */
    signUp: async (id, password, salt, name, email, nickname, school, gender) => {
        const fields = 'username, password, salt, name, email, nickname, school, gender';
        const questions = '?, ?, ?, ?, ?, ?, ?, ?';
        const values = [id, password, salt, name, email, nickname, school, gender];
        const query = `INSERT INTO ${table}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR: ', err);
            throw err;
        }
    },
    /** 
    * 유저 존재확인
    * @type SELECT
    * @param 아이디
    * @return 존재여부 (Boolean)
    */
    checkUser: async (id) => {
        const query = `SELECT * FROM ${table} WHERE username = "${id}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.length === 0) {
                return false;
            } else
                return true;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkUser ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('checkUser ERROR: ', err);
            throw err;
        }
    },
    /** 
    * 유저정보
    * @type SELECT
    * @param 아이디
    * @return 아이디에 해당하는 유저정보
    */
    getUserById: async (id) => {
        const query = `SELECT * FROM ${table} WHERE username = "${id}"`;
        try {
            return await pool.queryParam(query);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getUserById ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getUserById ERROR: ', err);
            throw err;
        }
    },
    /** 
    * 유저정보
    * @type SELECT
    * @param 인덱스
    * @return 인덱스에 해당하는 유저정보
    */
    getUserByIdx: async (userIdx) => {
        const query = `SELECT * FROM ${table} WHERE userIdx = "${userIdx}"`;
        try {
            return await pool.queryParam(query);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getUserByIdx ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getUserByIdx ERROR: ', err);
            throw err;
        }
    },
    /** 
    * 프로필 사진 업데이트
    * @type UPDATE
    * @param 유저 인덱스, 프로필 사진 주소
    * @return 업데이트한 유저 정보
    */
    updateProfile: async (userIdx, profile) => {
        let query = `UPDATE ${table} SET profileImage="${profile}" WHERE userIdx="${userIdx}"`;
        try {
            await pool.queryParam(query);
            query = `SELECT username, name, email, school, profileImage FROM ${table} WHERE userIdx="${userIdx}"`;
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateProfile ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateProfile ERROR: ', err);
            throw err;
        }
    },
}

module.exports = user;