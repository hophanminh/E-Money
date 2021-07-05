import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import {
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
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import moment from 'moment';
import { getSocket } from '../../utils/socket';
import config from '../../constants/config.json';
import { splitNotificationID } from '../../utils/helper';

export default function Notification() {
  const classes = useStyles();
  const history = useHistory();
  const socket = getSocket();
  const userID = localStorage.getItem('userID');

  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [currentAmountToLoad, setCurrentAmountToLoad] = useState(config.NOTIFICATION_AMOUNT_TO_LOAD);

  useEffect(() => {
    socket.emit('get_notification', { userID, limit: currentAmountToLoad }, ({ notificationList, count }) => {
      setNotifications(notificationList);
      setUnreadNotificationCount(count);
    });

    socket.on(`new_notification_added_${userID}`, ({ notificationList, count }) => {
      setNotifications(notificationList);
      setUnreadNotificationCount(count);
    });
  }, []);

  const handleMarkNotification = (event, notification) => {
    event.stopPropagation();
    socket.emit('update_notification', {
      userID,
      limit: currentAmountToLoad,
      notificationID: notification.ID,
      value: true
    }, ({ notificationList }) => {
      setNotifications(notificationList);
      setUnreadNotificationCount(unreadNotificationCount - 1);
    });
  }

  const handleMarkAllAsRead = () => {
    if (notifications.length === 0) {
      return;
    }

    socket.emit('mark_all_as_read', {
      userID,
      notificationIDs: notifications.map(notification => notification.ID),
      limit: currentAmountToLoad
    }, ({ notificationList, count }) => {
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

  const goToTransaction = (ID) => {
    const info = splitNotificationID(ID);
    let url = '/Wallet';
    url = url + (info?.isPrivate ? "" : ("/" + info?.walletID))
    history.push({
      pathname: url,
      state: {
        selected: info?.txID,
      }
    });
  }

  return (
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
                  <div className={classes.notifyToolbar}>
                    <Link className={classes.link} onClick={handleMarkAllAsRead}>
                      Đánh dấu tất cả đã xem
                    </Link>
                  </div>
                  <Divider />
                  {
                    notifications.map(notification => {
                      return (
                        <>
                          <div key={notification.ID} onClick={() => goToTransaction(notification.ID)}>
                            <Card key={notification.ID} className={classes.notifyCard} style={{ backgroundColor: notification.IsRead ? '#ffffff' : '#eaeaea' }}>
                              <CardContent style={{ padding: '10px' }}>
                                <div className={classes.notifyText} style={{ fontWeight: notification.IsRead ? 'normal' : 'bold' }}>
                                  <FiberManualRecordIcon className={classes.unreadMessageIcon} style={{ display: notification.IsRead ? 'none' : 'inline' }} />
                                  <div>
                                    <p className={classes.notifyContent}>{notification.Content}</p>
                                    <Typography variant="body2" color="textSecondary" component="p" style={{ fontSize: '9pt' }}>
                                      {moment(notification.DateNotified).format(config.DATE_TIME_FORMAT)}
                                    </Typography>
                                  </div>
                                  <div style={{ flexGrow: 1 }}></div>
                                  {
                                    !notification.IsRead
                                      ? <div>
                                        <Tooltip title="Đánh dấu là đã đọc" aria-label="mark-as-read">
                                          <IconButton id={notification.ID} size='small' aria-label="refuse"
                                            style={{ marginLeft: '5px' }}
                                            onClick={(event) => handleMarkNotification(event, notification)}
                                          >
                                            <CheckIcon className={classes.checkIcon} />
                                          </IconButton>
                                        </Tooltip>
                                      </div>
                                      : <React.Fragment></React.Fragment>
                                  }
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          <Divider />
                        </>
                      );
                    })
                  }
                  <div style={{ flexGrow: 1 }} />
                  {
                    notifications.length === 0 ? <Divider /> : <React.Fragment></React.Fragment>
                  }
                  <div className={classes.notifyToolbar}>
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
  )
}

const useStyles = makeStyles((theme) => ({
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
    display: 'flex',
    flexDirection: 'column',
  },
  notifyCard: {
    height: '100%',
    width: '100%',
    fontSize: '14px',
    borderRadius: '0px',
    "& .MuiCardContent-root:last-child": {
      padding: '10px',
    },
    "&&:hover": {
      cursor: 'pointer',
    }
  },
  notifyContent: {
    margin: '5px 5px 5px 0px',
    wordWrap: 'break-word',
    textAlign: 'justify',
    fontSize: '11pt'
  },
  notifyText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkIcon: {
    color: 'red'
  },
  notifyToolbar: {
    display: 'flex',
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
  },
}));
