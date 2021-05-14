import React, { useState, useEffect } from 'react';
import {
    Icon,
    Box,
    Avatar,
    makeStyles,
} from '@material-ui/core/';
import config from '../constants/config.json';

let list = null;
const API_URL = config.API_LOCAL;

export const getListIcon = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!list) {
        try {
            const res = await fetch(`${API_URL}/icons/list`, {
                method: 'POST',
                body: '',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            list = res.json()
        } catch (error) {
            list = [];
        }
    }
    return list;
}

export default function DefaultIcon({ IconID, backgroundSize, iconSize }) {
    const [icon, setIcon] = useState();
    // get initial list of icon
    useEffect(async () => {
        const temp = await getListIcon();
        const selected = temp.find(icon => icon.ID === IconID);
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
