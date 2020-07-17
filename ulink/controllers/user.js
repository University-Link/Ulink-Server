const jwt = require('../modules/jwt');
const encrypt = require('../modules/encryption');
const util = require('../modules/util')
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const userModel = require('../models/user');
const nameMaker = require('../modules/name');

const user = {
    /** 
    * 회원가입하기
    * @summary 주어진 정보들을 가지고 회원가입
    * @param 아이디, 비밀번호, 이름, 이메일, 학교명, 성별(m/f)
    * @return 회원가입한 유저의 아이디, 인덱스
    */
    signUp: async (req, res) => {
        const {
            id,
            password,
            name,
            email,
            school,
            gender
        } = req.body;

        // empty value
        if (id === undefined || password === undefined || name === undefined ||
            email === undefined || school === undefined || gender === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        // duplicated id
        if (await userModel.checkUser(id)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
        }

        // invalid school
        if (!school.endsWith("학교")) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.INVALID_SCHOOL));
        }

        const salt = encrypt.makeSalt();
        const encryptPassword = encrypt.encryption(password, salt);
        const nickname = nameMaker.makeRandomName();

        const idx = await userModel.signUp(id, encryptPassword, salt, name, email, nickname, school, gender);
        if (idx === -1) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR)
                .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.CREATED_USER, {
                userId: id,
                userIdx: idx
            }));
    },
    /** 
    * 로그인 하기
    * @summary 주어진 정보들을 가지고 로그인
    * @param 아이디, 비밀번호
    * @return 엑세스 토큰
    */
    signIn: async (req, res) => {
        const {
            id,
            password
        } = req.body;

        //  empty value
        if (id === undefined || password === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        // check id
        if (!await userModel.checkUser(id)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }

        const user = await userModel.getUserById(id);
        // check password
        if (user[0].password !== encrypt.encryption(password, user[0].salt)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
        }

        const {
            token,
            _
        } = await jwt.sign(user[0]);

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                uid: user[0].uidChat,
                accessToken: token
            }));
    },
    /** 
    * 프로필 정보
    * @summary 아이디에 해당하는 프로필 정보 가져오기
    * @param 아이디
    * @return 프로필 정보
    */
    getProfileId: async (req, res) => {
        const id = req.params.id;
        if (id === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        // check id
        if (!await userModel.checkUser(id)) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }

        const user = await userModel.getUserById(id)
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS, {
                userId: user[0].id,
                name: user[0].name,
                email: user[0].email,
                nickname: user[0].nickname,
                school: user[0].school,
                check: user[0].check,
                profileImage: user[0].profileImage,
                like: user[0].like,
                point: user[0].point,
                level: user[0].level
            }));
    },
    /** 
    * 모든 프로필 정보
    * @summary 모든 회원의 프로필 정보 가져오기
    * @param None
    * @return 모든 회원의 프로필 정보
    */
    getProfile: async (req, res) => {
        const userList = await userModel.getUserList()
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS, {
                userList
            }));
    },
    /** 
    * 프로필 사진 업데이트
    * @summary 프로필 사진을 업데이트 (AWS S3 사용)
    * @param 토큰, 프로필 사진
    * @return 업데이트 한 유저 정보
    */
    updateProfile: async (req, res) => {
        const userIdx = req.decoded.userIdx;
        if (req.file === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.PROFILE_NO_IMAGE));
        }

        const profileImg = req.file.location;
        // data check - undefined
        if (profileImg === undefined || userIdx === undefined) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.PROFILE_NO_IMAGE));
        }
        // check image type
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.UNSUPPORTED_TYPE));
        }

        const result = await userModel.updateProfile(userIdx, profileImg);
        return res.status(statusCode.CREATED)
            .send(util.success(statusCode.CREATED, resMessage.PROFILE_SUCCESS, result[0]));
    }
}

module.exports = user;
