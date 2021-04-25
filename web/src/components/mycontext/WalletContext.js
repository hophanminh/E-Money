import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
import { getSocket } from "../../utils/socket";

const API_URL = config.API_LOCAL;
const WalletContext = createContext({});

export default WalletContext;

export const WalletProvider = (props) => {
  const socket = getSocket();

  const [walletID, setWalletID] = useState();
  const [selected, setSelected] = useState();
  const [list, setList] = useState([])
  
  //Wallet
  const updateSelected = () => {
    if (selected) {
      const temp = list.find(i => i?.id === selected?.id)
      setSelected(temp);
    }
  }

  return (
    <WalletContext.Provider
      value={{
        walletID,
        selected,
        list,

        setWalletID,
        setSelected,
        setList,
        updateSelected
      }}>
      {props.children}
    </WalletContext.Provider>
  )
}
