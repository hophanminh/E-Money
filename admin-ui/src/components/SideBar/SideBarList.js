import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import CategoryIcon from '@material-ui/icons/Category';
import GroupIcon from '@material-ui/icons/Group';
import { NavLink } from "react-router-dom";

export default function SideBarList(props) {
  return (
    <div>
      <ListItem button component={NavLink} to="/users">
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Người dùng" />
      </ListItem>
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