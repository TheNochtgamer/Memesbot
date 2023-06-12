const { PermissionsBitField } = require('discord.js');

module.exports = {
  sendWebHook: require('./sendWebHook'),
  notAuthorized: require('./notAuthorized'),
  logme: require('./logMgr'),
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
      return new Promise(resolve => setTimeout(resolve, ms));
    },
  fixMoment: require('./fixMoment'),
  eNames: require('./emotesNames'),
  ReplyTimer: require('./replyTimer'),
  confi: require('../config.json'),
};

