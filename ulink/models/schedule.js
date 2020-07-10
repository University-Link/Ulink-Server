const pool = require('../modules/pool');
const table = 'schedule';

const schedule = {
    /*
    유저 시간표 가져오기
    - 토큰으로 유저에 해당하는 시간표의 정보를 가져온다.
    - 가져오기: 시간표 idx, 학기, 시간표 이름
    */
    getSchedule: async (userIdx) => {
        const query = `SELECT scheduleIdx, semester, name FROM ${table} 
        WHERE userIdx = ${userIdx}`;
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
        const query = `SELECT scheduleIdx, semester, name FROM ${table} 
    WHERE userIdx = ${userIdx} and main = 1`;
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
        const query = `SELECT scheduleIdx, semester, name FROM ${table} 
    WHERE userIdx = ${userIdx} and semester = "${semester}" and main = 1`;
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
        const query1 = `SELECT s1.scheduleSchoolIdx, s2.subjectIdx, s2.name, s2.people AS total, s1.color FROM
            (
                SELECT * FROM schedule_school 
                WHERE scheduleIdx = ${scheduleIdx}
            ) s1
            INNER JOIN subject s2 ON s1.subjectIdx = s2.subjectIdx`;

        const query2 = `SELECT s1.scheduleSchoolIdx, count(*) AS current 
            FROM schedule_school s1, schedule_school s2 
            WHERE s1.subjectIdx = s2.subjectIdx group by s1.scheduleSchoolIdx`;

        const query3 = `SELECT q1.subjectIdx, q1.name, q1.color, q1.total, q2.current
        FROM (${query1}) q1 INNER JOIN (${query2}) q2 
        ON q1.scheduleSchoolIdx = q2.scheduleSchoolIdx`;
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
        const query = `SELECT s.scheduleSchoolIdx AS idx, s.name, tp.startTime, tp.endTime, tp.day AS day, tp.place, s.color
            FROM (
                SELECT s1.scheduleSchoolIdx, s2.subjectIdx, s2.name, s1.color FROM
                    (
                        SELECT * FROM schedule_school 
                        WHERE scheduleIdx = ${scheduleIdx}
                    ) s1
                INNER JOIN subject s2 ON s1.subjectIdx = s2.subjectIdx
                ) s 
            INNER JOIN subject_timeplace tp ON s.subjectIdx = tp.subjectIdx`;

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
        const query = `SELECT schedulePersonalIdx AS idx, name, startTime, endTime, day AS day, content, color 
            FROM schedule_personal WHERE scheduleIdx = ${scheduleIdx}`;
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
        const query1 = `SELECT subjectIdx, color FROM schedule_school 
        WHERE subjectIdx = ${scheduleSchoolIdx}`;
        const query2 = `SELECT q1.color, subject.* 
        FROM (${query1}) q1 INNER JOIN subject
        ON q1.subjectIdx = subject.subjectIdx`;
        const query3 = `SELECT q2.*, 
        subject_timeplace.startTime, subject_timeplace.endTime, subject_timeplace.day, subject_timeplace.place
        FROM (${query2}) q2 INNER JOIN subject_timeplace
        ON q2.subjectIdx = subject_timeplace.subjectIdx`;
        try {
            const result = await pool.queryParam(query3);
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
        const query = `SELECT * FROM schedule_personal WHERE schedulePersonalIdx = ${schedulePersonalIdx}`;
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
        const fields = 'subjectIdx, color, scheduleIdx';
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
    createSchedulePersonal: async (name, startTime, endTime, day, content, color, scheduleIdx) => {
        const fields = 'name, startTime, endTime, day, content, color, scheduleIdx';
        const questions = '?, ?, ?, ?, ?, ?, ?';
        const values = [name, startTime, endTime, day, content, color, scheduleIdx];
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
        WHERE scheduleSchoolIdx = ${scheduleSchoolIdx}`;
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
        WHERE schedulePersonalIdx = ${schedulePersonalIdx}`;
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
    },
    /*
    모든 학기 수업 시간표 목록 가져오기
    - token을 통해 자신의 학교의 모든 학기 수업 기간표 목록을 가져온다.
    - 가져오기: 자신의 시간표 목록
    */
    getSemesterList: async (userIdx) => {
        const query1 = `SELECT DISTINCT semester FROM ${table} WHERE userIdx = ${userIdx}`;
        try {
            const semesters = await pool.queryParamArr(query1);
            let result = [];
            for (let data of semesters) {
                let query2 = `SELECT scheduleIdx, name, main As isMain FROM ${table} WHERE semester="${data.semester}"`;

                const timeTableList = await pool.queryParamArr(query2);
                let result2 = {
                    "semester": data.semester,
                    "timeTableList": timeTableList
                };
                result.push(result2);
            }
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSemesterList ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSemesterList ERROR: ', err);
            throw err;
        }
    },
    /*
    개인일정 수정하기
    - schedulePersonalIdx를 통해 개인일정데이터를 가져온다.
    - 수정하기 : 자신의 개인시간표 일정 수정하기
    */
    updateSchedulePersonal: async (schedulePersonalIdx, name, content, startTime, endTime, day) => {
        const query = `UPDATE schedule_personal SET name = "${name}", content = "${content}", startTime = "${startTime}", endTime = "${endTime}", day = "${day}" WHERE schedulePersonalIdx = "${schedulePersonalIdx}"`;
        try {
            const result = await pool.queryParamArr(query);
            //console.log('Update post - result: ', result);
            if (result.affectedRows > 0) return false;
            else return true;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateSchedulePersonal ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateSchedulePersonal ERROR: ', err);
            throw err;
        }
    },
    /*
    시간표 이름 수정하기
    - scheduleIdx를 통해 시간표데이터를 가져온다.
    - 수정하기 : 자신의 시간표 이름 수정하기
    */
    updateMainNameSchedule: async (scheduleIdx, name) => {
        const query = `UPDATE ${table} SET name = "${name}" WHERE scheduleIdx = "${scheduleIdx}"`;
        try {
            const result = await pool.queryParamArr(query);
            //console.log('Update post - result: ', result);
            if (result.affectedRows > 0) return false;
            else return true;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateMainNameSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateMainNameSchedule ERROR: ', err);
            throw err;
        }
    },
    deleteMainSchedule: async (scheduleIdx) => {
        const query = `DELETE FROM ${table} WHERE scheduleIdx = "${scheduleIdx}"`;
        try {
            const result = await pool.queryParamArr(query);
            //console.log('Delete - result: ', result);
            if (result.affectedRows > 0) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteMainSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('deleteMainSchedule ERROR: ', err);
            throw err;
        }
    },
    getScheduleIdx: async (semester) => {
        const query = `SELECT MIN(scheduleIdx) AS scheduleIdx FROM ${table} WHERE semester = "${semester}"`;
        try {
            const result = await pool.queryParam(query);
            console.log("결과값3: ", result);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getScheduleIdx ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getScheduleIdx ERROR: ', err);
            throw err;
        }
    },
    updateMainSchedule: async (scheduleIdx) => {
        const query = `UPDATE schedule SET main=1 WHERE scheduleIdx=${scheduleIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            //console.log('Update post - result: ', result);
            //아무 시간표도 없을때! => 0이 나와도 좋은 거지!
            console.log("결과값2: ", result);
            if (result.affectedRows >= 0) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateMainSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateMainSchedule ERROR: ', err);
            throw err;
        }
    },
    updateMainOffSchedule: async (semester) => {
        const query = `UPDATE schedule SET main=0 WHERE main=1 AND semester="${semester}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.affectedRows === 1) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateMainOffSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateMainOffSchedule ERROR: ', err);
            throw err;
        }
    },
    updateMainOnSchedule: async (scheduleIdx) => {
        const query = `UPDATE schedule SET main=1 WHERE scheduleIdx=${scheduleIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            if (result.affectedRows === 1) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateMainOnSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateMainOnSchedule ERROR: ', err);
            throw err;
        }
    },
    checkSchedule: async (idx) => {
        const query = `SELECT * FROM ${table} WHERE scheduleIdx = ${idx} AND main = 1`;
        try {
            const result = await pool.queryParam(query);
            if (result.length === 1) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('checkSchedule ERROR: ', err);
            throw err;
        }
    },
    getScheduleSemester: async (userIdx, scheduleIdx) => {
        const query = `SELECT semester FROM ${table} WHERE scheduleIdx = ${scheduleIdx} AND userIdx = ${userIdx}`
        //{semester: "2020-2"}
        //result.semester => 2020-2
        try {
            const result = await pool.queryParam(query);
            console.log("결과값: ", result);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getScheduleSemester ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getScheduleSemester ERROR: ', err);
            throw err;
        }
    },
    


}

module.exports = schedule;