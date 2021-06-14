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
    return moment(date).format(config.FORMAT_DATETIME_PATTER.DATE);
  },

  convertToRegularDateTime: (date) => {
    return moment(date).format(config.FORMAT_DATETIME_PATTER.DATE_TIME);
  },

  digitGeneration: (length) => {
    let digits = "";

    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10);
      digits += digit;
    }

    return digits;
  },

  getNextEventDate: (date, eventTypeID, value, StartTime) => {
    const current = moment();
    let new_date = moment(date);
    const hour = moment(StartTime).hour()
    const minute = moment(StartTime).minute();
    new_date.hour(hour);
    new_date.minute(minute);

    if (+eventTypeID === config.EVENT_TYPE.DAILY) {
      if (current.isBefore(new_date)) {
        return new_date;
      }
      new_date.add(1, 'days');
    }

    if (+eventTypeID === config.EVENT_TYPE.WEEKLY) {
      const today = new_date.isoWeekday();
      if (today === value + 1) {
        if (current.isBefore(new_date)) {
          return new_date;
        }
      }

      if (today <= value) {
        new_date.isoWeekday(value + 1);
      } else {
        new_date.add(1, 'weeks').isoWeekday(value + 1);
      }
    }

    if (+eventTypeID === config.EVENT_TYPE.MONTHLY) {
      let tempValue = value + 1;

      const today = new_date.date();
      if (today === tempValue) {
        if (current.isBefore(new_date)) {
          return new_date;
        }
      }

      let temp = moment(new_date).date(tempValue);
      let i = 0;
      do {
        if (temp.isValid && temp.isAfter(new_date) && temp.date() === tempValue) {
          new_date = temp;
          break;
        } else {
          i++;
          temp = moment(new_date);
          temp.add(i, 'months');
          temp.date(tempValue);
        }
      } while (true);
    }

    if (+eventTypeID === config.EVENT_TYPE.YEARLY) {
      const currentMonth = new_date.month();
      const currentDay = new_date.date();
      const currentYear = new_date.year()

      const day = Math.floor(value / 1000) + 1;
      const month = value % 1000;

      if (day === currentDay && month === currentMonth) {
        if (current.isBefore(new_date)) {
          return new_date;
        }
      }

      // check 29/2
      if (month === 1 && day === 29) {
        let i = 1;
        do {
          if (moment([currentYear + i]).isLeapYear()) {
            new_date.year(currentYear + i).month(month).date(day);
            return new_date;
          }
          i++;
        } while (true);
      }

      if (currentMonth < month) {
        new_date.month(month).date(day);
      }
      else if (currentMonth > month) {
        new_date.add(1, 'years').month(month).date(day);
      }
      else if (currentMonth === month) {
        if (currentDay < day) {
          new_date.month(month).date(day);
        }
        else {
          new_date.add(1, 'years').month(month).date(day);
        }
      }
    }
    return new_date;
  },
}
