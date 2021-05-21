import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaveIcon from '@material-ui/icons/Save';
import * as helper from '../../utils/helper'; //'../../../utils/index'
import config from '../../constants/config.json';
import palette from '../../constants/palette.json';
const API_URL = config.API_LOCAL;

export default function ChangePasswordDialog({ setShowSnackBar, setContent }) {
  const userID = localStorage.getItem('userID');
  const token = window.localStorage.getItem('jwtToken');
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleCurrentPasswordChange = (currentPassword) => {
    setCurrentPassword(currentPassword);
  }

  const handleNewPasswordChange = (newPassword) => {
    setNewPassword(newPassword);
  }

  const handleConfirmedPasswordChange = (newPassword) => {
    setConfirmedPassword(newPassword);
  }

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmedPassword("");
    setErrors({});
  }

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const errorObj = {};

    if (currentPassword.length < config.PASSWORDMINLENGTH) {
      errorObj.currentPassword = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (helper.isBlankString(currentPassword)) {
      errorObj.currentPassword = "Mật khẩu phải chứa ký tự khác khoảng trắng"
    }

    if (newPassword.length < config.PASSWORDMINLENGTH) {
      errorObj.newPassword = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (helper.containsBlank(newPassword)) {
      errorObj.newPassword = "Mật khẩu phải chứa ký tự khác khoảng trắng"
    }

    if (confirmedPassword.length < config.PASSWORDMINLENGTH) {
      errorObj.confirmedPassword = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (confirmedPassword !== newPassword) {
      errorObj.confirmedPassword = "Mật khẩu xác nhận không khớp";
    }
    setErrors(errorObj);

    if (Object.keys(errorObj).length > 0) {
      return;
    }

    const data = {
      CurrentPassword: currentPassword,
      NewPassword: newPassword
    }
    const res = await fetch(`${API_URL}/users/${userID}/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });


    if (res.status === 200) {
      setContent("Cập nhật thành công");
    } else {
      const result = await res.json();
      setContent(result.msg);
    }
    setShowSnackBar(true);
  }


  return (
    <div className="margin-top-10">
      {/* <SimpleSnackbar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} contents={contents} /> */}

      <Button fullWidth variant="contained" style={{ backgroundColor: palette.secondary, color: 'white', fontWeight: 'bold', marginTop: '10px' }} onClick={handleClickOpen} startIcon={<SaveIcon />}>
        Cập nhật mật khẩu
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth >
        <DialogTitle>
          <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center' }}>Đổi mật khẩu</Typography>
        </DialogTitle>
        <DialogContent >
          <div className="container margin-top-10">
            <Typography style={{ fontWeight: 'bold' }} variant="h6">Mật khẩu hiện tại</Typography>
            <div className="input-invalid">{errors.currentPassword}</div>
          </div>
          <TextField variant="outlined" autoFocus margin="normal" type="password" fullWidth
            onChange={(event) => { handleCurrentPasswordChange(event.target.value); }} placeholder="Mật khẩu hiện tại"
          />

          <div className="container margin-top-10">
            <Typography style={{ fontWeight: 'bold' }} variant="h6">Mật khẩu mới</Typography>
            <div className="input-invalid">{errors.newPassword}</div>
          </div>
          <TextField variant="outlined" margin="normal" type="password" fullWidth placeholder="Mật khẩu mới"
            onChange={(event) => { handleNewPasswordChange(event.target.value); }}
          />

          <div className="container margin-top-10">
            <Typography style={{ fontWeight: 'bold' }} variant="h6">Xác nhận mật khẩu mới</Typography>
            <div className="input-invalid">{errors.confirmedPassword}</div>
          </div>
          <TextField variant="outlined" margin="normal" type="password" fullWidth placeholder="Xác nhận mật khẩu mới"
            onChange={(event) => { handleConfirmedPasswordChange(event.target.value); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Hủy
           </Button>
          <Button onClick={handleChangePassword} color='primary' variant='outlined'>
            Cập nhật
            </Button>

        </DialogActions>
      </Dialog>
    </div>
  );
}
