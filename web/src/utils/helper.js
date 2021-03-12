import config from '../constants/config.json';
import moment from 'moment';
const API_URL = config.API_LOCAL;

// async function authen() {
//     const jwtToken = window.localStorage.getItem('jwtToken');
//     const res = await fetch(`${API_URL}/users/authenticate`, {
//         method: 'POST',
//         // body: JSON.stringify({ newUserName }),
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${jwtToken}`
//         }
//     });
//     return res.status;
// }

export const isBlankString = (token) => token.trim().length === 0;

export const containsBlank = (token) => token.includes(' ');

export const isEmailPattern = (token) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;// /\S+@\S+\.\S+/;
  return regex.test(token)
}

export const convertToRegularDateFormat = (date) => moment(date).format("YYYY-MM-DD");

export const convertToLocalDateFormat = (date) => moment(date).format("DD/MM/YYYY");