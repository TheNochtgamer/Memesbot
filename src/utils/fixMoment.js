const moment = require('moment');
const Timezones = require('moment-timezone');

/**
 * @param {moment.Moment} moment 
 * @param {Boolean} keepLocal
 */
function fixMoment(moment, keepLocal = false) {
    // if (process.env.DIFERENCIA) {
    //     let diff = Number.parseInt(process.env.DIFERENCIA);
    //     moment.add(diff, 'h');
    // }
    return moment.utc().tz('America/Argentina/Buenos_Aires', keepLocal);
}

module.exports = fixMoment;