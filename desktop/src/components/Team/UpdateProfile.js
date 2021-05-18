import React, { useEffect, useState, useContext } from 'react';
import { useHistory,useParams  } from 'react-router-dom';
import Button from '@material-ui/core/Button';
// import ImageUploader from './ImageUploader';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import * as helper from '../../utils/helper';
import palette from '../../constants/palette.json';
import MyContext from '../mycontext/MyContext';
import SnackBar from '../snackbar/SnackBar';
import config from '../../constants/config.json';
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

export default function TeamProfile() {

    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('jwtToken');
    const teamID = useParams().TeamID;
    console.log(teamID);
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [teamName, setTeamName] = useState("");
    const [description, setDiscription] = useState("");
    const [numberUser, setNumberUser] = useState(10);
    const [avatar, setAvatar] = useState(null);
    const { isLoggedIn } = useContext(MyContext);

    const [content, setContent] = useState("");
    const [showSnackbar, setShowSnackBar] = useState(false);

    useEffect(() => {
        console.log(isLoggedIn);
        if (isLoggedIn !== null && isLoggedIn === false) {
            history.push('/');
        }
        getTeamDetail();
    }, [isLoggedIn]);

    const getTeamDetail = async () => {
        const res = await fetch(`${API_URL}/teams/details/${teamID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Body res: ",res.body);
        if (res.status === 200) {
            const result = await res.json();
            console.log(result.teams[0]);
            const team = result.teams[0];
            setTeamName(team.Name);
            setDiscription(team.Description)
            setNumberUser(team.MaxUsers)
        } else {
            // alert("Some error when updating!")
        }
    }


    const handleTeamNameChange = (teamName) => {
        setTeamName(teamName);
    }
    const handleNumberUsers = (number) => {
        setNumberUser(number);
    }
    const handleDescription = (des) => {
        setDiscription(des);
    }

    const handleSaveChange = async () => {

        const errorObjs = {
        };

        if (helper.isBlankString(teamName)) {
            errorObjs.teamName = "Tên hiển thị không được để trống";
        }

        setErrors(errorObjs);

        if (Object.keys(errorObjs).length > 0) {
            return;
        }

        const data = {
            Name: teamName,
            MaxUsers: numberUser,
            Description: description,
            UserID: userID
        }
        console.log(data);
        const res = await fetch(`${API_URL}/teams/details/${teamID}`, {
            method: 'PUT',
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
            const result = await res.json();
            console.log(result);
            setContent(result.msg);
            setShowSnackBar(true);
        }
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
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} maxWidth='md' align="center">
                            <div style={{ textAlign: 'center', width: '80%' }}>
                                <Typography component="h2" variant="h5" style={{ fontWeight: 'bold' }}>
                                    Thông tin tạo nhóm
                                </Typography>
                                <div style={{ margin: '20px 0 20px' }}>
                                    <div class="container">
                                        <Typography style={{ fontWeight: 'bold' }} variant="h6">Tên nhóm</Typography>
                                        <div class="input-invalid">{errors.teamName}</div>
                                    </div>
                                    <TextField placeholder="Tên nhóm" variant="outlined"
                                               margin="normal" required fullWidth autoFocus
                                               onChange={e => handleTeamNameChange(e.target.value)}
                                               value={teamName}
                                    />

                                    <div class="container margin-top-10">
                                        <Typography style={{ fontWeight: 'bold' }} variant="h6">Số lượng thành viên</Typography>
                                        <div class="input-invalid">{errors.numberUser}</div>
                                    </div>
                                    <TextField placeholder="Số lượng" variant="outlined"
                                               margin="normal" required fullWidth
                                               value={numberUser}
                                               onChange={e => handleNumberUsers(e.target.value)}
                                    />

                                    <div class="container margin-top-10">
                                        <Typography style={{ fontWeight: 'bold' }} variant="h6">Mô tả</Typography>
                                    </div>
                                    <TextField placeholder="Mô tả"
                                               variant="outlined" 
                                               margin="normal" 
                                               required fullWidth
                                               onChange={e => handleDescription(e.target.value)}
                                               value={description}
                                               multiline
                                    />
                                </div>

                                <Button type="submit" fullWidth variant="contained" style={{ backgroundColor: palette.primary, color: 'white', fontWeight: 'bold', marginTop: '20px' }}
                                        onClick={handleSaveChange}
                                        startIcon={<SaveIcon />}
                                >
                                    Cập nhật thông tin
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </>
    );
}