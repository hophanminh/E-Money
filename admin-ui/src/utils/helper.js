import config from '../constants/config.json';
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