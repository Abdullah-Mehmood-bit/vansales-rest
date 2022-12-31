
function getDate(date_time) {
    const now = new Date(date_time)
    let year    = now.getFullYear();
    let month   = now.getMonth()+1; 
    let day     = now.getDate();

    if(month.toString().length == 1) month = '0'+month;
    if(day.toString().length == 1) day = '0'+day;  
    const dateTime = year+'-'+month+'-'+day
    return dateTime
}

module.exports = getDate