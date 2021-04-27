import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
import { getSocket } from "../../utils/socket";

const API_URL = config.API_LOCAL;
const PopupContext = createContext({});

export default PopupContext;

export const PopupProvider = (props) => {
  const socket = getSocket();

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
  )
}
