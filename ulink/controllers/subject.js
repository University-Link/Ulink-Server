const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const subjectModel = require('../models/subject');
const Hangul = require('hangul-js');


const subject = {
    /** 
     * 수업목록 가져오기
     * @summary 사용자 학교의 수업 목록 가져오기
     * @param 토큰, query (None~5): course, grade, credit, onDay, offDay
     *  - course (이수구분): 전공필수, 전공선택, 교양필수, 교양선택, ...
     *  - grade (학년): 0, 1, 2, 3, 4, 5
     *  - credit (학점): 1, 2, 3, 4, ...
     *  - onDay (수업 선호요일): 0~4
     *  - offDay (수업 제외요일, 공강): 0~4
     * @return 수업 목록
     */
    getSubject: async (req, res) => {
        const user = req.decoded;

        const condition1 = {
            course: req.query.course,
            grade: req.query.grade,
            credit: req.query.credit
        };
        const condition2 = {
            onDay: req.query.onDay,
            offDay: req.query.offDay
        }        
        // 조건으로 모델 필터링하기
        const subjectList = await subjectModel.getConditionSubject(user.school, condition1, condition2);

        if (subjectList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SUBJECT_FAIL));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, subjectList));
    },
    /** 
     * 수업목록 전공 가져오기
     * @summary 사용자 학교 및 전공의 수업 목록 가져오기
     * @param 토큰, query (None~5): course, grade, credit, onDay, offDay
     *  - course (이수구분): 전공필수, 전공선택, 교양필수, 교양선택, ...
     *  - grade (학년): 0, 1, 2, 3, 4, 5
     *  - credit (학점): 1, 2, 3, 4, ...
     *  - onDay (수업 선호요일): 0~4
     *  - offDay (수업 제외요일, 공강): 0~4
     * @return 수업 목록
     */
    getMajorSubject: async (req, res) => {
        const user = req.decoded;

        const condition1 = {
            course: req.query.course,
            grade: req.query.grade,
            credit: req.query.credit,
            major: user.major
        };
        const condition2 = {
            onDay: req.query.onDay,
            offDay: req.query.offDay
        }        
        // 조건으로 모델 필터링하기
        const subjectList = await subjectModel.getConditionSubject(user.school, condition1, condition2);

        if (subjectList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SUBJECT_FAIL));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, subjectList));
    },
    /** 
     * 이수구분 목록 가져오기
     * @summary 이수구분 목록 가져오기
     * @param 토큰
     * @return 이수구분 목록
     */
    getCourse: async (req, res) => {
        const user = req.decoded;
        let courseList = await subjectModel.getCourse(user.school);

        if (courseList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_COURSE_FAIL));
        }
        const result = [];
        courseList.map((element)=>{ result.push(element.course); });

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_COURSE_SUCCESS, result));
    },
    /** 
     * 특정 이수구분 수업목록 가져오기
     * @summary 특정 이수구분 수업 목록 가져오기
     * @param 토큰, 이수구분(course)
     * @return 이수구분에 해당하는 수업 목록
     */
    getCourseSubject: async (req, res) => {
        const user = req.decoded;
        const course = req.query.name;
        if(course === undefined){
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        let subjectList = await subjectModel.getCourseSubject(user.school, course);

        if (subjectList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SUBJECT_FAIL));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, subjectList));
    },
    /** 
     * 특정 학년 수업목록 가져오기
     * @summary 특정 학년 수업 목록 가져오기
     * @param 토큰, 학년
     * @return 학년에 해당하는 수업 목록
     */
    getGradeSubject: async (req, res) => {
        const user = req.decoded;
        const grade = req.query.grade;
        if(grade === undefined){
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        let subjectList = await subjectModel.getGradeSubject(user.school, grade);

        if (subjectList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SUBJECT_FAIL));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, subjectList));
    },
    /** 
     * 특정 단어 포함 수업목록 가져오기
     * @summary 특정 단어 포함 수업목록 가져오기
     * @param 토큰, 검색 단어
     * @return 단어 포함 수업 목록
     */
    getSearchSubject: async (req, res) => {
        const user = req.decoded;
        const name = req.query.name;

        const subjectList = await subjectModel.getSearchSubject(user.school, name);

        if (subjectList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, subjectList));
    },
    /** 
     * 수업검색 자동완성
     * @summary 키워드를 통해 비슷한 수업목록 조회 (검색어 자동완성)
     * @param 토큰, 검색 키워드
     * @return 자동완성 수업 목록
     */
    getRecommendSubject: async (req, res) => {
        const user = req.decoded;
        const name = req.query.name;
        let subjectName = [];

        if (name === undefined || name === "") {
            return res.status(statusCode.OK)
                .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, subjectName));
        }
        const nameAtomic = Hangul.disassemble(name.replace(/(\s*)/g, "")).join('');
        const subjectList = await subjectModel.getRecommendSubject(user.school, nameAtomic);
        if (subjectList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }

        subjectList.forEach(element => {
            subjectName.push(element.name);
        });
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_SUBJECT_SUCCESS, subjectName));
    },
}

module.exports = subject;
