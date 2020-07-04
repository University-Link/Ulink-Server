const pool = require('../modules/pool');
const table = 'schedule';

const schedule = {
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