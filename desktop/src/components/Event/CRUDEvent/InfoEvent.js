import React, { useContext, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  MenuItem,
  DialogTitle,
  Typography,
  TextField,
  Avatar,
  Button,
  Box,
  makeStyles,
  DialogActions,
} from '@material-ui/core/';
import moment from 'moment'
import NumberFormat from 'react-number-format';

import DefaultIcon from '../../../utils/DefaultIcon'
import { getMaxMoney, getCurrencySymbol } from '../../../utils/currency'
import {
  PopupContext,
  EventContext
} from '../../mycontext'
import POPUP from '../../../constants/popup.json'
import { getSocket } from "../../../utils/socket";

const NAME = POPUP.EVENT.INFO_EVENT

export default function InfoEvent(props) {
  const classes = useStyles();
  const socket = getSocket();
  const { id } = useParams();
  const { open, setOpen } = useContext(PopupContext);
  const { selected } = useContext(EventContext);

  const isOpen = open === NAME

  const type = selected?.ExpectingAmount >= 0 ? "Thu" : "Chi";

  const handleCloseEditDialog = () => {
    setOpen(null);
  }

  return (
    <React.Fragment>
      {selected &&
        <Dialog open={isOpen} onClose={handleCloseEditDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" >
            <Typography className={classes.title}>
              Khoản giao dịch dự kiến
                </Typography>
          </DialogTitle>
          <DialogContent>
            <Box>
              <Box className={classes.amountRow}>
                <TextField
                  style={{ marginRight: '10px' }}
                  className={classes.textField}
                  size="small"
                  id="isNegative"
                  name="isNegative"
                  label=""
                  value={type}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    className: type === "Thu" ? classes.type1Text : classes.type2Text,
                  }}
                >
                  {type}
                </TextField>

                <TextField
                  className={`${classes.textField}`}
                  size="small"
                  autoFocus
                  id="price"
                  name="price"
                  label="Số tiền *"
                  value={Math.abs(selected?.ExpectingAmount) || ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                    inputComponent: NumberFormatCustom,
                    className: type === "Thu" ? classes.type1Text : classes.type2Text,
                    endAdornment:
                      <Typography>{getCurrencySymbol()}</Typography>
                  }}
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <TextField
                name="time"
                size="small"
                className={classes.textField}
                value={moment(selected?.NextDate).format("DD/MM/YYYY - HH:mm") || ''}
                label="Thời gian *"
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              >
              </TextField>

              <TextField
                className={classes.textField}
                size="small"
                id="category"
                name="CategoryID"
                label="Hạng mục"
                value={" " + selected?.CategoryName}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  startAdornment:
                    <DefaultIcon
                      IconID={selected?.IconID}
                      backgroundSize={24}
                      iconSize={14} />
                }}

              >
              </TextField>
              <TextField
                className={classes.textField}
                size="small"
                id="event"
                name="eventID"
                label="Sự kiện"
                value={selected?.Name || ''}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}

              >
              </TextField>

              {/* <TextField
                                name="description"
                                className={classes.textField}
                                size="small"
                                value={selected?.Description || ''}
                                id="outlined-multiline-static"
                                label="Mô tả"
                                multiline
                                rows={10}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                            /> */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseEditDialog} variant="contained" >
              Đóng
                        </Button>

          </DialogActions>
        </Dialog>
      }
    </React.Fragment>
  );
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}
const useStyles = makeStyles({
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '-10px'
  },
  amountRow: {
    display: 'flex',
  },
  textField: {
    margin: '10px 0px 15px 0px'
  },
  type1Text: {
    color: '#1DAF1A'
  },
  type2Text: {
    color: '#FF2626'
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
});
