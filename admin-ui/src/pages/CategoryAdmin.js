import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Breadcrumbs,
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
import {
  WalletContext,
  PopupContext,
  CategoryContext
} from '../mycontext'
import POPUP from '../constants/popup.json'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import DefaultIcon from '../utils/DefaultIcon'
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import { getSocket } from "../utils/socket";
import AddCategory from '../components/category/CRUDCategory/AddCategory';
import EditCategory from '../components/category/CRUDCategory/EditCategory';
import DeleteCategory from '../components/category/CRUDCategory/DeleteCategory';

export default function CategoryAdmin(props) {
  const classes = useStyles();
  const { id } = useParams();
  const socket = getSocket();
  const { setOpen } = useContext(PopupContext);
  const { defaultList, customList, setAllList, setSelected } = useContext(CategoryContext);
  const { list, setList } = useContext(WalletContext);

  const [countList, setCountList] = useState();
  const [team, setTeam] = useState();
  // get initial data
  useEffect(() => {
    socket.emit("get_team", { walletID: id }, ({ team }) => {
      setTeam(team);
    });

    if (list?.length === 0) {
      socket.emit("get_transaction", { walletID: id }, ({ transactionList }) => {
        setList(transactionList);
      });
    }

    socket.on('wait_for_update_transaction', ({ transactionList }) => {
      setList(transactionList);
    });

    socket.emit("get_category", { walletID: id }, ({ defaultList, customList, fullList }) => {
      console.log(defaultList)
      setAllList(defaultList, customList, fullList)
    });

    socket.on('wait_for_update_category', ({ defaultList, customList, fullList }) => {
      setAllList(defaultList, customList, fullList)
    });

    return () => {
      socket.off("wait_for_update_transaction");
      socket.off("wait_for_update_category");
      setOpen(null);
    }
  }, []);

  useEffect(() => {
    if (list) {
      const temp = { ...countList };

      if (defaultList) {
        for (let i = 0; i < defaultList?.length; i++) {
          const cat = defaultList[i];
          const number = list.filter(j => j?.catID === cat?.ID)?.length;
          temp[cat?.ID] = { count: number };
        }
      }
      setCountList(temp);
    }
  }, [list, defaultList])

  // popover button
  const [openedPopover, setOpenedPopover] = useState(false)
  const [anchorEl, setAnchorEl] = useState();
  useEffect(() => {
    if (anchorEl) {
      const temp = defaultList.find(i => i.ID === anchorEl.id)
      setSelected(temp);
    }
  }, [anchorEl]);

  const handlePopoverOpenParent = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenedPopover(true)
  };

  const handlePopoverOpenChild = (event) => {
    setOpenedPopover(true)
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false)
  };

  // add dialog
  const handleOpenAddDialog = () => {
    setOpen(POPUP.CATEGORY.ADD_CATEGORY);
  }

  // edit dialog
  const handleOpenEditDialog = () => {
    setOpen(POPUP.CATEGORY.EDIT_CATEGORY);
  }

  // delete dialog
  const handleOpenDeleteDialog = () => {
    setOpen(POPUP.CATEGORY.DELETE_CATEGORY);
  }

  // search category
  const [filterList, setFilterList] = useState(defaultList);
  const [searchInput, setSearchInput] = useState('');

  const changeSearchInput = (e) => {
    setSearchInput(e.target.value);
  }
  const clearSearchInput = () => {
    setSearchInput('');
  }

  useEffect(() => {
    let filtered = defaultList;
    if (searchInput !== '') {
      filtered = filtered.filter(i => i.Name.toLowerCase().includes(searchInput));
    }
    setFilterList(filtered)
  }, [defaultList, searchInput])


  return (
    <React.Fragment>
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
      <AddCategory />
      <EditCategory />
      <DeleteCategory />
      <Container className={classes.root} maxWidth={null}>
        <div className={classes.body}>
          <Box className={classes.subHeader}>
            <Typography className={classes.subHeaderFont} color="textPrimary">
              Loại mặc định
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
                Thêm loại
              </Button>
            {filterList && filterList.map((i, n) => {
              return (
                <Card
                  id={i.ID}
                  key={i.ID}
                  className={classes.categoryCard}
                  aria-owns="mouse-over-popover"
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpenParent}
                  onMouseLeave={handlePopoverClose}>
                  <Box className={classes.categoryInfo}>
                    <DefaultIcon
                      IconID={i.IconID}
                      backgroundSize={40}
                      iconSize={20} />
                    <Typography
                      noWrap={true}
                      className={classes.categoryText}>
                      {i.Name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      noWrap={true}
                      className={classes.categoryNumber}>
                      ({countList ? countList[i?.ID]?.count : 0})
                    </Typography>
                  </Box>
                </Card>
              )
            })}
          </Box>
        </div>
      </Container>
    </React.Fragment>
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