import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
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
import TransactionImages from '../Dashboard/TransactionImages';

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
  const [username, setUsername] = useState("");// không thay đổi được
  const [displayedName, setDisplayedName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("Bạn chưa chọn ngày sinh");
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const { isLoggedIn, info, setInfo } = useContext(MyContext);
  const [activeDate, setActiveDate] = useState((new Date()).toISOString());
  const [content, setContent] = useState("");
  const [showSnackbar, setShowSnackBar] = useState(false);

  useEffect(() => {
    if (isLoggedIn !== null && isLoggedIn === false) {
      history.push('/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setDisplayedName(info.Name);
    setUsername(info.Username);
    setEmail(info.Email);
    setDateOfBirth(info.DateOfBirth);
    setActiveDate(info.ActivatedDate);
    setAvatar(info.AvatarURL ? info.AvatarURL : defaultAvatar);
  }, [info])

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
      setInfo({
        ...info,
        Name: data.Name,
        Email: data.Email,
        DateOfBirth: data.DateOfBirth
      })
    } else {
      // alert("Some error when updating!")
    }
  }

  const handleResetInfo = () => {

  }

  return (
    <>
      <TransactionImages transactionID={1} />

      <SnackBar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} content={content} />
      <div className="wallpaper" style={{ ...styles.wallpaper }}>
      </div>
      <div style={styles.body}>
        <Container component="main" /*maxWidth="lg"*/>
          <Grid container spacing={2}>
            <Grid item item xs={12} sm={12} md={6} style={{ textAlign: 'center', marginTop: '5%' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="shadow avatar"
                  style={{
                    position: 'relative',
                    marginTop: '-200px',
                    backgroundImage: `url('${avatar}')`
                  }}
                >
                  <div style={{ position: 'absolute', left: '76%', bottom: '0%' }}>
                    <ImageUploader setContent={setContent} setShowSnackBar={setShowSnackBar} />
                  </div>
                </div>

                <div className="margin-top-20">
                  <Typography variant='h4' style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    {displayedName}
                  </Typography>
                  <Typography variant='h6'>
                    Ngày tham gia: {helper.convertToLocalDateFormat(activeDate)}
                  </Typography>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={12} md={6} /*maxWidth='md'*/ align="center">
              <div style={{ textAlign: 'center', width: '80%' }}>
                <Typography component="h2" variant="h5" style={{ fontWeight: 'bold' }}>
                  Thông tin tài khoản
                <IconButton onClick={handleResetInfo} title="Reset information" color="primary" aria-label="add an alarm" style={{ fontSize: 'large' }} >
                    <ReplayIcon />
                  </IconButton>
                </Typography>
                <div style={{ margin: '20px 0 20px' }}>
                  <div className="container">
                    <Typography style={{ fontWeight: 'bold' }} variant="h6">Tên hiển thị</Typography>
                    <div className="input-invalid">{errors.displayedName}</div>
                  </div>
                  <TextField placeholder="Tên hiển thị" variant="outlined"
                    margin="normal" required fullWidth autoFocus
                    onChange={e => handleDisplayedNameChange(e.target.value)}
                    value={displayedName}
                  />
                  <div className="container margin-top-10">
                    <Typography style={{ fontWeight: 'bold' }} variant="h6">Tên tài khoản</Typography>
                    <div className="input-invalid">{errors.userName}</div>
                  </div>
                  <TextField placeholder="Tên tài khoản" variant="outlined"
                    margin="normal" required fullWidth disabled
                    value={username}
                  />
                  <div className="container margin-top-10">
                    <Typography style={{ fontWeight: 'bold' }} variant="h6">Email</Typography>
                    <div className="input-invalid">{errors.email}</div>
                  </div>
                  <TextField placeholder="Email"
                    variant="outlined" margin="normal" required fullWidth
                    onChange={e => handleEmailChange(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="container margin-top-10">
                  <Typography style={{ fontWeight: 'bold' }} variant="h6">Ngày sinh</Typography>
                  <div className="input-invalid">{errors.dob}</div>
                </div>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                  <KeyboardDatePicker
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    placeholder="chh"
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
                <div className="container margin-top-20">
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