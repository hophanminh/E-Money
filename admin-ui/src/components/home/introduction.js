import React from 'react';
import { Typography, Button } from '@material-ui/core';
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
    <div className={classes.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ textAlign: 'left', width: '50%' }}>
        <Typography style={{ fontSize: '32px', marginBottom: '50px' }}>
          Chi tiêu hiệu quả hơn bằng việc sử dụng E-Money
        </Typography>
        <div>
          <Button className={classes.button}
            style={{
              height: '50px', width: '200px', fontSize: '20px', color: 'white',
              backgroundColor: '#1daf1a', marginRight: '30px'
            }}
          >
            Bắt đầu ngay
          </Button>
          <Button className={classes.button}
            style={{
              height: '50px', width: '200px', fontSize: '20px', color: 'black',
              border: '1px solid #1daf1a'
            }}
          >
            Tìm hiểu thêm
          </Button>
        </div>
      </div>

      <div style={{ marginLeft: 20 }}>
        <img width={540} height={360} src={imgTemp} style={{ borderRadius: '50px' }}></img>
      </div>
    </div>
  );
}