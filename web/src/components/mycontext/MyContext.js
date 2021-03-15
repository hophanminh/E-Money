import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
const API_URL = config.API_LOCAL;

const MyContext = createContext({});

export default MyContext;

export const MyProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const jwtToken = window.localStorage.getItem('jwtToken');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    async function authen() {
      const res = await fetch(`${API_URL}/users/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`
        }
      });
      if (res.status === 200) {
        setIsLoggedIn(true);
        setIsLoading(false);
      } else {
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    }
    authen();
  }, []);

  return (
    <MyContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading }}>
      {props.children}
    </MyContext.Provider>
  )
}
