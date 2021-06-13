import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MyContext from '../mycontext/MyContext';
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import TopBarNotLogin from "./TopBarNotLogIn";


export default function Menu(props) {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const history = useHistory();

  useEffect(() => {
    function storageChange(event) {
      if (event.key === 'jwtToken') {
        if (event.newValue === null) {
          setIsLoggedIn(false);
          history.push('/signin');
          return;

        } else {
          setIsLoggedIn(true);
          history.push('/');
          return;
        }
      }
    }
    window.addEventListener('storage', storageChange);
    return () => {
      window.removeEventListener('storage', storageChange);
    }
  }, []);

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
