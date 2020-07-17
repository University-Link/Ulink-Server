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
     * 시간표 정보 가져오기
     * @summary 시간표 정보 및 일정 가져오기
     * @param 토큰, 학기, 시간표 인덱스
     * @return 특정 학기의 시간표 정보 및 일정 
     */
    getSchedule: async (req, res) => {
        const scheduleIdx = req.params.idx;

        const scheduleInfo = await scheduleModel.getSchedule(scheduleIdx);
        if (scheduleInfo < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        if (scheduleInfo.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_TIMETABLE_FAIL));
        }

        // result template
        const result = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: []
        };

        let getMinTime = await scheduleModel.getMinTime(scheduleIdx);
        let getMaxTime = await scheduleModel.getMaxTime(scheduleIdx);
        if (getMinTime === null) {
            getMinTime = "09:00";
            getMaxTime = "18:00";
        }


        const schedulePersonalList = await scheduleModel.getSchedulePersonal(scheduleIdx);
        const scheduleSchoolList = await scheduleModel.getScheduleSchool(scheduleIdx);
        if (schedulePersonalList < 0 || scheduleSchoolList < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        // Add a variable that verifies that it is a subject
        mapping(schedulePersonalList, false);
        mapping(scheduleSchoolList, true);

        const schedule = await schedulePersonalList.concat(scheduleSchoolList);

        // Pack per day
        schedule.forEach((s) => {
            result[s.day].push(s);
        });

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_TIMETABLE_SUCCESS, {
                timeTable: scheduleInfo[0],
                minTime: getMinTime,
                maxTime: getMaxTime,
                subjects: result
            }));
    },
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
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        // result template
        const result = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: []
        };

        // 현재학기 시간표가 존재하지 않을 경우, 자동으로 새로운 메인 시간표를 생성
        if (mainScheduleList.length === 0) {
            // userIdx, semester, name, main
            const scheduleIdx = await scheduleModel.createSchedule(user.userIdx, semester, semester + '학기 첫 시간표', 1);
            if (scheduleIdx < 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }
            return res.status(statusCode.OK)
                .send(util.success(statusCode.OK, resMessage.READ_TIMETABLE_SUCCESS, {
                    timeTable: {
                        "scheduleIdx": scheduleIdx,
                        "semester": semester,
                        "name": semester + '학기 첫 시간표'
                    },
                    minTime: "09:00",
                    maxTime: "18:00",
                    subjects: result
                }));
        }

        let getMinTime = await scheduleModel.getMinTime(mainScheduleList[0].scheduleIdx);
        let getMaxTime = await scheduleModel.getMaxTime(mainScheduleList[0].scheduleIdx);
        if (getMinTime === null) {
            getMinTime = "09:00";
            getMaxTime = "18:00";
        }
        // 현재학기 시간표가 존재 할 경우, 메인 시간표 일정을 조회
        const schedulePersonalList = await scheduleModel.getSchedulePersonal(mainScheduleList[0].scheduleIdx);
        const scheduleSchoolList = await scheduleModel.getScheduleSchool(mainScheduleList[0].scheduleIdx);
        if (schedulePersonalList < 0 || scheduleSchoolList < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        // Add a variable that verifies that it is a subject
        mapping(schedulePersonalList, false);
        mapping(scheduleSchoolList, true);

        const schedule = await schedulePersonalList.concat(scheduleSchoolList);

        // Pack per day
        schedule.forEach((s) => {
            result[s.day].push(s);
        });

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_TIMETABLE_SUCCESS, {
                timeTable: mainScheduleList[0],
                minTime: getMinTime,
                maxTime: getMaxTime,
                subjects: result
            }));
    },
    /** 
     * 시간표 만들기
     * @summary 시간표 새로 만들기
     * @param 토큰, 학기, 시간표 이름
     * @return Boolean
     */
    createSchedule: async (req, res) => {
        const user = req.decoded;
        const {
            semester,
            name
        } = req.body;
        let main;
        if (user === undefined || semester === undefined || name === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const mainSchedule = await scheduleModel.getSemesterMainSchedule(user.userIdx, semester);
        if (mainSchedule < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        if (mainSchedule.length === 0) {
            main = 1;
        } else {
            main = 0;
        }

        const result = await scheduleModel.createSchedule(user.userIdx, semester, name, main);
        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.CREATE_TIMETABLE_SUCCESS, {
                idx: result
            }));



    },
    /** 
     * 시간표에 학교 일정 추가하기
     * @summary 시간표에 학교 일정 (과목) 추가하기
     * @param 과목 인덱스, 색상, 시간표 인덱스
     * @return 추가한 데이터 인덱스
     */
    createScheduleSchool: async (req, res) => {
        const {
            subjectIdx,
            color,
            scheduleIdx
        } = req.body;
        if (subjectIdx === undefined || color === undefined || scheduleIdx === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.createScheduleSchool(subjectIdx, color, scheduleIdx);
        if (result < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.CREATE_SCHEDULE_SUCCESS, {
                idx: result
            }));

    },
    /** 
     * 시간표에 개인 일정 추가하기
     * @summary 시간표에 개인 일정 추가하기
     * @param 개인 일정 이름, 시작시간, 종료시간, 요일, 내용, 색상, 시간표 인덱스
     * @return 추가한 데이터 인덱스
     */
    createSchedulePersonal: async (req, res) => {
        const {
            scheduleList
        } = req.body;
        
        if (scheduleList === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if (scheduleList.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.CREATE_SCHEDULE_FAIL));
        }

        let result;
        for (let schedule of scheduleList) {
            if(typeof(schedule) === typeof('jihye')){
                schedule = JSON.parse(schedule);
            }
            schedule.startTime = await moment.timeToStrTime(schedule.startTime);
            schedule.endTime = await moment.timeToStrTime(schedule.endTime);
            console.log(schedule.startTime, schedule.endTime);
            result = await scheduleModel.createSchedulePersonal(schedule.name, schedule.startTime, schedule.endTime,
                schedule.day, schedule.content, schedule.color, schedule.scheduleIdx);
            if (result < 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }
        }

        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.CREATE_SCHEDULE_SUCCESS));
    },
    /** 
     * 일정 상세정보 (통합)
     * @summary 일정에 대한 상세 정보 가져오기
     * @param 일정 인덱스, 학교일정(T)/개인일정(F) (Boolean)
     * @return 일정에 대한 상세 정보
     */
    getSpecificSchedule: async (req, res) => {
        const idx = req.params.idx;
        const isSubject = req.query.isSubject;
        if (idx === undefined || isNaN(idx) || isSubject === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if (!await scheduleModel.checkScheduleIdx(idx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        let result;
        if (isSubject === 'true') {
            result = await scheduleModel.getSpecificScheduleSchool(idx);
        } else if (isSubject === 'false') {
            result = await scheduleModel.getSpecificSchedulePersonal(idx);
        } else {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if (result < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        if (result.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SCHEDULE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, result[0]));
    },
    /** 
     * 학교 일정 상세정보
     * @summary 학교 일정에 대한 상세 정보 가져오기
     * @param 학교 일정 인덱스
     * @return 학교 일정에 대한 상세 정보
     */
    getSpecificScheduleSchool: async (req, res) => {
        const scheduleSchoolIdx = req.params.idx;
        if (scheduleSchoolIdx === undefined || isNaN(scheduleSchoolIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.getSpecificScheduleSchool(scheduleSchoolIdx);
        if (result < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        if (result.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SCHEDULE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, result[0]));
    },
    /** 
     * 개인 일정 상세정보
     * @summary 개인 일정에 대한 상세 정보 가져오기
     * @param 개인 일정 인덱스
     * @return 개인 일정에 대한 상세 정보
     */
    getSpecificSchedulePersonal: async (req, res) => {
        const schedulePersonalIdx = req.params.idx;
        if (schedulePersonalIdx === undefined || isNaN(schedulePersonalIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.getSpecificSchedulePersonal(schedulePersonalIdx);
        if (result < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        if (result.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SCHEDULE_FAIL));
        }
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SCHEDULE_SUCCESS, result[0]));
    },
    /** 
     * 일정 삭제 (통합)
     * @summary 일정 삭제
     * @param 일정 인덱스
     * @return 삭제한 일정 인덱스
     */
    deleteSpecificSchedule: async (req, res) => {
        const idx = req.params.idx;
        const isSubject = req.query.isSubject;
        if (idx === undefined || isNaN(idx) || isSubject === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        let result;
        if (isSubject === 'true') {
            result = await scheduleModel.deleteScheduleSchool(idx);
        } else if (isSubject === 'false') {
            result = await scheduleModel.deleteSchedulePersonal(idx);
        } else {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if (result === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_SCHEDULE_FAIL));
        }
        if (result < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.NO_CONTENT)
            .send(util.success(statusCode.NO_CONTENT, resMessage.DELETE_SCHEDULE_SUCCESS));
    },
    /** 
     * 학교 일정 삭제
     * @summary 학교 일정 삭제
     * @param 학교 일정 인덱스
     * @return 삭제한 학교 일정 인덱스
     */
    deleteScheduleSchool: async (req, res) => {
        const scheduleSchoolIdx = req.params.idx;
        if (scheduleSchoolIdx === undefined || isNaN(scheduleSchoolIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.deleteScheduleSchool(scheduleSchoolIdx);
        if (result === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_SCHEDULE_FAIL));
        }
        if (result < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.NO_CONTENT)
            .send(util.success(statusCode.NO_CONTENT, resMessage.DELETE_SCHEDULE_SUCCESS));
    },
    /** 
     * 개인 일정 삭제
     * @summary 개인 일정 삭제
     * @param 개인 일정 인덱스
     * @return 삭제한 개인 일정 인덱스
     */
    deleteSchedulePersonal: async (req, res) => {
        const schedulePersonalIdx = req.params.idx;
        if (schedulePersonalIdx === undefined || isNaN(schedulePersonalIdx)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await scheduleModel.deleteSchedulePersonal(schedulePersonalIdx);
        if (result === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_SCHEDULE_FAIL));
        }
        if (result < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.NO_CONTENT)
            .send(util.success(statusCode.NO_CONTENT, resMessage.DELETE_SCHEDULE_SUCCESS));
    },
    /** 
     * 모든/특정 학기 시간표 목록 가져오기
     * @summary 유저의 학기 시간표 목록 가져오기
     * @param 토큰, 학기(not required)
     * @return 시간표 목록과 각 시간표의 정보(인덱스, 이름, 메인여부)
     */
    getScheduleList: async (req, res) => {
        const user = req.decoded;
        const semester = req.query.semester;
        if (semester === undefined){
            const scheduleList = await scheduleModel.getScheduleList(user.userIdx);
            if (scheduleList === -1) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }
            return res.status(statusCode.OK)
                .send(util.success(statusCode.OK, resMessage.READ_TIMETABLE_SUCCESS, scheduleList));
        }
        else{
            const semesterScheduleList = await scheduleModel.getSemesterScheduleList(user.userIdx, semester);
            if (semesterScheduleList === -1) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }

            const scheduleList = [];
            for(let schedule2 of semesterScheduleList){
                let scheduleIdx = schedule2.scheduleIdx;
                let scheduleInfo = await scheduleModel.getSchedule(scheduleIdx);
                if (scheduleInfo < 0) {
                    return res.status(statusCode.INTERNAL_SERVER_ERROR)
                        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
                }
                if (scheduleInfo.length === 0) {
                    return res.status(statusCode.BAD_REQUEST)
                        .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_TIMETABLE_FAIL));
                }

                // result template
                let result = {
                    0: [],
                    1: [],
                    2: [],
                    3: [],
                    4: []
                };

                let getMinTime = await scheduleModel.getMinTime(scheduleIdx);
                let getMaxTime = await scheduleModel.getMaxTime(scheduleIdx);
                if (getMinTime === null) {
                    getMinTime = "09:00";
                    getMaxTime = "18:00";
                }


                let schedulePersonalList = await scheduleModel.getSchedulePersonal(scheduleIdx);
                let scheduleSchoolList = await scheduleModel.getScheduleSchool(scheduleIdx);
                if (schedulePersonalList < 0 || scheduleSchoolList < 0) {
                    return res.status(statusCode.INTERNAL_SERVER_ERROR)
                        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
                }

                // Add a variable that verifies that it is a subject
                mapping(schedulePersonalList, false);
                mapping(scheduleSchoolList, true);

                let schedule = await schedulePersonalList.concat(scheduleSchoolList);

                // Pack per day
                schedule.forEach((s) => {
                    result[s.day].push(s);
                });

                scheduleList.push({
                    timeTable: scheduleInfo[0],
                    minTime: getMinTime,
                    maxTime: getMaxTime,
                    subjects: result
                });
            }
            return res.status(statusCode.OK)
                .send(util.success(statusCode.OK, resMessage.READ_TIMETABLE_SUCCESS, scheduleList));
        }
    },
    /** 
     * 개인 일정 업데이트
     * @summary 개인일정 수정
     * @param 토큰, 개인 일정 인덱스, 업데이트 일정 이름, 내용, 시작시간, 종료시간, 요일
     * @return 수정한 개인일정
     */
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

        if (name === undefined || content === undefined || startTime === undefined ||
            endTime === undefined || day === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        startTime = await moment.timeToStrTime(startTime);
        endTime = await moment.timeToStrTime(endTime);
        const schedulePersonal = await scheduleModel.updateSchedulePersonal(schedulePersonalIdx, name, content, startTime, endTime, day);

        if (schedulePersonal) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.UPDATE_SCHEDULE_FAIL));
        }

        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.UPDATE_SCHEDULE_SUCCESS));
    },
    /** 
     * 시간표 이름 수정하기
     * @summary 시간표 이름 수정
     * @param 토큰, 시간표 인덱스, 업데이트 시간표 이름
     * @return 수정한 시간표 인덱스, 수정한 시간표 이름
     */
    updateNameSchedule: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const scheduleIdx = req.params.idx;
        const {
            name
        } = req.body;

        if (name === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const scheduleMain = await scheduleModel.updateNameSchedule(scheduleIdx, name);

        if (scheduleMain) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.UPDATE_TIMETABLE_FAIL));
        }

        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.UPDATE_TIMETABLE_SUCCESS));
    },
    /** 
     * 메인 시간표 수정하기
     * @summary 메인 시간표 수정하기
     * @param 토큰, 시간표 인덱스
     * @return 수정한 시간표 인덱스
     */
    updateMainSchedule: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const scheduleIdx = req.params.idx;

        if (scheduleIdx === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if (!await scheduleModel.checkSchedule(scheduleIdx)) {
            const getScheduleSemester = await scheduleModel.getScheduleSemester(userIdx, scheduleIdx);
            if (getScheduleSemester < 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }
            const updateMainOffSchedule = await scheduleModel.updateMainOffSchedule(getScheduleSemester[0].semester, userIdx);
            if (updateMainOffSchedule) {
                const updateMainOnSchedule = await scheduleModel.updateMainOnSchedule(scheduleIdx);
                if (updateMainOnSchedule === -1) {
                    return res.status(statusCode.INTERNAL_SERVER_ERROR)
                        .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
                }
                if (!updateMainOnSchedule) {
                    return res.status(statusCode.BAD_REQUEST)
                        .send(util.fail(statusCode.BAD_REQUEST, resMessage.UPDATE_TIMETABLE_FAIL));
                }
            }
        }

        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.UPDATE_TIMETABLE_SUCCESS));
    },
    /** 
     * 시간표 삭제하기
     * @summary 시간표 삭제하기
     * @param 토큰, 시간표 인덱스
     * @return 삭제한 시간표 인덱스
     */
    deleteMainSchedule: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        const scheduleIdx = req.params.idx;
        let scheduleSemester, updateMainSchedule, deleteMainSchedule;
        if (scheduleIdx === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if (await scheduleModel.checkSchedule(scheduleIdx)) {
            scheduleSemester = await scheduleModel.getScheduleSemester(userIdx, scheduleIdx);
            deleteMainSchedule = await scheduleModel.deleteMainSchedule(scheduleIdx);
            if (scheduleSemester < 0 || deleteMainSchedule < 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }
            if (scheduleSemester.length === 0 || deleteMainSchedule === 0) {
                return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_TIMETABLE_FAIL));
            }
            const getScheduleIdx = await scheduleModel.getScheduleIdx(scheduleSemester[0].semester);
            if (getScheduleIdx.length === 0) {
                return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_TIMETABLE_FAIL));
            }
            updateMainSchedule = await scheduleModel.updateMainSchedule(getScheduleIdx[0].scheduleIdx);
            if (getScheduleIdx < 0 || updateMainSchedule < 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }
        } else {
            deleteMainSchedule = await scheduleModel.deleteMainSchedule(scheduleIdx);
            if (deleteMainSchedule < 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR)
                    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
            }
        }
        if (deleteMainSchedule === 0 || updateMainSchedule === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_TIMETABLE_FAIL));
        }
        return res.status(statusCode.NO_CONTENT)
            .send(util.success(statusCode.NO_CONTENT, resMessage.DELETE_TIMETABLE_SUCCESS));
    },
    /** 
     * 일정 색상 수정하기 (통합)
     * @summary 일정 색상 수정하기
     * @param 일정 인덱스, 학교일정(T)/개인일정(F) (Boolean), 색상 인덱스
     * @return 변경한 일정 인덱스
     */
    updateSpecificSchedule: async (req, res) => {
        const idx = req.params.idx;
        const isSubject = req.query.isSubject;
        const {
            color
        } = req.body;
        if (idx === undefined || isNaN(idx) ||
            isSubject === undefined || color === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        let result;
        if (isSubject === 'true') {
            result = await scheduleModel.updateSpecificScheduleSchool(idx, color);
        } else if (isSubject === 'false') {
            result = await scheduleModel.updateSpecificSchedulePersonal(idx, color);
        } else {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if (result < 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }
        if (result === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.UPDATE_SCHEDULE_FAIL));
        }
        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.UPDATE_SCHEDULE_SUCCESS, {
                idx: idx
            }));
    },
}

module.exports = schedule;
