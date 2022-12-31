const moment = require('moment')

exports.daysBetweenDates = function( date1, date2){
    if(!date1) return null
    if(!date2) return null

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return diffDays + 1
}


