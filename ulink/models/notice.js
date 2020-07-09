const pool = require('../modules/pool');

const notice = {
    getNoticeList: async (scheduleIdx, start, end) => {
        const query1 = `SELECT * FROM schedule_school WHERE scheduleIdx = ${scheduleIdx}`;
        const query2 = `SELECT s.subjectIdx, s.name, q1.color 
        FROM (${query1}) q1 INNER JOIN subject s ON q1.subjectIdx = s.subjectIdx`;
        const query3 = `SELECT q2.name, q2.color, n.noticeIdx, n.category, n.date, n.startTime, n.endTime, n.title 
        FROM (${query2}) q2 INNER JOIN notice n ON q2.subjectIdx = n.subjectIdx 
        WHERE date BETWEEN "${start}" AND "${end}" ORDER BY n.date, n.startTime`;
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
        const fields = 'subjectIdx, category, date, startTime, endTime, title, content';
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
        const query = `SELECT noticeIdx, category, title, startTime, endTime
        FROM notice WHERE subjectIdx = ${subjectIdx}`;
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
        const query = `SELECT noticeIdx, category, date, startTime, endTime, title, content
        FROM notice WHERE noticeIdx = ${noticeIdx}`;
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
        startTime = "${updateNotice.startTime}", endTime = "${updateNotice.endTime}",
        title = "${updateNotice.title}", content = "${updateNotice.content}"
        WHERE noticeIdx = ${updateNotice.noticeIdx}`;
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