const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const scheduleModel = require('../models/schedule');
const moment = require('../modules/moment');


const chat = {
    chat: async (req, res) => {
        const user = req.decoded;
        const semester = await moment.getSemester();
        const mainScheduleList = await scheduleModel.getSemesterMainSchedule(user.userIdx, semester);
        if (mainScheduleList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        const chat = await scheduleModel.getScheduleSubject(mainScheduleList[0].scheduleIdx);
        const result = {'semester':semester, 'chat': chat};
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_CHAT_LIST_SUCCESS, result));
    }
}

module.exports = chat;
