import React, { useEffect, useState } from 'react';
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

export default function EditIconAdmin({ isOpen, setOpen, selectedIcon }) {
  const classes = useStyles();

  const [icon, setIcon] = useState({
    name: selectedIcon.name,
    color: selectedIcon.color,
    backgroundColor: selectedIcon.backgroundColor
  });

  useEffect(() => {
    setIcon({
      name: selectedIcon.name,
      color: selectedIcon.color,
      backgroundColor: selectedIcon.backgroundColor
    });
  }, [selectedIcon]);

  const handleCloseEditDialog = () => {
    setOpen(false);
  }

  const handleEdit = () => {

  }

  return (
    <Dialog
      open={isOpen} onClose={handleCloseEditDialog}
      aria-labelledby="form-dialog-title"
      fullWidth={true} maxWidth={'md'}
    >
      <DialogTitle id="form-dialog-title" >
        <Typography className={classes.title}>
          Chỉnh sửa icon
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Chọn icon</Typography>
            <Autocomplete
              style={{ width: 225 }}
              filterSelectedOptions
              value={icon.name}
              id="icons"
              name='icons'
              size='small'
              onChange={(event, newValue) => {
                setIcon({
                  ...icon,
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
              value={icon.color}
              onChange={color => setIcon({
                ...icon,
                color: color.css.backgroundColor
              })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Chọn màu nền cho icon</Typography>
            <ColorPicker
              value={icon.backgroundColor}
              onChange={color => setIcon({
                ...icon,
                backgroundColor: color.css.backgroundColor
              })}
            />
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <TemplateIcon
            icon={icon}
            backgroundSize={200}
            iconSize={100}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button className={`${classes.button} ${classes.closeButton}`} onClick={handleCloseEditDialog} variant="contained" >
          Hủy
        </Button>
        <Button className={`${classes.button} ${classes.editButton}`} disabled={!isOpen} onClick={handleEdit} variant="contained">
          Lưu
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
  editButton: {
    backgroundColor: '#1DAF1A',
  },
});
