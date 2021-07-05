import React, { useState, createContext } from 'react';

const CategoryContext = createContext({});
export default CategoryContext;

export const CategoryProvider = (props) => {
  const [selected, setSelected] = useState();
  const [categoryList, setCategoryList] = useState({
    fullList: [],
    defaultList: [],
    customList: []
  });
  const [filterList, setFilterList] = useState([]);

  //Category
  const updateSelected = () => {
    if (selected) {
      const temp = categoryList?.fullList?.find(i => i?.id === selected?.id)
      setSelected(temp);
    }
  }

  const setAllList = (defaultList, customList, fullList) => {
    setCategoryList({
      fullList: fullList,
      defaultList: defaultList,
      customList: customList,
    });
  }

  const setFullList = (fullList) => {
    setCategoryList({
      ...categoryList,
      fullList: fullList,
    });
  }

  return (
    <CategoryContext.Provider
      value={{
        selected,
        defaultList: categoryList?.defaultList,
        customList: categoryList?.customList,
        fullList: categoryList?.fullList,
        filterList,

        setSelected,
        updateSelected,
        setAllList,
        setFullList,
        setFilterList,
      }}>
      {props.children}
    </CategoryContext.Provider>
  );
}
