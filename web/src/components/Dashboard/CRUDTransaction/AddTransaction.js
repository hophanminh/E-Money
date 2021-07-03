import React, { useContext, useState, useEffect } from 'react';
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
import {
  WalletContext,
  PopupContext,
  CategoryContext,
  EventContext
} from '../../mycontext'
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import NumberFormat from 'react-number-format';
import config from '../../../constants/config.json';
import DefaultIcon from '../../../utils/DefaultIcon';
import { getMaxMoney, getCurrencySymbol } from '../../../utils/currency';
import { getSocket } from "../../../utils/socket";
import POPUP from '../../../constants/popup.json';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import SnackBar from '../../snackbar/SnackBar';
const API_URL = config.API_LOCAL;
const NAME = POPUP.TRANSACTION.ADD_TRANSACTION

export default function AddTransaction(props) {
  const classes = useStyles();
  const socket = getSocket();
  const { walletID, setSelected } = useContext(WalletContext);
  const { open, setOpen } = useContext(PopupContext);
  const { fullList } = useContext(CategoryContext);
  const { eventList } = useContext(EventContext);
  const [files, setFiles] = useState([]);
  const isOpen = open === NAME;

  const [type, setType] = useState("Chi");
  const [error, setError] = useState({
    Description: false,
  })

  const [newTransaction, setNewTransaction] = useState({
    price: -1000,
    time: new Date(),
    catID: 0,
    eventID: 0,
    description: "",
    IconID: "",
    categoryName: "",
    eventName: "",
  })

  const [showSnackbar, setShowSnackBar] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (fullList && fullList.length !== 0) {
      setNewTransaction({
        ...newTransaction,
        catID: fullList[0]?.ID
      })
    }
  }, [fullList]);

  const clearNewTransaction = () => {
    setType("Chi");
    setNewTransaction({
      price: -1000,
      time: new Date(),
      catID: fullList?.length !== 0 ? fullList[0]?.ID : 0,
      eventID: 0,
      description: "",
      IconID: "",
      categoryName: "",
      eventName: "",
    })
  }

  const handleCloseAddDialog = () => {
    setOpen(null);
    clearNewTransaction();
    setFiles([]);
  }

  const handleAdd = () => {
    if (error.Description === true) {
      return;
    }

    const newCategory = fullList.find(i => i.ID === newTransaction.catID);
    const newEvent = eventList.find(i => i.ID === newTransaction.eventID);

    newTransaction.IconID = newCategory?.IconID;
    newTransaction.categoryName = newCategory?.Name;
    newTransaction.eventName = newEvent?.name;
    newTransaction.catID = newTransaction?.catID !== 0 ? newTransaction?.catID : null
    newTransaction.eventID = newTransaction?.eventID !== 0 ? newTransaction?.eventID : null

    socket.emit("add_transaction", { walletID, newTransaction }, async ({ ID }) => {

      if (files.length === 0) {
        return;
      }

      const token = window.localStorage.getItem('jwtToken');
      const data = new FormData();
      files.forEach(file => {
        data.append('images', file.file);
      });

      const res = await fetch(`${API_URL}/transaction-images?transactionID=${ID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data,
      });

      if (res.status === 200) {
        const result = await res.json();
        // setImages(images.slice().concat(result.urls));
        socket.emit('add_transaction_image', { transactionID: ID, urls: result.urls });
      } else { // 400, etc...
        const result = await res.json();
        setContent(result.msg);
        setShowSnackBar(true);
      }
    });

    setOpen(null);
    clearNewTransaction();
    setFiles([]);
  }

  // transaction 

  const handleChangeType = (event) => {
    setType(event.target.value);
    setNewTransaction({
      ...newTransaction,
      price: newTransaction.price * (-1),
    });
  }

  const handleChangeDes = (event) => {
    if (event.target.value?.length > 500 && !error.Description) {
      setError({
        ...error,
        Description: true,
      });
    }
    if (event.target.value?.length <= 500 && error.Description) {
      setError({
        ...error,
        Description: false,
      });
    }

    setNewTransaction({
      ...newTransaction,
      description: event.target.value
    });
  }

  const handleChange = (event) => {
    setNewTransaction({
      ...newTransaction,
      [event.target.name]: event.target.value
    });
  }
  const handleChangeTime = (time) => {
    setNewTransaction({
      ...newTransaction,
      time: time
    });
  }

  const handleChangeMoney = (e) => {
    // format money
    const max = getMaxMoney();
    let temp = e.target.value === '' ? 0 : e.target.value;
    temp = temp > max ? max : temp;
    temp = temp < 0 ? 0 : temp;

    setNewTransaction({
      ...newTransaction,
      price: type === "Thu" ? temp : temp * -1,
    });

  }

  const handleAddImg = newFiles => {
    newFiles = newFiles.filter(file => !files.find(f => f.data === file.data));
    setFiles([...files, ...newFiles]);
  };

  const handleDeleteImg = deleted => {
    setFiles(files.filter(f => f !== deleted));
  };

  return (
    <>
      <SnackBar open={showSnackbar} setOpen={(isOpen) => setShowSnackBar(isOpen)} content={content} />
      <Dialog open={isOpen} onClose={handleCloseAddDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" >
          <Typography className={classes.title}>
            Thêm khoản giao dịch mới
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
                select
                label=""
                value={type}
                onChange={handleChangeType}
                variant="outlined"
              >
                <MenuItem value={"Chi"}>
                  <Box className={`${classes.typeBox} ${classes.type2Text}`}>
                    Chi
                </Box>
                </MenuItem>
                <MenuItem value={"Thu"}>
                  <Box className={`${classes.typeBox} ${classes.type1Text}`}>
                    Thu
                </Box>
                </MenuItem>
              </TextField>

              <TextField
                className={`${classes.textField}`}
                size="small"
                autoFocus
                id="price"
                name="price"
                label="Số tiền *"
                value={Math.abs(newTransaction.price)}
                onChange={e => handleChangeMoney(e)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  className: type === "Thu" ? classes.type1Text : classes.type2Text,
                  endAdornment:
                    <Typography>{getCurrencySymbol()}</Typography>
                }}
                fullWidth
                variant="outlined"
              />
            </Box>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDateTimePicker
                name="time"
                size="small"
                className={classes.textField}
                value={newTransaction.time}
                onChange={time => handleChangeTime(time)}
                label="Thời gian *"
                onError={console.log}
                maxDate={new Date()}
                format="dd/MM/yyyy - hh:mm a"
                inputVariant="outlined"
              />
            </MuiPickersUtilsProvider>

            <TextField
              className={classes.textField}
              size="small"
              id="category"
              name="catID"
              select
              label="Hạng mục"
              value={newTransaction ? newTransaction.catID : 0}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            >
              {fullList && fullList.map((cat) => (
                <MenuItem key={cat.ID} value={cat.ID}>
                  <Box className={classes.categoryIconBox}>
                    <DefaultIcon
                      IconID={cat.IconID}
                      backgroundSize={24}
                      iconSize={14} />
                    <Typography className={classes.iconText}>
                      {cat.Name}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              {(!fullList || fullList.length === 0) &&
                <MenuItem value={0}>
                  Không tìm thấy hạng mục
              </MenuItem>
              }
            </TextField>
            <TextField
              className={classes.textField}
              size="small"
              id="event"
              name="eventID"
              select
              label="Sự kiện"
              value={newTransaction ? newTransaction?.eventID : 0}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem key={0} value={0}>
                Không có
            </MenuItem>
              {(eventList || []).filter(i => i.Status === 1).map((event) => (
                <MenuItem key={event.ID} value={event.ID}>
                  {event.Name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="description"
              size="small"
              className={classes.textField}
              value={newTransaction.description}
              onChange={handleChangeDes}
              id="outlined-multiline-static"
              label="Mô tả"
              multiline
              rows={7}
              fullWidth
              variant="outlined"
              error={error?.Description}
              helperText={error?.Description ? "Mô tả không được quá 500 ký tự" : ''}

            />
            <DropzoneAreaBase
              fileObjects={files}
              dropzoneText="Chọn hoặc kéo thả ảnh từ thiết bị vào đây"
              acceptedFiles={['image/jpeg', 'image/png', 'image/gif']}
              showPreviewsInDropzone={true}
              showPreviews={false}
              showAlerts={true}
              filesLimit={5}
              maxFileSize={10000000}
              onAdd={handleAddImg}
              onDelete={handleDeleteImg}
              dropzoneParagraphClass="dropzone-text"
              // dropzoneClass="dropzone-height"
              previewGridClasses={{ image: "dropzone-height" }}
            />
            <Typography style={{ marginTop: '5px', fontStyle: 'italic' }}><b>*</b> Sau khi tạo giao dịch, hình ảnh cần mất vài giây để hiển thị</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseAddDialog} variant="contained" >
            Hủy
        </Button>
          <Button className={`${classes.button} ${classes.addButton}`} disabled={!isOpen} onClick={handleAdd} variant="contained">
            Thêm
        </Button>

        </DialogActions>
      </Dialog>
    </>
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
    width: '100%'
  },
  textField: {
    margin: '10px 0px 15px 0px'
  },

  typeBox: {
    padding: '0px 15px 0px 0px',
  },
  type1Text: {
    color: '#1DAF1A'
  },
  type2Text: {
    color: '#FF2626'
  },

  categoryIconBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '0px 10px 0px 10px',
  },
  iconText: {
    marginLeft: '10px',
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
