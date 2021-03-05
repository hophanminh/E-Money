import React, { useState, useEffect } from 'react';
import {
  Container,
  Breadcrumbs,
  Typography,
  Link,
  Grid,
  Box,
  Avatar,
  Divider,
  Button,
  makeStyles,
} from '@material-ui/core/';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ListIcon from '@material-ui/icons/List';
import EventIcon from '@material-ui/icons/Event';

import SearchBar from './SearchBar'
import TransactionMini from './TransactionMini'
import TransactionDetail from './TransactionDetail'

import moment from 'moment'
import AddTransaction from './CRUDTransaction/AddTransaction';
import socket from "../../utils/socket";

const useStyles = makeStyles((theme) => ({
  root: (theme) => ({
    width: '95%',
    minHeight: '100%',
    borderRadius: '4px',
    paddingBottom: '24px',
    paddingTop: '24px',
  }),
  card: (theme) => ({
    backgroundColor: theme.body,
    border: theme.fieldBorder,
  }),
  // out icon
  outColor: {
    color: '#FF2626'
  },
  outBackGround: {
    backgroundColor: 'rgba(255, 38, 38, 7%);',
  },
  // in icon
  inColor: {
    color: '#1DAF1A'
  },
  inBackGround: {
    backgroundColor: 'rgba(29, 175, 26, 7%);',
  },
  // total icon
  totalColor: {
    color: '#2196F3',
  },
  totalBackGround: {
    backgroundColor: 'rgba(33, 150, 243, 7%);',
  },
  // add icon
  addColor: {
    color: '#FFFFFF'
  },
  addBackGround: {
    backgroundColor: '#1DAF1A',
  },
  // category icon
  categoryColor: {
    color: '#FFFFFF'
  },
  categoryBackGround: {
    backgroundColor: '#FDA92C',
  },
  // event icon
  eventColor: {
    color: '#FFFFFF'
  },
  eventBackGround: {
    backgroundColor: '#6F52ED',
  },

  // upper section
  title: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '10px'
  },
  breadcrumb: {
    fontSize: '30px',
  },
  titleFont: {
    fontSize: '30px',
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
  grid: {
    marginBottom: '20px',
  },
  wrap: {
    width: "100%",
    wordWrap: 'break-word',
    overflow: 'hidden',
  },

  // 3 info box
  smallBox: {
    height: '100%',
    minHeight: '155px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '40px',
    paddingRight: '15px',
  },
  smallBoxIconBox: {
    width: '70px',
    height: '70px',
    marginRight: '35px',
  },
  smallBoxIcon: {
    width: '40px',
    height: '40px',
  },
  smallBoxNumber: {
    fontSize: '28px',
  },
  smallBoxText: {
    fontSize: '20px',
  },

  // 3 button
  buttonColumn: {
    minHeight: '575px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    width: '100%',
    minHeight: '155px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: '40px',
    paddingRight: '15px',
    textAlign: 'left'
  },

  dividerBold: {
    width: '100%',
    backgroundColor: '#000000'
  },
  divider: {
    width: '100%',
  },

  // transaction list
  longBox: {
    minHeight: '575px',
    maxHeight: '575px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflowY: 'auto'
  },

  // transaction detail
  transactionBox: {
    minHeight: '575px',
    maxHeight: '575px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexShrink: 0,
  },

}));


const fakeCategory = [{
  id: '1',
  avatar: "food",
  categoryName: 'Ăn uống',
  check: true
},
{
  id: '2',
  avatar: "book",
  categoryName: 'Học tập',
  check: true
},
]

const fakeEvent = [{
  id: 0,
  name: "Không có"
},
]

export default function Dashboard() {
  const classes = useStyles();

  const userID = localStorage.getItem('userID');
  const [walletID, setWalletID] = useState();

  const [categoryList, setCategoryList] = useState(fakeCategory);
  const [list, setList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterList, setFilterList] = useState(list);

  const [selected, setSelected] = useState(1);

  ////////////////////////////////////////////////////////////////////////////////////// CHƯA LÀM
  const [spend, setSpend] = useState(14000000);
  const [receive, setReceive] = useState(9000000);
  const total = receive - spend;
  //////////////////////////////////////////////////////////////////////////////////////
  
  // get initial data
  useEffect(() => {
    console.log(userID);
    socket.emit("get_private_wallet", { userID }, ({ wallet, transactionList, categoryList }) => {
      setWalletID(wallet[0].ID);
      //setCategoryList(categoryList);
      setList(transactionList);
    });

    socket.on('wait_for_update', ({ wallet, transactionList, categoryList }) => {
      //setCategoryList(categoryList);
      //setList(transactionList);

    });

    return () => {
      socket.off("wait_for_update");
    }
  }, []);


  // select 1 transaction
  const selectTransaction = (n) => {
    console.log(n);
    setSelected(n);
  }

  // search and filter
  const searchTransaction = (input) => {
    setSearchInput(input);
  }
  const filterCategory = (list) => {
    setCategoryList(list);
  }
  useEffect(() => {
    let filtered = list;
    if (searchInput !== '') {
      filtered = filtered.filter(i => i.description.toLowerCase().includes(searchInput) || i.categoryName.toLowerCase().includes(searchInput));
    }
    setFilterList(filtered.filter(i => categoryList.filter(cat => cat.id === i.catID && cat.check === true).length !== 0))
  }, [list, categoryList, searchInput])

  // add transaction dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  }

  // add 
  const addList = (newTransaction) => {
    socket.emit("add_transaction", { walletID, userID, newTransaction }, ({ ID }) => {
      let tempList = list.slice();
      newTransaction.id = ID;
      tempList = [newTransaction].concat(tempList);
      console.log(tempList)
      setList(tempList);
    });
  }

  // update
  const updateList = (newTransaction) => {
    socket.emit("update_transaction", { userID, transactionID: newTransaction.id, newTransaction }, () => {
      let tempList = list.slice();
      const index = tempList.findIndex(obj => obj.id == newTransaction.id);
      tempList[index] = newTransaction;
      setList(tempList);
    });

  }
  // delete
  const deleteList = (id) => {
    socket.emit("delete_transaction", { userID, id }, () => {
      const tempList = list.slice();
      const index = tempList.findIndex(obj => obj.id == id);
      tempList.splice(index, 1);
      setList(tempList);
    });
  }

  return (
    <>
      <Container className={classes.root} maxWidth={null}>
        <div className={classes.title}>
          <Breadcrumbs className={classes.breadcrumb} separator={<NavigateNextIcon fontSize="30px" />} aria-label="breadcrumb">
            <Typography className={classes.titleFont} color="textPrimary">
              <Box fontWeight="fontWeightBold" >Ví cá nhân</Box>
            </Typography>
          </Breadcrumbs>
          <Typography className={classes.subTitleFont} color="textSecondary">Quản lý các khoản giao dịch tiền tệ cá nhân </Typography>
        </div>

        <div className={classes.body}>
          <Grid container spacing={5} className={classes.grid}>
            <Grid item lg={3} md={12} >
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.smallBox}>
                <Avatar className={`${classes.smallBoxIconBox} ${classes.totalBackGround}`}>
                  <AccountBalanceWalletIcon className={`${classes.smallBoxIcon} ${classes.totalColor}`} />
                </Avatar>
                <Box className={classes.wrap}>
                  <Typography className={classes.smallBoxNumber}>{total}đ </Typography>
                  <Typography className={classes.smallBoxText}>Tổng tiền trong ví </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item lg={3} md={12} >
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.smallBox}>
                <Avatar className={`${classes.smallBoxIconBox} ${classes.inBackGround}`}>
                  <TrendingUpIcon className={`${classes.smallBoxIcon} ${classes.inColor}`} />
                </Avatar>
                <Box className={classes.wrap}>
                  <Typography className={classes.smallBoxNumber}>{receive}đ </Typography>
                  <Typography className={classes.smallBoxText}>Tổng thu tháng hiện tại ({moment(new Date()).format("M/YYYY")}) </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item lg={3} md={12} >
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.smallBox}>
                <Avatar className={`${classes.smallBoxIconBox} ${classes.outBackGround}`}>
                  <TrendingDownIcon className={`${classes.smallBoxIcon} ${classes.outColor}`} />
                </Avatar>
                <Box className={classes.wrap}>
                  <Typography className={classes.smallBoxNumber}>{spend}đ </Typography>
                  <Typography className={classes.smallBoxText}>Tổng chi tháng hiện tại ({moment(new Date()).format("M/YYYY")}) </Typography>
                </Box>
              </Box>
            </Grid>

          </Grid>
          <Grid container spacing={5} className={classes.grid}>

            <Grid item lg={3} xs={12}>
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.longBox}>
                <SearchBar
                  categoryList={categoryList}
                  setCategoryList={(list) => filterCategory(list)}
                  searchInput={searchInput}
                  setSearchInput={(input) => setSearchInput(input)} />
                <Divider className={classes.dividerBold} />

                {filterList && filterList.map((i, n) => {
                  return (
                    <React.Fragment key={i.id}>
                      <TransactionMini transactionData={i} selected={selected === i.id} onClick={() => selectTransaction(i.id)} />
                      <Divider className={classes.divider} />
                    </React.Fragment>
                  )
                })}
              </Box>
            </Grid>

            <Grid item lg={6} xs={12}>
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.transactionBox}>
                {filterList && <TransactionDetail transactionData={list.find(i => i.id === selected)} updateList={(data) => updateList(data)} deleteList={(data) => deleteList(data)} />}
              </Box>
            </Grid>

            <Grid item lg={3} md={12} >
              <div className={classes.buttonColumn}>
                <Box
                  boxShadow={3}
                  bgcolor="background.paper">
                  <AddTransaction open={openAddDialog} setOpen={(open) => setOpenAddDialog(open)} addList={(data) => addList(data)} />
                  <Button className={classes.button} style={{ textTransform: 'none' }} onClick={handleOpenAddDialog}>
                    <Avatar className={`${classes.smallBoxIconBox} ${classes.addBackGround}`}>
                      <AddCircleOutlineIcon className={`${classes.smallBoxIcon} ${classes.addColor}`} />
                    </Avatar>
                    <Box className={classes.wrap}>
                      <Typography className={classes.smallBoxNumber}>Thêm giao dịch </Typography>
                    </Box>
                  </Button>
                </Box>

                <Box
                  boxShadow={3}
                  bgcolor="background.paper">
                  <Button className={classes.button} style={{ textTransform: 'none' }}>
                    <Avatar className={`${classes.smallBoxIconBox} ${classes.categoryBackGround}`}>
                      <ListIcon className={`${classes.smallBoxIcon} ${classes.categoryColor}`} />
                    </Avatar>
                    <Box className={classes.wrap}>
                      <Typography className={classes.smallBoxNumber}>Quản lý loại giao dịch </Typography>
                    </Box>
                  </Button>
                </Box>

                <Box
                  boxShadow={3}
                  bgcolor="background.paper">
                  <Button className={classes.button} style={{ textTransform: 'none' }}>
                    <Avatar className={`${classes.smallBoxIconBox} ${classes.eventBackGround}`}>
                      <EventIcon className={`${classes.smallBoxIcon} ${classes.eventColor}`} />
                    </Avatar>
                    <Box className={classes.wrap}>
                      <Typography className={classes.smallBoxNumber}>Quản lý sự kiện </Typography>
                    </Box>
                  </Button>
                </Box>

              </div>
            </Grid>

          </Grid>


        </div>

      </Container>
    </>
  );
}