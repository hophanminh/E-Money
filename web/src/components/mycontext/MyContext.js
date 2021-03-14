import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
const API_URL = config.API_LOCAL;

const MyContext = createContext({});

export default MyContext;

export const MyProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [info, setInfo] = useState({});
  const token = window.localStorage.getItem('jwtToken');
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
      } else {
        setIsLoggedIn(false);
      }
    }
    fetchInfo();
  }, []);

  return (
    <MyContext.Provider value={{ isLoggedIn, setIsLoggedIn, info, setInfo }}>
      {props.children}
    </MyContext.Provider>
  )
}
