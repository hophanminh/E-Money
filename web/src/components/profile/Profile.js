import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import background from '../../resources/images/background1.jpg';
import defaultAvatar from '../../resources/images/defaultAvatar.png';
import ImageUploader from './ImageUploader';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SaveIcon from '@material-ui/icons/Save';
import ChangePasswordDialog from './ChangePasswordDialog';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import IconButton from '@material-ui/core/IconButton';
import * as helper from '../../utils/helper';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import ReplayIcon from '@material-ui/icons/Replay';
import config from '../../constants/config.json';
import palette from '../../constants/palette.json';
import MyContext from '../mycontext/MyContext';
import SnackBar from '../snackbar/SnackBar';

const API_URL = config.API_LOCAL;
const styles = {
  wallpaper: {
    width: '100%',
    height: '50vh'
  },
  body: {
    marginBottom: '10vh'
  }
}

export default function Profile() {

  const userID = localStorage.getItem('userID');
  const token = localStorage.getItem('jwtToken');
  console.log(token)
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState("");
  const [displayedName, setDisplayedName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("Bạn chưa chọn ngày sinh");
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const { isLoggedIn } = useContext(MyContext);
  const [activeDate, setActiveDate] = useState((new Date()).toISOString());

  const [content, setContent] = useState("");
  const [showSnackbar, setShowSnackBar] = useState(false);

  useEffect(() => {
    console.log(isLoggedIn);
    if (isLoggedIn !== null && isLoggedIn === false) {
      history.push('/');
    }
    async function getProfie() {


      const res = await fetch(`${API_URL}/users/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        const result = await res.json();
        const user = result.user;
        setDisplayedName(user.Name);
        setUsername(user.Username);
        setEmail(user.Email);
        setDateOfBirth(user.DateOfBirth);
        setActiveDate(user.ActivatedDate);
        setAvatar(user.AvatarURL ? user.AvatarURL : defaultAvatar);
      } else {
        history.push('/');
      }
    }
    getProfie();
  }, [isLoggedIn]);

  const handleDisplayedNameChange = (name) => {
    setDisplayedName(name);
  }

  const handleEmailChange = (email) => {
    setEmail(email);
  }

  const handleDateChange = (date) => {
    setDateOfBirth(date?.toISOString());
  }

  const handleSaveChange = async () => {

    const errorObjs = {
    };

    if (helper.isBlankString(displayedName)) {
      errorObjs.displayedName = "Tên hiển thị không được để trống";
    }

    if (helper.isBlankString(email)) {
      errorObjs.email = "Email không được để trống";
    } else if (!helper.isEmailPattern(email)) {
      errorObjs.email = "Email không hợp lệ";
    }

    if (dateOfBirth > (new Date()).toISOString()) {
      errorObjs.dob = "Ngày sinh không hợp lệ"
    }

    setErrors(errorObjs);

    if (Object.keys(errorObjs).length > 0) {
      return;
    }

    const data = {
      Name: displayedName,
      Email: email,
      DateOfBirth: dateOfBirth
    }
    const res = await fetch(`${API_URL}/users/${userID}/info`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      setContent("Cập nhật thành công");
      setShowSnackBar(true);
    } else {
      // alert("Some error when updating!")
    }
  }

  const handleResetInfo = () => {

  }

  return (
    <>
      <SnackBar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} content={content} />

      <div class="wallpaper" style={{ ...styles.wallpaper }}>
      </div>
      <div style={styles.body}>
        <Container component="main" maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item item xs={12} sm={12} md={6} direction="column" style={{ textAlign: 'center', marginTop: '5%' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div class="shadow avatar"
                  style={{
                    position: 'relative',
                    marginTop: '-200px',
                    backgroundImage: `url('${avatar}')`
                  }}
                >
                  <div style={{ position: 'absolute', left: '76%', bottom: '0%' }}>
                    <ImageUploader setAvatar={setAvatar} setContent={setContent} setShowSnackBar={setShowSnackBar} />
                  </div>
                </div>

                <div class="margin-top-20">
                  <Typography variant='h4' style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    {displayedName}
                  </Typography>
                  <Typography variant='h6'>
                    Ngày tham gia: {helper.convertToLocalDateFormat(activeDate)}
                  </Typography>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={12} md={6} maxWidth='md' align="center">
              <div style={{ textAlign: 'center', width: '80%' }}>
                <Typography component="h2" variant="h5" style={{ fontWeight: 'bold' }}>
                  Thông tin tài khoản
                <IconButton onClick={handleResetInfo} title="Reset information" color="primary" aria-label="add an alarm" style={{ fontSize: 'large' }} >
                    <ReplayIcon />
                  </IconButton>
                </Typography>
                <div style={{ margin: '20px 0 20px' }}>
                  <div class="container">
                    <Typography style={{ fontWeight: 'bold' }} variant="h6">Tên hiển thị</Typography>
                    <div class="input-invalid">{errors.displayedName}</div>
                  </div>
                  <TextField placeholder="Tên hiển thị" variant="outlined"
                    margin="normal" required fullWidth autoFocus
                    onChange={e => handleDisplayedNameChange(e.target.value)}
                    value={displayedName}
                  />

                  <div class="container margin-top-10">
                    <Typography style={{ fontWeight: 'bold' }} variant="h6">Tên tài khoản</Typography>
                    <div class="input-invalid">{errors.userName}</div>
                  </div>
                  <TextField placeholder="Tên tài khoản" variant="outlined"
                    margin="normal" required fullWidth disabled
                    value={username}
                  />

                  <div class="container margin-top-10">
                    <Typography style={{ fontWeight: 'bold' }} variant="h6">Email</Typography>
                    <div class="input-invalid">{errors.email}</div>
                  </div>
                  <TextField placeholder="Email"
                    variant="outlined" margin="normal" required fullWidth
                    onChange={e => handleEmailChange(e.target.value)}
                    value={email}
                  />
                </div>

                <div class="container margin-top-10">
                  <Typography style={{ fontWeight: 'bold' }} variant="h6">Ngày sinh</Typography>
                  <div class="input-invalid">{errors.dob}</div>
                </div>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                  <KeyboardDatePicker
                    // disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    fullWidth value={dateOfBirth}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    placeholder="Date of Birth"
                  />
                </MuiPickersUtilsProvider>

                <Button type="submit" fullWidth variant="contained" style={{ backgroundColor: palette.primary, color: 'white', fontWeight: 'bold', marginTop: '20px' }}
                  onClick={handleSaveChange}
                  startIcon={<SaveIcon />}
                >
                  Cập nhật thông tin
                </Button>

                <div class="container margin-top-20">
                  <Typography style={{ fontWeight: 'bold' }} variant="h6">Mật khẩu</Typography>
                </div>
                <ChangePasswordDialog setShowSnackBar={setShowSnackBar} setContent={setContent} />
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}