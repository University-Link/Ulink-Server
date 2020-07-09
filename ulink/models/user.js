const pool = require('../modules/pool');
const encrypt = require('../modules/encryption');
const table = 'user';

const user = {
    signUp: async (id, password, salt, name, email, nickname, school) => {
        const fields = 'id, password, salt, name, email, nickname, school';
        const questions = '?, ?, ?, ?, ?, ?, ?';
        const values = [id, password, salt, name, email, nickname, school];
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
    checkUser: async (id) => {
        const query = `SELECT * FROM ${table} WHERE id = "${id}"`;
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
    getUserById: async (id) => {
        const query = `SELECT * FROM ${table} WHERE id = "${id}"`;
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
    getUserList: async () => {
        const query = `SELECT * FROM ${table}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getUserList ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getUserList ERROR: ', err);
            throw err;
        }
    },
    updateProfile: async (userIdx, profile) => {
        let query = `UPDATE ${table} SET profileImage="${profile}" WHERE userIdx="${userIdx}"`;
        try {
            await pool.queryParam(query);
            query = `SELECT id, name, email, school, profileImage FROM ${table} WHERE userIdx="${userIdx}"`;
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