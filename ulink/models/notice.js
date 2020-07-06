const pool = require('../modules/pool');

const notice = {
    getNoticeList: async (scheduleIdx, subjectIdx) => {
        const query1 = `SELECT * FROM schedule_school WHERE schedule_idx = ${scheduleIdx}`;
        const query2 = `SELECT s.* FROM (${query1}) q1 INNER JOIN subject s ON q1.subject_idx = s.subject_idx`;
        const query3 = `SELECT * FROM (${query2}) q2 INNER JOIN notice n ON q2.subject_idx = n.subject_idx`;
        try {
            const temp = await pool.queryParam(query2);
            const result = await pool.queryParam(query3);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getNoticeList ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getNoticeList ERROR: ', err);
            throw err;
        }
    },
    getNotice: async (scheduleSchoolIdx) => {
        const query = `
        SELECT q2.notice_idx, q2.category, q2.date, q2.title, q2.start_time, q2.end_time FROM (
            SELECT subject_idx FROM schedule_school WHERE schedule_school_idx = ${scheduleSchoolIdx}
        ) q1 INNER JOIN notice q2 ON q1.subject_idx = q2.subject_idx`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getNotice ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getNotice ERROR: ', err);
            throw err;
        }
    },
    getSpecificNotice: async (noticeIdx) => {
        const query = `SELECT notice_idx, category, date, start_time, end_time, title, content
        FROM notice WHERE notice_idx = ${noticeIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSpecificNotice ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSpecificNotice ERROR: ', err);
            throw err;
        }
    },
    updateSpecificNotice: async (updateNotice) => {
        const query = `UPDATE notice
        SET category = "${updateNotice.category}", date = "${updateNotice.date}",
        start_time = "${updateNotice.startTime}", end_time = "${updateNotice.endTime}",
        title = "${updateNotice.title}", content = "${updateNotice.content}"
        WHERE notice_idx = ${updateNotice.noticeIdx}`;
        try {
            const result = await pool.queryParam(query);
            if(result.affectedRows > 0) return result;
            else return -1;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('updateSpecificNotice ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('updateSpecificNotice ERROR: ', err);
            throw err;
        }
    }

}

module.exports = notice;