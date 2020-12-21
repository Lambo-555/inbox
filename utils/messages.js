const moment = require('moment');
const config = require('../config/config');

//______________ MESSAGE CREATOR ___________________
function msg(name, message, socketId, isBot = true) {
  return {
    name: stringProtection(name, 20),
    message: stringProtection(message, 250),
    time: moment().format(config.DATE_FORMAT),
    socketId: socketId,
    isBot: !!isBot
  }
}

// replace dangerous chars in strings
// slice long strings
function stringProtection(string, len) {
  const sliced = string.slice(0, len);
  return sliced.replace(/[&<>"']/g, '');
}

module.exports = msg;