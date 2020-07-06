const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const noticeModel = require('../models/notice');

const notice = {
    /*
    캘린더 뷰 - 메인 스케줄의 모든 공지 가져오기
    - 유저의 메인 스케줄 과목들의 모든 공지 데이터를 가져오기 (시간별?)
    */
    getNoticeList: async (req, res) => {
        // const user = req.decoded;
        // const semester = await moment.getSemester();
        // const mainScheduleList = await scheduleModel.getSemesterMainSchedule(user.userIdx, semester);
        // console.log(mainScheduleList);

        // if (mainScheduleList < 0) {
        //     return res.status(statusCode.BAD_REQUEST)
        //         .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        // }
        // const notice = await noticeModel.getNoticeList(mainScheduleList[0].schedule_idx);
        // console.log(notice);


        // const result = {
        //     'semester': semester,
        //     'chat': notice
        // };
        // return res.status(statusCode.OK)
        //     .send(util.success(statusCode.OK, resMessage.READ_CHAT_LIST_SUCCESS, result));
    },
    /*
    특정 과목 공지 목록 가져오기
    - scheduleSchoolIdx를 받아 특정 과목을 인식하고, 그 과목에 대한 Notice 목록을 가져온다.
    */
    getNotice: async (req, res) => {
        const scheduleSchoolIdx = req.params.idx;
        if (!scheduleSchoolIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const noticeList = await noticeModel.getNotice(scheduleSchoolIdx);
        if (noticeList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        let c1 = [], c2 = [], c3 = [] // 과제, 시험, 수업
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
    /*
    특정 공지 가져오기
    - noticeIdx 받아 특정 공지를 인식하고, 상세 데이터를 가져온다.
    */
    getSpecificNotice: async (req, res) => {
        const noticeIdx = req.params.idx;
        if (!noticeIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await noticeModel.getSpecificNotice(noticeIdx);
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_NOTICE_SUCCESS, result));
    },
    /*
    특정 공지 업데이트
    - noticeIdx와 수정된 사항을 받아 공지 데이터를 업데이트한다.
    */
    updateSpecificNotice: async (req, res) => {
        const noticeIdx = req.params.idx;
        const {category, date, startTime, endTime, title, content} = req.body;

        if (!noticeIdx || !category || !date || !startTime || !endTime || !title || !content) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const updateNotice = {noticeIdx, category, date, startTime, endTime, title, content};
        const notice = await noticeModel.updateSpecificNotice(updateNotice);
        if (notice < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.UPDATE_NOTICE_SUCCESS));
    },
}

module.exports = notice;
