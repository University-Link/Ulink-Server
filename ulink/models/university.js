const pool = require('../modules/pool');
const table = 'university';

const university = {
    /** 
     * 특정 단어 포함 학교 조회
     * @type SELECT
     * @param 학교명을 찾기위한 단어
     * @return 단어가 포함된 학교 리스트
     */
    getSearchUniversityName: async (name) => {
        const query = `SELECT DISTINCT name FROM ${table} 
        WHERE name LIKE "%${name}%"
        ORDER BY name
        LIMIT 10 `;
        try {
            return await pool.queryParam(query);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSearchUniversityName ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSearchUniversityName ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 특정 단어 포함 학교의 전공 조회
     * @type SELECT
     * @param 학교의 전공을 찾기위한 단어
     * @return 단어가 포함된 학교의 전공 리스트
     */
    getSearchUniversityMajor: async (name, major) => {
        const query = `SELECT DISTINCT major FROM ${table} 
        WHERE name = "${name}" AND major LIKE "%${major}%"
        ORDER BY major
        LIMIT 10 `;
        try {
            return await pool.queryParam(query);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSearchUniversityName ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSearchUniversityName ERROR: ', err);
            throw err;
        }
    },
}

module.exports = university;