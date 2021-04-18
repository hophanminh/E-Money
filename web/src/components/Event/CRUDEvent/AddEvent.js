import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  DialogTitle,
  Typography,
  TextField,
  Avatar,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  makeStyles,
} from '@material-ui/core/';
import moment from 'moment'
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import NumberFormat from 'react-number-format';

import DefaultIcon from '../../../utils/DefaultIcon'
import getValueOfEventType from '../../../utils/defaultEventType'
import { getMaxMoney, getCurrencySymbol } from '../../../utils/currency'

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

  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px',
    marginBottom: '10px'
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

const fakeEvent = []

export default function AddEvent({ categoryList, eventTypeList, open, setOpen, addList }) {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [list, setList] = useState(categoryList);
  const [typeList, setTypeList] = useState(eventTypeList);

  const [error, setError] = useState({
    Name: false,
    Description: false,
  })
  const [type, setType] = useState("Chi");
  const [isEndless, setIsEndless] = useState(true);

  const today = new Date();
  const todayNextYear = new Date();
  todayNextYear.setFullYear(todayNextYear.getFullYear() + 1);

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
    Description: ''
  })

  useEffect(() => {
    if (open) {
      setStep(1);
      clearNewEvent();
    }
  }, [open]);

  useEffect(() => {
    if (categoryList && categoryList.length !== 0) {
      setList(categoryList);
      setNewEvent({
        ...newEvent,
        CategoryID: categoryList[0]?.ID
      })
    }
  }, [categoryList]);

  useEffect(() => {
    if (eventTypeList && eventTypeList.length !== 0) {
      setTypeList(eventTypeList);
      setNewEvent({
        ...newEvent,
        EventTypeID: eventTypeList[0]?.ID
      })
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
      CategoryID: list[0]?.ID,
      EventTypeID: typeList[0]?.ID,
      TypeName: '',
      CategoryName: '',
      IconID: '1',
      Description: ''
    })
  }

  const handleCloseAddDialog = () => {
    setOpen(false);
  }

  const handleNextStep = (number) => {
    if (newEvent.Name.trim() === '') {
      setError({
        ...error,
        Name: true
      });
      return;
    }

    setStep(number);
  }

  const handleAdd = () => {
    if (error.Name === true || error.Description === true) {
      return;
    }
    const newCategory = list.find(i => i?.ID === newEvent.CategoryID);
    const newEventType = typeList.find(i => i?.ID === newEvent.EventTypeID);

    newEvent.IconID = newCategory?.IconID;
    newEvent.CategoryName = newCategory?.Name;
    newEvent.TypeName = newEventType?.Name;

    if (isEndless) {
      newEvent.EndDate = null;
    }
    console.log(newEvent)
    addList(newEvent);
    //setOpen(false);
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
      const selected = typeList.filter(i => i?.ID === event.target.value);
      setNewEvent({
        ...newEvent,
        EventTypeID: event.target.value,
        TypeName: selected[0]?.Name,
        Value: 0
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

  const handleChangeEndDate = (time) => {
    setNewEvent({
      ...newEvent,
      EndDate: time
    });
  }

  const handleChangeMoney = (e) => {
    // format money
    const max = getMaxMoney();
    let temp = e.target.value === '' ? 0 : e.target.value;
    temp = temp > max ? max : temp;
    temp = temp < 0 ? 0 : temp;

    setNewEvent({
      ...newEvent,
      ExpectingAmount: type === "Thu" ? temp : temp * -1,
    });

  }

  const valueList = getValueOfEventType(newEvent.TypeName);

  return (
    <Dialog open={open} onClose={handleCloseAddDialog} aria-labelledby="form-dialog-title">
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
                {(typeList || []).map((type) => (
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
              <Box className={classes.buttonBox}>
                <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseAddDialog} variant="contained" >
                  Hủy
                </Button>
                <Button className={`${classes.button} ${classes.addButton}`} onClick={() => handleNextStep(2)} variant="contained">
                  Tiếp tục
                </Button>
              </Box>

            </Box>
          </DialogContent>
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
                {(list || []).map((cat) => (
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

              <TextField
                name="Description"
                size="small"
                className={classes.textField}
                value={newEvent.Description}
                onChange={handleChangeDes}
                id="outlined-multiline-static"
                label="Mô tả"
                multiline
                rows={10}
                fullWidth
                variant="outlined"
                error={error?.Description}
                helperText={error?.Description ? "Mô tả không được quá 500 ký tự" : ''}
              />

              <Box className={classes.buttonBox}>
                <Button className={`${classes.button} ${classes.closeButton}`} onClick={() => handleNextStep(1)} variant="contained" >
                  Trở về
                </Button>
                <Button className={`${classes.button} ${classes.addButton}`} onClick={handleAdd} variant="contained">
                  Thêm
                </Button>
              </Box>

            </Box>
          </DialogContent>
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
