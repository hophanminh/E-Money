import React, { useState, createContext } from 'react';

const PopupContext = createContext({});
export default PopupContext;

export const PopupProvider = (props) => {
  //Popup
  const [open, setOpen] = useState();

  return (
    <PopupContext.Provider
      value={{
        open,
        setOpen,
      }}>
      {props.children}
    </PopupContext.Provider>
  );
}
