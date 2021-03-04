import React, { useState, useContext } from 'react';
import MyContext from '../mycontext/MyContext';
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import TopBarNotLogin from "./TopBarNotLogIn";


export default function Menu(props) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      {isLoggedIn ?
        (
          <>
            <Topbar
              handleDrawerOpen={() => handleDrawerOpen()}
              open={open}
              titl e={props.title}
            />
            <SideBar
              handleDrawerClose={() => handleDrawerClose()}
              open={open}
            />
          </>
        )
        :
        (
          <>
            <TopBarNotLogin />
          </>
        )
      }
    </>
  )
}
