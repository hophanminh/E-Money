import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
} from '@material-ui/core/';


const DeleteEvent = ({ open, setOpen, data, deleteList }) => {
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        deleteList(data.ID)
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Kết thúc</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có muốn kết thúc sự kiện này ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Kết thúc
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteEvent