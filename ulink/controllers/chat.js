const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const scheduleModel = require('../models/schedule');
const moment = require('../modules/moment');


const chat = {
        
    /** 
    * 채팅 목록 조회
    * @summary 현재 학기 메인 시간표의 과목들의 채팅방 목록 조회
    * @param 토큰
    * @return 현재 학기와 채팅방 목록 (과목 인덱스, 과목 이름, 색상, 총 인원수, 현재 인원수)
    */
    chat: async (req, res) => {
        const user = req.decoded;
        const semester = await moment.getSemester();
        const mainScheduleList = await scheduleModel.getSemesterMainSchedule(user.userIdx, semester);
        if (mainScheduleList < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        const chat = await scheduleModel.getScheduleSubject(mainScheduleList[0].scheduleIdx);
        const result = {'semester':semester, 'chat': chat};
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_CHAT_LIST_SUCCESS, result));
    }
}

module.exports = chat;
