const pool = require('../modules/pool');
const connect = require('../modules/connect');

const checkOnDay = (onDay, day) => {
    if (onDay === undefined) return true;
    let isOkOnDay = true;
    for (let d of onDay) {
        if (!day.includes(parseInt(d))) {
            isOkOnDay = false;
            break;
        }
    }
    return isOkOnDay;
}
const checkOffDay = (offDay, day) => {
    if (offDay === undefined) return true;
    let isOkOffDay = true;
    for (let d of offDay) {
        if (day.includes(parseInt(d))) {
            isOkOffDay = false;
            break;
        }
    }
    return isOkOffDay;
}

const subject = {
    /** 
     * 모든 수업 데이터 조회
     * @type SELECT
     * @param 학교명
     * @return 학교에 해당하는 모든 수업 목록
     */
    getSubject: async (school) => {
        const query1 = `SELECT subjectIdx, subjectCode, name, professor, credit, course
        FROM subject WHERE school = "${school}"`;
        const query2 = `SELECT q1.*, q2.startTime, q2.endTime, q2.day, q2.content
        FROM (${query1}) q1 INNER JOIN subject_timeplace q2
        ON q1.subjectIdx = q2.subjectIdx ORDER BY q1.subjectIdx, q2.day, q2.startTime`;
        try {
            const subjects = await pool.queryParam(query2);
            return await connect.connectTimePlace(subjects);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSubject ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 조건에 맞는 수업 데이터 조회
     * @type SELECT
     * @param 학교명, 
     *        condition1: course, grade, credit
     *        condition2: onDay, offDay
     * @return 학교, 조건에 해당하는 모든 수업 목록
     */
    getConditionSubject: async (school, condition1, condition2) => {
        let query1 = `SELECT subjectIdx, subjectCode, name, professor, credit, course, grade
        FROM subject WHERE school = "${school}" `;
        
        for (let c of Object.keys(condition1)) {
            if (condition1[c] === undefined) {
                continue;
            }
            if (typeof(condition1[c]) === 'object'){
                let temp = "";
                for (let v of condition1[c]) {
                    temp += ` ${c} = "${v}" OR `;
                }
                query1 += ` AND (${temp.slice(0, -4)}) `;
            }else{
                query1 += ` AND ${c} = "${condition1[c]}"`;
            }

        }
        
        let query2 = `SELECT q1.*, q2.startTime, q2.endTime, q2.day, q2.content
        FROM (${query1}) q1 INNER JOIN subject_timeplace q2
        ON q1.subjectIdx = q2.subjectIdx ORDER BY q1.subjectIdx, q2.day, q2.startTime`;
        try {
            const subjects = await pool.queryParam(query2);
            const subjectTimePlace = await connect.connectTimePlace(subjects);
            if(condition2.onDay === undefined && condition2.offDay === undefined){
                return subjectTimePlace;
            }
            const result = [];
            for (let val of subjectTimePlace) {
                if (checkOnDay(condition2.onDay, val.day) && checkOffDay(condition2.offDay, val.day)) {
                    result.push(val);
                }
            }
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getConditionSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getConditionSubject ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 이수구분 조회
     * @type SELECT
     * @param 학교명
     * @return 수업 이수구분 목록
     */
    getCourse: async (school) => {
        const query = `SELECT DISTINCT course FROM subject WHERE school = "${school}" ORDER BY name`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getCourse ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getCourse ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 이수구분 별 수업목록 조회
     * @type SELECT
     * @param 학교명, 이수구분
     * @return 이수구분 별 수업목록
     */
    getCourseSubject: async (school, course) => {
        const query1 = `SELECT subjectIdx, subjectCode, name, professor, credit, course
        FROM subject WHERE school = "${school}" and course = "${course}"`;
        const query2 = `SELECT q1.*, q2.startTime, q2.endTime, q2.day, q2.content
        FROM (${query1}) q1 INNER JOIN subject_timeplace q2
        ON q1.subjectIdx = q2.subjectIdx ORDER BY q1.subjectIdx, q2.day, q2.startTime`;
        try {
            const subjects = await pool.queryParam(query2);
            return await connect.connectTimePlace(subjects);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getCourseSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getCourseSubject ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 학년 별 수업목록 조회
     * @type SELECT
     * @param 학교명, 학년
     * @return 학년 별 수업목록
     */
    getGradeSubject: async (school, grade) => {
        const query1 = `SELECT subjectIdx, subjectCode, name, professor, credit, course
        FROM subject WHERE school = "${school}" and grade = "${grade}"`;
        const query2 = `SELECT q1.*, q2.startTime, q2.endTime, q2.day, q2.content
        FROM (${query1}) q1 INNER JOIN subject_timeplace q2
        ON q1.subjectIdx = q2.subjectIdx ORDER BY q1.subjectIdx, q2.day, q2.startTime`;
        try {
            const subjects = await pool.queryParam(query2);
            return await connect.connectTimePlace(subjects);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getGradeSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getGradeSubject ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 특정 단어 포함 수업 데이터 조회
     * @type SELECT
     * @param 학교명, 단어
     * @return 단어가 포함된 수업 리스트
     */
    getSearchSubject: async (school, name) => {
        const query1 = `SELECT subjectIdx, subjectCode, name, professor, credit, course FROM subject 
        WHERE school = "${school}" AND name LIKE "%${name}%"`;
        const query2 = `SELECT q1.*, q2.startTime, q2.endTime, q2.day, q2.content
        FROM (${query1}) q1 INNER JOIN subject_timeplace q2
        ON q1.subjectIdx = q2.subjectIdx ORDER BY q1.subjectIdx, q2.day, q2.startTime`;
        try {
            const subjects = await pool.queryParam(query2);
            return await connect.connectTimePlace(subjects);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSearchSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSearchSubject ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 키워드로 시작하는 수업목록
     * @type SELECT
     * @param 학교, 키워드 (자모분리)
     * @return 키워드와 비슷한 수업 리스트
     */
    getRecommendSubject: async (school, nameAtomic) => {
        const query = `SELECT DISTINCT name FROM subject 
        WHERE school = "${school}" AND nameAtomic LIKE "${nameAtomic}%"
        ORDER BY name`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getRecommendSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getRecommendSubject ERROR: ', err);
            throw err;
        }
    },
}

module.exports = subject;