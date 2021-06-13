import React, { useState, createContext } from 'react';
import config from '../../constants/config.json';
import { getSocket } from "../../utils/socket";

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
