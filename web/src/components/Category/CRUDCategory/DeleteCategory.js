import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
} from '@material-ui/core/';


export default function DeleteCategory({ open, setOpen, data, deleteList }) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        deleteList(data.id)
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
                <DialogTitle id="alert-dialog-title">Xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có muốn xóa loại giao dịch đã chọn ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
