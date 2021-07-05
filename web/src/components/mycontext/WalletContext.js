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
    const check = window.localStorage.getItem('isSimple') === '0' ? false : true;
    setIsSimple(check)
  }, [])

  useEffect(() => {
    setList([]);
  }, [walletID])

  useEffect(() => {
    setSelected(selected => {
      if (list && selected) {
        const temp = list.find(i => i?.id === selected?.id)
        if (temp) {
          return temp;
        }
        else {
          return null;
        }
      }
    });
  }, [list]);

  const updateTxCategory = (catList) => {
    setList(list => {
      let newList = list.slice();
      for (let i = 0; i < newList.length; i++) {
        const newCat = catList.find(cat => cat.ID === newList[i].catID);
        if (newCat) {
          newList[i].IconID = newCat.IconID;
          newList[i].categoryName = newCat.Name;
        }
        else {
          const temp = catList.find(cat => cat.Name === "Khác");
          newList[i].IconID = temp.IconID;
          newList[i].categoryName = temp.Name;
          newList[i].catID = temp.ID;
        }
      }
      return [...newList]
    });
  }

  const setSimpleOption = (status) => {
    const check = status ? '1' : '0'
    window.localStorage.setItem('isSimple', check);
    setIsSimple(status)
  }

  const setSelectedByID = (ID) => {
    if (list) {
      const temp = list.find(i => i?.id === ID)
      if (temp) {
        setSelected(temp);
      }
    }
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
        setExpanded,
        setFilterList,
        setSimpleOption,
        updateTxCategory,
        setSelectedByID,
      }}>
      {props.children}
    </WalletContext.Provider>
  )
}
