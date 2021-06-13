import React from 'react';
import {
  Icon,
  Avatar,
} from '@material-ui/core/';

export default function DefaultIcon({ icon, backgroundSize, iconSize }) {
  // Set name, color and background color for icon
  const styleBackground = {
    width: backgroundSize + 'px',
    height: backgroundSize + 'px',
    backgroundColor: icon.backgroundColor ? icon.backgroundColor : icon.BackgroundColor,
    fontSize: iconSize + 'px',
  }

  const styleIcon = {
    color: icon.color ? icon.color : icon.Color,
    fontSize: 'inherit',
  }

  return (
    <React.Fragment>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <Avatar style={styleBackground}>
        <Icon style={styleIcon}>{icon.name ? icon.name : icon.Name}</Icon>
      </Avatar>
    </React.Fragment>
  );
}
