const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const moment = require('../modules/moment');
const scheduleModel = require('../models/schedule');

const mapping = (schedule, isSubject) => {
    schedule.forEach(element => {
        element.subject = isSubject;
    });
};

const schedule = {
    getMainSchedule: async (req, res) => {
        const user = req.decoded;
        const semester = await moment.getSemester();

        const mainScheduleList = await scheduleModel.getSemesterMainSchedule(user.userIdx, semester);
        if (mainScheduleList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        const schedulePersonalList = await scheduleModel.getSchedulePersonal(mainScheduleList[0].schedule_idx);
        const scheduleSchoolList = await scheduleModel.getScheduleSchool(mainScheduleList[0].schedule_idx);
        if (schedulePersonalList < 0 || scheduleSchoolList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        mapping(schedulePersonalList, false);
        mapping(scheduleSchoolList, true);

        const schedule = schedulePersonalList.concat(scheduleSchoolList);

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, {
                timeTable: mainScheduleList[0],
                subjects: schedule
            }));

    },
    createScheduleSchool: async (req, res) => {
        const {
            subjectIdx,
            color,
            scheduleIdx
        } = req.body;
        if (!subjectIdx || !color || !scheduleIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.createScheduleSchool(subjectIdx, color, scheduleIdx);
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CREATE_SCHEDULE_SUCCESS, {
                idx: result
            }));

    },
    createSchedulePersonal: async (req, res) => {
        const {
            name,
            startTime,
            endTime,
            week,
            place,
            color,
            scheduleIdx
        } = req.body;
        if (!name || !startTime || !endTime || !week || !place || !color || !scheduleIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.createSchedulePersonal(name, startTime, endTime,
            week, place, color, scheduleIdx);
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CREATE_SCHEDULE_SUCCESS, {
                idx: result
            }));
    },
    getSpecificScheduleSchool: async(req, res) => {
        const scheduleSchoolIdx = req.params.idx;
        if (!scheduleSchoolIdx || isNaN(scheduleSchoolIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.getSpecificScheduleSchool(scheduleSchoolIdx);
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        if (result.length === 0){
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SCHEDULE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, result[0]));


    },
    getSpecificSchedulePersonal: async(req, res) => {
        const schedulePersonalIdx = req.params.idx;
        if (!schedulePersonalIdx || isNaN(schedulePersonalIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.getSpecificSchedulePersonal(schedulePersonalIdx);
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        if (result.length === 0){
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SCHEDULE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, result[0]));
    },
    deleteScheduleSchool: async (req, res) => {
        const scheduleSchoolIdx = req.params.idx;
        if (!scheduleSchoolIdx || isNaN(scheduleSchoolIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.deleteScheduleSchool(scheduleSchoolIdx);
        if (result === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_SCHEDULE_FAIL));
        }
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.DELETE_SCHEDULE_SUCCESS, {
                idx: scheduleSchoolIdx
            }));
    },
    deleteSchedulePersonal: async (req, res) => {
        const schedulePersonalIdx = req.params.idx;
        if (!schedulePersonalIdx || isNaN(schedulePersonalIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.deleteSchedulePersonal(schedulePersonalIdx);
        if (result === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_SCHEDULE_FAIL));
        }
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.DELETE_SCHEDULE_SUCCESS, {
                idx: schedulePersonalIdx
            }));
    },
    getSubject: async (req, res) => {
        const user = req.decoded;
        const subjectList = await scheduleModel.getSubject(user.school);

        if (subjectList.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SUBJECT_FAIL));
        }
        
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, {
                subjectList
            }));
    }
}

module.exports = schedule;
