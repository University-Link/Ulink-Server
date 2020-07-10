const pool = require('../modules/pool');
const table = 'cart';

const cart = {
    getCartList: async (userIdx, semester) => {
        const query = `SELECT * FROM
        (
            SELECT * FROM cart 
            WHERE userIdx = ${userIdx} AND semester="${semester}"
        ) s1
        INNER JOIN subject s2 ON s1.subjectIdx = s2.subjectIdx`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getCartList ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getCartList ERROR : ', err);
            throw err;
        }
    },
    createCart: async (userIdx, subjectIdx, semester) => {
        const fields = 'userIdx, subjectIdx, semester';
        const questions = '?,?,?';
        const values = [userIdx, subjectIdx, semester];
        const query = `INSERT INTO ${table}(${fields}) VALUES (${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('createCart ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('createCart ERROR : ', err);
            throw err;
        }
    },
    checkCart: async (userIdx, subjectIdx, semester) => {
        const query = `SELECT * FROM ${table} WHERE subjectIdx = ${subjectIdx} AND userIdx = ${userIdx} AND semester="${semester}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.length === 0) {
                return false;
            } else {
                return true;
            }
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkCart ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('checkCart ERROR: ', err);
            throw err;
        }
    },
    deleteCart: async (userIdx, subjectIdx, semester) => {
        const query = `DELETE FROM ${table} WHERE subjectIdx = ${subjectIdx} AND userIdx = ${userIdx} AND semester="${semester}"`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteCart ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('deleteCart ERROR: ', err);
            throw err;
        }
    },
}

module.exports = cart;