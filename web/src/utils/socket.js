import socketIOClient from "socket.io-client";
import config from '../constants/config.json';
import { useHistory } from 'react-router-dom';
const API_URL = config.API_LOCAL;

// connect to server
let socket = null;
let errMessage = null;
export const startSocket = () => {
    const token = window.localStorage.getItem('jwtToken');
    socket = socketIOClient(API_URL, {
        query: { token }
    });
    socket.on("connect_error", (err) => {
        errMessage = err.message;
        console.log(err.message);
    });
}

export const getSocket = () => {
    const token = window.localStorage.getItem('jwtToken');
    if (!socket && token) {
        startSocket();
    }
    return socket;
}

export const getError = () => {
    return errMessage;
}