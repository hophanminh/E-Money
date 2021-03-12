import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import {
  useHistory,
  NavLink,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Popover,
  IconButton,
  ListItem,
  ListItemText,
  makeStyles
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MyContext from '../mycontext/MyContext';

const drawerWidth = 240;

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
  popover: {
    maxHeight: '300px',
  },
  notifyCard: {
    minWidth: '320px',
    maxWidth: '320px',
    fontSize: '14px',
    borderRadius: '0px'
  },
  notifyToolTip: {
    textAlign: 'center',
    marginBottom: '-10px'
  },
  notifyContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkIcon: {
    color: 'green'
  },
  clearIcon: {
    color: 'red'
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between"
  },
  avatarImg: {
    wight: 52,
    height: 52,
    borderRadius: 50
  },
  colorTopBar: {
    background: "green !important"
  }
}));

function Topbar(props) {
  const classes = useStyles();
  const history = useHistory();
  const displayedName = localStorage.getItem('name');
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const logOut = (e) => {
    localStorage.clear();
    setIsLoggedIn(false);
  };
  // sidebar's open
  const openSidebar = props.open;
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
                <Typography style={{ marginRight: '10px' }}>{displayedName}</Typography>
                <img src={`https://picsum.photos/200`} className={`${classes.avatarImg}`}></img>
              </ListItem>
            </>
          )}

          {(
            <>
              <ListItem button component={NavLink} to="/Login" onClick={(e) => logOut(e)}
                className={classes.button}>
                <NotificationsNoneIcon />
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