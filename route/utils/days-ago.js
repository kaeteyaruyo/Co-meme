module.exports = function (days) {
    const now = new Date();
    now.setDate(now.getDate() - days);
    return now;
}