import React, { useContext, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  DialogTitle,
  Typography,
  TextField,
  Button,
  Box,
  makeStyles,
} from '@material-ui/core/';
import {
  PopupContext,
  CategoryContext,
  EventContext
} from '../../mycontext';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import DefaultIcon from '../../../utils/DefaultIcon';
import getValueOfEventType from '../../../utils/defaultEventType';
import { getMaxMoney, getCurrencySymbol } from '../../../utils/currency';
import POPUP from '../../../constants/popup.json';
import { getSocket } from "../../../utils/socket";
import { isValidMonthDay } from '../../../utils/helper';

const NAME = POPUP.EVENT.ADD_EVENT;

export default function AddEvent(props) {
  const classes = useStyles();
  const socket = getSocket();
  const { id } = useParams();
  const { open, setOpen } = useContext(PopupContext);
  const { fullList } = useContext(CategoryContext);
  const { eventTypeList } = useContext(EventContext);
  const isOpen = open === NAME;
  const [step, setStep] = useState(1);
  const [error, setError] = useState({
    Name: false,
    Price: false,
    Description: false,
    StartTime: false,
    Value: false,
  });
  const [type, setType] = useState("Chi");
  const [isEndless, setIsEndless] = useState(true);

  const today = new Date();
  const todayNextYear = new Date();
  todayNextYear.setFullYear(todayNextYear.getFullYear() + 1);
  const initialTime = new Date();
  initialTime.setHours(0, 0, 0, 0);

  const [newEvent, setNewEvent] = useState({
    Name: '',
    StartDate: today,
    EndDate: todayNextYear,
    Value: 0,
    ExpectingAmount: -1000,
    CategoryID: null,
    EventTypeID: null,
    TypeName: '',
    CategoryName: '',
    IconID: '1',
    Description: '',
    StartTime: initialTime,
    Value2: 0
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      clearNewEvent();
    }
  }, [isOpen]);

  useEffect(() => {
    if (fullList && fullList.length !== 0) {
      setNewEvent({
        ...newEvent,
        CategoryID: fullList[0]?.ID
      });
    }
  }, [fullList]);

  useEffect(() => {
    if (eventTypeList && eventTypeList.length !== 0) {
      setNewEvent({
        ...newEvent,
        EventTypeID: eventTypeList[0]?.ID
      });
    }
  }, [eventTypeList]);

  const clearNewEvent = () => {
    setType("Chi");
    setNewEvent({
      Name: '',
      StartDate: today,
      EndDate: todayNextYear,
      Value: 0,
      ExpectingAmount: -1000,
      CategoryID: fullList[0]?.ID,
      EventTypeID: eventTypeList[0]?.ID,
      TypeName: '',
      CategoryName: '',
      IconID: '1',
      Description: '',
      StartTime: initialTime,
      Value2: 0
    });
  }

  const handleCloseAddDialog = () => {
    setOpen(null);
  }

  const handleNextStep = (number) => {
    if (newEvent.Name.trim() === '') {
      setError({
        ...error,
        Name: true
      });
      return;
    }

    if (!moment(newEvent.StartTime, "DD/MM/YYYY - hh:mm:ss A", true).isValid()) {
      setError({
        ...error,
        StartTime: true,
      });
      return;
    }

    if (newEvent.TypeName === "Hằng năm") {
      if (!isValidMonthDay(newEvent.Value, newEvent.Value2)) {
        setError({
          ...error,
          Value: true,
        });
        return;
      }
    }

    setStep(number);
  }

  const handleAdd = () => {
    if (error.Name === true || error.Description === true || error.Price === true
      || error.Value === true || error.StartTime === true) {
      return;
    }

    const newCategory = fullList.find(i => i?.ID === newEvent.CategoryID);
    const newEventType = eventTypeList.find(i => i?.ID === newEvent.EventTypeID);

    newEvent.IconID = newCategory?.IconID;
    newEvent.CategoryName = newCategory?.Name;
    newEvent.TypeName = newEventType?.Name;

    if (isEndless) {
      newEvent.EndDate = null;
    }

    if (newEvent.TypeName === "Hằng năm") {
      newEvent.Value = newEvent.Value * 1000 + newEvent.Value2;
    }

    socket.emit("add_event", { walletID: id, newEvent });
    setOpen(null);
  }

  // event 
  const handleChangeIsEndless = (event) => {
    setIsEndless(event.target.value);
  }

  const handleChangeType = (event) => {
    setType(event.target.value);
    setNewEvent({
      ...newEvent,
      ExpectingAmount: newEvent.ExpectingAmount * (-1),
    });
  }

  const handleChangeEventType = (event) => {
    if (newEvent.EventTypeID !== event.target.value) {
      const selected = eventTypeList.filter(i => i?.ID === event.target.value);
      setNewEvent({
        ...newEvent,
        EventTypeID: event.target.value,
        TypeName: selected[0]?.Name,
        Value: 0,
        Value2: 0
      });

      setError({
        ...error,
        Value: false,
      });
    }
  }

  const handleChangeName = (event) => {
    if (event.target.value !== '') {
      setError({
        ...error,
        Name: false,
      });
    }

    setNewEvent({
      ...newEvent,
      Name: event.target.value
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

    setNewEvent({
      ...newEvent,
      Description: event.target.value
    });
  }

  const handleChange = (event) => {
    setNewEvent({
      ...newEvent,
      [event.target.name]: event.target.value
    });
  }

  const handleChangeValue = (event) => {
    if (newEvent.TypeName === "Hằng năm") {
      if (!isValidMonthDay(event.target.value, newEvent.Value2)) {
        setError({
          ...error,
          Value: true,
        });
      } else {
        setError({
          ...error,
          Value: false,
        });
      }
    }

    setNewEvent({
      ...newEvent,
      Value: event.target.value
    });
  }

  const handleChangeValue2 = (event) => {
    if (newEvent.TypeName === "Hằng năm") {
      if (!isValidMonthDay(newEvent.Value, event.target.value)) {
        setError({
          ...error,
          Value: true,
        });
      } else {
        setError({
          ...error,
          Value: false,
        });
      }
    }

    setNewEvent({
      ...newEvent,
      Value2: event.target.value
    });
  }

  const handleChangeStartTime = (time) => {
    if (moment(time, "DD/MM/YYYY - hh:mm:ss A", true).isValid()) {
      setError({
        ...error,
        StartTime: false,
      });
    } else {
      setError({
        ...error,
        StartTime: true,
      });
    }

    setNewEvent({
      ...newEvent,
      StartTime: time
    });
  }

  const handleChangeEndDate = (time) => {
    setNewEvent({
      ...newEvent,
      EndDate: time
    });
  }

  const handleChangeMoney = (e) => {
    // format money
    const max = getMaxMoney();
    let temp = e.target.value === '' ? '0' : e.target.value;
    temp = temp > max ? max : temp;
    temp = temp < '0' ? '0' : temp;
    if (temp === '0' && !error.Price) {
      setError({
        ...error,
        Price: true,
      });
    }
    if (temp !== '0' && error.Price) {
      setError({
        ...error,
        Price: false,
      });
    }

    setNewEvent({
      ...newEvent,
      ExpectingAmount: type === "Thu" ? temp : temp * -1,
    });
  }

  const valueList = getValueOfEventType(newEvent.TypeName);

  return (
    <Dialog open={isOpen} onClose={handleCloseAddDialog} aria-labelledby="form-dialog-title">
      {step === 1 &&
        <React.Fragment>
          <DialogTitle id="form-dialog-title" >
            <Typography className={classes.title}>
              Thêm sự kiện mới
            </Typography>
          </DialogTitle>
          <DialogContent className={classes.dialog}>
            <Box>
              <TextField
                className={`${classes.textField}`}
                size="small"
                autoFocus
                id="Name"
                name="Name"
                label="Tên sự kiện"
                value={newEvent.Name}
                onChange={handleChangeName}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                variant="outlined"
                error={error?.Name}
                helperText={error?.Name ? "Tên sự kiện không được để trống" : ''}
              />

              <TextField
                className={classes.textField}
                size="small"
                id="EventTypeID"
                name="EventTypeID"
                select
                fullWidth
                label="Loại sự kiện"
                value={newEvent.EventTypeID}
                onChange={handleChangeEventType}
                variant="outlined"
              >
                {(eventTypeList || []).map((type) => (
                  <MenuItem key={type.ID} value={type.ID}>
                    {type.Name}
                  </MenuItem>
                ))}
              </TextField>

              {newEvent.TypeName === "Hằng tuần" &&
                <TextField
                  className={classes.textField}
                  size="small"
                  id="Value"
                  name="Value"
                  select
                  fullWidth
                  value={newEvent.Value}
                  onChange={handleChange}
                  variant="outlined"
                >
                  {(valueList || []).map((type, i) => (
                    <MenuItem key={i} value={i}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              }
              {newEvent.TypeName === "Hằng tháng" &&
                <TextField
                  className={classes.textField}
                  size="small"
                  id="Value"
                  name="Value"
                  select
                  fullWidth
                  value={newEvent.Value}
                  onChange={handleChange}
                  variant="outlined"
                >
                  {(valueList || []).map((type, i) => (
                    <MenuItem key={i} value={i}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              }
              {newEvent.TypeName === "Hằng năm" &&
                <Box className={classes.amountRow}>
                  <TextField
                    className={classes.textField}
                    size="small"
                    id="Value"
                    name="Value"
                    select
                    fullWidth
                    value={newEvent.Value}
                    onChange={handleChangeValue}
                    variant="outlined"
                    error={error?.Value}
                    helperText={error?.Value ? "Ngày lựa chọn không hợp lệ" : ''}
                  >
                    {(valueList.dayList || []).map((type, i) => (
                      <MenuItem key={i} value={i}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    className={classes.textField}
                    size="small"
                    id="Value2"
                    name="Value2"
                    select
                    fullWidth
                    value={newEvent.Value2}
                    onChange={handleChangeValue2}
                    variant="outlined"
                  >
                    {(valueList.monthList || []).map((type, i) => (
                      <MenuItem key={i} value={i}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              }
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  name="StartTime"
                  label="Thời gian tạo"
                  size="small"
                  fullWidth
                  className={classes.textField}
                  style={{ marginRight: '0px' }}
                  value={newEvent.StartTime}
                  onChange={time => handleChangeStartTime(time)}
                  mask="__:__ _M"
                  inputVariant="outlined"
                  error={error?.StartTime}
                  helperText={error?.StartTime ? "Thời gian không hợp lệ" : ''}
                  InputLabelProps={{
                    shrink: true,
                  }} />
              </MuiPickersUtilsProvider>
            </Box>
            <Box className={classes.amountRow}>
              <TextField
                style={{ minWidth: '150px' }}
                className={classes.textField}
                size="small"
                id="isNegative"
                name="isNegative"
                select
                label="Kết thúc"
                value={isEndless}
                onChange={handleChangeIsEndless}
                variant="outlined"
              >
                <MenuItem value={true}>
                  <Box className={classes.typeBox}>
                    Vô tận
                  </Box>
                </MenuItem>
                <MenuItem value={false}>
                  <Box className={classes.typeBox}>
                    Vào lúc
                  </Box>
                </MenuItem>
              </TextField>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="EndDate"
                  size="small"
                  fullWidth
                  className={classes.textField}
                  style={{ marginRight: '0px' }}
                  value={newEvent.EndDate}
                  onChange={time => handleChangeEndDate(time)}
                  onError={console.log}
                  minDate={new Date()}
                  format="dd/MM/yyyy - hh:mm a"
                  inputVariant="outlined"
                  disabled={isEndless}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseAddDialog} variant="contained" >
              Hủy
            </Button>
            <Button className={`${classes.button} ${classes.addButton}`} onClick={() => handleNextStep(2)} variant="contained">
              Tiếp tục
            </Button>

          </DialogActions>
        </React.Fragment>
      }
      {step === 2 &&
        <React.Fragment>
          <DialogTitle id="form-dialog-title" >
            <Typography className={classes.title}>
              Thông tin giao dịch định kì
            </Typography>
          </DialogTitle>
          <DialogContent className={classes.dialog}>
            <Box>
              <Box className={classes.amountRow}>
                <TextField
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
                  style={{ marginRight: '0px' }}
                  size="small"
                  autoFocus
                  id="ExpectingAmount"
                  name="ExpectingAmount"
                  label="Số tiền"
                  value={Math.abs(newEvent.ExpectingAmount)}
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
                  error={error?.Price}
                  helperText={error?.Price ? "Số tiền không được bằng 0" : ''}
                />
              </Box>

              <TextField
                className={classes.textField}
                size="small"
                id="CategoryID"
                name="CategoryID"
                select
                label="Hạng mục"
                value={newEvent.CategoryID}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              >
                {(fullList || []).map((cat) => (
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
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button className={`${classes.button} ${classes.closeButton}`} onClick={() => handleNextStep(1)} variant="contained" >
              Trở về
            </Button>
            <Button className={`${classes.button} ${classes.addButton}`} onClick={handleAdd} variant="contained">
              Thêm
            </Button>
          </DialogActions>
        </React.Fragment>
      }
    </Dialog>
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
  subTitle: {
    fontSize: '20px',
    marginTop: '10px',
    marginBottom: '5px'
  },
  dialog: {
    minWidth: '500px'
  },
  amountRow: {
    display: 'flex',
  },
  textField: {
    margin: '10px 10px 15px 0px'
  },
  checkBox: {
    marginBottom: '0px'
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
