const pool = require('../modules/pool');

const chat = {
    getChatList: async (userIdx, profile) => {
        // 채팅목록
        
        let query = `UPDATE ${table} SET profile_image="${profile}" WHERE user_idx="${userIdx}"`;
        try {
            await pool.queryParam(query);
            query = `SELECT id, name, email, school, profile_image FROM ${table} WHERE user_idx="${userIdx}"`;
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

module.exports = chat;