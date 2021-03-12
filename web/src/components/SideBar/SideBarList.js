import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import TableChartIcon from '@material-ui/icons/TableChart';
import { BsFillBarChartFill } from "react-icons/bs";
import {
  NavLink
} from "react-router-dom";


export default function SideBarList(props) {
  const [currentUser, setCurrentUser] = useState();
  return (
    <div>
      <ListItem button component={NavLink} to="/Dashboard">

        <ListItemIcon>
          <AccountBalanceWalletIcon />
        </ListItemIcon>
        <ListItemText primary="Ví cá nhân" />
      </ListItem>
      {(
        <ListItem button component={NavLink} to="/Account">
          <ListItemIcon>
            <BsFillBarChartFill />
          </ListItemIcon>
          <ListItemText primary="Thống kê" />
        </ListItem>
      )}
      {(
        <ListItem button component={NavLink} to="/teams">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Nhóm" />
        </ListItem>
      )}
    </div>
  )
};