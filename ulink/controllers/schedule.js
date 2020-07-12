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
        if(!user || !semester || !name){
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const mainSchedule = await scheduleModel.getSemesterMainSchedule(user.userIdx, semester);
        if (mainSchedule.length == 0){
            main = 1;
        }
        else{
            main = 0;
        }

        const result = await scheduleModel.createSchedule(user.userIdx, semester, name, main);
        // TO DO: response message 재정의 필요
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.CREATE_SCHEDULE_SUCCESS, {
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
    /** 
     * 시간표에 개인 일정 추가하기
     * @summary 시간표에 개인 일정 추가하기
     * @param 개인 일정 이름, 시작시간, 종료시간, 요일, 내용, 색상, 시간표 인덱스
     * @return 추가한 데이터 인덱스
     */
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
    /** 
     * 일정 상세정보 (통합)
     * @summary 일정에 대한 상세 정보 가져오기
     * @param 일정 인덱스, 학교일정(T)/개인일정(F) (Boolean)
     * @return 일정에 대한 상세 정보
     */
    getSpecificSchedule: async (req, res) => {
        const idx = req.params.idx;
        const isSubject = req.query.isSubject;
        if (!idx || isNaN(idx) || !isSubject) {
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
    /** 
     * 학교 일정 상세정보
     * @summary 학교 일정에 대한 상세 정보 가져오기
     * @param 학교 일정 인덱스
     * @return 학교 일정에 대한 상세 정보
     */
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
    /** 
     * 개인 일정 상세정보
     * @summary 개인 일정에 대한 상세 정보 가져오기
     * @param 개인 일정 인덱스
     * @return 개인 일정에 대한 상세 정보
     */
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
    /** 
     * 일정 삭제 (통합)
     * @summary 일정 삭제
     * @param 일정 인덱스
     * @return 삭제한 일정 인덱스
     */
    deleteSpecificSchedule: async (req, res) => {
        const idx = req.params.idx;
        const isSubject = req.query.isSubject;
        if (!idx || isNaN(idx) || !isSubject) {
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
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.DELETE_SCHEDULE_SUCCESS, {
                idx: idx
            }));
    },
    /** 
     * 학교 일정 삭제
     * @summary 학교 일정 삭제
     * @param 학교 일정 인덱스
     * @return 삭제한 학교 일정 인덱스
     */
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
    /** 
     * 개인 일정 삭제
     * @summary 개인 일정 삭제
     * @param 개인 일정 인덱스
     * @return 삭제한 개인 일정 인덱스
     */
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
    /** 
     * 수업목록 가져오기
     * @summary 사용자 학교의 수업 목록 가져오기
     * @param 토큰
     * @return 수업 목록
     */
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
    /** 
     * 모든 학기 시간표 목록 가져오기
     * @summary 유저의 모든 학기 시간표 목록 가져오기
     * @param 토큰
     * @return 시간표 목록과 각 시간표의 정보(인덱스, 이름, 메인여부)
     */
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
