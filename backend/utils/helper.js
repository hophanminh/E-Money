const config = require('../config/default.json');
const moment = require("moment");
const accountModel = require('../models/accountModel');

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

  digitGeneration: (length) => {
    let digits = "";
    // while (true) {

    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10);
      digits += digit;
    }

    // const result = await accountModel.findByCode(digits);

    // if (result.length !== 0) {
    // digits = "";
    // continue;
    // }

    // break;
    // }
    return digits;
  }
}


