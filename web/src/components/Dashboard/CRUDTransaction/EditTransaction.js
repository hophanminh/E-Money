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
    editButton: {
        backgroundColor: '#1DAF1A',
    },
});

const fakeCategory = [{
    id: 1,
    avatar: "food",
    categoryName: 'Ăn uống',
    check: true
},
{
    id: 2,
    avatar: "book",
    categoryName: 'Học tập',
    check: true
},
{
    id: 3,
    avatar: "food",
    categoryName: 'Ăn uống',
    check: true
},
{
    id: 4,
    avatar: "book",
    categoryName: 'Ăn vặt',
    check: true
},
]
const fakeEvent = [{
    id: 0,
    name: "Không có"
},
{
    id: 1,
    name: "Tổng kết học kì 1"
},
{
    id: 2,
    name: "Tiền lương hàng tháng"
},
{
    id: 3,
    name: "Tiền điện"
},
]

export default function EditTransaction({ data, setData, open, setOpen }) {
    const classes = useStyles();
    const [newTransaction, setNewTransaction] = useState(data);
    useEffect(() => {
        setNewTransaction(data)
    }, [data])

    const clearNewTransaction = () => {
        setNewTransaction(data)
    }

    const handleCloseEditDialog = () => {
        setOpen(false);
        clearNewTransaction();
    }
    const handleEdit = () => {

        const newCategory = fakeCategory.find(i => i.id === newTransaction.catID);
        const newEvent = fakeEvent.find(i => i.id === newTransaction.eventID);

        newTransaction.avatar = newCategory.avatar;
        newTransaction.categoryName = newCategory.categoryName;
        newTransaction.eventName = newEvent.name;

        setData(newTransaction);
        setOpen(false);
    }

    // transaction 


    const handleChange = (event) => {
        setNewTransaction({
            ...newTransaction,
            [event.target.name]: event.target.value
        });
        console.log(newTransaction)
    }
    const handleChangeTime = (time) => {
        setNewTransaction({
            ...newTransaction,
            time: time
        });
    }

    return (
        <Dialog open={open} onClose={handleCloseEditDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" >
                <Typography className={classes.title}>
                    Thay đổi khoản chi tiêu
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
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
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
                        <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseEditDialog} variant="contained" >
                            Hủy
                        </Button>
                        <Button className={`${classes.button} ${classes.editButton}`} onClick={handleEdit} variant="contained">
                            Thay đổi
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
}