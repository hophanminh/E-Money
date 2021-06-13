import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  IconButton,
  Box,
  TextField,
  Card,
  Popover,
  InputAdornment,
  Button,
  makeStyles,
} from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import DefaultIcon from '../../utils/DefaultIcon';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import AddIconAdmin from './CRUDIcon/AddIcon';

import config from '../../constants/config.json';
const API_URL = config.API_LOCAL;

export default function IconList() {
  const classes = useStyles();
  const token = localStorage.getItem('jwtToken');
  const [icons, setIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState({});
  // popover button
  const [openedPopover, setOpenedPopover] = useState(false)
  const [anchorEl, setAnchorEl] = useState();
  const [isOpenAddIconDialog, setOpenIconDialog] = useState(false);

  const getIcons = async () => {
    const res = await fetch(`${API_URL}/icons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    if (res.status === 200) {
      const result = await res.json();
      console.log(result);
      setIcons(result.icons);
    } else {
      setIcons([]);
    }
  }

  // get initial data
  useEffect(() => {
    getIcons();
  }, []);

  const handlePopoverOpenParent = (event, icon) => {
    setAnchorEl(event.currentTarget);
    setSelectedIcon(icon);
    setOpenedPopover(true);
  };

  const handlePopoverOpenChild = (event) => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  // add dialog
  const handleOpenAddDialog = () => {
    setOpenIconDialog(true);
  }

  // edit dialog
  const handleOpenEditDialog = () => {
    console.log(selectedIcon);
  }

  // delete dialog
  const handleOpenDeleteDialog = () => {

  }

  // search icon
  const [filterList, setFilterList] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const changeSearchInput = (e) => {
    setSearchInput(e.target.value);
  }
  const clearSearchInput = () => {
    setSearchInput('');
  }

  useEffect(() => {
    let filtered = icons;
    if (searchInput !== '') {
      filtered = filtered.filter(i => i.Name.toLowerCase().includes(searchInput));
    }
    setFilterList(filtered)
  }, [icons, searchInput]);

  return (
    <React.Fragment>
      <AddIconAdmin isOpen={isOpenAddIconDialog} setOpen={setOpenIconDialog} />
      <Popover
        elevation={0}
        className={classes.popover}
        classes={{
          paper: classes.popoverContent,
        }}
        open={openedPopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{ onMouseEnter: handlePopoverOpenChild, onMouseLeave: handlePopoverClose }}
      >
        <div>
          <IconButton size="small" className={classes.green} aria-label="edit" onClick={handleOpenEditDialog}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" className={classes.red} aria-label="delete" onClick={handleOpenDeleteDialog}>
            <DeleteIcon />
          </IconButton>
        </div>
      </Popover>
      <Container className={classes.root} maxWidth={null}>
        <div className={classes.body}>
          <Box className={classes.subHeader}>
            <Typography className={classes.subHeaderFont} color="textPrimary">
              Icon
            </Typography>
            <Box className={classes.actionBox}>
              <TextField
                className={classes.searchField}
                value=''
                size="small"
                variant="outlined"
                placeholder="Tìm kiếm"
                value={searchInput}
                onChange={changeSearchInput}
                InputProps={{
                  startAdornment:
                    <InputAdornment position="start" >
                      <SearchIcon />
                    </InputAdornment>,
                  endAdornment:
                    <InputAdornment position="end">
                      <IconButton size='small' aria-label="clear" onClick={clearSearchInput}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                }}
              />
            </Box>
          </Box>
          <Box className={classes.categoryBox}>
            <Button className={classes.categoryCard} variant="outlined" onClick={handleOpenAddDialog}>
              <AddIcon className={classes.green} />
              Thêm icon
            </Button>
            {filterList && filterList.map((i, n) => {
              return (
                <Card
                  id={i.ID}
                  key={i.ID}
                  className={classes.categoryCard}
                  aria-owns="mouse-over-popover"
                  aria-haspopup="true"
                  onMouseEnter={e => handlePopoverOpenParent(e, i)}
                  onMouseLeave={handlePopoverClose}>
                  <Box className={classes.categoryInfo}>
                    <DefaultIcon
                      IconID={i.ID}
                      backgroundSize={40}
                      iconSize={20} />
                    <Typography
                      noWrap={true}
                      className={classes.categoryText}
                    >
                      {i.Name}
                    </Typography>
                  </Box>
                </Card>
              )
            })}
          </Box>
        </div>
      </Container>
    </React.Fragment >
  );
}

const useStyles = makeStyles((theme) => ({
  root: (theme) => ({
    width: '95%',
    minHeight: '100%',
    borderRadius: '4px',
    paddingBottom: '24px',
    paddingTop: '24px',
  }),
  red: {
    color: '#FF2626'
  },
  green: {
    color: '#1DAF1A'
  },

  // upper section
  title: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '10px'
  },
  breadcrumb: {

  },
  titleFont: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  LinkFont: {
    fontSize: '24px',
    '&:hover': {
      textDecoration: 'underline'
    }

  },
  subTitleFont: {
    fontSize: '14px',
  },

  // lower section
  body: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '30px',
    paddingBottom: '10px'
  },
  subHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  subHeaderFont: {
    fontSize: '24px',
  },
  actionBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: '20px'
  },
  categoryBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: "wrap",
    marginBottom: '25px'
  },
  addButton: {
    height: '40px',
    textTransform: 'none',
    borderColor: '#1DAF1A',
    padding: '5px 10px',
    marginRight: '20px',
    backgroundColor: '#FFFFFF'
  },
  searchField: {
    backgroundColor: '#FFFFFF'
  },

  // category card
  categoryCard: {
    display: 'flex',
    minWidth: '250px',
    maxWidth: '250px',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '10px',
    margin: '10px 20px'
  },
  categoryInfo: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: '16px',
    marginLeft: '10px'
  },
  categoryNumber: {
    fontSize: '16px',
    marginLeft: '5px'
  },


  // popover button
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
    border: '1px black solid',
    borderBottom: '0px',
    borderColor: 'rgb(0,0,0, 14%)',
    borderRadius: '4px 4px 0px 0px'
  },
}));
