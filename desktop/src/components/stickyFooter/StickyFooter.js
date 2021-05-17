import React from 'react';
import { Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';
import Config from '../../Config/default.json'
import MailIcon from '@material-ui/icons/Mail';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import { Grid } from '@material-ui/core';

function Copyright() {
  return (
    <Typography color="textSecondary" style={{
      color: 'white',
      fontSize: '15px'
    }}>
      {'© ' + new Date().getFullYear() + ' All Rights Reversed.'}
    </Typography>
  );
}

function ContactInfo() {
  const classes = useStyles();

  return (
    <Typography className={`${classes.flexColumn} ${classes.flexStart}`} component={'span'}>
      <h4>
        {`Thông tin liên hệ`}
      </h4>
      <PhoneInfo />
      <MailInfo />
    </Typography>
  )
}

function PhoneInfo() {
  const classes = useStyles();
  return (
    <div style={{ display: 'table', margin: '5px' }}>
      <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingRight: '0' }}>
        <PhoneIcon />
      </div>
      <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
        <div>
          0909789651
        </div>
        <div>
          0709855627
        </div>
      </div>
    </div>
  )
}

function MailInfo() {
  return (
    <div style={{ display: 'table', margin: '5px' }}>
      <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingRight: '16px' }}>
        <MailIcon />
      </div>
      <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
        <div>
          masa23@gmail.com
        </div>
      </div>
    </div>
  );
}

function SocialConnect() {
  return (
    <Typography component={'span'}>
      <h4>
        {`Kết nối với chúng tôi`}
      </h4>
      <div>
        <FacebookIcon fontSize="large" style={{ marginRight: '10px' }} />
        <TwitterIcon fontSize="large" />
      </div>
    </Typography>
  );
}

function FastConnect() {
  const classes = useStyles();

  return (
    <Typography component={'span'}>
      <h4>
        {`Truy cập nhanh`}
      </h4>
      <div className={`${classes.flexColumn} ${classes.flexStart}`}>
        <Link className={`${classes.hyperLink} ${classes.textFormat}`} to="/">
          Trang chủ
        </Link>
        <Link className={`${classes.hyperLink} ${classes.textFormat}`} to="/signin">
          Đăng Nhập
        </Link>
        <Link className={`${classes.hyperLink} ${classes.textFormat}`} to="/signup">
          Đăng ký
        </Link>
        <Link className={`${classes.hyperLink} ${classes.textFormat}`} to="/wallet">
          Ví cá nhân
        </Link>
      </div>
    </Typography>
  );
}

function Description() {
  return (
    <Typography style={{ width: `30vw` }}>
      {`E-money giải pháp giúp bạn dễ dàng quản lý việc thu chi rõ ràng, minh bạch. Quản lý quỹ nhóm cũng đã trở nên dễ dàng hơn với E-money.`}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    minHeight: '35vh',
    marginTop: '30px'
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: '#323232',
  },
  paperLikeShadow: {
    boxShadow: '0 4px 8px 5px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  },
  phoneCss: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  align: {
    display: 'flex',
    flexDirection: "row",
    alignItems: 'start'
  },
  textFormat: {
    color: 'white',
    fontSize: '15px'
  },
  hyperLink: {
    // textDecoration: "none"
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexSpaceBetween: {
    display: "flex",
    justifyContent: "space-between"
  },
  flexStart: {
    display: "flex",
    justifyContent: "flex-start"
  },
  containerMargin: {
    margin: '10px 40px'
  }
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <footer className={`${classes.footer} 
                          ${classes.paperLikeShadow} 
                          ${classes.textFormat}`}>
        <div className={`${classes.align}  ${classes.flexSpaceBetween}`}>
          <span>
            <p style={{ fontSize: '30px' }}> E-MONEY</p>
            <Description style={{ margin: '10px' }} />
          </span>
          <Grid container spacing={4} className={classes.containerMargin}>
            <Grid item sm={6} md={4}>
              <FastConnect />
            </Grid>
            <Grid item sm={6} md={4}>
              <SocialConnect />
            </Grid>
            <Grid item md={4}>
              <ContactInfo />
            </Grid>
          </Grid>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Copyright />
        </div>
      </footer>
    </div>
  );
}