import React, { useContext } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  DialogContentText,
  Button,
  makeStyles,
  DialogActions
} from '@material-ui/core/';
import {
  WalletContext,
  PopupContext
} from '../../mycontext'
import { getSocket } from "../../../utils/socket";
import POPUP from '../../../constants/popup.json'

const NAME = POPUP.TRANSACTION.DELETE_TRANSACTION

export default function DeleteTransaction(props) {
  const classes = useStyles();
  const socket = getSocket();
  const { walletID, selected } = useContext(WalletContext);
  const { open, setOpen } = useContext(PopupContext);
  const isOpen = open === NAME;
  const data = selected;

  const handleClose = () => {
    setOpen(null);
  };

  const handleDelete = () => {
    socket.emit("delete_transaction", { walletID, id: data?.id });
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
            Xóa
                    </Typography>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography className={classes.description}>
              Bạn có muốn xóa khoản giao dịch đã chọn ?
                            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleClose} variant="contained" >
            Hủy
                    </Button>
          <Button className={`${classes.button} ${classes.addButton}`} onClick={handleDelete} variant="contained">
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
  addButton: {
    backgroundColor: '#1DAF1A',
  },
});
