import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Container from '@material-ui/core/Container';
import palette from '../../constants/palette.json';
import SnackBar from '../snackbar/SnackBar';
import * as helper from '../../utils/helper';
import config from '../../constants/config.json';
import MyContext from '../mycontext/MyContext';
import { Hidden } from '@material-ui/core';

const API_URL = process.env.REACT_APP_API_URL || config.API_LOCAL;
export const styles = {
  background: {
    width: '100%',
    height: '100%',
    filter: 'brightness(60%)'
  },
  paper: {
    padding: '40px 20px 40px',
    borderRadius: '8px',
    backgroundColor: '#fff'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: 1,
  },
  submit: {
    margin: '3px 0 2px',
  },
  shadow: {
    boxShadow: '3px 3px 5px 3px rgba(0, 0, 0, 0.2), 3px 4px 12px 3px rgba(0, 0, 0, 0.19)',
  },
}

export default function SignUp() {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [displayedName, setDisplayedName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [content, setContent] = useState("");
  const [waiting, setWaiting] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);

  useEffect(() => {
    if (isLoggedIn !== null && isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn]);

  const signInClicked = () => {
    history.push('/signin');
  }

  async function handleKeyPress(event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      event.preventDefault();
      await handleSubmit();
    }
  }

  const handleSubmit = async () => {
    const errorObj = {
    }

    if (helper.isBlankString(username)) {
      errorObj.username = "Tên tài khoản không được để trống";
    } else if (helper.containsBlank(username)) {
      errorObj.username = "Tên tài khoản không được chứa khoảng trắng";
    }

    if (helper.isBlankString(displayedName)) {
      errorObj.displayedName = "Tên hiển thị không được để trống";
    }

    if (helper.isBlankString(email)) {
      errorObj.email = "Email không được để trống";
    } else if (!helper.isEmailPattern(email)) {
      errorObj.email = "Email không hợp lệ";
    }

    if (password.length < config.PASSWORDMINLENGTH) {
      errorObj.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (helper.containsBlank(password)) {
      errorObj.password = "Mật khẩu phải chứa ký tự khác khoảng trắng"
    }

    if (confirmedPassword.length < config.PASSWORDMINLENGTH) {
      errorObj.confirmedPassword = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (password !== confirmedPassword) {
      errorObj.confirmedPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(errorObj);

    if (Object.keys(errorObj).length > 0) {
      return;
    }

    setWaiting(true);
    const data = {
      Name: displayedName,
      Username: username,
      Password: password,
      Email: email
    }

    // call API here
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await res.json();
    setWaiting(false);
    setContent(result.msg);
    setShowSnackBar(true);
  }

  const handleUsernameChange = (username) => {
    setUsername(username);
  }

  const handleDisplayedNameChange = (displayedName) => {
    setDisplayedName(displayedName);
  }

  const handlePasswordChange = (password) => {
    setPassword(password);
  }

  const handleConfirmPasswordChange = (password) => {
    setConfirmedPassword(password);
  }

  const handleEmailChange = (email) => {
    setEmail(email);
  }

  return (
    <>
      <div className="trap-container">
        <Hidden xsDown>
          <div >
            <svg fill="white" width="55%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, zIndex: -1 }}>
              <polygon points="0,0 100,0 80,100 0,100" />
            </svg>
          </div>
          <div style={{ width: '65%', position: 'absolute', right: 0, zIndex: -2, height: '100%' }} className="bgimg">
          </div>
        </Hidden>

        <div className="trap-content">
          <Container component="main" maxWidth="xl">
            <SnackBar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} content={content} />
            <Grid container spacing={4}>
              <Hidden smDown>
                <Grid item sm={2} md={3} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => signInClicked()}
                      // className="shadow"
                      style={{
                        borderRadius: '50%',
                        height: '65px',
                        width: '65px',
                        color: '#FFF',
                        backgroundColor: palette.primary,
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                      }}
                    >
                      <KeyboardReturnIcon />
                    </Button>
                    <h4 variant='h6' style={{ color: '#172755' }}>Đăng nhập</h4>
                  </div>
                </Grid>
              </Hidden>

              <Grid item xs={12} md={8} style={{ padding: '25px 20px 25px' }}>
                <Dialog style={{ textAlign: 'center' }} open={waiting} >
                  <DialogContent align='center'>
                    <CircularProgress style={{ color: palette.primary }} />
                    <Typography variant='h6'>Đang xử lý</Typography>
                  </DialogContent>
                </Dialog>
                <div style={{ ...styles.shadow, ...styles.paper, width: '100%', alignItems: 'center' }} onKeyPress={handleKeyPress}>
                  <Typography gutterBottom style={{ color: palette.primary, fontWeight: 'bold' }} variant='h5'>Đăng ký tài khoản</Typography>

                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <div>
                        <TextField label="Tên tài khoản" variant="outlined"
                          margin="normal" required fullWidth autoFocus
                          onChange={e => handleUsernameChange(e.target.value)}
                          value={username}
                        />
                        <div className="input-invalid">
                          {errors.username}
                        </div>

                        <TextField label="Tên hiển thị"
                          variant="outlined" margin="normal" required fullWidth
                          onChange={e => handleDisplayedNameChange(e.target.value)}
                          value={displayedName}
                        />
                        <div className="input-invalid">
                          {errors.displayedName}
                        </div>

                        <TextField label="Email (VD: abc@gmail.com)"
                          variant="outlined" margin="normal" required fullWidth
                          onChange={e => handleEmailChange(e.target.value)}
                          value={email}
                        />
                        <div className="input-invalid">
                          {errors.email}
                        </div>

                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div >
                        <TextField label="Mật khẩu" variant="outlined" type="password"
                          margin="normal" required fullWidth
                          onChange={e => handlePasswordChange(e.target.value)}
                          value={password}
                        />
                        <div className="input-invalid">
                          {errors.password}
                        </div>
                        <TextField label="Xác nhận mật khẩu" type="password"
                          variant="outlined" margin="normal" required fullWidth
                          onChange={e => handleConfirmPasswordChange(e.target.value)}
                          value={confirmedPassword}
                        />
                        <div className="input-invalid">
                          {errors.confirmedPassword}
                        </div>
                        <Button type="submit" fullWidth variant="contained" onClick={() => handleSubmit()} size='large'
                          style={{ ...styles.submit, backgroundColor: palette.primary, color: '#fff', fontWeight: 'bold', margin: '25px 0 20px' }}>
                          Đăng ký
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </>
  );
}
