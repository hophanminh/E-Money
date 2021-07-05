import React from 'react';
import Typography from '@material-ui/core/Typography';
import { SnackbarContent } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Palette from '../../constants/palette.json';

export default function InformationSnackbar({ open, setOpen, content }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent
          message={<Typography>{content}</Typography>}
          style={{ alignContent: "center", backgroundColor: Palette.secondary }}
        />
      </Snackbar>
    </div>
  );
}
