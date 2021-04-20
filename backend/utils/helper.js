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
  },

  getNextEventDate: (date, eventType, value) => {
    let new_date = moment(date);
    new_date.hours(0).minutes(0).seconds(0)
    console.log(new_date.format("YYYY-MM-DD HH:mm:ss"))

    if (eventType === config.EVENTTYPE.DAILY) {
      new_date.add(1, 'days')
    }

    if (eventType === config.EVENTTYPE.WEEKLY) {
      const today = new_date.isoWeekday();
      if (today <= value) {
        new_date.isoWeekday(value + 1);
      } else {
        new_date.add(1, 'weeks').isoWeekday(value + 1);
      }
    }

    if (eventType === config.EVENTTYPE.MONTHLY) {
      const today = new_date.date();
      if (today <= value) {
        new_date.date(value + 1);
      } else {
        new_date.add(1, 'months').date(value + 1);
      }
    }

    if (eventType === config.EVENTTYPE.YEARLY) {
      const today = new_date.month();
      if (today <= value) {
        new_date.month(value).date(1);
      } else {
        new_date.add(1, 'years').month(value).date(1);
      }

    }

    return new_date.format("YYYY-MM-DD HH:mm:ss")
  },


}


