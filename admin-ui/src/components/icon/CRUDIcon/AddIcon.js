import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Button,
  makeStyles,
} from '@material-ui/core/';
import { Autocomplete } from '@material-ui/lab';
import { ColorPicker } from 'material-ui-color';
import TemplateIcon from '../TemplateIcon';
import { ICON_NAMES } from '../../../constants/default.json';
import { getSocket } from '../../../utils/socket';

export default function AddIconAdmin({ isOpen, setOpen }) {
  const classes = useStyles();
  const socket = getSocket();

  const [newIcon, setNewIcon] = useState({
    name: 'school',
    color: '#FFFFFF',
    backgroundColor: '#AAAAAA'
  });
  const [isError, setIsError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const clearNewIcon = () => {
    setNewIcon({
      name: 'school',
      color: '#FFFFFF',
      backgroundColor: '#AAAAAA'
    });
  }

  const handleCloseAddDialog = () => {
    setOpen(false);
    setIsError(false);
    setHelperText('');
    clearNewIcon();
  }

  const handleAdd = () => {
    if (!newIcon.name || !newIcon.color || !newIcon.backgroundColor) {
      setIsError(true);
      setHelperText('Bạn chưa chọn ' + (!newIcon.name ? 'icon' : (!newIcon.color ? 'màu cho icon' : 'màu nền cho icon')));
      return;
    }

    socket.emit('add_icon', { newIcon });
    setOpen(false);
    clearNewIcon();
  }

  return (
    <Dialog
      open={isOpen} onClose={handleCloseAddDialog}
      aria-labelledby="form-dialog-title"
      fullWidth={true} maxWidth={'md'}
    >
      <DialogTitle id="form-dialog-title" >
        <Typography className={classes.title}>
          Thêm icon mới
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Chọn icon</Typography>
            <Autocomplete
              style={{ width: 225 }}
              filterSelectedOptions
              value={newIcon.name}
              id="icons"
              name='icons'
              size='small'
              onChange={(event, newValue) => {
                setNewIcon({
                  ...newIcon,
                  name: newValue
                });
              }}
              options={ICON_NAMES}
              renderOption={(option) => (
                <React.Fragment>
                  <TemplateIcon
                    icon={{
                      name: option,
                      color: '#FFFFFF',
                      backgroundColor: '#AAAAAA'
                    }}
                    backgroundSize={40}
                    iconSize={20}
                  />
                  {option}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Icon"
                  variant="outlined"
                />
              )}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Chọn màu cho icon</Typography>
            <ColorPicker
              value={newIcon.color}
              onChange={color => {
                if (color.hex) {
                  setNewIcon({
                    ...newIcon,
                    color: '#' + color.hex
                  });
                }
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Chọn màu nền cho icon</Typography>
            <ColorPicker
              value={newIcon.backgroundColor}
              onChange={color => {
                if (color.hex) {
                  setNewIcon({
                    ...newIcon,
                    backgroundColor: '#' + color.hex
                  });
                }
              }}
            />
          </div>

          <div style={{ visibility: !isError ? 'hidden' : 'visible' }}>
            <Typography className={classes.errorText}>{helperText}</Typography>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <TemplateIcon
            icon={newIcon}
            backgroundSize={200}
            iconSize={100}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseAddDialog} variant="contained" >
          Hủy
        </Button>
        <Button className={`${classes.button} ${classes.addButton}`} disabled={!isOpen} onClick={handleAdd} variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles({
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '-10px'
  },
  button: {
    borderRadius: '4px',
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: '5px 40px',
    marginLeft: '20px'
  },
  dialogContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: '200px',
    marginBottom: '20px'
  },
  closeButton: {
    backgroundColor: '#F50707',
  },
  addButton: {
    backgroundColor: '#1DAF1A',
  },
  errorText: {
    color: 'red'
  }
});
