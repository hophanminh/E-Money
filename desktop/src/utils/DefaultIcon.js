import React, { useState, useEffect, useContext } from 'react';
import {
    Icon,
    Box,
    Avatar,
    makeStyles,
} from '@material-ui/core/';
import config from '../constants/config.json';
import { IconContext } from '../components/mycontext'

const API_URL = config.API_LOCAL;

export default function DefaultIcon({ IconID, backgroundSize, iconSize }) {
    const [icon, setIcon] = useState();
    const { iconList } = useContext(IconContext);

    // get initial list of icon
    useEffect(async () => {
        const selected = iconList.find(icon => icon.ID === IconID);
        setIcon(selected);
    }, [IconID]);

    // Set name, color and background color for icon
    const styleBackground = {
        width: backgroundSize + 'px',
        height: backgroundSize + 'px',
        backgroundColor: icon ? icon.BackgroundColor : '#FFFFFF',
        fontSize: iconSize + 'px',
    }
    const styleIcon = {
        color: icon ? icon.Color : '#FFFFFF',
        fontSize: 'inherit',
    }
    const iconName = icon ? icon.Name : 'school';

    return (
        <React.Fragment>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <Avatar style={styleBackground}>
                <Icon style={styleIcon}>{iconName}</Icon>
            </Avatar>
        </React.Fragment>
    );
}
