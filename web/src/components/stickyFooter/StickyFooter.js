import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';
import Config from '../../Config/default.json'
import MailIcon from '@material-ui/icons/Mail';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';

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
        <Typography className={`${classes.phoneCss} ${classes.flexColumn} ${classes.flexStart}`}>
            <p>
                {`Thông tin liên hệ`}
            </p>
            <PhoneInfo/>
            <MailInfo/>
        </Typography>
    )
}

function PhoneInfo() {
  const classes = useStyles();
  return (
      <Typography className={`${classes.phoneCss}`}>
          <Typography>
            <PhoneIcon/>
          </Typography>
          <Typography>
            <p> {`${Config.PHONE_1}`}</p>
            <p> {`${Config.PHONE_2}`}</p>
          </Typography>
      </Typography>
  )
}

function MailInfo() {
    return (
      <Typography>
        <MailIcon/> {Config.EMAIL}
      </Typography>
  )
}

function SocialConnect() {
    return (
        <Typography>
            <p>
                {`Kết nối với chúng tôi`}
            </p>
            <div>
                <FacebookIcon fontSize="large"/>
                <TwitterIcon fontSize="large"/>
            </div>
        </Typography>
    )
}

function FastConnect() {
    const classes = useStyles();

    return (
        <Typography>
            <p>
                {`Truy cập nhanh`}
            </p>
            <div className={`${classes.flexColumn} ${classes.flexStart}`}>
                <a className={`${classes.hyperLink} ${classes.textFormat}`} href={'/trangChu/google.com'}>
                    Trang chủ
                </a>
                <a className={`${classes.hyperLink}  ${classes.textFormat}`} href={'/dangnhap/google.com'}>
                    Đăng Nhập
                </a>
                <a className={`${classes.hyperLink}  ${classes.textFormat}`} href={'/dangky/google.com'}>
                    Đăng ký
                </a>
                <a className={`${classes.hyperLink}  ${classes.textFormat}`} href={'/dashboard/google.com'}>
                    DashBoard
                </a>
            </div>
        </Typography>

    )
}

function Description() {
    return (
        <Typography style={{width: `30vw`}}>
            {`E-money giải pháp giúp bạn dễ dàng quản lý việc thu chi rõ ràng, minh bạch. Quản lý quỹ nhóm cũng đã trở nên dễ dàng hơn với E-money.`}
        </Typography>
    )
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
        textDecoration: "none"
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
    }
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
      <div className={classes.root}>
          <CssBaseline/>
          <footer className={`${classes.footer} 
                          ${classes.paperLikeShadow} 
                          ${classes.textFormat}`}>
              <div className={`${classes.align}  ${classes.flexSpaceBetween}`}>
                  <p>
                      <p style={{fontSize: '30px'}}> E-MONEY</p>
                      <Description style = {{margin: 5}}/>
                  </p>
                  <FastConnect/>
                  <SocialConnect/>
                  <ContactInfo/>
              </div>
              <div>
                  <Copyright/>
              </div>
          </footer>
      </div>
  );
}