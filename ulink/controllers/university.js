const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const universityModel = require('../models/university');

const university = {
    /** 
     * 특정 단어 포함 학교 조회
     * @summary 특정 단어 포함 학교 가져오기
     * @param 학교를 찾기 위한 단어
     * @return 단어 포함 학교 목록
     */
    getSearchUniversityName: async (req, res) => {
        const { name } = req.params;

        const nameList = await universityModel.getSearchUniversityName(name);

        if (nameList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        } else if (nameList.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_UNIVERSITY_NAME_FAIL))
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_UNIVERSITY_NAME_SUCCESS, nameList));
    },
    /** 
     * 특정 단어 포함 학교의 전공 조회
     * @summary 특정 단어 포함 학교의 전공 가져오기
     * @param 학교, 전공을 찾기 위한 단어
     * @return 단어 포함 학교의 전공 목록
     */
    getSearchUniversityMajor: async (req, res) => {
        const {
            name,
            major
        } = req.body;

        const majorList = await universityModel.getSearchUniversityMajor(name, major);

        if (majorList < 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        } else if (majorList.length === 0) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_UNIVERSITY_MAJOR_FAIL))
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_UNIVERSITY_MAJOR_SUCCESS, majorList));
    },
}

module.exports = university;
