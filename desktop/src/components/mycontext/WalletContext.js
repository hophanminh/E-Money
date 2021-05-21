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
  const [filterList, setFilterList] = useState([])

  const [expanded, setExpanded] = useState('category');
  const [isSimple, setIsSimple] = useState(true)

  useEffect(() => {
    const check = localStorage.getItem('isSimple') === '0' ? false : true;
    setIsSimple(check);
  }, []);

  //Wallet
  const updateSelected = () => {
    if (selected) {
      const temp = list.find(i => i?.id === selected?.id)
      setSelected(temp);
    }
  }

  const setSimpleOption = (status) => {
    const check = status ? '1' : '0';
    localStorage.setItem('isSimple', check);
    setIsSimple(status);
  }

  return (
    <WalletContext.Provider
      value={{
        walletID,
        selected,
        list,
        expanded,
        filterList,
        isSimple,

        setWalletID,
        setSelected,
        setList,
        updateSelected,
        setExpanded,
        setFilterList,
        setSimpleOption,
      }}>
      {props.children}
    </WalletContext.Provider>
  )
}
