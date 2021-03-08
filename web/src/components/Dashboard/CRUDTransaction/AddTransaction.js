import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  DialogTitle,
  Typography,
  TextField,
  Avatar,
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

import DefaultIcon from '../../../utils/DefaultIcon'
// import currency from 'currency.js'

const useStyles = makeStyles({
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '-10px'
  },
  textField: {
    margin: '20px 0px'
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
    justifyContent: 'flex-end'
  },
  button: {
    borderRadius: '4px',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: '20px',
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

const fakeCategory = [{
  id: '1',
  avatar: "food",
  categoryName: 'Ăn uống',
  check: true
},
{
  id: '2',
  avatar: "book",
  categoryName: 'Học tập',
  check: true
},
]
const fakeEvent = []

export default function AddTransaction({ open, setOpen, addList }) {
  const classes = useStyles();
  const [newTransaction, setNewTransaction] = useState({
    price: 1000,
    time: new Date(),
    catID: '1',
    eventID: 0,
    description: "",
    avatar: "",
    categoryName: "",
    eventName: "",
  })

  const clearNewTransaction = () => {
    setNewTransaction({
      price: 1000,
      time: new Date(),
      catID: '1',
      eventID: 0,
      description: "",
      avatar: "",
      categoryName: "",
      eventName: "",
    })
  }

  const handleCloseAddDialog = () => {
    setOpen(false);
    clearNewTransaction();
  }
  const handleAdd = () => {
    const newCategory = fakeCategory.find(i => i.id === newTransaction.catID);
    const newEvent = fakeEvent.find(i => i.id === newTransaction.eventID);

    newTransaction.avatar = newCategory.avatar;
    newTransaction.categoryName = newCategory.categoryName;
    newTransaction.eventName = newEvent ? newEvent.name : null;

    addList(newTransaction);
    setOpen(false);
    clearNewTransaction();
  }

  // transaction 


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
    const max = 999999999;
    const min = -999999999;
    let temp = Number(e.target.value) > 999999999 ? 999999999 : e.target.value;
    temp = Number(e.target.value) < -999999999 ? -999999999 : temp;
    setNewTransaction({
      ...newTransaction,
      price: temp
    });
  }

  return (
    <Dialog open={open} onClose={handleCloseAddDialog} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" >
        <Typography className={classes.title}>
          Thêm khoản chi tiêu mới
                </Typography>
      </DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            className={classes.textField}
            autoFocus
            id="price"
            name="price"
            label="Số tiền *"
            type="number"
            value={newTransaction.price}
            onChange={e => handleChangeMoney(e)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            inputProps={{ max: 12 }}
            variant="outlined"
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              name="time"
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
            id="category"
            name="catID"
            select
            label="Hạng mục"
            value={newTransaction.catID}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          >
            {fakeCategory.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Box className={classes.categoryIconBox}>
                  <DefaultIcon
                    avatar={cat.avatar}
                    backgroundSize={40}
                    iconSize={20} />
                  <Typography className={classes.iconText}>
                    {cat.categoryName}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className={classes.textField}
            id="event"
            name="eventID"
            select
            label="Sự kiện"
            value={newTransaction.eventID}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          >
            <MenuItem key={0} value={0}>
              Không có
                        </MenuItem>
            {fakeEvent.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            name="description"
            className={classes.textField}
            value={newTransaction.description}
            onChange={handleChange}
            id="outlined-multiline-static"
            label="Mô tả"
            multiline
            rows={10}
            fullWidth
            variant="outlined"
          />

          <Box className={classes.buttonBox}>
            <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseAddDialog} variant="contained" >
              Hủy
                        </Button>
            <Button className={`${classes.button} ${classes.addButton}`} onClick={handleAdd} variant="contained">
              Thêm
                        </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
}