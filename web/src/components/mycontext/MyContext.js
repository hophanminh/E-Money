import React, { useState, createContext } from 'react';

const MyContext = createContext();

export default MyContext;

export const MyProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <MyContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
      {props.children}
    </MyContext.Provider>
  )
}
