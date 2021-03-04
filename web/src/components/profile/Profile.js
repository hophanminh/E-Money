import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import background from '../../resources/images/background1.jpg';
import ImageUploader from './ImageUploader';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SaveIcon from '@material-ui/icons/Save';
// import ChangePasswordDialog from '../Dialogs/ChangePasswordDialog';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Badge from '@material-ui/core/Badge';
import DateFnsUtils from '@date-io/date-fns';
import IconButton from '@material-ui/core/IconButton';
import { isBlankString, isEmailPattern, convertISOToDMY } from '../../utils/helper';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import ReplayIcon from '@material-ui/icons/Replay';
import config from '../../constants/config.json';

const API_URL = config.API_LOCAL;
const styles = {
  wallpaper: {
    width: '100%',
    height: '55vh'
  },
  body: {
    minHeight: '1000px'
  }
}

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '25%',
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardContent: {
    flexGrow: 1,
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "black"//theme.palette.secondary.main,
  },
  form: {
    width: '75%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    display: 'inline-block',
    width: '100%'
  },
  floatRight: {
    float: "right",
    width: '60%'
  },
  floatLeft: {
    float: "left",
    width: '40%'
  },
  paperLikeShadow: {
    boxShadow: '0 4px 8px 5px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  },
  hidden: {
    display: 'none'
  }
}));

export default function Profile() {

  const classes = useStyles();
  const userID = localStorage.getItem('userID');
  const token = localStorage.getItem('jwtToken');
  const history = useHistory();
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(true);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState((new Date()).toISOString());
  const [validDOB, setValidDOB] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [activatedDate, setActivatedDate] = useState((new Date()).toISOString());
  const [info, setInfo] = useState({});
  const [contents, setContents] = useState([]);
  const [showSnackbar, setShowSnackBar] = useState(false);
  const handleNameChange = (name) => {
    setName(name);
    if (isBlankString(name)) {
      setContents(contents => [...contents.filter(content => content.id !== 1), { id: 1, msg: "Name field can't be empty!!!" }]);
      setValidName(false);
    } else {
      setContents(contents.filter(content => content.id !== 1));
      setValidName(true);
    }
  }

  const handleEmailChange = (email) => {
    setEmail(email);
    if (isBlankString(email)) {
      setContents(contents => [...contents.filter(content => content.id !== 2), { id: 2, msg: "Email field can't be empty!!!" }]);
      setValidEmail(false);
    }
    else if (!isEmailPattern(email)) {// === false
      setContents(contents => [...contents.filter(content => content.id !== 2), { id: 2, msg: "Email field doesn't match the email format!!!" }]);
      setValidEmail(false);
    } else {
      setContents(contents.filter(content => content.id !== 2));
      setValidEmail(true);
    }
  }

  const handleDateChange = (date) => {
    setDateOfBirth(date.toISOString());
    const now = new Date().toISOString()
    if (dateOfBirth < now) {
      setContents(contents.filter(content => content.id !== 3));
      setValidDOB(true);
    }
    else {
      setContents(contents => [...contents.filter(content => content.id !== 3), { id: 3, msg: "Invalid date!!!" }]);
      setValidDOB(false);
    }
  }

  const handleSaveChange = async () => {
    if (validDOB && validEmail && validName) {
      const data = {
        Name: name,
        Email: email,
        DateOfBirth: dateOfBirth
      }
      const res = await fetch(`${API_URL}/users/profile/updateinfo/${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      // const result = await res.json();

      if (res.status === 200) {

        const infoCopy = JSON.parse(JSON.stringify(info));

        infoCopy.Name = data.Name;
        infoCopy.Email = data.Email;
        infoCopy.DateOfBirth = data.DateOfBirth;
        setInfo(infoCopy);
        setShowSnackBar(true);
      } else {
        // alert("Some error when updating!")
      }
    } else {
      setShowSnackBar(true);
    }
  }

  const handleResetInfo = () => {
    setName(info.Name);
    setEmail(info.Email);
    setDateOfBirth(info.DateOfBirth);
    setValidEmail(true);
    setValidName(true);
    setValidDOB(true);
    setContents([]);
  }
  return (
    <>
      <div class="wallpaper" style={{ ...styles.wallpaper, position: 'relative' }}>
        <img style={{ position: 'absolute', bottom: '-10%', left: '10%' }} class="shadow avatar"
          src="https://biprodfinal.imgix.net/images/1539ff6d-3adc-4f96-9b8d-9440c7ba7c27-featured-image-tom1440x540.jpg?w=880&h=440&fit=crop&crop=faces,edges" alt="User avatar"
        />
        <div style={{ position: 'absolute', bottom: '-20%', left: '23%' }}>
          <ImageUploader />
        </div>
      </div>
      <div style={styles.body}>
        <Container component="main" maxWidth="xl">
          <Grid container spacing={4} >
            <Grid item item xs={12} sm={12} md={6} direction="column" style={{ textAlign: 'center', marginTop: '5%' }}>
              <Typography variant='h4' style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                Quang Minh
              </Typography>
              <Typography variant='h6'>
                Ngày tham gia: 01/01/2020
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <div >
                <Typography component="h2" variant="h5">
                  YOUR PROFILE
                <IconButton onClick={handleResetInfo} title="Reset information" color="primary" aria-label="add an alarm" style={{ fontSize: 'large' }} >
                    <ReplayIcon />
                  </IconButton>
                </Typography>
                <div className={classes.form} >

                  <div className={classes.container}>
                    <Typography className={classes.floatLeft} align="left" component="h2"><b> Name:</b> </Typography>
                    {validName ?
                      <></>
                      :
                      <Typography className={classes.floatRight} align="right" style={{ color: "red" }}>Invalid</Typography>
                    }
                  </div>
                  <TextField variant="outlined" margin="normal" required fullWidth autoFocus
                    placeholder="Username" value={name}
                    onChange={(event) => { handleNameChange(event.target.value); }}
                  />

                  <div className={classes.container}>
                    <Typography className={classes.floatLeft} align="left" component="h2"> <b>Email:</b>  </Typography>
                    {validEmail ?
                      <></>
                      :
                      <Typography className={classes.floatRight} align="right" style={{ color: "red" }}>Invalid</Typography>
                    }
                  </div>
                  <TextField variant="outlined" margin="normal" required fullWidth
                    id="email" name="email" placeholder="Email" value={email}
                    onChange={(event) => { handleEmailChange(event.target.value); }}
                  />

                  <div className={classes.container}>
                    <Typography align="left" component="h2" className={classes.floatLeft}>
                      <b>Date of Birth:</b>
                    </Typography>
                    {validDOB ?
                      <></>
                      :
                      <Typography className={classes.floatRight} align="right" style={{ color: "red" }}>Invalid</Typography>
                    }
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

                  <div className={classes.container}>
                    <Typography align="left" component="h2" className={classes.floatLeft}>
                      <b>Activated date:</b>
                    </Typography>
                    <TextField variant="outlined" margin="normal" required fullWidth
                      placeholder="Activated date" value={convertISOToDMY(activatedDate)} disabled
                    />
                  </div>
                  <Button type="submit" fullWidth variant="outlined" color="primary" onClick={handleSaveChange}
                    className={classes.submit} startIcon={<SaveIcon />}
                  >
                    Save Change
                </Button>
                  <Typography align="left" component="h2" style={{ marginTop: 10, marginBottom: 12, fontWeight: 'bold' }}> Passowrd: </Typography>
                  {/* <ChangePasswordDialog /> */}
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}