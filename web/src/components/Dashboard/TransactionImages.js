import React, { useState, useEffect, forwardRef } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Button, Grid, Container, IconButton, DialogActions, DialogContentText, DialogContent, DialogTitle, Dialog } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleOutlineSharpIcon from '@material-ui/icons/CheckCircleOutlineSharp';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { DropzoneDialog } from 'material-ui-dropzone'
import { getSocket } from '../../utils/socket';
import config from '../../constants/config.json';
import palette from '../../constants/palette.json';
import moment from 'moment';

const API_URL = config.API_LOCAL;
const styles = {
  smallImageItem: { width: '75px', height: '75px', cursor: 'pointer' },
  largeImageItem: { width: '7vw', height: '7vw', cursor: 'pointer' },
  smallItemSpace: { margin: '3px 3px' },
  largeItemSpace: { margin: '10px 7px' },
  roundedCorner: { borderRadius: '5px' },
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

const Item = ({ image }) => {
  return (
    <>
      <Typography>Đăng vào lúc: {moment(image.DateAdded).format('DD/MM/YYYY HH:mm')}</Typography>
      <div className="carousel" style={{ backgroundImage: `url('${image.URL}')`, height: '72vh', maxHeight: '72vh', width: 'auto', backgroundColor: 'black' }}>
      </div>
    </>
  );
}

export default function TransactionImages({ transactionID, images, setImages }) {
  const [open, setOpen] = useState(false); // this dialog
  const [displayedImage, setDisplayedImage] = useState(0);
  const [removeImageDialog, setRemoveImageDialog] = useState(false); // child dialog
  const [imageToRemove, setImageToRemove] = useState("");
  const [addImageDialog, setAddImageDialog] = useState(false); // child dialog

  useEffect(() => {
    if (!addImageDialog && images.length === 0) {
      handleClose()
    }
  }, [open, images])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSelectedUrl = (i) => {
    setDisplayedImage(i);
  };

  const handleRemoveImage = (i) => {
    setImageToRemove(i);
    setRemoveImageDialog(true);
  };

  const handleAddImage = () => {
    setAddImageDialog(true);
  };

  const prevViewUI = () => {
    return (
      <>
        {
          images.length === 0 ?
            <div style={{ display: 'inline-block' }}>
              <Tooltip arrow fontSize="40" title={<Typography>Thêm hình ảnh minh chứng cho giao dịch này</Typography>} placement="right">
                <div className="container shadow" style={{ justifyContent: 'center', ...styles.smallImageItem, ...styles.smallItemSpace, ...styles.roundedCorner, backgroundColor: '#f0f0f0' }} onClick={handleAddImage}>
                  <AddAPhotoIcon fontSize="large" style={{ color: "#727375" }} />
                </div>
              </Tooltip>
            </div>
            :
            <Tooltip arrow title={<Typography>Hình ảnh minh chứng giao dịch</Typography>} placement="right">
              {
                images.length <= 3 ?
                  <div style={{ display: 'inline-block' }}>
                    {images.map((item, i) =>
                      <img key={i} className="shadow" src={item.URL} onClick={() => { setDisplayedImage(i); handleClickOpen() }}
                        style={{ ...styles.smallImageItem, ...styles.smallItemSpace, ...styles.roundedCorner }}
                      />
                    )}
                  </div>
                  :
                  <div style={{ display: 'inline-block', textAlign: 'right' }}>
                    <div style={{ display: 'inline-block' }} onClick={() => { setDisplayedImage(0); handleClickOpen() }}>
                      <img key={0} src={images[0].URL} className="shadow"
                        style={{ ...styles.smallImageItem, ...styles.smallItemSpace, ...styles.roundedCorner }}
                      />
                    </div>
                    <div style={{ display: 'inline-block' }} onClick={() => { setDisplayedImage(1); handleClickOpen() }}>
                      <img key={1} src={images[1].URL} className="shadow"
                        style={{ ...styles.smallImageItem, ...styles.smallItemSpace, ...styles.roundedCorner }}
                      />
                    </div>
                    <div style={{ display: 'inline-block', position: 'relative', cursor: 'pointer' }} onClick={() => { setDisplayedImage(2); handleClickOpen() }}>
                      <img key={2} src={images[2].URL} className="shadow"
                        style={{ filter: 'brightness(50%)', ...styles.smallImageItem, ...styles.smallItemSpace, ...styles.roundedCorner }}
                      />
                      <div style={{ position: 'absolute', top: '30%', width: '100%', textAlign: 'center', color: '#fff', fontSize: '25px' }}>
                        +{images.length - 2}
                      </div>
                    </div>
                  </div>
              }
            </Tooltip>
        }
      </>
    );
  }

  return (
    <>
      {prevViewUI()}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="xl" TransitionComponent={Transition}>
        <DialogTitle >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography component={'span'} style={{ fontSize: '30px' }}>Hình ảnh giao dịch</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

        </DialogTitle>
        <Container component="main" maxWidth="xl" >
          <Grid container spacing={4}>
            <Grid item sm={12} md={7}>
              <div>
                <Carousel
                  interval={"1000"} autoPlay={false} indicators={false} animation={'slide'} index={displayedImage}
                  next={(next, active) => { handleChangeSelectedUrl(next) }}
                  prev={(prev, active) => { handleChangeSelectedUrl(prev) }}

                >
                  {images.map((image, i) => <Item key={i} image={image} />)}
                </Carousel>
              </div>
            </Grid>
            <Grid item sm={12} md={5}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <div className="container"
                  style={{ ...styles.largeImageItem, justifyContent: 'center', ...styles.largeItemSpace }} >
                  <Button
                    variant="contained"
                    onClick={() => { handleClose(); handleAddImage(); }}
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
                  images.map((image, i) =>
                    <StyledBadge key={i} badgeContent={<CloseIcon style={{ fontSize: '1.5vw' }} onClick={() => handleRemoveImage(image.ID)} />} color="secondary" >
                      <div onClick={() => handleChangeSelectedUrl(i)} className="wallpaper"
                        style={{ ...styles.largeImageItem, ...styles.largeItemSpace, ...styles.roundedCorner, backgroundImage: `url('${image.URL}')`, ...(i === displayedImage ? { border: `3px solid ${palette.primary}` } : { filter: 'brightness(60%)' }) }}>
                      </div>
                    </StyledBadge>
                  )
                }

              </div>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
      <RemoveImageDialog transactionID={transactionID} open={removeImageDialog} images={images} setImages={setImages} setOpen={setRemoveImageDialog} imageID={imageToRemove} />
      <ImagesUploader open={addImageDialog} setOpen={setAddImageDialog} transactionID={transactionID} images={images} setImages={setImages} />
    </>
  );
}

function RemoveImageDialog({ transactionID, imageID, images, setImages, open, setOpen }) {
  const socket = getSocket();
  const token = window.localStorage.getItem('jwtToken');
  const [isWaiting, setIsWaiting] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleRemove = async () => {

    setOpen(false);
    setIsWaiting(true);

    socket.emit(`remove_transaction_image`, { imageID, transactionID }, (status) => {
      if (status === 200) {
        setIsWaiting(false);
        // setImages(images.slice().filter(image => image.ID !== imageID));
      }
    });
  }

  return (
    <div>
      <Dialog
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
          <Button onClick={handleRemove} color="primary" variant="outlined">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isWaiting}>
        <DialogContent style={{ width: '20vw', textAlign: 'center' }}>
          <div>
            <CircularProgress style={{ color: palette.primary }} />
            <Typography variant='h6'>Đang xử lý</Typography>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ImagesUploader({ transactionID, open, setOpen, images, setImages }) {
  const token = window.localStorage.getItem('jwtToken');
  const socket = getSocket();
  const [isWaiting, setIsWaiting] = useState(false); // child
  const [isDone, setIsDone] = useState(false); // child

  const handleCloseInformationDialog = () => {
    setIsDone(false);
  }

  const handleCloseUploadDialog = () => {
    setOpen(false);
  }

  const handleSave = async (files) => {

    const data = new FormData();
    files.forEach(file => {
      data.append('images', file);
    });

    setOpen(false);
    setIsWaiting(true);

    const res = await fetch(`${API_URL}/transaction-images?transactionID=${transactionID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data,
    });

    if (res.status === 200) {
      const result = await res.json();
      // setImages(images.slice().concat(result.urls));
      socket.emit('add_transaction_image', { transactionID, urls: result.urls });
      setIsDone(true);

    }
    // else { // 400, etc...
    // setContent(result.msg)
    // }
    // setShowSnackBar(true);      
    setIsWaiting(false)
  }

  return (
    <>
      <DropzoneDialog
        open={open}
        dialogTitle="Thêm hình ảnh giao dịch"
        submitButtonText="Thêm ảnh"
        cancelButtonText="Hủy"
        dropzoneText="Chọn hoặc kéo thả ảnh từ thiết bị vào đây"
        onSave={handleSave}
        acceptedFiles={['image/jpeg', 'image/png', 'image/gif']}
        showPreviewsInDropzone={true}
        showPreviews={false}
        showAlerts={true}
        filesLimit={5}
        maxFileSize={10000000}
        dropzoneParagraphClass="dropzone-text"
        onClose={handleCloseUploadDialog}
      />
      <Dialog open={isWaiting || isDone} onClick={isDone ? () => handleCloseInformationDialog() : null}>
        {
          isDone ? <div style={{ textAlign: 'right' }}>
            <IconButton onClick={handleCloseInformationDialog}>
              <CloseIcon />
            </IconButton>
          </div> : null
        }
        <DialogContent style={{ width: '20vw', textAlign: 'center' }}>
          {
            isWaiting ?
              <div>
                <CircularProgress style={{ color: palette.primary }} />
                <Typography variant='h6'>Đang xử lý</Typography>
              </div>
              :
              null
          }
          {
            isDone ?
              <div>
                <CheckCircleOutlineSharpIcon style={{ color: palette.primary, fontSize: 60 }} />
                <Typography variant='h6'>Hoàn tất</Typography>
              </div>
              :
              null
          }
        </DialogContent>
      </Dialog>
    </>
  );
}