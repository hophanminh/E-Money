import config from '../constants/config.json';
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

export function isBlankString(token) {
    return token.trim().length === 0;
}

export function containsBlank(token) {
    return token.includes(' ');
}

export function isEmailPattern(token) {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;// /\S+@\S+\.\S+/;
    return regex.test(token)
}

export function convertISOToDMY(token) {
    let formattedDOB = new Date(token).toLocaleDateString();
    formattedDOB = formattedDOB.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    // return formattedDOB[1] + "/" + formattedDOB[2] + "/" + formattedDOB[3];
    return (formattedDOB[1].length === 1 ? "0" + formattedDOB[1] : formattedDOB[1]) + "/" + (formattedDOB[2].length === 1 ? "0" + formattedDOB[2] : formattedDOB[2]) + "/" + formattedDOB[3];
}