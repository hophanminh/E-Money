import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import {
  Typography,
  Dialog,
  DialogTitle,
  Box,
  Button,
  DialogContent,
  makeStyles,
  DialogActions
} from '@material-ui/core/';
import {
  PopupContext,
  EventContext
} from '../../mycontext';
import POPUP from '../../../constants/popup.json';
import { getSocket } from "../../../utils/socket";

const NAME = POPUP.EVENT.DELETE_EVENT;

const DeleteEvent = (props) => {
  const classes = useStyles()
  const socket = getSocket();
  const { id } = useParams();
  const { open, setOpen } = useContext(PopupContext);
  const { selected } = useContext(EventContext);

  const isOpen = open === NAME;

  const handleClose = () => {
    setOpen(null);
  };

  const handleDelete = () => {
    socket.emit("end_event", { walletID: id, id: selected?.ID });
    setOpen(null);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle >
          <Typography className={classes.title}>
            Kết thúc
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography className={classes.description}>
              Bạn có muốn kết thúc sự kiện đã chọn ?
            </Typography>
            <Typography className={classes.description}>
              Bạn sẽ không thể bắt đầu lại sự kiện khi đã kết thúc.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleClose} variant="contained" >
            Hủy
          </Button>
          <Button className={`${classes.button} ${classes.addButton}`} onClick={handleDelete} variant="contained">
            Kết thúc
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteEvent;

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
  addButton: {
    backgroundColor: '#1DAF1A',
  },
});
