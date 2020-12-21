const moment = require('moment');
const config = require('../config/config');

//______________ MESSAGE CREATOR ___________________
function msg(name, message, socketId, isBot = true) {
  return {
    name: stringProtection(name),
    message: stringProtection(message),
    time: moment().format(config.DATE_FORMAT),
    socketId: socketId,
    isBot: !!isBot
  }
}

// replace dangerous chars in strings
function stringProtection(string) {
  return string.replace(/[&<>"']/g, '');
}

module.exports = msg;