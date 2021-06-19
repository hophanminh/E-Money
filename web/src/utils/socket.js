import socketIOClient from "socket.io-client";
import config from '../constants/config.json';
const API_URL = config.API_LOCAL;

// connect to server
let socket = null;
let errMessage = null;
export const startSocket = () => {
  const token = localStorage.getItem('jwtToken');
  socket = socketIOClient(API_URL, {
    query: { token }
  });
  socket.on("connect_error", (err) => {
    errMessage = err.message;
  });
}

export const getSocket = () => {
  const token = localStorage.getItem('jwtToken');
  if (!socket && token) {
    startSocket();
  }
  return socket;
}

export const clearSocket = () => {
  if (socket) {
    socket = null;
  }
}

export const getError = () => {
  return errMessage;
}