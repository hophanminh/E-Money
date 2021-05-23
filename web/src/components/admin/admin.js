import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CategoryAdmin from './category/CategoryAdmin';

const useStyles = makeStyles((theme) => ({
    container: {
      margin: '50px 20px 20px 30px'
    },
    paper: {
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      borderRadius: '20px'
    }
  }));

export default function Calendar() {
    const classes = useStyles();
  
    return (
      <div className={classes.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: '60%', textAlign: 'center' }}>
            <CategoryAdmin></CategoryAdmin>
          </div>
        </div>
      </div>
    );
  }