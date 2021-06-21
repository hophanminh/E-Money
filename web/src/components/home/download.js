import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import ComputerIcon from '@material-ui/icons/Computer';
import LanguageIcon from '@material-ui/icons/Language';
import { makeStyles } from '@material-ui/core/styles';
import { MyContext } from '../mycontext';

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
  const history = useHistory();
  const { isLoggedIn } = useContext(MyContext);

  const handleRedirect = () => {
    if (isLoggedIn !== null && isLoggedIn) {
      history.push('/Wallet');
    } else {
      history.push('/signin');
    }
  }
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
            href="https://drive.google.com/drive/folders/19J7NL5vFHzmVa6AK_gtUlrG7y_0GmBbD?usp=sharing" target="_blank"
          >
            <ComputerIcon className={classes.icon} />
            <Typography style={{ textAlign: 'left', fontSize: '20px' }}>
              Tải về phiên bản trên <b>Windows</b>
            </Typography>
          </Button>

          <Button className={classes.button}
            style={{
              height: '100px', width: '300px', color: 'white', backgroundColor: '#1daf1a',
              padding: '0px 15px 0px 15px', margin: '0px 20px 10px 20px'
            }}
            href="https://drive.google.com/drive/folders/1v_sGGlymmbUOC0WqUYfXl0uTVpWpXFsU?usp=sharing"
            target="_blank"
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
            onClick={handleRedirect}
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