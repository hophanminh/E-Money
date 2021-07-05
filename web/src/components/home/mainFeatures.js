import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  }
}));

export default function MainFeatures() {
  const classes = useStyles();

  return (
    <div className={classes.container} style={{ textAlign: 'center' }}>
      <div style={{ padding: '0px 100px 0px 100px' }}>
        <Typography style={{ color: '#172755', fontSize: '32px', fontWeight: 'bold' }}>
          Chức năng chính
        </Typography>
        <Typography style={{ color: '#8794ba', marginTop: '10px' }}>
          E-Money giúp mỗi cá nhân hoặc nhóm ghi nhận những khoản tiền đã chi tiêu hằng ngày và phân loại chúng, từ đó giúp người dùng có cái nhìn tổng quát về hoạt động chi tiêu và để ra những kế hoạch chi tiêu thận trọng trong tương lai
        </Typography>
      </div>
    </div>
  );
}
