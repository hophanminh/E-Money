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

import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import TemplateIcon from './TemplateIcon';
import AddIconAdmin from './CRUDIcon/AddIcon';
import EditIconAdmin from './CRUDIcon/EditIcon';
import DeleteIconAdmin from './CRUDIcon/DeleteIcon';
import { getSocket } from '../../utils/socket';

export default function IconList() {
  const classes = useStyles();
  const socket = getSocket();

  const [icons, setIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState({
    name: '',
    color: '',
    backgroundColor: ''
  });
  // popover button
  const [openedPopover, setOpenedPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [isOpenAddIconDialog, setOpenAddIconDialog] = useState(false);
  const [isOpenEditIconDialog, setOpenEditIconDialog] = useState(false);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);

  // get initial data
  useEffect(() => {
    socket.emit('get_icons', {}, ({ iconList }) => {
      setIcons(iconList);
    });

    socket.on('wait_for_update_icon', ({ iconList }) => {
      console.log(iconList);
      setIcons(iconList);
    });

    return () => {
      socket.off('wait_for_update_icon');
    }
  }, []);

  const handlePopoverOpenParent = (event, icon) => {
    setAnchorEl(event.currentTarget);
    setSelectedIcon({
      id: icon.ID,
      name: icon.Name,
      color: icon.Color,
      backgroundColor: icon.BackgroundColor
    });
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
    setOpenAddIconDialog(true);
  }

  // edit dialog
  const handleOpenEditDialog = () => {
    setOpenEditIconDialog(true);
  }

  // delete dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
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
    setFilterList(filtered);
  }, [icons, searchInput]);

  return (
    <React.Fragment>
      <AddIconAdmin
        isOpen={isOpenAddIconDialog}
        setOpen={setOpenAddIconDialog}
      />
      <EditIconAdmin
        isOpen={isOpenEditIconDialog}
        setOpen={setOpenEditIconDialog}
        selectedIcon={selectedIcon}
      />
      <DeleteIconAdmin
        isOpen={isOpenDeleteDialog}
        setOpen={setOpenDeleteDialog}
        idToDelete={selectedIcon.id}
      />
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
          <Box className={classes.iconBox}>
            <Button className={classes.iconCard} variant="outlined" onClick={handleOpenAddDialog}>
              <AddIcon className={classes.green} />
              Thêm icon
            </Button>
            {filterList && filterList.map((i, n) => {
              return (
                <Card
                  id={i.ID}
                  key={i.ID}
                  className={classes.iconCard}
                  aria-owns="mouse-over-popover"
                  aria-haspopup="true"
                  onMouseEnter={e => handlePopoverOpenParent(e, i)}
                  onMouseLeave={handlePopoverClose}>
                  <Box className={classes.iconInfo}>
                    <TemplateIcon
                      icon={i}
                      backgroundSize={40}
                      iconSize={20} />
                    <Typography
                      noWrap={true}
                      className={classes.iconText}
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
  titleFont: {
    fontSize: '24px',
    fontWeight: 'bold',
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
  iconBox: {
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
  iconCard: {
    display: 'flex',
    minWidth: '250px',
    maxWidth: '250px',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '10px',
    margin: '10px 20px'
  },
  iconInfo: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconText: {
    fontSize: '16px',
    marginLeft: '10px'
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
