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
import NumberFormat from 'react-number-format';

import DefaultIcon from '../../../utils/DefaultIcon'
import { getMaxMoney, getCurrencySymbol } from '../../../utils/currency'

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
        margin: '10px 10px 15px 0px'
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
        justifyContent: 'flex-end'
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
    editButton: {
        backgroundColor: '#1DAF1A',
    },
});

const fakeEvent = [];

export default function EditTransaction({ categoryList, data, updateList, open, setOpen }) {
    const classes = useStyles();
    const [list, setList] = useState(categoryList);
    const [type, setType] = useState("Chi");
    const [newTransaction, setNewTransaction] = useState(data);

    useEffect(() => {
        if (data) {
            setNewTransaction(data)
            setType(data.price >= 0 ? "Thu" : "Chi");
        }
    }, [data])

    useEffect(() => {
        setList(categoryList);
    }, [categoryList]);

    const clearNewTransaction = () => {
        setType(data.price >= 0 ? "Thu" : "Chi");
        setNewTransaction(data)
    }

    const handleCloseEditDialog = () => {
        setOpen(false);
        clearNewTransaction();
    }
    const handleEdit = () => {
        const newCategory = list.find(i => i.ID === newTransaction.catID);
        const newEvent = fakeEvent.find(i => i.id === newTransaction.eventID);

        const temp = newTransaction;
        temp.IconID = newCategory.IconID;
        temp.categoryName = newCategory.Name;
        temp.eventName = newEvent ? newEvent.name : null;
        updateList(temp);
        setOpen(false);
    }

    // transaction 
    const handleChangeType = (event) => {
        setType(event.target.value);
        setNewTransaction({
            ...newTransaction,
            price: newTransaction.price * (-1),
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

    return (
        <Dialog open={open} onClose={handleCloseEditDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" >
                <Typography className={classes.title}>
                    Thay đổi khoản giao dịch
                </Typography>
            </DialogTitle>
            <DialogContent>
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
                        value={newTransaction.catID}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    >
                        {list && list.map((cat) => (
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
                        className={classes.textField}
                        size="small"
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
                        size="small"
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
                        <Button className={`${classes.button} ${classes.editButton}`} disabled={!open} onClick={handleEdit} variant="contained">
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
