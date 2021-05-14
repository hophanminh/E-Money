import React from 'react';
import {
  Typography,
  Button,
  Tooltip
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PeopleIcon from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  },
  button: {
    padding: 0,
    lineHeight: 'normal',
    fontWeight: 'normal',
    textTransform: 'none'
  }
}));

export default function GettingStarted() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div style={{ display: 'flex', alignItems: 'center', margin: '0px 50px 0px 50px' }}>
        <div style={{ width: '45%', float: 'left', marginRight: '50px' }}>
          <Typography style={{ color: '#172755', fontSize: '36px', fontWeight: 'bold', textAlign: 'left' }}>
            Ghi chép chi tiêu cho cá nhân hoặc nhóm
          </Typography>
          <Typography style={{ color: '#8794ba', textAlign: 'justify', marginTop: '20px' }}>
            Ghi chép, phân loại hoạt động thu chi một cách tiện lợi, E-Money sẽ đồng bộ hoạt động thu chi trong nhóm trên tất cả thiết bị để mọi người cùng theo dõi.
          </Typography>
        </div>
        <div style={{ width: '55%', float: 'right', display: 'flex', justifyContent: 'center' }}>
          <div>
            <Tooltip title="IDK" aria-label="IDK">
              <Button style={{
                width: '300px', height: '400px', backgroundColor: '#1bb55c',
                borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px',
                borderTopRightRadius: '0px', borderBottomRightRadius: '0px'
              }}
              >
                <CreateIcon style={{ width: '80px', height: '80px', color: 'white' }} />
              </Button>
            </Tooltip>
          </div>
          <div style={{ width: '300px' }}>
            <Tooltip title="Vào ví cá nhân" aria-label="Vào ví cá nhân">
              <Button style={{
                width: '300px', height: '200px', backgroundColor: '#fda92c',
                borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px',
                borderTopRightRadius: '30px', borderBottomRightRadius: '0px'
              }}
              >
                <AccountBalanceWalletIcon style={{ width: '80px', height: '80px', color: 'white' }} />
              </Button>
            </Tooltip>
            <Tooltip title="Vào 1 nhóm" aria-label="Vào 1 nhóm">
              <Button style={{
                width: '300px', height: '200px', backgroundColor: '#fda92c',
                borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px',
                borderTopRightRadius: '0px', borderBottomRightRadius: '30px'
              }}
              >
                <PeopleIcon style={{ width: '80px', height: '80px', color: 'white' }} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}