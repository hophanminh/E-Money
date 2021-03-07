import socketIOClient from "socket.io-client";
import config from '../constants/config.json';
const API_URL = config.API_LOCAL;

// connect to server
const socket = socketIOClient(API_URL);

export default socket;