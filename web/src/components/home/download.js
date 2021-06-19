import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import ComputerIcon from '@material-ui/icons/Computer';
import LanguageIcon from '@material-ui/icons/Language';
import { makeStyles } from '@material-ui/core/styles';

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
  },
  icon: {
    width: '40px',
    height: '40px',
    marginRight: '15px'
  }
}));

export default function Download() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div style={{ textAlign: 'center' }}>
        <Typography style={{ color: '#172755', fontSize: '32px', fontWeight: 'bold' }}>
          Sử dụng ngay trên mọi nền tảng
        </Typography>
        <div style={{ marginTop: '30px' }}>
          <Button className={classes.button}
            style={{
              height: '100px', width: '300px', color: 'white', backgroundColor: '#1daf1a',
              padding: '0px 15px 0px 15px', margin: '0px 20px 10px 20px'
            }}
          >
            <ComputerIcon className={classes.icon} />
            <Link to="/robots.txt" target="_blank" download style={{ textDecoration: 'none', color: 'white' }}>
              <Typography style={{ textAlign: 'left', fontSize: '20px' }}>
                Tải về phiên bản trên <b>Windows</b>
              </Typography>
            </Link>
          </Button>

          <Button className={classes.button}
            style={{
              height: '100px', width: '300px', color: 'white', backgroundColor: '#1daf1a',
              padding: '0px 15px 0px 15px', margin: '0px 20px 10px 20px'
            }}
          >
            <PhoneAndroidIcon className={classes.icon} />
            <Typography style={{ textAlign: 'left', fontSize: '20px' }}>
              Tải về phiên bản trên <b>Android</b>
            </Typography>
          </Button>

          <Button className={classes.button}
            style={{
              height: '100px', width: '300px', color: 'white', backgroundColor: '#1daf1a',
              padding: '0px 15px 0px 15px', margin: '0px 20px 10px 20px'
            }}
          >
            <LanguageIcon className={classes.icon} />
            <Typography style={{ textAlign: 'left', fontSize: '20px' }}>
              Sử dụng ngay trên <b>Website</b>
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}