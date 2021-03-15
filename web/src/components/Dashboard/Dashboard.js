import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {
  Container,
  Breadcrumbs,
  Typography,
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
import { getSocket } from "../../utils/socket";

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
    fontSize: '24px',
  },
  titleFont: {
    fontWeight: 'bold',
    fontSize: '24px',
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
    flexGrow: 3,
    marginLeft: '15px',
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
  avatar: {
    width: '50px',
    height: '50px',
  },
  smallBoxIcon: {
    width: '30px',
    height: '30px',
  },
  smallBoxNumber: {
    fontSize: '18px',
  },
  smallBoxText: {
    fontSize: '16px',
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
    minHeight: '130px',
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

const fakeEvent = [{
  id: 0,
  name: "Không có"
},
]

export default function Dashboard() {
  const classes = useStyles();
  const socket = getSocket();

  const userID = localStorage.getItem('userID');
  const [walletID, setWalletID] = useState();

  const [categoryList, setCategoryList] = useState([]);
  const [list, setList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterList, setFilterList] = useState(list);

  const [selected, setSelected] = useState(1);

  const [spend, setSpend] = useState(0);
  const [receive, setReceive] = useState(0);
  const [total, setTotal] = useState(0);

  // get initial data
  useEffect(() => {
    socket.emit("get_private_wallet", {}, ({ wallet, transactionList, categoryList }) => {
      setWalletID(wallet[0].ID);
      setTotal(wallet[0].TotalCount);

      categoryList.forEach(cat => cat['check'] = true);
      setCategoryList(categoryList);
      setList(transactionList);

      setSelected(transactionList.length !== 0 ? transactionList[0].id : -1);
    });

    socket.on('wait_for_update', ({ wallet, transactionList, categoryList }) => {
      setTotal(wallet[0].TotalCount);
      categoryList.forEach(cat => cat['check'] = true);
      setCategoryList(categoryList);
      setList(transactionList);
    });

    return () => {
      socket.off("wait_for_update");
    }
  }, []);

  // update wallet's info at top of page
  useEffect(() => {
    const spendList = list.filter(i => {
      const month = moment(i.time, 'YYYY-MM-DD HH:mm:ss').format('M');
      const currentMonth = moment().format('M');
      return month === currentMonth && i.price < 0;
    })
    const receiveList = list.filter(i => {
      const month = moment(i.time, 'YYYY-MM-DD HH:mm:ss').format('M');
      const currentMonth = moment().format('M');
      return month === currentMonth && i.price > 0;
    })

    let tempSpend = 0;
    spendList.forEach(i => tempSpend += i.price);
    let tempReceive = 0;
    receiveList.forEach(i => tempReceive += i.price);

    setSpend(tempSpend);
    setReceive(tempReceive);
  }, [list])


  // select 1 transaction
  const selectTransaction = (n) => {
    setSelected(n);
  }

  // search and filter
  const searchTransaction = (input) => {
    setSearchInput(input);
  }
  const filterCategory = (list) => {
    setCategoryList(list);
  }

  // update filter list
  useEffect(() => {
    let filtered = list;
    if (searchInput !== '') {
      filtered = filtered.filter(i => i.description.toLowerCase().includes(searchInput) || i.categoryName.toLowerCase().includes(searchInput));
    }
    setFilterList(filtered.filter(i => categoryList.filter(cat => cat.ID === i.catID && cat.check === true).length !== 0))
  }, [list, categoryList, searchInput])

  // add transaction dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  }

  // add 
  const addList = (newTransaction) => {
    socket.emit("add_transaction", { walletID, newTransaction }, ({ ID }) => {
      let tempList = list.slice();
      newTransaction.id = ID;
      tempList = [newTransaction].concat(tempList);
      setList(tempList);
      setSelected(ID);
    });
  }

  // update
  const updateList = (newTransaction) => {
    socket.emit("update_transaction", { transactionID: newTransaction.id, newTransaction }, () => {
      let tempList = list.slice();
      const index = tempList.findIndex(obj => obj.id == newTransaction.id);
      tempList[index] = newTransaction;
      setList(tempList);
    });

  }
  // delete
  const deleteList = (id) => {
    socket.emit("delete_transaction", { id }, () => {
      const tempList = list.slice();
      const index = tempList.findIndex(obj => obj.id == id);
      tempList.splice(index, 1);
      setList(tempList);
      setSelected(tempList.length !== 0 ? tempList[0].id : -1);
    });
  }

  return (
    <>
      <Container className={classes.root} maxWidth={null}>
        <div className={classes.title}>
          <Breadcrumbs className={classes.breadcrumb} separator={<NavigateNextIcon fontSize="large" />} aria-label="breadcrumb">
            <Typography className={classes.titleFont} color="textPrimary">
              Ví cá nhân
            </Typography>
          </Breadcrumbs>
          <Typography className={classes.subTitleFont} color="textSecondary">Quản lý các khoản giao dịch tiền tệ cá nhân </Typography>
        </div>

        <div className={classes.body}>
          <Grid container spacing={5} className={classes.grid}>
            <Grid item lg={3} sm={12} >
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.smallBox}>
                <Avatar className={`${classes.avatar} ${classes.totalBackGround}`}>
                  <AccountBalanceWalletIcon className={`${classes.smallBoxIcon} ${classes.totalColor}`} />
                </Avatar>
                <Box className={classes.wrap}>
                  <Typography className={classes.smallBoxNumber}>{total}đ </Typography>
                  <Typography className={classes.smallBoxText}>Tổng tiền </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item lg={3} sm={12} >
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.smallBox}>
                <Avatar className={`${classes.avatar} ${classes.inBackGround}`}>
                  <TrendingUpIcon className={`${classes.smallBoxIcon} ${classes.inColor}`} />
                </Avatar>
                <Box className={classes.wrap}>
                  <Typography className={classes.smallBoxNumber}>{receive}đ </Typography>
                  <Typography className={classes.smallBoxText}>Tiền thu tháng {moment(new Date()).format("M/YYYY")} </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item lg={3} sm={12} >
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.smallBox}>
                <Avatar className={`${classes.avatar} ${classes.outBackGround}`}>
                  <TrendingDownIcon className={`${classes.smallBoxIcon} ${classes.outColor}`} />
                </Avatar>
                <Box className={classes.wrap}>
                  <Typography className={classes.smallBoxNumber}>{spend}đ </Typography>
                  <Typography className={classes.smallBoxText}>Tiền chi tháng {moment(new Date()).format("M/YYYY")} </Typography>
                </Box>
              </Box>
            </Grid>

          </Grid>
          <Grid container spacing={5} className={classes.grid}>

            <Grid item lg={3} sm={12}>
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.longBox}>
                <SearchBar
                  categoryList={categoryList}
                  setCategoryList={(list) => filterCategory(list)}
                  searchInput={searchInput}
                  setSearchInput={(input) => searchTransaction(input)} />
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

            <Grid item lg={6} sm={12}>
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.transactionBox}>
                {filterList && list.find(i => i.id === selected) &&
                  <TransactionDetail
                    categoryList={categoryList}
                    transactionData={list.find(i => i.id === selected)}
                    updateList={(data) => updateList(data)}
                    deleteList={(data) => deleteList(data)} />}
              </Box>
            </Grid>

            <Grid item lg={3} sm={12} >
              <div className={classes.buttonColumn}>
                <Box
                  boxShadow={3}
                  bgcolor="background.paper">
                  <AddTransaction
                    categoryList={categoryList}
                    open={openAddDialog}
                    setOpen={(open) => setOpenAddDialog(open)}
                    addList={(data) => addList(data)} />
                  <Button className={classes.button} style={{ textTransform: 'none' }} onClick={handleOpenAddDialog}>
                    <Avatar className={`${classes.avatar} ${classes.addBackGround}`}>
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
                  <Link to={`/category/${walletID}`} style={{ textDecoration: 'none' }} >
                    <Button className={classes.button} style={{ textTransform: 'none' }}>
                      <Avatar className={`${classes.avatar} ${classes.categoryBackGround}`}>
                        <ListIcon className={`${classes.smallBoxIcon} ${classes.categoryColor}`} />
                      </Avatar>
                      <Box className={classes.wrap}>
                        <Typography className={classes.smallBoxNumber}>Quản lý loại giao dịch </Typography>
                      </Box>
                    </Button>
                  </Link>
                </Box>

                <Box
                  boxShadow={3}
                  bgcolor="background.paper">
                  <Button className={classes.button} style={{ textTransform: 'none' }}>
                    <Avatar className={`${classes.avatar} ${classes.eventBackGround}`}>
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