module.exports = {
    connectTimePlace : async (subjects) => {
        const res = [];
        let timePlace;
        let temp = {
            'subjectIdx': 'n'
        };
        for (let subject of subjects) {
            if (temp.subjectIdx != subject.subjectIdx) {
                if (temp.subjectIdx != 'n') {
                    res.push(Object.assign(temp, timePlace));
                }
                temp = {
                    'subjectIdx': subject.subjectIdx,
                    'subjectCode': subject.subjectCode,
                    'name': subject.name,
                    'professor': subject.professor,
                    'credit': subject.credit,
                    'course': subject.course
                };
                timePlace = {
                    'startTime': [],
                    'endTime': [],
                    'day': [],
                    'content': []
                };
            }
            timePlace.startTime.push(subject.startTime);
            timePlace.endTime.push(subject.endTime);
            timePlace.day.push(subject.day);
            timePlace.content.push(subject.content);
        }
        if (temp.subjectIdx != 'n') {
            res.push(Object.assign(temp, timePlace));
        }
        return res;
    },
    connectColorTimePlace : async (subjects) => {
        const res = [];
        let timePlace;
        let temp = {
            'subjectIdx': 'n'
        };
        for (let subject of subjects) {
            if (temp.subjectIdx != subject.subjectIdx) {
                if (temp.subjectIdx != 'n') {
                    res.push(Object.assign(temp, timePlace));
                }
                temp = {
                    'color': subject.color,
                    'subjectIdx': subject.subjectIdx,
                    'subjectCode': subject.subjectCode,
                    'name': subject.name,
                    'professor': subject.professor,
                    'credit': subject.credit,
                    'course': subject.course
                };
                timePlace = {
                    'startTime': [],
                    'endTime': [],
                    'day': [],
                    'content': []
                };
            }
            timePlace.startTime.push(subject.startTime);
            timePlace.endTime.push(subject.endTime);
            timePlace.day.push(subject.day);
            timePlace.content.push(subject.content);
        }
        res.push(Object.assign(temp, timePlace));
        return res;
    },
};