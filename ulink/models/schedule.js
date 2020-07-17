const pool = require('../modules/pool');
const connect = require('../modules/connect');
const moment = require('../modules/moment');
const table = 'schedule';

const schedule = {
    /** 
     * 유저 시간표 가져오기
     * @type SELECT
     * @param 스케줄 인덱스
     * @return 시간표 정보(인덱스, 학기, 이름)
     */
    getSchedule: async (scheduleIdx) => {
        const query = `SELECT scheduleIdx, semester, name FROM ${table} 
        WHERE scheduleIdx = ${scheduleIdx}`;
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
    /** 
     * 유저 메인 시간표 가져오기
     * @type SELECT
     * @param 유저 인덱스
     * @return 메인 시간표 정보(인덱스, 학기, 이름)
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
    /** 
     * 현재학기 유저 메인 시간표 가져오기
     * @type SELECT
     * @param 유저 인덱스, 현재학기
     * @return 현재학기 메인 시간표 정보(인덱스, 학기, 이름)
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
    /** 
     * 시간표 수업 목록 가져오기
     * @type SELECT
     * @param 시간표 인덱스
     * @return 시간표에 해당하는 수업 목록 가져오기(수업 인덱스, 이름, 색상, 총 인원수, 현재 인원수)
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
    /** 
     * 학교 일정 가져오기
     * @type SELECT
     * @param 시간표 인덱스
     * @return 수업 일정 인덱스, 이름, 시작시간, 종료시간, 요일, 장소, 색상
     */
    getScheduleSchool: async (scheduleIdx) => {
        const query = `SELECT s.scheduleSchoolIdx AS idx, s.name, tp.startTime, tp.endTime, tp.day, tp.content, s.color, s.subjectIdx
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
            result.forEach((r) => {
                r.startTime = [r.startTime];
                r.endTime = [r.endTime];
                r.day = [r.day];
                r.content = [r.content];
            });
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
    /** 
     * 개인 일정 가져오기
     * @type SELECT
     * @param 시간표 인덱스
     * @return 개인 일정 인덱스, 이름, 시작시간, 종료시간, 요일, 내용, 색상
     */
    getSchedulePersonal: async (scheduleIdx) => {
        const query = `SELECT schedulePersonalIdx AS idx, name, startTime, endTime, day, content, color 
            FROM schedule_personal WHERE scheduleIdx = ${scheduleIdx}`;
        try {
            const result = await pool.queryParam(query);
            result.forEach((r) => {
                r.startTime = [r.startTime];
                r.endTime = [r.endTime];
                r.day = [r.day];
                r.content = [r.content];
            });
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
    /** 
    * 학교 일정 상세 정보 가져오기
    * @type SELECT
    * @param 학교 일정 인덱스
    * @return 일정 색상, 과목 시작시간, 종료시간, 요일, 장소
            과목 인덱스, 이름, 교수명, 학교명, 학부명, 전공, 학기, 학년, 학점, 총 인원수, 
            과목 시작시간, 종료시간, 요일, 장소, 이수구분(전공/교양, 필수/선택)
    */
    getSpecificScheduleSchool: async (scheduleSchoolIdx) => {
        const query1 = `SELECT subjectIdx, color FROM schedule_school 
        WHERE scheduleSchoolIdx = ${scheduleSchoolIdx}`;
        const query2 = `SELECT q1.color, subject.* 
        FROM (${query1}) q1 INNER JOIN subject
        ON q1.subjectIdx = subject.subjectIdx`;
        const query3 = `SELECT q2.*, 
        subject_timeplace.startTime, subject_timeplace.endTime, subject_timeplace.day, subject_timeplace.content
        FROM (${query2}) q2 INNER JOIN subject_timeplace
        ON q2.subjectIdx = subject_timeplace.subjectIdx`;
        try {
            const subjects = await pool.queryParam(query3);
            if (subjects.length === 0) {
                return subjects;
            }
            return await connect.connectColorTimePlace(subjects);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSpecificScheduleSchool ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSpecificScheduleSchool ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 개인 일정 상세 정보 가져오기
     * @type SELECT
     * @param 개인일정 인덱스
     * @return 개인일정 인덱스, 이름(제목), 시작시간, 종료시간, 요일, 내용, 색상
     */
    getSpecificSchedulePersonal: async (schedulePersonalIdx) => {
        const query = `SELECT schedulePersonalIdx, name, startTime, endTime, day, content, color 
        FROM schedule_personal WHERE schedulePersonalIdx = ${schedulePersonalIdx}`;
        try {
            const result = await pool.queryParam(query);
            result.forEach((r) => {
                r.startTime = [r.startTime];
                r.endTime = [r.endTime];
                r.day = [r.day];
                r.content = [r.content];
            });
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
    /** 
     * 시간표 추가
     * @type INSERT
     * @param 유저 인덱스, 학기, 시간표 이름, 메인 시간표 여부
     * @return 스케줄 생성 여부
     */
    createSchedule: async (userIdx, semester, name, main) => {
        const fields = 'userIdx, semester, name, main';
        const questions = '?, ?, ?, ?';
        const values = [userIdx, semester, name, main];
        const query = `INSERT INTO schedule(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('createSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('createSchedule ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 학교 일정 추가
     * @type INSERT
     * @param 과목 인덱스, 색상, 시간표 인덱스
     * @return 추가된 학교 일정 인덱스
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
    /** 
     * 개인 일정 추가
     * @type INSERT
     * @param 개인 일정 이름, 시작시간, 종료시간, 요일, 내용, 색상, 시간표 인덱스
     * @return 추가된 개인 일정 인덱스
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
    /** 
     * 학교 일정 삭제
     * @type DELETE
     * @param 학교 일정 인덱스
     * @return 삭제 성공여부 (Boolean)
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
    /** 
     * 개인 일정 삭제
     * @type DELETE
     * @param 개인 일정 인덱스
     * @return 삭제 성공여부 (Boolean)
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
    /** 
     * 모든 학기 수업 시간표 목록 가져오기
     * @type SELECT
     * @param 유저 인덱스
     * @return 유저의 모든 학기에 대해 수업 시간표 목록 정보
     */
    getScheduleList: async (userIdx) => {
        const query1 = `SELECT DISTINCT semester FROM ${table} 
                        WHERE userIdx = ${userIdx} ORDER BY semester DESC`;
        try {
            const semesters = await pool.queryParamArr(query1);
            let result = [];
            for (let data of semesters) {
                let query2 = `SELECT scheduleIdx, name, main As isMain FROM ${table} 
                            WHERE semester="${data.semester}" AND userIdx = ${userIdx} ORDER BY main DESC`;
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
    /** 
     * 특정 학기 수업 시간표 목록 가져오기
     * @type SELECT
     * @param 유저 인덱스, 학기정보
     * @return 유저의 특정 학기에 대해 수업 시간표 목록 정보
     */
    getSemesterScheduleList: async (userIdx, semester) => {
        const query = `SELECT scheduleIdx, name, main As isMain FROM ${table} 
                        WHERE userIdx = ${userIdx} AND semester="${semester}" ORDER BY main DESC`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSemesterScheduleList ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSemesterScheduleList ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 개인일정 수정하기
     * @type UPDATE
     * @param 개인일정 인덱스, 수정할 이름, 내용, 시작시간, 종료시간, 요일
     * @return 수정여부 (Boolean)
     */
    updateSchedulePersonal: async (schedulePersonalIdx, name, content, startTime, endTime, day) => {
        const query = `UPDATE schedule_personal 
        SET name = "${name}", content = "${content}", startTime = "${startTime}", endTime = "${endTime}", day = "${day}" 
        WHERE schedulePersonalIdx = "${schedulePersonalIdx}"`;
        try {
            const result = await pool.queryParamArr(query);
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
    /** 
     * 시간표 이름 수정하기
     * @type UPDATE
     * @param 시간표 인덱스, 이름
     * @return 수정 여부 (Boolean)
     */
    updateNameSchedule: async (scheduleIdx, name) => {
        const query = `UPDATE ${table} SET name = "${name}" WHERE scheduleIdx = "${scheduleIdx}"`;
        try {
            const result = await pool.queryParamArr(query);
            if (result.affectedRows > 0) return false;
            else return true;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateNameSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateNameSchedule ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 메인 시간표 삭제하기
     * @type DELETE
     * @param 시간표 인덱스
     * @return 삭제 성공여부 (Boolean)
     */
    deleteMainSchedule: async (scheduleIdx) => {
        const query = `DELETE FROM ${table} WHERE scheduleIdx = "${scheduleIdx}"`;
        try {
            const result = await pool.queryParamArr(query);
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
    /** 
     * 메인 시간표 삭제 시 메인 시간표를 설정하기 위한 해당 학기의 가장 작은 시간표 인덱스 찾기
     * @type SELECT
     * @param 학기
     * @return 시간표 인덱스
     */
    getScheduleIdx: async (semester) => {
        const query = `SELECT MIN(scheduleIdx) AS scheduleIdx FROM ${table} WHERE semester = "${semester}"`;
        try {
            const result = await pool.queryParam(query);
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
    /** 
     * 메인 시간표 삭제 시 다른 시간표 메인 시간표로 설정하기
     * @type UPDATE
     * @param 시간표 인덱스
     * @return 수정여부
     */
    updateMainSchedule: async (scheduleIdx) => {
        const query = `UPDATE schedule SET main=1 WHERE scheduleIdx=${scheduleIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            if (result.affectedRows > 0) return 1;
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
    /** 
     * 메인 시간표 수정하기(메인o->x)
     * @type UPDATE
     * @param 학기
     * @return 수정여부
     */
    updateMainOffSchedule: async (semester, userIdx) => {
        const query = `UPDATE schedule SET main=0 WHERE main=1 AND semester="${semester}" AND userIdx=${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            if (result.affectedRows > 0) return true;
            else return false;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateMainOffSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateMainOffSchedule ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 메인 시간표 수정하기(메인x->o)
     * @type UPDATE
     * @param 시간표 인덱스
     * @return 수정여부
     */
    updateMainOnSchedule: async (scheduleIdx) => {
        const query = `UPDATE schedule SET main=1 WHERE scheduleIdx=${scheduleIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            if (result.affectedRows > 0) return true;
            else return false;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateMainOnSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateMainOnSchedule ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 해당 시간표가 메인 시간표이면 시간표 가져오기
     * @type SELECT
     * @param 시간표 인덱스
     * @return 시간표 인덱스, 학기, 메인시간표여부, 이름, 유저인덱스
     */
    checkSchedule: async (idx) => {
        const query = `SELECT * FROM ${table} WHERE scheduleIdx = ${idx} AND main = 1`;
        try {
            const result = await pool.queryParam(query);
            if (result.length >= 1) {
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
    /** 
     * 해당 시간표의 학기 가져오기
     * @type SELECT
     * @param 유저 인덱스, 시간표 인덱스
     * @return 학기
     */
    getScheduleSemester: async (userIdx, scheduleIdx) => {
        const query = `SELECT semester FROM ${table} WHERE scheduleIdx = ${scheduleIdx} AND userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
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
    /** 
     * 학교 일정 시간표 색상 수정하기
     * @type UPDATE
     * @param 일정 인덱스, 색상 인덱스
     * @return 수정 여부
     */
    updateSpecificScheduleSchool: async (scheduleSchoolIdx, color) => {
        const query = `UPDATE schedule_school SET color=${color} WHERE scheduleSchoolIdx = ${scheduleSchoolIdx}`;
        try {
            const result = await pool.queryParam(query);
            if (result.affectedRows > 0) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateSpecificScheduleSchool ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateSpecificScheduleSchool ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 개인 일정 시간표 색상 수정하기
     * @type UPDATE
     * @param 일정 인덱스, 색상 인덱스
     * @return 수정 여부
     */
    updateSpecificSchedulePersonal: async (schedulePersonalIdx, color) => {
        const query = `UPDATE schedule_personal SET color=${color} WHERE schedulePersonalIdx = ${schedulePersonalIdx}`;
        try {
            const result = await pool.queryParam(query);
            if (result.affectedRows > 0) return 1;
            else return 0;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateSpecificSchedulePersonal ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateSpecificSchedulePersonal ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 시간표 시작 시간
     * @type SELECT
     * @param 시간표 idx
     * @return 시간표에서 시작 시간
     */
    getMinTime: async (scheduleIdx) => {
        const query1 = `SELECT MIN(startTime) AS minTime FROM schedule_personal WHERE scheduleIdx =  ${scheduleIdx}`;
        const query2 = `SELECT subjectIdx FROM schedule_school WHERE scheduleIdx = ${scheduleIdx}`;
        const query3 = `SELECT MIN(tp.startTime) AS minTime 
        FROM (${query2}) q2 INNER JOIN subject_timeplace tp ON q2.subjectIdx = tp.subjectIdx`;
        try {
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query3);
            return await moment.getMinStrTime(result1[0].minTime, result2[0].minTime);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getMinTime ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getMinTime ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 시간표 끝나는 시간
     * @type SELECT
     * @param 시간표 idx
     * @return 시간표에서 끝나는 시간
     */
    getMaxTime: async (scheduleIdx) => {
        const query1 = `SELECT MAX(endTime) AS maxTime FROM schedule_personal WHERE scheduleIdx =  ${scheduleIdx}`;
        const query2 = `SELECT subjectIdx FROM schedule_school WHERE scheduleIdx = ${scheduleIdx}`;
        const query3 = `SELECT MAX(tp.endTime) AS maxTime 
        FROM (${query2}) q2 INNER JOIN subject_timeplace tp ON q2.subjectIdx = tp.subjectIdx`;
        try {
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query3);
            return await moment.getMaxStrTime(result1[0].maxTime, result2[0].maxTime);
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getMaxTime ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getMaxTime ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 시간표 인덱스가 학교일정 또는 개인일정 존재여부 확인
     * @type SELECT
     * @param 시간표 idx
     * @return 시간표에서 존재하는 여부를 확인하는 것
     */
    checkScheduleIdx: async (idx) => {
        const query1 = `SELECT * FROM schedule_school WHERE scheduleSchoolIdx = ${idx}`;
        const query2 = `SELECT * FROM schedule_personal WHERE schedulePersonalIdx = ${idx}`;
        try {
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query2);
            if (result2.length === 1 || result1.length === 1) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            if (err.errno == 1062) {
                console.log('checkScheduleIdx ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('checkScheduleIdx ERROR: ', err);
            throw err;
        }
    },
}

module.exports = schedule;