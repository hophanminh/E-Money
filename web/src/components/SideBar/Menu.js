import React, {useState} from 'react';
import SideBar from "./SideBar";
import Topbar from "./Topbar";
import TopBarNotLogin from "./TopBarNotLogIn";

export default function Menu(props) {
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };
  
    return (
        <>
            <Topbar
                handleDrawerOpen = {(i) => handleDrawerOpen()}
                open = {open}
                title = {props.title}
            />
            {/*<TopBarNotLogin/>*/}
            <SideBar  
                handleDrawerClose = {(i) => handleDrawerClose()}
                open = {open}
            />
        </>
    )
}
