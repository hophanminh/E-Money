import React, { useState, useEffect } from 'react';
import {
    Icon,
    Box,
    Avatar,
    makeStyles,
} from '@material-ui/core/';


export default function DefaultIcon({ IconName, backgroundSize, iconSize }) {
    const IconColor = {
        school: {
            backgroundColor: '#1DAF1A',
            color: '#FFFFFF'
        },
        fastfood: {
            backgroundColor: '#FF2626',
            color: '#FFFFFF'
        }
    }

    const styleBackground = {
        width: backgroundSize + 'px',
        height: backgroundSize + 'px',
        backgroundColor: IconColor[IconName] ? IconColor[IconName].backgroundColor : '#1DAF1A',
        fontSize: iconSize + 'px',
    }
    const styleIcon = {
        color: IconColor[IconName] ? IconColor[IconName].color : '#FFFFFF',
        fontSize: 'inherit',
    }

    return (
        <React.Fragment>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <Avatar style={styleBackground}>
                <Icon style={styleIcon}>{IconName}</Icon>
            </Avatar>
        </React.Fragment>
    );
}
