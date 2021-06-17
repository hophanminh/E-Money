import React, { useContext, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
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
import {
  PopupContext,
  IconContext,
} from '../../../mycontext'
import POPUP from '../../../../constants/popup.json'
import { getSocket } from "../../../../utils/socket";

import DefaultIcon from '../../../../utils/DefaultIcon'


const fakeEvent = []
const NAME = POPUP.CATEGORY.ADD_CATEGORY

export default function AddCategory(props) {
  const classes = useStyles();
  const socket = getSocket();
  const { id } = useParams();
  const { open, setOpen } = useContext(PopupContext);
  const { iconList } = useContext(IconContext);
  
  const isOpen = open === NAME

  const [list, setList] = useState();
  const [newCategory, setNewCategory] = useState({
    IconID: '1',
    Name: "",
    IsDefault: true
  })

  // get list of icon
  useEffect(async () => {
    setList(iconList);
    if (iconList && iconList.length !== 0) {
      setNewCategory({
        ...newCategory,
        IconID: iconList[0].ID,
      })
    }
  }, [iconList]);

  const clearNewCategory = () => {
    setNewCategory({
      IconID: list[0].ID,
      Name: "",
    })
  }

  const handleCloseAddDialog = () => {
    setOpen(null);
    clearNewCategory();
  }

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const handleAdd = () => {
    if (!newCategory.Name || newCategory.Name.trim() === '') {
      setHelperText("Tên không được để trống");
      setError(true);
    }
    else {
      newCategory.Name = newCategory.Name.trim();
      socket.emit("add_category", { walletID: null, newCategory });
      setOpen(null);
      clearNewCategory();
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
    <Dialog open={isOpen} onClose={handleCloseAddDialog} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" >
        <Typography className={classes.title}>
          Thêm loại mới
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
        </Box>
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

  amountRow: {
    display: 'flex',
  },
  textField: {
    margin: '15px 10px 30px 15px'
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
