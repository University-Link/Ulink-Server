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
    /** 
     * 메인 시간표 정보 가져오기
     * @summary 현재 학기 메인 시간표 정보 및 일정 가져오기
     * @param 토큰
     * @return 현재 학기 시간표 정보 및 일정 
     */
    getMainSchedule: async (req, res) => {
        const user = req.decoded;
        const semester = await moment.getSemester();

        const mainScheduleList = await scheduleModel.getSemesterMainSchedule(user.userIdx, semester);
        if (mainScheduleList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        if (mainScheduleList.length == 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_MAIN_SCHEDULE_FAIL));
        }
        const schedulePersonalList = await scheduleModel.getSchedulePersonal(mainScheduleList[0].scheduleIdx);
        const scheduleSchoolList = await scheduleModel.getScheduleSchool(mainScheduleList[0].scheduleIdx);
        if (schedulePersonalList < 0 || scheduleSchoolList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        mapping(schedulePersonalList, false);
        mapping(scheduleSchoolList, true);

        const schedule = await schedulePersonalList.concat(scheduleSchoolList);
        const result = {};
        result.mon = [];
        result.tue = [];
        result.wen = [];
        result.tru = [];
        result.fri = [];
        schedule.forEach((s) => {
            if (s.day == 'mon') {
                result.mon.push(s);
            } else if (s.day == 'tue') {
                result.tue.push(s);
            } else if (s.day == 'wen') {
                result.wen.push(s);
            } else if (s.day == 'tru') {
                result.tru.push(s);
            } else {
                result.fri.push(s);
            }
        })
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, {
                timeTable: mainScheduleList[0],
                subjects: result
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
            day,
            content,
            color,
            scheduleIdx
        } = req.body;
        if (!name || !startTime || !endTime || !day || !content || !color || !scheduleIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.createSchedulePersonal(name, startTime, endTime,
            day, content, color, scheduleIdx);
        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CREATE_SCHEDULE_SUCCESS, {
                idx: result
            }));
    },
    getSpecificSchedule: async (req, res) => {
        const scheduleIdx = req.params.idx;
        const isSubject = req.query.isSubject;
        if (!scheduleIdx || isNaN(scheduleIdx) || !isSubject) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        let result;
        if (isSubject === 'true') {
            result = await scheduleModel.getSpecificScheduleSchool(scheduleIdx);
        } else if (isSubject === 'false') {
            result = await scheduleModel.getSpecificSchedulePersonal(scheduleIdx);
        } else {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if (result < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        if (result.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SCHEDULE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, result[0]));
    },
    getSpecificScheduleSchool: async (req, res) => {
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
        if (result.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SCHEDULE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, result[0]));
    },
    getSpecificSchedulePersonal: async (req, res) => {
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
        if (result.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SCHEDULE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, result[0]));
    },
    deleteSpecificSchedule: async (req, res) => {
        const scheduleIdx = req.params.idx;
        const isSubject = req.query.isSubject;
        if (!scheduleIdx || isNaN(scheduleIdx) || !isSubject) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        let result;
        if (isSubject === 'true') {
            result = await scheduleModel.deleteScheduleSchool(scheduleIdx);
        } else if (isSubject === 'false') {
            result = await scheduleModel.deleteSchedulePersonal(scheduleIdx);
        } else {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

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
                idx: scheduleIdx
            }));
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
    },
    getSemesterList: async (req, res) => {
        const user = req.decoded;
        const semesterList = await scheduleModel.getSemesterList(user.userIdx);
        if (semesterList === -1) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, semesterList));
    },
    updateSchedulePersonal: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const schedulePersonalIdx = req.params.idx;
        const {
            name,
            content,
            startTime,
            endTime,
            day
        } = req.body;

        if (!name || !content || !startTime || !endTime || !day) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const schedulePersonal = await scheduleModel.updateSchedulePersonal(schedulePersonalIdx, name, content, startTime, endTime, day);

        if (schedulePersonal) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.UPDATE_SCHEDULE_FAIL));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.UPDATE_SCHEDULE_SUCCESS, {
                idx: schedulePersonalIdx,
                name: name,
                content: content,
                startTime: startTime,
                endTime: endTime,
                day: day
            }));
    },
    updateMainNameSchedule: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const scheduleIdx = req.params.idx;
        const {
            name
        } = req.body;

        if (!name) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const scheduleMain = await scheduleModel.updateMainNameSchedule(scheduleIdx, name);

        if (scheduleMain) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.UPDATE_SCHEDULE_FAIL));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.UPDATE_SCHEDULE_SUCCESS, {
                idx: scheduleIdx,
                name: name
            }));
    },
    updateMainSchedule: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const scheduleIdx = req.params.idx;

        if (!scheduleIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        //시간표가 메인시간표가 아니면 false를 받아옴!
        if (!await scheduleModel.checkSchedule(scheduleIdx)) {
            //메인시간표를 찾아서 0으로 만드는 것
            const getScheduleSemester = await scheduleModel.getScheduleSemester(userIdx, scheduleIdx);
            const updateMainOffSchedule = await scheduleModel.updateMainOffSchedule(getScheduleSemester[0].semester);
            if (updateMainOffSchedule === 1) {
                const updateMainOnSchedule = await scheduleModel.updateMainOnSchedule(scheduleIdx);
            }
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.UPDATE_SCHEDULE_SUCCESS, {
                idx: scheduleIdx
            }));
    },
    deleteMainSchedule: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        console.log("test");
        const scheduleIdx = req.params.idx;
        let scheduleSemester;
        let updateMainSchedule;
        let deleteMainSchedule;
        if (!scheduleIdx) {
            console.log("test1");
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        // checkSchedule -> 이게 메인이면 semester 아니면 어떤 특정 값을 줘서 그냥 삭제만 해야함
        if (await scheduleModel.checkSchedule(scheduleIdx)) {
            // 삭제할 정보의 학기 가져와야 함
            scheduleSemester = await scheduleModel.getScheduleSemester(userIdx, scheduleIdx);
            // getScheduleSemester[0].semester
            console.log("학기: ", scheduleSemester[0].semester);
            deleteMainSchedule = await scheduleModel.deleteMainSchedule(scheduleIdx);
            // 그 정보로 scheduleIdx 제일 낮은거 찾음
            const getScheduleIdx = await scheduleModel.getScheduleIdx(scheduleSemester[0].semester);
            console.log("낮은 순서 찾았냐? : ", getScheduleIdx[0].scheduleIdx);
            // 그걸 인덱스로 메인 시간표로 설정
            updateMainSchedule = await scheduleModel.updateMainSchedule(getScheduleIdx[0].scheduleIdx);
            console.log("실행!: ", updateMainSchedule);
        } else {
            // 그리고삭제
            deleteMainSchedule = await scheduleModel.deleteMainSchedule(scheduleIdx);
        }
        if (deleteMainSchedule === 0 || updateMainSchedule === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_SCHEDULE_FAIL));
        }
        if (deleteMainSchedule < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.DELETE_SCHEDULE_SUCCESS, {
                idx: scheduleIdx
            }));
    },
}

module.exports = schedule;
