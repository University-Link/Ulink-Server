const pool = require('../modules/pool');
const table = 'cart';

const connectTimePlace = (subjects) => {
    const res = [];
    let timePlace;
    let temp = {
        'subjectIdx': 'n'
    };
    for (let subject of subjects) {
        if (temp.subjectIdx != subject.subjectIdx) {
            if (temp.subjectIdx != 'n') {
                res.push(Object.assign(temp, timePlace));
            }
            temp = {
                'subjectIdx': subject.subjectIdx,
                'subjectCode': subject.subjectCode,
                'name': subject.name,
                'professor': subject.professor,
                'credit': subject.credit,
                'course': subject.course
            };
            timePlace = {
                'startTime': [],
                'endTime': [],
                'day': [],
                'content': []
            };
        }
        timePlace.startTime.push(subject.startTime);
        timePlace.endTime.push(subject.endTime);
        timePlace.day.push(subject.day);
        timePlace.content.push(subject.content);
    }

    return res;
}

const cart = {
    /** 
    * 장바구니(후보 과목) 가져오기
    * @type SELECT
    * @param 유저 인덱스, 학기
    * @return 유저와 학기의 장바구니(과목) 정보
        (장바구니 인덱스, 유저 인덱스, 과목 인덱스, 학기, 과목이름, 
        학수번호, 교수명, 학교, 전공명, 학년, 학점, 최대인원 수, 교과정보(전필/전선/교양/교필...))
    */
    getCartList: async (userIdx, semester) => {
        const query1 = `SELECT * FROM cart 
        WHERE userIdx = ${userIdx} AND semester="${semester}"`;
        const query2 = `SELECT q1.subjectIdx, s.subjectCode, s.name, s.nameAtomic, s.professor, s.college, s.grade, s.people, s.major, s.credit, s.course 
        FROM (${query1}) q1 INNER JOIN subject s ON q1.subjectIdx = s.subjectIdx`;
        const query3 = `SELECT q2.*, tp.startTime, tp.endTime, tp.content, tp.day
        FROM (${query2}) q2 INNER JOIN subject_timeplace tp ON tp.subjectIdx = q2.subjectIdx`
        try {
            const subjects = await pool.queryParam(query3);
            return connectTimePlace(subjects);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getCartList ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getCartList ERROR : ', err);
            throw err;
        }
    },
    /** 
     * 장바구니(후보 과목) 추가
     * @type INSERT
     * @param 유저 인덱스, 과목 인덱스, 학기
     * @return 추가된 장바구니 과목 인덱스
     */
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
    /** 
     * 장바구니(후보 과목) 확인
     * @type SELECT
     * @param 유저 인덱스, 과목 인덱스, 학기
     * @return 장바구니 존재여부 (Boolean)
     */
    checkCart: async (userIdx, subjectIdx, semester) => {
        const query = `SELECT * FROM ${table} WHERE subjectIdx = ${subjectIdx} 
        AND userIdx = ${userIdx} AND semester="${semester}"`;

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
    /** 
     * 장바구니(후보 과목) 삭제
     * @type DELETE
     * @param 유저 인덱스, 과목 인덱스, 학기
     * @return 삭제한 장바구니 과목 인덱스
     */
    deleteCart: async (userIdx, subjectIdx, semester) => {
        const query = `DELETE FROM ${table} WHERE subjectIdx = ${subjectIdx} 
        AND userIdx = ${userIdx} AND semester="${semester}"`;
        try {
            const result = await pool.queryParamArr(query);
            if (result.affectedRows > 0) return 1;
            else return 0;
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