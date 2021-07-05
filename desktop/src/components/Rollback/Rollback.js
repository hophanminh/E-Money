import React, { useContext, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  makeStyles,
  DialogActions,
} from '@material-ui/core/';
import {
  PopupContext,
  WalletContext
} from '../mycontext';
import POPUP from '../../constants/popup.json';
import { getSocket } from "../../utils/socket";
import RollbackTransaction from './RollbackTransaction';
import RollbackList from './RollbackList';

const NAME = POPUP.TRANSACTION.ROLLBACK_TRANSACTION;

export default function Rollback(props) {
  const classes = useStyles();
  const socket = getSocket();
  const { open, setOpen } = useContext(PopupContext);
  const { walletID, selected } = useContext(WalletContext);
  const isOpen = open === NAME;

  const [step, setStep] = useState(1);
  const [versionList, setVersionList] = useState([]);
  const [version, setVersion] = useState();

  useEffect(() => {
    if (isOpen) {
      socket.emit("get_history_transaction", { walletID: walletID, transactionID: selected?.id }, ({ historyList }) => {
        setVersionList(historyList);
      });
      setStep(1);
    }
  }, [isOpen]);

  const handleCloseRollbackDialog = () => {
    setOpen(null);
  }

  const handleGoBback = () => {
    setStep(1);
  }

  const handleRestore = (newTransaction) => {
    socket.emit("restore_transaction", { walletID: walletID, transactionID: selected?.id, newTransaction: newTransaction });
    setOpen(null);
  }

  return (
    <React.Fragment>
      {selected &&
        <Dialog maxWidth={step === 1 ? "md" : 'sm'} open={isOpen} onClose={handleCloseRollbackDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" >
            <Typography className={classes.title}>
              Lịch sử thay đổi
            </Typography>
          </DialogTitle>
          <DialogContent>
            <div style={{ display: step === 1 ? '' : 'none' }}>
              <RollbackList versionList={versionList} setVersion={setVersion} setStep={setStep} handleRestore={handleRestore} />
            </div>
            <div style={{ display: step === 2 ? '' : 'none' }}>
              <RollbackTransaction version={version} />
            </div>
          </DialogContent>
          <DialogActions>
            {step === 1
              ?
              <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseRollbackDialog} variant="contained" >
                Đóng
              </Button>
              :
              <>
                <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleGoBback} variant="contained" >
                  Trở về
                </Button>
                {versionList.findIndex(i => i.ID === version.ID) !== 0 &&
                  <Button className={`${classes.button} ${classes.infoButton}`} onClick={() => handleRestore(version)} variant="contained" >
                    Phục hồi
                  </Button>
                }
              </>
            }
          </DialogActions>
        </Dialog>
      }
    </React.Fragment>
  );
}

const useStyles = makeStyles({
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '-10px'
  },
  button: {
    borderRadius: '4px',
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: '5px 40px',
    marginLeft: '20px'
  },
  infoButton: {
    backgroundColor: '#1DAF1A',
  },
  closeButton: {
    backgroundColor: '#F50707',
  },
});
