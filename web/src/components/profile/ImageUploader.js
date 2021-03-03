import React, { useState } from 'react'
import { DropzoneDialog } from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { makeStyles } from '@material-ui/core/styles';
import config from '../../constants/config.json';
import palette from '../../constants/palette.json';
const API_URL = config.API_LOCAL;

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: '20px 0 40px',
    alignItems: 'center'
  }
}));

export default function ImageUploader() {
  const classes = useStyles();
  const userID = localStorage.getItem('userID');
  const token = window.localStorage.getItem('jwtToken');
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  const handleSave = async (files) => {

    const data = new FormData();
    data.append('avatar', files[0]);

    const res = await fetch(`${API_URL}/users/profile/updateavatar/${userID}`, {
      method: 'POST',
      headers: {
        // 'content-type': 'multipart/form-data', // no need
        Authorization: `Bearer ${token}`
      },
      body: data,
    });

    if (res.status === 200) {
      const result = await res.blob();
      // setAvatar(URL.createObjectURL(result));
      // setShowSnackBar(true);
    } else { // 400, etc...
      // setShowErrorSnackBar(true);
    }
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  return (
    <div className={classes.margin}>
      <Button
        onClick={handleOpen}
        variant="contained"
        // class="shadow"
        style={{ borderRadius: '50%', backgroundColor: '#fafafa', color: palette.secondary, height: '4.5vw', width: '1.5vw' }}>
        <AddPhotoAlternateIcon style={{ fontSize: '30px' }} />
      </Button>

      <DropzoneDialog
        open={open}
        onSave={handleSave}
        acceptedFiles={['image/jpeg', 'image/png', 'image/gif']}
        showPreviewsInDropzone={true}
        showPreviews={false}
        showFileNames={true}
        filesLimit={1}
        maxFileSize={10000000}
        onClose={handleClose}
      />
    </div>
  );
}