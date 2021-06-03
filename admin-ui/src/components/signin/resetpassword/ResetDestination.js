import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SnackBar from '../../snackbar/SnackBar';
import MyContext from '../../mycontext/MyContext';
import Tooltip from '@material-ui/core/Tooltip';
import { isBlankString, containsBlank, containNonDigit } from '../../../utils/helper';
// import { styles } from '../../signup/SignUp';
import config from '../../../constants/config.json';
import palette from '../../../constants/palette.json';
const API_URL = config.API_LOCAL;

const styles = {
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

function ResetDestination() {
  const history = useHistory();
  const id = localStorage.getItem('resetID');
  const [errorObj, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [content, setContent] = useState("");
  const { isLoggedIn } = useContext(MyContext);

  useEffect(() => {

    async function checkRequest() {
      const res = await fetch(`${API_URL}/checkresetrequest`, {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 400) {
        history.push('/signin');
      }
    }
    if (isLoggedIn !== null && isLoggedIn === false) {
      checkRequest()
    } else if (isLoggedIn !== null && isLoggedIn === true) {
      history.push('/');
    }
  }, [isLoggedIn]);

  const handlePasswordChange = (password) => {
    setPassword(password);
  }

  const handleConfirmPasswordChange = (password) => {
    setConfirmPassword(password);
  }

  const handleCodeChange = (code) => {
    setCode(code);
  }

  const handleSubmit = async () => {
    const errorObj = {
    }

    if (isBlankString(code)) {
      errorObj.code = "Mã xác nhận không được để trống";
    } else if (containNonDigit(code)) {
      errorObj.code = "Mã xác nhận chỉ được chứa ký tự"
    }
    if (password.length < config.PASSWORDMINLENGTH) {
      errorObj.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (containsBlank(password)) {
      errorObj.password = "Mật khẩu phải chứa ký tự khác khoảng trắng"
    }
    if (confirmPassword.length < config.PASSWORDMINLENGTH) {
      errorObj.confirmPassword = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (confirmPassword !== password) {
      errorObj.confirmPassword = "Mật khẩu xác nhận không đúng"
    }
    setErrors(errorObj);

    if (Object.keys(errorObj).length > 0) { return; }

    const data = {
      ID: id,
      Code: code,
      Password: password
    }
    const res = await fetch(`${API_URL}/admin/resetpassword`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (res.status === 200) {
      const result = await res.json();
      localStorage.clear('resetID');
      setContent(result.msg);
      setShowSnackBar(true);
      setCode("");
      setPassword("");
      setConfirmPassword("");
    } else if (res.status === 500 || res.status === 400) {
      const result = await res.json();
      setContent(result.msg);
      setShowSnackBar(true);
    }
    else if (res.status === 401) {
      history.push('/');
    }
  }

  const signInClicked = () => {
    history.push('/signIn');
  }

  return (
    <>
      <div class="trap-container">
        <div >
          <svg fill="white" width="55%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, zIndex: -1 }}>
            <polygon points="0,0 100,0 80,100 0,100" />
          </svg>
        </div>
        <div style={{ width: '65%', position: 'absolute', right: 0, zIndex: -2, height: '100%' }} class="bgimg">
        </div>
        <div class="trap-content">
          <Container component="main" maxWidth="xl">
            <SnackBar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} content={content} />
            <Grid container spacing={4}>
              <Grid item item xs={2} sm={2} md={2} direction="column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={() => signInClicked()}
                    style={{
                      alignContent: 'center',
                      fontSize: '4',
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

              <Grid item xs={10} sm={10} md={9} align='center'>
                <div style={{ ...styles.shadow, ...styles.paper, width: '60%' }}>
                  <Typography style={{ color: palette.primary, fontWeight: 'bold', marginBottom: '5px' }} variant='h5'>Đặt lại mật khẩu</Typography>
                  <div >
                    <Tooltip fontSize="20"
                      arrow title={<Typography>Hãy kiểm tra tài khoản email vừa khai báo để nhận mã xác thực</Typography>} placement="bottom">
                      <TextField label="Mã xác nhận" variant="outlined"
                        margin="normal" required fullWidth autoFocus
                        onChange={e => handleCodeChange(e.target.value)}
                        value={code}
                      />
                    </Tooltip>

                    <div class="input-invalid">
                      {errorObj.code
                      }
                    </div>
                    <TextField label="Mật khẩu mới" variant="outlined" type="password"
                      margin="normal" required fullWidth
                      onChange={e => handlePasswordChange(e.target.value)}
                      value={password}
                    />
                    <div class="input-invalid">
                      {errorObj.password}
                    </div>
                    <TextField label="Xác nhận mật khẩu" type="password"
                      variant="outlined" margin="normal" required fullWidth
                      onChange={e => handleConfirmPasswordChange(e.target.value)}
                      value={confirmPassword}
                    />
                    <div class="input-invalid">
                      {errorObj.confirmPassword}
                    </div>
                    <Button className={styles.submit} type="submit" fullWidth variant="contained" onClick={() => handleSubmit()}
                      style={{ backgroundColor: palette.primary, color: '#fff', fontWeight: 'bold', margin: '15px 0 0' }}>
                      Xác nhận
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </>
  );
}

export default ResetDestination;