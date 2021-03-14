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
const API_URL = config.API_LOCAL;

export default function ActiveDestination() {
  const ID = useParams().id;
  const history = useHistory();
  const [status, setStatus] = useState("Đang kích hoạt tài khoản. Hãy chờ trong giây lát...");
  const { isLoggedIn, setInfo, setIsLoggedIn } = useContext(MyContext);

  useEffect(() => {
    async function active() {

      if (isLoggedIn === null) {
        return;
      }

      if (isLoggedIn) {
        setStatus("Bạn đã đăng nhập trước đó");
        history.push("/");
      }

      const res = await fetch(`${API_URL}/active`, {
        method: 'POST',
        body: JSON.stringify({ ID }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      if (res.status === 200) {
        window.localStorage.setItem('jwtToken', result.token);
        window.localStorage.setItem('userID', result.user.ID);
        setInfo(result.user);
        setIsLoggedIn(true);
        alert(result.msg);
        history.push("/");
      } else if (res.status === 400) { // already activated or not exist
        setStatus(result.msg);
      }
    }
    active();
  }, [isLoggedIn])
  return (
    <>
      <Dialog style={{ textAlign: 'center' }} open={true} >
        <DialogContent align='center'>
          <CircularProgress style={{ color: palette.primary }} />
          <Typography variant='h6'>{status}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}