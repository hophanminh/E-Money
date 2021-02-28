const config = require('../config/default.json');
const moment = require("moment");

module.exports = {
  isBlankString: (token) => token.trim().length === 0,

  containsBlank: (token) => token.includes(' '),

  isEmailPattern: (token) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(token)
  },

  convertToRegularDate: (date) => {
    return moment(date).format("YYYY-MM-DD");
  },

  convertToRegularDateTime: (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  },
}


