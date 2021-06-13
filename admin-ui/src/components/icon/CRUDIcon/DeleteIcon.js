import React from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  makeStyles,
  DialogActions
} from '@material-ui/core/';
import { getSocket } from "../../../utils/socket";

export default function DeleteIconAdmin({ isOpen, setOpen, idToDelete }) {
  const classes = useStyles();
  const socket = getSocket();

  const handleCloseDeleteDialog = () => {
    setOpen(false);
    setIsError(false);
    setHelperText('');
  }

  const handleDelete = () => {
    socket.emit("delete_icon", { iconID: idToDelete });
    setOpen(false);
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle >
          <Typography className={classes.title}>
            Xóa
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.description}>
            Bạn có muốn xóa icon đã chọn ?
          </Typography>
          <Typography className={classes.description}>
            Người dùng sẽ không được chọn icon này về sau
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseDeleteDialog} variant="contained" >
            Hủy
          </Button>
          <Button className={`${classes.button} ${classes.deleteButton}`} onClick={handleDelete} variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles({
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '-15px'
  },
  description: {
    fontSize: '18px',
  },
  button: {
    borderRadius: '4px',
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: '5px 40px',
    marginLeft: '20px'
  },
  closeButton: {
    backgroundColor: '#F50707',
  },
  deleteButton: {
    backgroundColor: '#1DAF1A',
  },
});
