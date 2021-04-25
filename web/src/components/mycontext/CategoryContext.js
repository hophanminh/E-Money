import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
import { getSocket } from "../../utils/socket";

const API_URL = config.API_LOCAL;
const CategoryContext = createContext({});

export default CategoryContext;

export const CategoryProvider = (props) => {
  const socket = getSocket();

  const [selected, setSelected] = useState();
  const [categoryList, setCategoryList] = useState({
    fullList: [],
    defaultList: [],
    customList: []
  })

  //Category
  const updateSelected = () => {
    if (selected) {
      const temp = categoryList.find(i => i?.id === selected?.id)
      setSelected(temp);
    }
  }
  const setAllList = (defaultList, customList, fullList) => {
    setCategoryList({
      fullList: fullList,
      defaultList: defaultList,
      customList: customList,
    })
  }

  const setFullList = (fullList) => {
    setCategoryList({
      ...categoryList,
      fullList: fullList,
    })
  }

  return (
    <CategoryContext.Provider
      value={{
        selected,
        defaultList: categoryList?.defaultList,
        customList: categoryList?.customList,
        fullList: categoryList?.fullList,

        setSelected,
        updateSelected,
        setAllList,
        setFullList,
      }}>
      {props.children}
    </CategoryContext.Provider>
  )
}
