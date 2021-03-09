import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
const API_URL = config.API_LOCAL;

const MyContext = createContext({});

export default MyContext;

export const MyProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const jwtToken = window.localStorage.getItem('jwtToken');

  useEffect(() => {

    async function authen() {
      console.log('cmmmmmm');
      const res = await fetch(`${API_URL}/users/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`
        }
      });
      if (res.status === 200) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
    authen();
  }, []);

  return (
    <MyContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {props.children}
    </MyContext.Provider>
  )
}
