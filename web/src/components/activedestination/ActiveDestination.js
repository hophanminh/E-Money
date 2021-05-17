import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import MyContext from '../mycontext/MyContext';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import config from '../../constants/config.json';
import palette from '../../constants/palette.json';
import { CheckCircleOutline, ErrorOutline, NotInterestedOutlined } from '@material-ui/icons';
import { Button, makeStyles } from '@material-ui/core';

const API_URL = process.env.REACT_APP_API_URL || config.API_LOCAL;

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  buttonContent: {
    fontSize: 17,
    color: palette.primary,
    borderColor: palette.primary
  }
}));

export default function ActiveDestination() {
  const classes = useStyles();
  const ID = useParams().id;
  const history = useHistory();
  const [msg, setMsg] = useState("Đang kích hoạt tài khoản. Hãy chờ trong giây lát...");
  const [statusCode, setStatusCode] = useState(-1);
  const { isLoggedIn, setInfo, setIsLoggedIn } = useContext(MyContext);

  useEffect(() => {
    async function active() {
      alert(isLoggedIn);

      if (isLoggedIn === null) {
        return;
      }
      if (isLoggedIn) {
        setStatusCode(200);
        setMsg("Bạn đã đăng nhập trước đó");
        // history.push("/");
      }
      // const res = await fetch(`http://192.168.1.93:9000/active`, {
      const res = await fetch(`${API_URL}/active`, {
        method: 'POST',
        body: JSON.stringify({ ID }),
        headers: {
          'Content-Type': 'application/json'
        }
      });


      if (res.status === 200) {
        const result = await res.json();
        window.localStorage.setItem('jwtToken', result.token);
        window.localStorage.setItem('userID', result.user.ID);
        setInfo(result.user);
        setIsLoggedIn(true);
        setMsg(result.msg);
        setStatusCode(200);

      } else if (res.status === 400) { //  not exist
        const result = await res.json();
        setMsg(result.msg);
        setStatusCode(400);

      } else if (res.status === 403) {
        const result = await res.json();
        setMsg(result.msg);
        setStatusCode(403);
      }
    }
    active();
  }, [isLoggedIn]);

  return (
    <>
      <Dialog style={{ textAlign: 'center' }} open={true} >
        <DialogContent align='center'>
          {
            statusCode === -1 ?
              <CircularProgress style={{ color: palette.primary }} />
              :
              (
                statusCode === 200 ?
                  <CheckCircleOutline style={{ color: palette.primary }} />
                  :
                  (
                    statusCode === 400 ?
                      <NotInterestedOutlined style={{ color: palette.primary }} /> : <ErrorOutline style={{ color: palette.primary }} />
                  )
              )

          }
          <Typography variant='h6'>{msg}</Typography>
          {
            isLoggedIn ?
              <Button variant="outlined" size="medium" className={`${classes.margin} ${classes.buttonContent}`} href="/">
                Trang chủ
              </Button>
              :
              <Button variant="outlined" size="medium" className={`${classes.margin} ${classes.buttonContent}`} href='/signIn'>
                Đăng nhập
              </Button>
          }
        </DialogContent>
      </Dialog>
    </>
  );
}