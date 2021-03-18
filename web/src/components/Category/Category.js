import React, { useState, useEffect, useRef } from 'react';
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
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import DefaultIcon from '../../utils/DefaultIcon'
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import { getSocket } from "../../utils/socket";
import AddCategory from './CRUDCategory/AddCategory';
import EditCategory from './CRUDCategory/EditCategory';
import DeleteCategory from './CRUDCategory/DeleteCategory';

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

const fakeEvent = [{
  id: 0,
  name: "Không có"
},
]

export default function Category() {
  const classes = useStyles();
  const { id } = useParams();
  const socket = getSocket();

  const [walletID, setWalletID] = useState(id);
  const [defaultList, setDefaultList] = useState();
  const [customList, setCustomList] = useState();

  // get initial data
  useEffect(() => {
    socket.emit("get_category", { walletID }, ({ defaultList, customList }) => {
      setDefaultList(defaultList);
      setCustomList(customList);
    });

    socket.on('wait_for_update_category', ({ defaultList, customList }) => {
      setDefaultList(defaultList);
      setCustomList(customList);
    });

    return () => {
      socket.off("wait_for_update_category");
    }

  }, []);

  // popover button
  const [openedPopover, setOpenedPopover] = useState(false)
  const [anchorEl, setAnchorEl] = useState();
  const [selected, setSelected] = useState();
  useEffect(() => {
    if (anchorEl) {
      const temp = customList.find(i => i.ID === anchorEl.id)
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

  // add transaction dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  }
  const addList = (newCategory) => {
    socket.emit("add_category", { walletID, newCategory }, ({ ID }) => {
      console.log(ID);
      let tempList = customList.slice();
      newCategory.ID = ID;
      newCategory.count = 0;
      tempList = tempList.concat([newCategory]);

      tempList.sort((a, b) => a.Name.localeCompare(b.Name));
      setCustomList(tempList);
    });
  }

  // edit transaction dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleOpenEditDialog = (event) => {
    console.log(anchorEl.id)
    setOpenEditDialog(true);
  }
  const updateList = (newCategory) => {
    socket.emit("update_category", { categoryID: newCategory.ID, newCategory }, () => {
      let tempList = customList.slice();
      const index = tempList.findIndex(obj => obj.ID == newCategory.ID);

      tempList[index] = newCategory;
      tempList.sort((a, b) => a.Name.localeCompare(b.Name));
      setCustomList(tempList);
    });

  }

  // delete transaction dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  }
  const deleteList = (id) => {
    socket.emit("delete_category", { id }, () => {
      const tempList = customList.slice();
      const index = tempList.findIndex(obj => obj.ID == id);
      tempList.splice(index, 1);
      setCustomList(tempList);
    });
  }

  // search category
  const [filterList, setFilterList] = useState(customList);
  const [searchInput, setSearchInput] = useState('');

  const changeSearchInput = (e) => {
    setSearchInput(e.target.value);
  }
  const clearSearchInput = () => {
    setSearchInput('');
  }

  useEffect(() => {
    let filtered = customList;
    if (searchInput !== '') {
      filtered = filtered.filter(i => i.Name.toLowerCase().includes(searchInput));
    }
    setFilterList(filtered)
  }, [customList, searchInput])


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
      <EditCategory
        data={selected}
        updateList={(data) => updateList(data)}
        open={openEditDialog}
        setOpen={(open) => setOpenEditDialog(open)} />
      <DeleteCategory
        data={selected}
        deleteList={(data) => deleteList(data)}
        open={openDeleteDialog}
        setOpen={(open) => setOpenDeleteDialog(open)}
      />

      <Container className={classes.root} maxWidth={null}>
        <div className={classes.title}>
          <Breadcrumbs className={classes.breadcrumb} separator={<NavigateNextIcon fontSize="large" />} aria-label="breadcrumb">
            <Link to="/Dashboard/Wallet" style={{ textDecoration: 'none' }}>
              <Typography className={classes.LinkFont}>
                Ví cá nhân
              </Typography>
            </Link>
            <Typography className={classes.titleFont} color="textPrimary">
              Quản lý phân loại giao dịch
            </Typography>
          </Breadcrumbs>
          <Typography className={classes.subTitleFont} color="textSecondary">Quản lý các khoản giao dịch tiền tệ cá nhân </Typography>
        </div>
        <div className={classes.body}>
          <Box className={classes.subHeader}>
            <Typography className={classes.subHeaderFont} color="textPrimary">
              Loại mặc định
              </Typography>
          </Box>
          <Box className={classes.categoryBox}>
            {defaultList && defaultList.map((i, n) => {
              return (
                <Card key={i.ID} className={classes.categoryCard}>
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
                      ({i.count})
                    </Typography>
                  </Box>
                </Card>
              )
            })}

          </Box>
          <Box className={classes.subHeader}>
            <Typography className={classes.subHeaderFont} color="textPrimary">
              Loại tự chọn
              </Typography>
            <Box className={classes.actionBox}>
              <AddCategory
                open={openAddDialog}
                setOpen={(open) => setOpenAddDialog(open)}
                addList={(data) => addList(data)} />
              <Button className={classes.addButton} variant="outlined" onClick={handleOpenAddDialog}>
                <AddIcon className={classes.green} />
                Thêm loại
              </Button>
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
                      ({i.count})
                    </Typography>
                  </Box>
                  <Box className={classes.categoryInfo}>
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