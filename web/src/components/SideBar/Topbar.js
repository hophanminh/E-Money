import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { NavLink } from "react-router-dom";
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
  Card,
  CardContent,
  Link,
  Tooltip
} from '@material-ui/core';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CheckIcon from '@material-ui/icons/Check';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MyContext from '../mycontext/MyContext';
import defaultAvatar from '../../resources/images/defaultAvatar.png';
import moment from 'moment';
import { getSocket } from '../../utils/socket';
import config from '../../constants/config.json';

const drawerWidth = 240;

function Topbar(props) {
  const classes = useStyles();
  const socket = getSocket();
  const userID = localStorage.getItem('userID');
  const { setIsLoggedIn, info } = useContext(MyContext);

  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [currentAmountToLoad, setCurrentAmountToLoad] = useState(config.NOTIFICATION_AMOUNT_TO_LOAD);

  useEffect(async () => {
    socket.emit('get_notification', { userID, limit: currentAmountToLoad }, ({ notificationList, count }) => {
      setNotifications(notificationList);
      setUnreadNotificationCount(count);
    });
  }, []);

  const logOut = (e) => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userID");
    //localStorage.clear();
    setIsLoggedIn(false);
  }
  const openSidebar = props.open;  // sidebar's open

  const handleMarkNotification = (notification) => {
    socket.emit('update_notification', { userID, limit: currentAmountToLoad, notificationID: notification.ID, value: !notification.IsRead }, ({ notificationList }) => {
      setNotifications(notificationList);
      setUnreadNotificationCount(unreadNotificationCount + (notification.IsRead ? 1 : -1));
    });
  }

  const handleMarkAllAsRead = () => {
    socket.emit('mark_all_as_read', { userID, notificationIDs: notifications.map(notification => notification.ID) }, ({ notificationList, count }) => {
      setNotifications(notificationList);
      setUnreadNotificationCount(count);
    });
  }

  const handleLoadMoreNotification = () => {
    const amountToLoad = currentAmountToLoad + config.NOTIFICATION_AMOUNT_TO_LOAD;
    socket.emit('load_more_notifications', { userID, limit: amountToLoad }, ({ notificationList }) => {
      setNotifications(notificationList);
      setCurrentAmountToLoad(amountToLoad);
    });
  }

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
                    <ListItem
                      button {...bindTrigger(popupState)}
                      className={classes.button} style={{ height: '100%' }}
                    >
                      <Badge badgeContent={unreadNotificationCount} color="error">
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
                      <div className={classes.popover}>
                        <div className={classes.scrollable}>
                          {notifications.map(notification => {
                            return (
                              <div key={notification.ID}>
                                <Card key={notification.ID} className={classes.notifyCard} style={{ backgroundColor: notification.IsRead ? '#ffffff' : '#eaeaea' }}>
                                  <CardContent className={classes.notifyContent}>
                                    <div className={classes.notifyText} style={{ fontWeight: notification.IsRead ? 'normal' : 'bold' }}>
                                      <FiberManualRecordIcon className={classes.unreadMessageIcon} style={{ visibility: notification.IsRead ? 'hidden' : 'visible' }} />
                                      <div>
                                        <p style={{ margin: '5px 5px 5px 0px', wordBreak: 'break-all', fontSize: '11pt' }}>{notification.Content}</p>
                                        <Typography variant="body2" color="textSecondary" component="p" style={{ fontSize: '9pt' }}>
                                          {moment(notification.DateNotified).format(config.DATE_TIME_FORMAT)}
                                        </Typography>
                                      </div>
                                      <div style={{ flexGrow: 1 }}></div>
                                      <div>
                                        <Tooltip title={notification.IsRead ? "Đánh dấu là chưa đọc" : "Đánh dấu là đã đọc"} aria-label="mark-as-read">
                                          <IconButton id={notification.ID} size='small' aria-label="refuse" onClick={() => handleMarkNotification(notification)}>
                                            <CheckIcon className={classes.checkIcon} />
                                          </IconButton>
                                        </Tooltip>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Divider />
                              </div>
                            );
                          })}
                          <div className={classes.notifyToolbar}>
                            <Link className={classes.link} onClick={handleMarkAllAsRead}>
                              Đánh dấu tất cả đã xem
                            </Link>
                            <Link className={classes.link} onClick={handleLoadMoreNotification}>
                              Tải thêm
                            </Link>
                          </div>
                        </div>
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
    borderRadius: '10px',
    minWidth: '320px',
    maxWidth: '320px',
    maxHeight: '350px',
    minHeight: '350px',
    overflow: 'hidden',
  },
  scrollable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: '-17px',
    overflowY: 'scroll',
  },
  notifyCard: {
    height: '100%',
    width: '100%',
    fontSize: '14px',
    borderRadius: '0px',
    "& .MuiCardContent-root:last-child": {
      padding: '10px',
    }
  },
  notifyContent: {
    padding: '10px'
  },
  notifyText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkIcon: {
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
  },
  notifyToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 25,
    padding: 10,
  },
  link: {
    cursor: 'pointer',
    color: 'red'
  },
  unreadMessageIcon: {
    width: '12px',
    height: '12px',
    marginRight: 10,
    color: '#2e89ff'
  }
}));
