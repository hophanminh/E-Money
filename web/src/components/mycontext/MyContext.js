import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
import { getSocket } from "../../utils/socket";
import { timeoutPromise } from "../../utils/helper";

const API_URL = config.API_LOCAL;
const MyContext = createContext({});

export default MyContext;

export const MyProvider = (props) => {
  const socket = getSocket();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [info, setInfo] = useState({});
  const token = window.localStorage.getItem('jwtToken');
  const userID = localStorage.getItem('userID');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
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
        setIsLoading(false);

      } else { // 400, 403

        // remove if any
        window.localStorage.removeItem('jwtToken');
        window.localStorage.removeItem('userID');
        setIsLoggedIn(false);
        setIsLoading(false);
      }
      return res
    }

    try {
      let res = await timeoutPromise(800, fetchInfo());
    } catch (error) {
      // remove if any
      window.localStorage.removeItem('jwtToken');
      window.localStorage.removeItem('userID');
      setIsLoggedIn(false);
      setIsLoading(false);
    }

  }, []);

  useEffect(async () => {

    if (isLoggedIn !== null && isLoggedIn) {
      socket.on(`update_profile_${info.ID}`, ({ user }) => {
        setInfo(user);
      });
    }
  }, [isLoggedIn])

  return (
    <MyContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        info,
        setInfo,
      }}>
      {props.children}
    </MyContext.Provider>
  )
}
