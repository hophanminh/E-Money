import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Avatar,
    makeStyles,
} from '@material-ui/core/';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import SchoolIcon from '@material-ui/icons/School';
import FastfoodIcon from '@material-ui/icons/Fastfood';


const IconColor = {
    book: {
        backgroundColor: '#1DAF1A',
        color: '#FFFFFF'
    },
    food: {
        backgroundColor: '#FF2626',
        color: '#FFFFFF'
    }
}



export default function DefaultIcon({ avatar, backgroundSize, iconSize }) {
    const styleBackground = {
        width: backgroundSize + 'px',
        height: backgroundSize + 'px',
        backgroundColor: IconColor[avatar].backgroundColor,
    }
    const styleIcon = {
        width: iconSize + 'px',
        height: iconSize + 'px',
        color: IconColor[avatar].color,
    }

    let icon;
    switch (avatar) {
        case "book": icon =
            <Avatar style={styleBackground}>
                <SchoolIcon style={styleIcon} />
            </Avatar>
            break;
        case "food": icon =
            <Avatar style={styleBackground}>
                <FastfoodIcon style={styleIcon} />
            </Avatar>
            break;

        default: icon =
            <Avatar style={styleBackground}>
                <SchoolIcon style={styleIcon} />
            </Avatar>
    }
    return (
        icon
    );
}
