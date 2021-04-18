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
    type1Text: {
        color: '#1DAF1A'
    },
    type2Text: {
        color: '#FF2626'
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
});

const fakeEvent = [];

export default function InfoEvent({ data, open, setOpen }) {
    const classes = useStyles();
    const [type, setType] = useState("Chi");
    const [transactionEvent, setTransactionEvent] = useState(data);

    useEffect(() => {
        if (data) {
            console.log(data)
            setTransactionEvent(data)
            setType(data?.ExpectingAmount >= 0 ? "Thu" : "Chi");
        }
    }, [data, open])

    const handleCloseEditDialog = () => {
        setOpen(false);
    }

    return (
        <React.Fragment>
            {transactionEvent &&
                <Dialog open={open} onClose={handleCloseEditDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title" >
                        <Typography className={classes.title}>
                            Khoản giao dịch dự kiến
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
                                    value={Math.abs(transactionEvent?.ExpectingAmount)}
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
                                value={moment(transactionEvent?.NextDate).format("DD/MM/YYYY")}
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
                                value={" " + transactionEvent?.CategoryName}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                    startAdornment:
                                        <DefaultIcon
                                            IconID={transactionEvent?.IconID}
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
                                value={transactionEvent?.Name}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}

                            >
                            </TextField>

                            <TextField
                                name="description"
                                className={classes.textField}
                                size="small"
                                value={transactionEvent?.Description}
                                id="outlined-multiline-static"
                                label="Mô tả"
                                multiline
                                rows={10}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <Box className={classes.buttonBox}>
                                <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseEditDialog} variant="contained" >
                                    Đóng
                        </Button>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
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
