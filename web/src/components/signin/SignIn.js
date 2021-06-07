import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import GoogleIcon from '../../resources/images/google.png';
import FacebookIcon from '../../resources/images/facebook.png';
import SnackBar from '../snackbar/SnackBar';
import MyContext from '../mycontext/MyContext';
import Palette from '../../constants/palette.json';
import ResetPassword from './resetpassword/RequestGenerator';
import * as helper from '../../utils/helper';
import config from '../../constants/config.json';
import { Hidden } from '@material-ui/core';

const API_URL = config.API_LOCAL;

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
  socialLoginButton: {
    boxShadow: '2px 2px 4px 2px rgba(0, 0, 0, 0.2), 2px 3px 10px 2px rgba(0, 0, 0, 0.19)',
    borderRadius: '5px',
    padding: '10px 30px 10px',
    margin: '20px',
    width: '60%'
  },
  shadow: {
    boxShadow: '2px 2px 4px 2px rgba(0, 0, 0, 0.2), 2px 3px 10px 2px rgba(0, 0, 0, 0.19)',
  },
  facebook: {
    border: '1px solid  #3b5998',
    backgroundColor: ' #3b5998',
    color: 'white',
  },
  google: {
    border: '1px solid  #f1f3f4',
    backgroundColor: ' #f1f3f4',
    color: 'black',
  },
  logoContainer: {
    display: 'table-cell', verticalAlign: 'middle', fontWeight: 'bold'
  },
  logo: {
    width: '40px', height: '40px', margin: '5px', verticalAlign: 'middle'
  }
}

export default function SignIn() {

  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showSnackbar, setShowSnackBar] = useState(false);
  const [content, setContent] = useState("");
  const { isLoggedIn, setIsLoggedIn, setInfo } = useContext(MyContext);

  useEffect(() => {
    if (isLoggedIn !== null && isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn]);

  const signUpClicked = () => {
    history.push('/signup');
  }

  const handleEnter = async (e) => {
    if (e.key === 'Enter') {
      await handleSubmit();
    }

  }

  const handleSubmit = async () => {

    const errorObj = {
    };

    if (helper.isBlankString(username)) {
      errorObj.username = "Tên tài khoản không được để trống";
    } else if (helper.containsBlank(username)) {
      errorObj.username = "Tên tài khoản không được chứa khoảng trắng";
    }

    if (password.length < config.PASSWORDMINLENGTH) {
      errorObj.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (helper.containsBlank(password)) {
      errorObj.password = "Mật khẩu phải chứa ký tự khác khoảng trắng"
    }
    setErrors(errorObj);

    if (Object.keys(errorObj).length > 0) {
      return;
    }

    const data = {
      Username: username,
      Password: password
    };
    // call API here
    const res = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = await res.json();

    if (res.status === 200) {
      window.localStorage.setItem('jwtToken', result.token);
      window.localStorage.setItem('userID', result.user.ID);
      setInfo(result.user);
      setIsLoggedIn(true);
      history.push("/");
    } else {
      setContent(result.msg);
      setShowSnackBar(true);
      setIsLoggedIn(false);
    }
  }

  const handleUsernameChange = (username) => { setUsername(username); }

  const handlePasswordChange = (password) => { setPassword(password); }

  return (
    <>
      <div className="trap-container">
        <Hidden xsDown>
          <div>
            <svg fill="white" width="50%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, zIndex: -1 }}>
              <polygon points="0,0 100,0 80,100 0,100" />
            </svg>
          </div>
          <div style={{ width: '65%', position: 'absolute', right: 0, zIndex: -2, height: '100%' }} className="bgimg"></div>
        </Hidden>
        {/* <div style={{ width: '45%', position: 'absolute', right: 0, zIndex: -1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
          <div style={{ ...styles.socialLoginButton }} >
            <Typography style={styles.logoContainer}>
              <img src={FacebookIcon} alt="Facebook icon" style={styles.logo} />
              Đăng nhập bằng Facebook
            </Typography>
          </div>
          <div style={styles.socialLoginButton}>
            <Typography style={{ ...styles.logoContainer }}>
              <img src={GoogleIcon} alt="Google icon" style={styles.logo} />
              Đăng nhập bằng Google
            </Typography>
          </div>
        </div> */}

        <div className="trap-content">
          <Container component="main" maxWidth="xl">
            <SnackBar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} content={content} />
            <Grid container spacing={4}>
              <Hidden xsDown>
                <Grid item xs={2} md={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => signUpClicked()}
                      style={{
                        borderRadius: '50%',
                        height: '65px',
                        width: '65px',
                        color: '#FFF',
                        backgroundColor: Palette.primary,
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                      }}
                    >
                      <KeyboardReturnIcon />
                    </Button>
                    <h4 variant='h6' style={{ color: '#172755' }}>Chưa có tài khoản?</h4>
                  </div>
                </Grid>

              </Hidden>
              <Grid item xs={12} sm={10} md={6}>
                <div style={{ ...styles.shadow, ...styles.paper, width: '90%' }}>
                  <Typography style={{ color: Palette.primary, fontWeight: 'bold' }} variant='h5'>Đăng nhập tài khoản</Typography>
                  <div style={{ margin: '20px 0 20px' }}>
                    <TextField label="Tên tài khoản" variant="outlined"
                      margin="normal" required fullWidth autoFocus
                      onChange={e => handleUsernameChange(e.target.value)}
                      value={username}
                    // onKeyUp={handleEnter}
                    />
                    <div className="input-invalid">
                      {errors.username}
                    </div>
                    <TextField label="Mật khẩu" type="password"
                      variant="outlined" margin="normal" required fullWidth
                      onChange={e => handlePasswordChange(e.target.value)}
                      value={password}
                    />
                    <div className="input-invalid">
                      {errors.password}
                    </div>
                    <Link variant="body2" >
                      <ResetPassword setContent={setContent} setShowSnackBar={setShowSnackBar} />
                    </Link>
                  </div>

                  <Button
                    type="submit" fullWidth variant="contained"
                    onClick={() => handleSubmit()}
                    style={{
                      ...styles.submit, backgroundColor: Palette.primary, color: '#fff',
                      fontWeight: 'bold', margin: '5px 0 20px'
                    }}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </Grid>

              {/* <Grid item xs={6} sm={6} md={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}> */}
              {/* <div style={styles.socialLoginButton} >
                  <Typography style={{ display: 'table-cell', verticalAlign: 'middle', fontWeight: 'bold' }}>
                    <img src={FacebookIcon} alt="Facebook icon" style={{ width: '40px', height: '40px', margin: '5px', verticalAlign: 'middle' }} />
                    Đăng nhập bằng Facebook
                </Typography>
                </div>
                <div style={styles.socialLoginButton}>
                  <Typography style={{ display: 'table-cell', verticalAlign: 'middle', fontWeight: 'bold' }}>
                    <img src={GoogleIcon} alt="Google icon" style={{ width: '40px', height: '40px', margin: '5px', verticalAlign: 'middle' }} />
                    Đăng nhập bằng Google
                </Typography>
                </div>
                {/* <FacebookLogin
                  appId="384191462701845"
                  autoLoad={false}
                  fields="name,email,picture"
                  // onClick={componentClicked}
                  callback={responseFacebook}
                  render={renderProps => (
                    <div className={`${styles.socialLoginButton} ${styles.facebook} ${styles.shadow}`}>
                      <Typography onClick={renderProps.onClick} style={{ display: 'table-cell', verticalAlign: 'middle', fontWeight: 'bold' }}> <FacebookIcon style={{ margin: '10px', verticalAlign: 'middle' }} />Sign in with FaceBook</Typography>
                    </div>
                  )}
                />
                <GoogleLogin
                  clientId="226602372235-lp2s47icle0bm0c58rnsp58f9a4tuid3.apps.googleusercontent.com" // clientID này của account: lactuanminh2121
                  render={renderProps => (
                    <div className={`${styles.socialLoginButton} ${styles.google} ${styles.shadow}`}
                      onClick={renderProps.onClick}>
                      <Typography style={{ display: 'table-cell', verticalAlign: 'middle', fontWeight: 'bold' }}>
                        <img src={GoogleIcon} alt="Google icon" style={{ width: '25px', height: '25px', margin: '10px', verticalAlign: 'middle' }} />
                    Sign in with Google
                </Typography>
                    </div>)}
                  buttonText="Login"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  icon={false}
                > */}
              {/* <div className={`${styles.socialLoginButton} ${styles.google} ${styles.shadow}`}>
              <Typography style={{ display: 'table-cell', verticalAlign: 'middle', fontWeight: 'bold' }}>
                <img src={GoogleIcon} alt="Google icon" style={{ width: '25px', height: '25px', verticalAlign: 'middle' }} />
                     Sign in with Google
                 </Typography>
            </div> 
                </GoogleLogin> */}
              {/* </Grid> */}
            </Grid>

          </Container>

        </div>
      </div>
    </>

  );
}