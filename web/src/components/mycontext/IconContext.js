import React, { useState, useEffect, createContext, useContext } from 'react';
import config from '../../constants/config.json';
import { MyContext } from '../mycontext'

const API_URL = config.API_LOCAL;
const IconContext = createContext({});

export default IconContext;

export const IconProvider = (props) => {
  const [iconList, setIconList] = useState([])
  const { isLoggedIn } = useContext(MyContext);

  useEffect(() => {
    if (isLoggedIn && iconList?.length === 0) {
      fetchIcon().then(list => setIconList(list))
    }
  }, [isLoggedIn])

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
