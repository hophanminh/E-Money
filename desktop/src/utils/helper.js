import config from '../constants/config.json';
import { formatMoney } from './currency';
import moment from 'moment';
const API_URL = config.API_LOCAL;

export const isBlankString = (token) => token.trim().length === 0;

export const containsBlank = (token) => token.includes(' ');

export const isEmailPattern = (token) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(token)
}

export const convertToRegularDateFormat = (date) => moment(date).format("YYYY-MM-DD");

export const convertToLocalDateFormat = (date) => moment(date).format("DD/MM/YYYY");

export const containNonDigit = token => token.match(/^[0-9]+$/) === null;

export const customizeTextForLegend = (name, value) => `${name}: ${formatMoney(value)}`;

export const customizeTextForLabel = arg => `${arg.percentText}`;

export const customizeTextForTooltip = arg => {
  return {
    text: `${formatMoney(arg.value)}`
  }
}

function daysInMonth(m) { // m is 0 indexed: 0-11
  switch (m) {
    case 1:
      return 29;
    case 8: case 3: case 5: case 10:
      return 30;
    default:
      return 31
  }
}

export const isValidMonthDay = (d, m) => {
  return m >= 0 && m < 12 && d >= 0 && d < daysInMonth(m);
}

export function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("promise timeout"))
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

export const splitNotificationID = (ID) => {
  const split = ID?.split(":");
  const isPrivate = split[0] === '0' ? true : false
  return { isPrivate, txID: split[1], walletID: split[2], notiID: split[3] };
}
