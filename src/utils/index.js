module.exports = {
    sendWebHook: require("./sendWebHook"),
    notAuthorized: require('./notAuthorized'),
    LogMgr: require("./logMgr"),
    getSql: require('./getSql'),
    fixTime: 
    /**
     * Funcion para acortar un timestamp de discord
     * @param {Number} timestamp 
     * @returns {Number}
     */
    function fixTime(timestamp) {
        return Math.floor(timestamp / 1000);
    },
    sleep: 
    /**
     * Funcion para hacer esperar el recorrido asyncronico
     * @param {Number} ms 
     * @returns
     */
    function sleep(ms) {
        return new Promise((res) => setTimeout(res, ms));
    },
    fixMoment: require('./fixMoment'),
    eNames: require('./emotesNames'),
    ReplyTimer: require('./replyTimer')
};