import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as helper from '../../../utils/helper';
import config from '../../../constants/config.json';
import palette from '../../../constants/palette.json';

const API_URL = config.API_LOCAL;

export default function RequestGenerator({ setShowSnackBar, setContent }) {
  const userID = localStorage.getItem('userID');
  const history = useHistory();
  const [waiting, setWaiting] = useState(false);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUsername("");
    setEmail("");
    setErrors({});
  };

  const handleSubmit = async () => {

    const errorObj = {
    };

    if (helper.isBlankString(username)) {
      errorObj.username = "Tên tài khoản không được để trống";
    } else if (helper.containsBlank(username)) {
      errorObj.username = "Tên tài khoản không được chứa khoảng trắng";
    }
    if (helper.isBlankString(email)) {
      errorObj.email = "Email không được để trống";
    } else if (!helper.isEmailPattern(email)) {
      errorObj.email = "Email không hợp lệ";
    }
    setErrors(errorObj);

    if (Object.keys(errorObj).length > 0) {
      return;
    }

    setWaiting(true);
    const data = {
      Username: username,
      Email: email
    }
    const res = await fetch(`${API_URL}/admin/forgotpassword`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 200) {
      const result = await res.json();
      localStorage.setItem('resetID', result.id);
      setContent(result.msg);
      setShowSnackBar(true);
      setOpen(false);
      history.push('/reset')
    } else {
      const result = await res.json();
      setContent(result.msg);
      setShowSnackBar(true);
      setWaiting(false);
    }
  }

  return (
    <div>
      <Link onClick={handleClickOpen} variant="body2" style={{ cursor: 'pointer ' }}>
        {"Quên mật khẩu?"}
      </Link>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Đặt lại mật khẩu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Để đặt lại mật khẩu, hãy nhập tên tài khoản và <b> địa chỉ email hợp lệ</b>. Bạn sẽ dùng địa chỉ email này để nhận liên kết thiết lập lại mật khẩu.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Tên tài khoản"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div class="input-invalid">
            {errors.username}
          </div>
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div class="input-invalid">
            {errors.email}
          </div>
        </DialogContent>
        <Dialog style={{ textAlign: 'center' }} open={waiting} >
          <DialogContent align='center'>
            <CircularProgress style={{ color: palette.primary }} />
            <Typography variant='h6'>Đang xử lý</Typography>
          </DialogContent>
        </Dialog>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary" variant="outlined">
            Xác nhận
          </Button>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
