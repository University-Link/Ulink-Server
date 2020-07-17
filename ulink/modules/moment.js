const moment = require('moment');


module.exports = {
    getSemester: async () => {
        const year = moment().format('Y');
        const month = moment().format('M');
        return '2020-1';
        if (month < 3){
            return String(parseInt(year)-1)+'-겨울학기';
        }
        else if (month < 7){
            return year+'-1';
        }
        else if (month < 9){
            return year+'-여름학기';
        }
        else{
            return year+'-2';
        }
    },
    timeToStrTime: async (time) => {
        time = time.split(":")
        for(let ind in time){
            if(time[ind].length < 2){
                time[ind] = '0' + time[ind].toString();
            }
            else{
                time[ind] = time[ind].toString();
            }
        }

        return time[0] + ":" + time[1];
    },
    getMaxStrTime: async (time1, time2) => {

        if(time1 === null) return time2;
        if(time2 === null) return time1;

        if (time1 > time2) return time1;
        else return time2;
    },
    getMinStrTime: async (time1, time2) => {

        if(time1 === null) return time2;
        if(time2 === null) return time1;

        if (time1 > time2) return time2;
        else return time1;
    }
}