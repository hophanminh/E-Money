import React, { useState, useEffect, forwardRef } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Button, Grid, Container, IconButton, DialogActions, DialogContentText, DialogContent, DialogTitle, Dialog } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import GalleryDialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slide from '@material-ui/core/Slide';
import { DropzoneDialog, AlertType } from 'material-ui-dropzone'
import config from '../../constants/config.json';
import palette from '../../constants/palette.json';
const API_URL = config.API_LOCAL;
const fakeUrls = [
  "https://www.theweek.in/content/dam/week/news/india/images/2020/5/5/liquor-bill.jpeg",
  "https://pbs.twimg.com/media/DEVtWyoUwAAZPTY.jpg",
  "https://www.cityofalbany.net/images/stories/publicworks/utility-billing/ub-bill.jpg",
  "https://www.theweek.in/content/dam/week/news/india/images/2020/5/5/liquor-bill.jpeg",
  "https://pbs.twimg.com/media/DEVtWyoUwAAZPTY.jpg",
  "https://www.cityofalbany.net/images/stories/publicworks/utility-billing/ub-bill.jpg"
  , "https://www.theweek.in/content/dam/week/news/india/images/2020/5/5/liquor-bill.jpeg",
  "https://pbs.twimg.com/media/DEVtWyoUwAAZPTY.jpg",
  "https://www.cityofalbany.net/images/stories/publicworks/utility-billing/ub-bill.jpg"
  , "https://www.theweek.in/content/dam/week/news/india/images/2020/5/5/liquor-bill.jpeg",
  "https://pbs.twimg.com/media/DEVtWyoUwAAZPTY.jpg",
  "https://www.cityofalbany.net/images/stories/publicworks/utility-billing/ub-bill.jpg"
  , "https://www.theweek.in/content/dam/week/news/india/images/2020/5/5/liquor-bill.jpeg",
  // "https://pbs.twimg.com/media/DEVtWyoUwAAZPTY.jpg",
  // "https://www.cityofalbany.net/images/stories/publicworks/utility-billing/ub-bill.jpg"
  // , "https://www.theweek.in/content/dam/week/news/india/images/2020/5/5/liquor-bill.jpeg",
  // "https://pbs.twimg.com/media/DEVtWyoUwAAZPTY.jpg",
  // "https://www.cityofalbany.net/images/stories/publicworks/utility-billing/ub-bill.jpg"
  // , "https://www.theweek.in/content/dam/week/news/india/images/2020/5/5/liquor-bill.jpeg",
]

const styles = {
  imageItem: { width: '7vw', height: '7vw', cursor: 'pointer' },
  itemSpace: { margin: '10px 7px' },
  roundedCorner: { borderRadius: '5px' }
}

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 13,
    top: 12,
    borderRadius: '50%',
    border: `2px solid white`,
    padding: '1vw 0.25vw',
    cursor: 'pointer',
    backgroundColor: palette.dark_grey
  },
}))(Badge);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

function Item({ url }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <img src={url} style={{ height: '75vh', maxHeight: '75vh', width: 'auto' }} />
    </div>
  );
}

export default function TransactionImages({ transactionID }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState(fakeUrls);
  const [displayedImage, setDisplayedImage] = useState(0);
  const [removeImageDialog, setRemoveImageDialog] = useState(false);
  const [imageToRemove, setImageToRemove] = useState("");
  const [addImageDialog, setAddImageDialog] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSelectedUrl = (i) => {
    setDisplayedImage(i);
  }

  const handleRemoveImage = (i) => {
    setImageToRemove(i);
    setRemoveImageDialog(true);
  }

  const handleAddImage = () => {
    setOpen(false);
    setAddImageDialog(true);
  }

  const prevViewUI = () => {
    return (
      <>
        {
          images.length <= 3 ?
            (images.map((item, i) =>
              <img key={i} src={item} onClick={() => { setDisplayedImage(i); handleClickOpen() }}
                style={{ ...styles.imageItem, ...styles.itemSpace, ...styles.roundedCorner }}
              />
            ))
            :
            <div style={{ display: 'inline-block' }}>
              <div style={{ display: 'inline-block' }} onClick={() => { setDisplayedImage(0); handleClickOpen() }}>
                <img key={0} src={images[0]}
                  style={{ ...styles.imageItem, ...styles.itemSpace, ...styles.roundedCorner }}
                />
              </div>
              <div style={{ display: 'inline-block' }} onClick={() => { setDisplayedImage(1); handleClickOpen() }}>
                <img key={1} src={images[1]}
                  style={{ ...styles.imageItem, ...styles.itemSpace, ...styles.roundedCorner }}
                />
              </div>
              <div style={{ display: 'inline-block', position: 'relative', cursor: 'pointer' }} onClick={() => { setDisplayedImage(2); handleClickOpen() }}>
                <img key={2} src={images[2]}
                  style={{ filter: 'brightness(50%)', ...styles.imageItem, ...styles.itemSpace, ...styles.roundedCorner }}
                />
                <div style={{ position: 'absolute', top: '35%', width: '100%', textAlign: 'center', color: '#fff', fontSize: '2vw' }}>
                  +{images.length - 2}
                </div>
              </div>
            </div>
        }
      </>
    );
  }

  return (
    <>
      {prevViewUI()}
      <GalleryDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="xl" TransitionComponent={Transition}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography component={'span'} style={{ marginLeft: '20px' }}><h4>Hình ảnh giao dịch</h4></Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Container component="main" maxWidth="xl" >
          <Grid container spacing={6}>
            <Grid item sm={12} md={7}>
              <Carousel
                autoPlay={false} indicators={false} animation={'slide'} index={displayedImage}
                next={(next, active) => { handleChangeSelectedUrl(next) }}
                prev={(prev, active) => { handleChangeSelectedUrl(prev) }}
              >
                {images.map((item, i) => <Item key={i} url={item} />)}
              </Carousel>
            </Grid>
            <Grid item sm={12} md={5}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <div class="container"
                  style={{ ...styles.imageItem, justifyContent: 'center', ...styles.itemSpace }} >
                  <Button
                    variant="contained"
                    onClick={handleAddImage}
                    style={{
                      justifyContent: 'center',
                      borderRadius: '50%',
                      height: '4.5em',
                      width: '4.5em',
                      color: '#FFF',
                      backgroundColor: palette.primary,
                      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    }}
                  >
                    <AddIcon style={{ fontSize: '3em' }} />
                  </Button>
                </div>
                {
                  images.map((url, i) =>
                    <StyledBadge badgeContent={<CloseIcon style={{ fontSize: '1.5vw' }} onClick={() => handleRemoveImage(i)} />} color="secondary" >
                      <div key={i} src={url} onClick={() => handleChangeSelectedUrl(i)} className="wallpaper"
                        style={{ ...styles.imageItem, ...styles.itemSpace, ...styles.roundedCorner, backgroundImage: `url('${url}')`, ...(i === displayedImage ? { border: `3px solid ${palette.primary}` } : { filter: 'brightness(60%)' }) }} />
                    </StyledBadge>
                  )
                }
              </div>
            </Grid>
          </Grid>
        </Container>
      </GalleryDialog>
      <RemoveImageDialog open={removeImageDialog} setOpen={setRemoveImageDialog} imageID={imageToRemove} />
      <ImagesUploader open={addImageDialog} setOpen={setAddImageDialog} setParentOpen={setOpen} />
    </>
  );
}

function RemoveImageDialog({ open, setOpen, imageID }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <GalleryDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Bạn chắc chắn muốn xóa ảnh này?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sau khi xóa, bạn sẽ không thể khôi phục nội dung này!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus variant="outlined">
            Xác nhận
          </Button>
        </DialogActions>
      </GalleryDialog>
    </div>
  );
}

function ImagesUploader({ open, setOpen, setParentOpen }) {
  const userID = localStorage.getItem('userID');
  const token = window.localStorage.getItem('jwtToken');
  const [waiting, setWaiting] = useState(false);

  const handleBack = () => {
    setOpen(false);
    setParentOpen(true);
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
      // setContent("Cập nhật thành công");
      // setInfo({ ...info, AvatarURL: result.url });
    } else { // 400, etc...
      // setContent(result.msg)
    }
    // setShowSnackBar(true);
    // setWaiting(false)
    // setOpen(false);
  }


  return (
    <>
      <DropzoneDialog
        open={open}
        dialogTitle="Thêm hình ảnh giao dịch"
        submitButtonText="Thêm"
        cancelButtonText="Trở về"
        dropzoneText="Chọn ảnh từ thiết bị hoặc kéo thả ảnh vào đây"
        onSave={handleSave}
        acceptedFiles={['image/jpeg', 'image/png', 'image/gif']}
        showPreviewsInDropzone={true}
        showPreviews={false}
        showAlerts={true}
        // showFileNames={true}
        filesLimit={5}
        maxFileSize={10000000}
        onClose={handleBack}
      />

      <Dialog style={{ textAlign: 'center' }} open={waiting} >
        <DialogContent align='center'>
          <CircularProgress style={{ color: palette.primary }} />
          <Typography variant='h6'>Đang cập nhật</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}