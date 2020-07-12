const pool = require('../modules/pool');

const notice = {
    /** 
    * 메인 시간표의 공지 목록 조회
    * @type SELECT
    * @param 메인 시간표 인덱스, 조회 시작날짜, 조회 끝날짜
    * @return 공지 목록 정보(과목 이름, 색상, 공지 이름, 인덱스, 카테고리, 날짜, 시작시간, 종료시간)
    */
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
    /** 
    * 공지 추가
    * @type INSERT
    * @param 과목 인덱스, 카테고리, 날짜, 시작시간, 종료시간, 제목, 내용
    * @return 추가된 공지 인덱스
    */
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
    /** 
    * 특정 과목의 공지 조회
    * @type SELECT
    * @param 과목 인덱스
    * @return 공지 인덱스, 카테고리, 제목, 시작시간, 종료시간
    */
    getNotice: async (subjectIdx) => {
        const query = `SELECT noticeIdx, category, title, startTime, endTime, date
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
    /** 
    * 공지 상세조회
    * @type SELECT
    * @param 공지 인덱스
    * @return 공지 인덱스, 카테고리, 날짜, 시작시간, 종료시간, 제목, 내용
    */
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
    /** 
    * 공지 수정하기
    * @type UPDATE
    * @param 공지 인덱스, 날짜, 시작시간, 종료시간, 제목, 내용
    * @return 수정 여부 (Boolean)
    */
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
    },
    /** 
    * 공지 삭제하기
    * @type DELETE
    * @param 공지 인덱스
    * @return 정보 삭제 정보
    */
    deleteSpecificNotice: async (noticeIdx) => {
        const query = `DELETE FROM notice WHERE noticeIdx = ${noticeIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('deleteSpecificNotice ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('deleteSpecificNotice ERROR: ', err);
            throw err;
        }
    },
}

module.exports = notice;