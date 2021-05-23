import React, { useContext, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
    Typography,
    Dialog,
    DialogTitle,
    Box,
    DialogContent,
    DialogContentText,
    Button,
    makeStyles,
    DialogActions
} from '@material-ui/core/';
import {
    PopupContext,
    CategoryContext
} from '../../mycontext'
import POPUP from '../../../constants/popup.json'
import { getSocket } from "../../../utils/socket";

const NAME = POPUP.CATEGORY.DELETE_CATEGORY

const DeleteCategory = (props) => {
    const classes = useStyles();
    const socket = getSocket();
    const { id } = useParams();
    const { open, setOpen } = useContext(PopupContext);
    const { selected } = useContext(CategoryContext);

    const isOpen = open === NAME

    const handleClose = () => {
        setOpen(null);
    };

    const handleDelete = () => {
        socket.emit("delete_category_default", { id: selected?.ID });
        setOpen(null);
    };

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle >
                    <Typography className={classes.title}>
                        Xóa
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography className={classes.description}>
                        Bạn có muốn xóa loại đã chọn ?
                        </Typography>
                    <Typography className={classes.description}>
                        Những giao dịch của loại này sẽ tự động đổi sang loại mặc định "Khác"
                        </Typography>
                </DialogContent>
                <DialogActions>
                    <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleClose} variant="contained" >
                        Hủy
                        </Button>
                    <Button className={`${classes.button} ${classes.addButton}`} onClick={handleDelete} variant="contained">
                        Xóa
                        </Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}
export default DeleteCategory
const useStyles = makeStyles({
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '-15px'
    },
    description: {
        fontSize: '18px',
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
