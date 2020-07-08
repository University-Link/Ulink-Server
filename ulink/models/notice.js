const pool = require('../modules/pool');

const notice = {
    getNoticeList: async (scheduleIdx, start, end) => {
        const query1 = `SELECT * FROM schedule_school WHERE schedule_idx = ${scheduleIdx}`;
        const query2 = `SELECT s.subject_idx, s.name, q1.color 
        FROM (${query1}) q1 INNER JOIN subject s ON q1.subject_idx = s.subject_idx`;
        const query3 = `SELECT q2.name, q2.color, n.notice_idx, n.category, n.date, n.start_time, n.end_time, n.title 
        FROM (${query2}) q2 INNER JOIN notice n ON q2.subject_idx = n.subject_idx 
        WHERE date BETWEEN "${start}" AND "${end}" ORDER BY n.date, n.start_time`;
        try {
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
    createNotice: async (subjectIdx, category, date, startTime, endTime, title, content) => {
        const fields = 'subject_idx, category, date, start_time, end_time, title, content';
        const questions = '?, ?, ?, ?, ?, ?, ?';
        const values = [subjectIdx, category, date, startTime, endTime, title, content];
        const query = `INSERT INTO notice(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('createNotice ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('createNotice ERROR: ', err);
            throw err;
        }
    },
    getNotice: async (subjectIdx) => {
        const query = `SELECT notice_idx, category, title, start_time, end_time
        FROM notice WHERE subject_idx = ${subjectIdx}`;
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