import React, { useState } from 'react';
import clsx from 'clsx';
import {
  useHistory,
  NavLink,
  Link
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
  Button,
  makeStyles
} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

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
  },
  brandText: {
    fontSize: 24,
  },
  margin: {
    margin: theme.spacing(1),
  },
  buttonContent: {
    fontSize: 17,
    color: "white",
    borderColor: "white"
  }
}));

function TopbarNotLogin() {
  const classes = useStyles();
  const history = useHistory();

  const handleSignUp = () => {
    history.push("/signup");
  }

  const handleSignIn = () => {
    history.push("/signin");
  }

  return (
    <AppBar position="absolute" className={clsx(classes.appBar)}>
      <Toolbar className={`${classes.toolbar} ${classes.spaceBetween} ${classes.colorTopBar}`}>
        <ListItem button component={NavLink} to="/" className={`${classes.button} ${classes.brandText}`}>
          {`E-Money`}
        </ListItem>
        <div className={`${classes.topBarButton} `}>
          <Button variant="outlined"
            size="large"
            className={`${classes.margin} ${classes.buttonContent}`}
            onClick={handleSignIn}
          >
            Đăng nhập
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopbarNotLogin