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
}