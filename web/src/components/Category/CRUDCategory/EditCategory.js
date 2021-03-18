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

import DefaultIcon, { getListIcon } from '../../../utils/DefaultIcon'

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
        justifyContent: 'center',
        width: '100%',
        paddingRight: '20px'
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

export default function EditCategory({ data, updateList, open, setOpen }) {
    const classes = useStyles();
    const [list, setList] = useState();
    const [newCategory, setNewCategory] = useState(data);

    // get list of icon
    useEffect(async () => {
        const temp = await getListIcon();
        setList(temp);
    }, []);

    // set data
    useEffect(() => {
        if (data) {
            setNewCategory(data)
        }
    }, [data])

    const clearNewCategory = () => {
        setNewCategory(data)
    }

    const handleCloseEditDialog = () => {
        setOpen(false);
        clearNewCategory();
    }

    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');
    const handleEdit = () => {
        if (!newCategory.Name || newCategory.Name.trim() === '') {
            setHelperText("Tên không được để trống");
            setError(true);
        }
        else {
            newCategory.Name = newCategory.Name.trim();
            updateList(newCategory);
            setOpen(false);
        }
    }

    // category 
    const handleChange = (event) => {
        setNewCategory({
            ...newCategory,
            [event.target.name]: event.target.value
        });
    }

    return (
        <React.Fragment>
            { newCategory &&
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
                                    id="IconID"
                                    name="IconID"
                                    select
                                    label="Icon"
                                    value={newCategory.IconID}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    {list && list.map((icon) => (
                                        <MenuItem key={icon.ID} value={icon.ID}>
                                            <Box className={classes.categoryIconBox}>
                                                <DefaultIcon
                                                    IconID={icon.ID}
                                                    backgroundSize={24}
                                                    iconSize={14} />
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    className={`${classes.textField}`}
                                    size="small"
                                    autoFocus
                                    id="Name"
                                    name="Name"
                                    label="Tên *"
                                    value={newCategory.Name}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    error={error}
                                    helperText={error ? helperText : ''}
                                />

                            </Box>


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
            }
        </React.Fragment>
    );
}