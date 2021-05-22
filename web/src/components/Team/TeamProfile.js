import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
// import ImageUploader from './ImageUploader';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import * as helper from '../../utils/helper';
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
        marginTop: '10vh',
        marginBottom: '10vh',
        display: 'flex',
        justifyContent: 'center',
        align: 'center'
    }
}

export default function TeamProfile() {

    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('jwtToken');
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
    }, [isLoggedIn]);

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
            Description: description
        }
        const res = await fetch(`${API_URL}/teams/${userID}`, {
            method: 'POST',
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

        history.push("/teams");
    }

    return (
        <>
            <SnackBar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} content={content} />
            <div style={styles.body}>
                <Container xs={12} sm={12} md={6} component="main" maxWidth="lg">
                    <Grid align="center">
                            <div style={{ textAlign: 'center', width: '50%' }}>
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
                                               inputProps={{ maxLength: 100 }}
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
                                                multiline
                                               variant="outlined" margin="normal" required fullWidth
                                               onChange={e => handleDescription(e.target.value)}
                                               value={description}
                                               inputProps={{ maxLength: 1000 }}
                                    />
                                </div>

                                <Button type="submit" fullWidth variant="contained" style={{ backgroundColor: palette.primary, color: 'white', fontWeight: 'bold', marginTop: '20px' }}
                                        onClick={handleSaveChange}
                                        startIcon={<SaveIcon />}
                                >
                                    Tạo nhóm
                                </Button>
                            </div>
                    </Grid>
                </Container>
            </div>
        </>
    );
}