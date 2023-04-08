function monthBetween(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}

function daysBetween(dateFrom, dateTo) {

    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(dateFrom - dateTo);

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);

}

function weeksBetween(dateFrom, dateTo) {
    return Math.round((dateTo - dateFrom) / (7 * 24 * 60 * 60 * 1000));
}
function getNow(){

    let today = new Date(),
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
        time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    return (date+' '+time);
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = {
    monthBetween,
    daysBetween,
    weeksBetween,
    getNow,
    formatDate
}