const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const moment = require('../modules/moment');
const noticeModel = require('../models/notice');
const scheduleModel = require('../models/schedule');

const notice = {
    /** 
     * 메인 스케줄의 모든 공지 가져오기 (Calendar view)
     * @summary 유저 메인 스케줄의 모든 공지 가져오기
     * @param 토큰, 조회 시작날짜, 조회 종료날짜
     * @return 각 날짜마다의 공지 정보
     */
    getNoticeList: async (req, res) => {
        const user = req.decoded;
        const start = req.query.start,
            end = req.query.end;
        if (!start || !end) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const semester = await moment.getSemester();
        const mainScheduleList = await scheduleModel.getSemesterMainSchedule(user.userIdx, semester);

        if (mainScheduleList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        const notices = await noticeModel.getNoticeList(mainScheduleList[0].scheduleIdx, start, end);

        const result = [];
        let noticeList = [];
        let dateBefore = notices[0].date;

        for (let notice of notices) {
            const date = notice.date;
            if (dateBefore !== date) {
                result.push({
                    'date': dateBefore,
                    'notice': noticeList
                });
                noticeList = []
            }
            delete notice.date;
            noticeList.push(notice);
            dateBefore = date;
        }
        result.push({
            'date': dateBefore,
            'notice': noticeList
        });

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_NOTICE_LIST_SUCCESS, result));
    },
    /** 
     * 공지 등록하기
     * @summary 과목의 공지 등록하기
     * @param 과목 인덱스, 공지 카테고리, 날짜, 시작시간, 종료시간, 제목, 내용
     * @return 성공 메시지
     */
    createNotice: async (req, res) => {
        const subjectIdx = req.params.idx;
        const {
            category,
            date,
            startTime,
            endTime,
            title,
            content
        } = req.body;

        if (!subjectIdx || isNaN(subjectIdx) || !category || !date || !startTime || !endTime || !title || !content) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const idx = await noticeModel.createNotice(subjectIdx, category, date, startTime, endTime, title, content);
        if (idx === -1) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CREATE_NOTICE_SUCCESS));
    },
    /** 
     * 특정 과목의 공지 가져오기
     * @summary 특정 과목의 공지목록 가져오기
     * @param 과목 인덱스
     * @return 각 카테고리별 공지 데이터
     */
    getNotice: async (req, res) => {
        const subjectIdx = req.params.idx;
        if (!subjectIdx || isNaN(subjectIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const noticeList = await noticeModel.getNotice(subjectIdx);
        if (noticeList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        let c1 = [],
            c2 = [],
            c3 = [] // 과제, 시험, 수업
        for (let notice of noticeList) {
            if (notice.category === '과제') {
                c1.push(notice);
            } else if (notice.category === '시험') {
                c2.push(notice);
            } else {
                c3.push(notice);
            }
            delete notice.category;
        }
        const result = {
            '과제': c1,
            "시험": c2,
            "수업": c3
        };

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_NOTICE_LIST_SUCCESS, result));
    },
    /** 
     * 공지 상세조회
     * @summary 공지의 상세정보 조회
     * @param 공지 인덱스
     * @return 공지의 상세정보
     */
    getSpecificNotice: async (req, res) => {
        const noticeIdx = req.params.idx;
        if (!noticeIdx || isNaN(noticeIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await noticeModel.getSpecificNotice(noticeIdx);
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_NOTICE_SUCCESS, result[0]));
    },
    /** 
     * 공지 업데이트
     * @summary 공지 정보 업데이트
     * @param 공지 인덱스, 카테고리, 날짜, 시작시간, 종료시간, 제목, 내용
     * @return 업데이트 성공 여부 메시지
     */
    updateSpecificNotice: async (req, res) => {
        const noticeIdx = req.params.idx;
        const {
            category,
            date,
            startTime,
            endTime,
            title,
            content
        } = req.body;

        if (!noticeIdx || isNaN(noticeIdx) || !category || !date || !startTime || !endTime || !title || !content) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const updateNotice = {
            noticeIdx,
            category,
            date,
            startTime,
            endTime,
            title,
            content
        };
        const notice = await noticeModel.updateSpecificNotice(updateNotice);
        if (notice < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.UPDATE_NOTICE_SUCCESS));
    },
    /** 
    * 공지 삭제
    * @summary 공지 삭제
    * @param 공지 인덱스
    * @return 삭제 성공 여부
    */
    deleteSpecificNotice: async (req, res) => {
        const noticeIdx = req.params.idx;

        if (!noticeIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const deleteSpecificNotice = await noticeModel.deleteSpecificNotice(noticeIdx);
        if (notice < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.DELETE_NOTICE_SUCCESS));
    },
}

module.exports = notice;
