const pool = require('../modules/pool');
const table = 'schedule';

const schedule = {
    /*
    유저 시간표 가져오기
    - 토큰으로 유저에 해당하는 시간표의 정보를 가져온다.
    - 가져오기: 시간표 idx, 학기, 시간표 이름
    */
    getSchedule: async (userIdx) => {
        const query = `SELECT schedule_idx, semester, name FROM ${table} 
        WHERE user_idx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSchedule ERROR: ', err);
            throw err;
        }
    },
    /*
    유저 메인 시간표 가져오기
    - 토큰으로 유저에 해당하는 유저 메인 시간표의 정보를 가져온다.
    - 가져오기: 시간표 idx, 학기, 시간표 이름
    */
    getMainSchedule: async (userIdx) => {
    const query = `SELECT schedule_idx, semester, name FROM ${table} 
    WHERE user_idx = ${userIdx} and main = 1`;
    try {
        const result = await pool.queryParam(query);
        return result;
    } catch (err) {
        if (err.errno == 1062) {
            console.log('getMainSchedule ERROR : ', err.errno, err.code);
            return -1;
        }
        console.log('getMainSchedule ERROR: ', err);
        throw err;
    }
},
    /*
    특정 학기 기본 메인 시간표 가져오기
    - 토큰으로 유저에 해당하는 메인 시간표의 정보를 가져온다.
    - 가져오기: 시간표 idx, 학기, 시간표 이름
    */
    getSemesterMainSchedule: async (userIdx, semester) => {
    const query = `SELECT schedule_idx, semester, name FROM ${table} 
    WHERE user_idx = ${userIdx} and semester = "${semester}" and main = 1`;
    try {
        const result = await pool.queryParam(query);
        return result;
    } catch (err) {
        if (err.errno == 1062) {
            console.log('getSemesterMainSchedule ERROR : ', err.errno, err.code);
            return -1;
        }
        console.log('getSemesterMainSchedule ERROR: ', err);
        throw err;
    }
},
    /*
    학교 수업목록 가져오기
    - scheduleIdx에 해당하는 학교 수업목록을 가져온다.
    */
    getScheduleSubject: async (scheduleIdx) => {
        const query1 = `SELECT s1.schedule_school_idx, s2.subject_idx, s2.name, s2.people AS total, s1.color FROM
            (
                SELECT * FROM schedule_school 
                WHERE schedule_idx = ${scheduleIdx}
            ) s1
            INNER JOIN subject s2 ON s1.subject_idx = s2.subject_idx`;

        const query2 = `SELECT s1.schedule_school_idx, count(*) AS current 
            FROM schedule_school s1, schedule_school s2 
            WHERE s1.subject_idx = s2.subject_idx group by s1.schedule_school_idx`;

        const query3 = `SELECT q1.subject_idx, q1.name, q1.color, q1.total, q2.current
        FROM (${query1}) q1 INNER JOIN (${query2}) q2 
        ON q1.schedule_school_idx = q2.schedule_school_idx`;
        try {
            const result = await pool.queryParam(query3);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getScheduleSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getScheduleSubject ERROR: ', err);
            throw err;
        }
    },
    /*
    학교 시간표 가져오기
    - scheduleIdx에 해당하는 학교 시간표를 가져온다.
    - schedule_school, subject 테이블을 조인하여 수업에 대한 정보를 가져오고 
    - subject_timeplace와 조인하여 시간과 장소에 대한 정보도 가져온다.
    - 가져오기: 수업 idx, 수업 이름, 수업 시작시간, 수업 종료시간, 수업 요일, 수업 장소, 색상
    */
    getScheduleSchool: async (scheduleIdx) => {
        const query = `SELECT s.schedule_school_idx AS idx, s.name, tp.start_time, tp.end_time, tp.week AS day, tp.place, s.color
            FROM (
                SELECT s1.schedule_school_idx, s2.subject_idx, s2.name, s1.color FROM
                    (
                        SELECT * FROM schedule_school 
                        WHERE schedule_idx = ${scheduleIdx}
                    ) s1
                INNER JOIN subject s2 ON s1.subject_idx = s2.subject_idx
                ) s 
            INNER JOIN subject_timeplace tp ON s.subject_idx = tp.subject_idx`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getScheduleSchool ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getScheduleSchool ERROR: ', err);
            throw err;
        }
    },
    /*
    개인 일정 시간표 가져오기
    - scheduleIdx에 해당하는 개인 시간표를 가져온다.
    - 가져오기: 개인일정 idx, 개인일정 이름, 개인일정 시작시간, 개인일정 종료시간, 개인일정 요일, 장소, 색상
    */
    getSchedulePersonal: async (scheduleIdx) => {
        const query = `SELECT schedule_personal_idx AS idx, name, start_time, end_time, week AS day, place, color 
            FROM schedule_personal WHERE schedule_idx = ${scheduleIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSchedulePersonal ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSchedulePersonal ERROR: ', err);
            throw err;
        }
    },
    /*
    학교 수업일정 상세 데이터 가져오기
    */
    getSpecificScheduleSchool: async (scheduleSchoolIdx) => {
        const query = `SELECT s2.*, s1.color FROM (
            SELECT * FROM schedule_school 
            WHERE schedule_school_idx = ${scheduleSchoolIdx}
        ) s1
        INNER JOIN subject s2 ON s1.subject_idx = s2.subject_idx`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSpecificScheduleSchool ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSpecificScheduleSchool ERROR: ', err);
            throw err;
        }
    },
    /*
    개인일정 상세 데이터 가져오기
    */
    getSpecificSchedulePersonal: async (schedulePersonalIdx) => {
        const query = `SELECT * FROM schedule_personal WHERE schedule_personal_idx = ${schedulePersonalIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSpecificSchedulePersonal ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSpecificSchedulePersonal ERROR: ', err);
            throw err;
        }
    },
    /*
    학교 수업일정 등록하기
    */
    createScheduleSchool: async (subjectIdx, color, scheduleIdx) => {
        const fields = 'subject_idx, color, schedule_idx';
        const questions = '?, ?, ?';
        const values = [subjectIdx, color, scheduleIdx];
        const query = `INSERT INTO schedule_school(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('createScheduleSchool ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('createScheduleSchool ERROR: ', err);
            throw err;
        }
    },
    /*
    개인 일정 등록하기
    */
    createSchedulePersonal: async (name, startTime, endTime, week, place, color, scheduleIdx) => {
        const fields = 'name, start_time, end_time, week, place, color, schedule_idx';
        const questions = '?, ?, ?, ?, ?, ?, ?';
        const values = [name, startTime, endTime, week, place, color, scheduleIdx];
        const query = `INSERT INTO schedule_personal(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('createSchedulePersonal ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('createSchedulePersonal ERROR: ', err);
            throw err;
        }
    },
    /*
    학교 수업일정 삭제하기
    - 현재 시간표에서 학교 수업일정 삭제
    */
    deleteScheduleSchool: async (scheduleSchoolIdx) => {
        const query = `DELETE FROM schedule_school 
        WHERE schedule_school_idx = ${scheduleSchoolIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            // console.log('Delete post - result: ', result);
            if (result.affectedRows > 0) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteScheduleSchool ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('deleteScheduleSchool ERROR: ', err);
            throw err;
        }
    },
    /*
    개인 일정 삭제하기
    - 현재 시간표에서 개인일정 삭제
    */
    deleteSchedulePersonal: async (schedulePersonalIdx) => {
        const query = `DELETE FROM schedule_personal 
        WHERE schedule_personal_idx = ${schedulePersonalIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            // console.log('Delete post - result: ', result);
            if (result.affectedRows > 0) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteSchedulePersonal ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('deleteSchedulePersonal ERROR: ', err);
            throw err;
        }
    },
    /*
    ddddd
    */
    deleteSchedulePersonal: async (schedulePersonalIdx) => {
        const query = `DELETE FROM schedule_personal 
    WHERE schedule_personal_idx = ${schedulePersonalIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            // console.log('Delete post - result: ', result);
            if (result.affectedRows > 0) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteSchedulePersonal ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('deleteSchedulePersonal ERROR: ', err);
            throw err;
        }
    },
    /*
    모든 수업 데이터 가져오기
    - token을 통해 자신의 학교의 모든 수업 데이터를 가져온다.
    - 가져오기: 자신의 학교에 해당하는 모든 수업 정보
    */
    getSubject: async (school) => {
        const query = `SELECT * FROM subject WHERE school = "${school}"`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSubject ERROR: ', err);
            throw err;
        }
    }
}

module.exports = schedule;