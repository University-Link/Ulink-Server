const pool = require('../modules/pool');
const table = 'schedule';

const schedule = {
    /*
    기본 메인 시간표 가져오기
    - 토큰으로 유저에 해당하는 메인 시간표의 정보를 가져온다.
    - 가져오기: 시간표 idx, 학기, 시간표 이름
    */
    getScheduleBasic: async (userIdx) => {
        const query = `SELECT schedule_idx, semester, name FROM ${table} WHERE user_idx = ${userIdx} and main = 1`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getBasicSchedule ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getBasicSchedule ERROR: ', err);
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
        const query = `SELECT s.subject_idx AS idx, s.name, tp.starttime, tp.endtime, tp.week, tp.place, s.color
            FROM (
                SELECT s2.subject_idx, s2.name, s1.color FROM schedule_school s1 
                INNER JOIN subject s2 ON s1.subject_idx = s2.subject_idx
                WHERE s1.schedule_idx = ${scheduleIdx}
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
    개인 시간표 가져오기
    - scheduleIdx에 해당하는 개인 시간표를 가져온다.
    - 가져오기: 개인일정 idx, 개인일정 이름, 개인일정 시작시간, 개인일정 종료시간, 개인일정 요일, 장소, 색상
    */
    getSchedulePersonal: async (scheduleIdx) => {
        const query = `SELECT schedule_personal_idx AS idx, name, starttime, endtime, week, place, color 
            FROM schedule_personal WHERE schedule_idx = ${scheduleIdx}`;
        
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getPersonalSchool ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getPersonalSchool ERROR: ', err);
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