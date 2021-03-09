import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
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
// import ResetPasswordDialog from '../Dialogs/ResetPasswordDialog';
import * as helper from '../../utils/helper';
import config from '../../constants/config.json';

const API_URL = config.API_LOCAL;
const styles = {
  background: {
    width: '100%',
    height: '100%',
    filter: 'brightness(60%)'
  },
  paper: {
    padding: '40px 20px 40px',
    borderRadius: '8px'
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
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn]);

  const signUpClicked = () => {
    history.push('/signup');
  }

  const handleSubmit = async (e) => {

    const errorObjs = {
    };

    if (helper.isBlankString(username)) {
      errorObjs.username = "Tên tài khoản không được để trống";
    } else if (helper.containsBlank(username)) {
      errorObjs.username = "Tên tài khoản không được chứa khoảng trắng";
    }

    if (password.length < config.PASSWORDMINLENGTH) {
      errorObjs.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
    } else if (helper.containsBlank(password)) {
      errorObjs.password = "Mật khẩu phải chứa ký tự khác khoảng trắng"
    }
    setErrors(errorObjs);

    if (Object.keys(errorObjs).length > 0) {
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
      window.localStorage.setItem('userID', result.id);
      window.localStorage.setItem('name', result.name);
      setIsLoggedIn(true);
      history.push("/games");
    } else {
      // alert(result.mesg);
      setContent(result.msg);
      setShowSnackBar(true);
      setIsLoggedIn(false);
    }
  }

  const handleUsernameChange = (username) => { setUsername(username); }

  const handlePasswordChange = (password) => { setPassword(password); }

  return (
    <>
      <div class="trap-container">
        <div >
          <svg fill="white" width="60%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, zIndex: 0 }}>
            <polygon points="0,0 100,0 80,100 0,100" />
          </svg>
        </div>
        <div style={{ width: '55%', position: 'absolute', right: 0, zIndex: -2, height: '100%' }} class="bgimg">

        </div>
        <div style={{ width: '45%', position: 'absolute', right: 0, zIndex: -1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
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
        </div>

        <div class="trap-content">
          <Container component="main" maxWidth="xl">
            <SnackBar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} content={content} />
            <Grid container spacing={4}>
              <Grid item item xs={2} sm={2} md={2} direction="column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={() => signUpClicked()}
                    style={{
                      alignContent: 'center',
                      fontSize: '4',
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

              <Grid item xs={4} sm={4} md={4}>
                <div style={{ ...styles.shadow, ...styles.paper, width: '110%' }}>
                  <Typography style={{ color: Palette.primary, fontWeight: 'bold' }} variant='h5'>Đăng nhập tài khoản</Typography>
                  <div style={{ margin: '20px 0 20px' }}>
                    <TextField label="Tên tài khoản" variant="outlined"
                      margin="normal" required fullWidth autoFocus
                      onChange={e => handleUsernameChange(e.target.value)}
                      value={username}
                    />
                    <div class="input-invalid">
                      {errors.username}
                    </div>
                    <TextField label="Mật khẩu" type="password"
                      variant="outlined" margin="normal" required fullWidth
                      onChange={e => handlePasswordChange(e.target.value)}
                      value={password}
                    />
                    <div class="input-invalid">
                      {errors.password}
                    </div>
                    <Link onClick={signUpClicked} variant="body2" >
                      <div style={{ cursor: 'pointer', margin: '10px 0 10px', textAlign: 'left' }}>Quên mật khẩu?</div>
                    </Link>
                  </div>

                  <Button className={styles.submit} type="submit" fullWidth variant="contained"
                    onClick={() => handleSubmit()}
                    style={{ backgroundColor: Palette.primary, color: '#fff', fontWeight: 'bold', margin: '5px 0 20px' }}>
                    Đăng nhập
                  </Button>
                  <Grid container justify="flex-end">
                    <Grid item>
                      {/* <ResetPasswordDialog /> */}
                    </Grid>
                  </Grid>

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