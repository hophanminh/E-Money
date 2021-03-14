import React, { useState, useContext } from 'react'
import { DropzoneDialog } from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CircularProgress from '@material-ui/core/CircularProgress';
import config from '../../constants/config.json';
import palette from '../../constants/palette.json';
import { Dialog, DialogContent, Typography } from '@material-ui/core';
import MyContext from '../mycontext/MyContext';
const API_URL = config.API_LOCAL;


export default function ImageUploader({ setContent, setShowSnackBar }) {
  const userID = localStorage.getItem('userID');
  const token = window.localStorage.getItem('jwtToken');
  const [open, setOpen] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const { info, setInfo } = useContext(MyContext);

  const handleClose = () => {
    setOpen(false);
  }

  const handleSave = async (files) => {

    const data = new FormData();
    data.append('avatar', files[0]);
    setWaiting(true);

    const res = await fetch(`${API_URL}/users/${userID}/avatar`, {
      method: 'PATCH',
      headers: {
        // 'content-type': 'multipart/form-data', // no need
        Authorization: `Bearer ${token}`
      },
      body: data,
    });
    const result = await res.json();

    if (res.status === 200) {
      setContent("Cập nhật thành công");
      setInfo({ ...info, AvatarURL: result.url });
    } else { // 400, etc...
      setContent(result.msg)
    }
    setShowSnackBar(true);
    setWaiting(false)
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  return (
    <div >
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{
          borderRadius: '50%',
          height: '45px',
          width: '45px',
          color: palette.secondary,
          backgroundColor: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
        class="shadow"
      >
        <AddPhotoAlternateIcon style={{ fontSize: '28px' }} />
      </Button>

      <DropzoneDialog
        open={open}
        dialogTitle="Cập nhật ảnh đại diện"
        submitButtonText="Cập nhật"
        cancelButtonText="Hủy"
        dropzoneText="Chọn ảnh từ thiết bị hoặc kéo thả ảnh vào đây"
        onSave={handleSave}
        acceptedFiles={['image/jpeg', 'image/png', 'image/gif']}
        showPreviewsInDropzone={true}
        showPreviews={false}
        showFileNames={true}
        filesLimit={1}
        maxFileSize={10000000}
        onClose={handleClose}
      />
      <Dialog style={{ textAlign: 'center' }} open={waiting} >
        <DialogContent align='center'>
          <CircularProgress style={{ color: palette.primary }} />
          <Typography variant='h6'>Đang cập nhật</Typography>
        </DialogContent>
      </Dialog>
    </div >
  );
}