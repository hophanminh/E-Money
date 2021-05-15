import React from 'react';
import { Typography, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import imgTemp from '../../resources/images/moneySaving.png';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  },
  button: {
    padding: 0,
    borderRadius: '8px',
    lineHeight: 'normal',
    fontWeight: 'normal',
    textTransform: 'none'
  }
}));

export default function Introduction() {
  const classes = useStyles();

  return (
    <div className={classes.container} style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '50%', float: 'left', textAlign: 'left' }}>
        <Typography style={{ fontSize: '38px', width: '600px', marginBottom: '50px' }}>
          Chi tiêu hiệu quả hơn bằng việc sử dụng E-Money
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Button className={classes.button}
              style={{
                height: '60px', width: '220px', fontSize: '24px', color: 'white',
                backgroundColor: '#1daf1a', marginRight: '30px'
              }}
            >
              Bắt đầu ngay
          </Button>
          </Grid>
          <Grid item md={6}>
            <Button className={classes.button}
              style={{
                height: '60px', width: '220px', fontSize: '24px', color: 'black',
                border: '1px solid #1daf1a'
              }}
            >
              Tìm hiểu thêm
             </Button>
          </Grid>
        </Grid>
      </div>

      <div style={{ width: '50%', float: "right", textAlign: 'center' }}>
        <img width={540} height={480} src={imgTemp} style={{ borderRadius: '50px' }}></img>
      </div>
    </div>
  );
}