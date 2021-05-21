import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
import { getSocket } from "../../utils/socket";
import fs from 'fs';

const API_URL = config.API_LOCAL;
const MyContext = createContext({});

export default MyContext;

export const MyProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [info, setInfo] = useState({});
  const token = localStorage.getItem('jwtToken');
  const userID = localStorage.getItem('userID');

  useEffect(() => {
    async function fetchInfo() {
      const res = await fetch(`${API_URL}/users/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        const result = await res.json();
        setInfo(result.user);
        setIsLoggedIn(true);
        getSocket();
      } else {
        setIsLoggedIn(false);
      }
    }

    if (userID) {
      fetchInfo();
    }
  }, []);

  return (
    <MyContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        info,
        setInfo,
      }}>
      {props.children}
    </MyContext.Provider>
  );
}
