import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';

const API_URL = config.API_LOCAL;
const IconContext = createContext({});

export default IconContext;

export const IconProvider = (props) => {
  const [iconList, setIconList] = useState([])

  useEffect(() => {
    fetchIcon().then(list => setIconList(list))
  }, [])

  const fetchIcon = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (iconList && iconList.length === 0) {
      try {
        const res = await fetch(`${API_URL}/icons/list`, {
          method: 'POST',
          body: '',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`
          }
        });
        return res.json()
      } catch (error) {
        return [];
      }
    }
  }

  return (
    <IconContext.Provider
      value={{
        iconList,
        fetchIcon,
      }}>
      {props.children}
    </IconContext.Provider>
  )
}
