const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const scheduleModel = require('../models/schedule');

const mapping = (schedule, isSubject) => {
    schedule.forEach(element => {
        element.subject = isSubject;
    });
};


const schedule = {
    getMainSchedule: async (req, res) => {
        const user = req.decoded;
        const scheduleBasic = await scheduleModel.getScheduleBasic(user.userIdx);
        const schedulePersonalList  = await scheduleModel.getSchedulePersonal(scheduleBasic[0].schedule_idx);
        mapping(schedulePersonalList, false);
        const scheduleSchoolList = await scheduleModel.getScheduleSchool(scheduleBasic[0].schedule_idx);
        mapping(scheduleSchoolList, true);
        const schedule = schedulePersonalList.concat(scheduleSchoolList);
        return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, schedule));

    },
    getSchedule: async (req, res) => {
        const user = req.decoded;
        const scheduleSchoolList  = await scheduleModel.getScheduleSchool(user.userIdx);
        const schedulePersonalList  = await scheduleModel.getSchedulePersonal(user.userIdx);
        const schedule = scheduleSchoolList.concat(schedulePersonalList);
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, {
                schedule
            }));
    },
    getSubject: async (req, res) => {
        const user = req.decoded;
        const subjectList = await scheduleModel.getSubject(user.school);

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, {
                subjectList
            }));

    }
}

module.exports = schedule;
