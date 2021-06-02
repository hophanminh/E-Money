import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import CategoryIcon from '@material-ui/icons/Category';
import GroupIcon from '@material-ui/icons/Group';
import {
  NavLink
} from "react-router-dom";


export default function SideBarList(props) {
  const [currentUser, setCurrentUser] = useState();
  return (
    <div>
      <ListItem button component={NavLink} to="/Category">
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Loại" />
      </ListItem>
      <ListItem button component={NavLink} to="/Teams">
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Nhóm" />
        </ListItem>
    </div>
  )
};