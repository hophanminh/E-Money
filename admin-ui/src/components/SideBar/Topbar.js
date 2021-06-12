import React, { useContext } from 'react';
import clsx from 'clsx';
import { NavLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  ListItem,
  makeStyles
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MyContext from '../mycontext/MyContext';
import defaultAvatar from '../../resources/images/defaultAvatar.png';
import { clearSocket } from '../../utils/socket';

const drawerWidth = 240;

function Topbar(props) {
  const classes = useStyles();
  const { setIsLoggedIn, info } = useContext(MyContext);

  const logOut = (e) => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userID");
    //localStorage.clear();
    setIsLoggedIn(false);
    clearSocket();
  }
  const openSidebar = props.open;  // sidebar's open

  return (
    <AppBar position="absolute" className={clsx(classes.appBar, openSidebar && classes.appBarShift)}>
      <Toolbar className={`${classes.toolbar} ${classes.spaceBetween} ${classes.colorTopBar}`}>
        <div>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => props.handleDrawerOpen()}
            className={clsx(classes.menuButton, openSidebar && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div className={classes.topBarButton}>
          {(
            <>
              <ListItem button component={NavLink} to="/profile" className={classes.button}>
                <Typography style={{ marginRight: '10px' }}>{info.Name}</Typography>
                <img src={info.AvatarURL ? info.AvatarURL : defaultAvatar} className={`${classes.avatarImg}`}></img>
              </ListItem>
            </>
          )}

          {(
            <>
              <ListItem button onClick={(e) => logOut(e)} className={classes.button}>
                <ExitToAppIcon />
              </ListItem>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  invisible: {
    cd: "hidden"
  },
  topBarButton: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    width: 'auto',
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between"
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 50,
  },
  colorTopBar: {
    background: "green !important"
  }
}));
