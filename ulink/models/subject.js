const pool = require('../modules/pool');

const subject = {
    /** 
     * 모든 수업 데이터 조회
     * @type SELECT
     * @param 학교명
     * @return 학교에 해당하는 모든 수업 목록
     */
    getSubject: async (school) => {
        const query = `SELECT subjectIdx, subjectCode, name, professor, credit, course
        FROM subject WHERE school = "${school}" ORDER BY name`;
        try {
            const result = await pool.queryParam(query);
            const subjectList = [];
            let subject, temp = -1;
            for (let r1 of result) {
                if (temp !== r1.name) {
                    subjectList.push(subject);
                    subject = {}
                    temp = r1.name;
                    subject['name'] = r1.name;
                    subject['list'] = [];
                }
                let query2 = `SELECT * FROM subject_timeplace WHERE subjectIdx = ${r1.subjectIdx}`;
                let result2 = await pool.queryParam(query2);

                let place = [], dateTime = [], day = [];
                for (let r2 of result2) {
                    place.push(r2.place);
                    day.push(r2.day);
                    dateTime.push(r2.startTime + '-' + r2.endTime);
                }

                r1['place'] = place;
                r1['day'] = day;
                r1['dateTime'] = dateTime;
                subject['list'].push(r1);
            }
            return subjectList;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSubject ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 특정 단어 포함 수업 데이터 조회
     * @type SELECT
     * @param 학교명, 단어
     * @return 단어가 포함된 수업 리스트
     */
    getSearchSubject: async (school, name) => {
        const query1 = `SELECT subjectIdx, name, professor, credit, course FROM subject 
        WHERE school = "${school}" AND name LIKE "%${name}%"`;
        const subjectList = [];
        try {
            const result = await pool.queryParam(query1);
            for (let r1 of result) {
                let query2 = `SELECT * FROM subject_timeplace WHERE subjectIdx = ${r1.subjectIdx}`;
                let result2 = await pool.queryParam(query2);
                let place = [],
                    dateTime = [],
                    day = [];
                for (let r2 of result2) {
                    place.push(r2.place);
                    day.push(r2.day);
                    dateTime.push(r2.startTime + '-' + r2.endTime);
                }
                let subject = {
                    "subjectIdx": r1.subjectIdx,
                    "name": r1.name,
                    "professor": r1.professor,
                    "credit": r1.credit,
                    "course": r1.course,
                    "place": place,
                    "day": day,
                    "dateTime": dateTime
                };
                subjectList.push(subject);
            }
            return subjectList;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getSearchSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getSearchSubject ERROR: ', err);
            throw err;
        }
    },
    /** 
     * 키워드로 시작하는 수업목록
     * @type SELECT
     * @param 학교, 키워드 (자모분리)
     * @return 키워드와 비슷한 수업 리스트
     */
    getRecommendSubject: async (school, nameAtomic) => {
        const query = `SELECT name FROM subject 
        WHERE school = "${school}" AND nameAtomic LIKE "${nameAtomic}%"
        ORDER BY name`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('getRecommendSubject ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('getRecommendSubject ERROR: ', err);
            throw err;
        }
    },
}

module.exports = subject;