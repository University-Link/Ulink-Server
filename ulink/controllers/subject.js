const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const subjectModel = require('../models/subject');
const Hangul = require('hangul-js');


const subject = {
    /** 
     * 수업목록 가져오기
     * @summary 사용자 학교의 수업 목록 가져오기
     * @param 토큰
     * @return 수업 목록
     */
    getSubject: async (req, res) => {
        const user = req.decoded;
        const subjectList = await subjectModel.getSubject(user.school);

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

        if (!name || name === "") {
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
