import React, { useContext } from 'react';
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
  makeStyles,
  Divider,
  Card
} from '@material-ui/core';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MyContext from '../mycontext/MyContext';
import config from '../../constants/config.json';
import defaultAvatar from '../../resources/images/defaultAvatar.png';

const API_URL = config.API_LOCAL;
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
    width: 52,
    height: 52,
    borderRadius: 50,

  },
  colorTopBar: {
    background: "green !important"
  }
}));

const notifications = [
  { id: 1, content: 'Hello' },
  { id: 2, content: 'World' },
  { id: 3, content: 'FIT' },
  { id: 4, content: 'HCMUS' }
]

function Topbar(props) {
  const classes = useStyles();
  const history = useHistory();
  const { setIsLoggedIn, info } = useContext(MyContext);
  const logOut = (e) => {
    localStorage.clear();
    setIsLoggedIn(false);
  };
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
              <PopupState variant="popover" popupId="demo-popup-popover">
                {(popupState) => (
                  <div>
                    <ListItem button {...bindTrigger(popupState)} className={classes.button} style={{ height: '100%' }}>
                      <Badge badgeContent={notifications.length} color="error">
                        <NotificationsNoneIcon />
                      </Badge>
                    </ListItem>

                    <Popover
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <div>
                        {notifications.map(notification => {
                          return (
                            <div key={notification.id}>
                              <Card key={notification.id} style={{ padding: '10px', borderRadius: '0px' }}>
                                <Typography>
                                  {notification.id + " - " + notification.content}
                                </Typography>
                              </Card>
                              <Divider></Divider>
                            </div>
                          );
                        })}
                      </div>
                    </Popover>
                  </div>
                )}
              </PopupState>
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