import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from "react-router-dom";
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
import {
  MyContext,
  WalletContext,
  PopupContext,
  CategoryContext,
  EventContext
} from '../mycontext'
import POPUP from '../../constants/popup.json'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ListIcon from '@material-ui/icons/List';
import EventIcon from '@material-ui/icons/Event';
import DefaultIcon from '../../utils/DefaultIcon'
import BarChartIcon from '@material-ui/icons/BarChart';

import SearchBar from './SearchBar'
import TransactionMini from './TransactionMini'
import TransactionDetail from './TransactionDetail'
import CategoryAccordion from './Accordion/CategoryAccordion'

import moment from 'moment'
import AddTransaction from './CRUDTransaction/AddTransaction';
import { getSocket } from "../../utils/socket";
import { formatMoney } from '../../utils/currency'
import EventAccordion from './Accordion/EventAccordion';

export default function Dashboard() {
  const classes = useStyles();
  const socket = getSocket();
  const { info } = useContext(MyContext);
  const { setWalletID, selected, setSelected, list, setList, filterList, updateSelected, updateTxCategory } = useContext(WalletContext);
  const { setOpen } = useContext(PopupContext);
  const { setAllList } = useContext(CategoryContext);
  const { setEventList } = useContext(EventContext);

  const [stat, setStat] = useState({
    spend: 0,
    receive: 0,
    total: 0
  })

  // get initial data
  useEffect(() => {
    setWalletID(info?.WalletID);

    socket.emit("get_transaction", { walletID: info?.WalletID }, ({ transactionList, total, spend, receive }) => {
      setList(transactionList);
      setSelected(transactionList[0]);
      setStat({
        spend: spend,
        receive: receive,
        total: total,
      })
    });

    socket.on(`wait_for_update_transaction_${info?.WalletID}`, ({ transactionList, total, spend, receive }) => {
      setList(transactionList);
      setStat({
        spend: spend,
        receive: receive,
        total: total,
      })
    });

    socket.emit("get_category", { walletID: info?.WalletID }, ({ defaultList, customList, fullList }) => {
      setAllList(defaultList, customList, fullList)
    });


    socket.on(`wait_for_update_category_${info?.WalletID}`, ({ defaultList, customList, fullList }) => {
      setAllList(defaultList, customList, fullList);
      updateTxCategory(fullList);
    });

    socket.emit("get_event", { walletID: info?.WalletID }, ({ eventList }) => {
      setEventList(eventList);
    });


    socket.on(`wait_for_update_event_${info?.WalletID}`, ({ eventList }) => {
      setEventList(eventList);
    });


    return () => {
      socket.off(`wait_for_update_transaction_${info?.WalletID}`);
      socket.off(`wait_for_update_category_${info?.WalletID}`);
      socket.off(`wait_for_update_event_${info?.WalletID}`);
      setOpen(null);
    }
  }, [info]);

  useEffect(() => {
    updateSelected();
  }, [list])


  // add transaction
  const handleOpenAddDialog = () => {
    setOpen(POPUP.TRANSACTION.ADD_TRANSACTION);
  }

  return (
    <>
      <AddTransaction />

      <Container className={classes.root} maxWidth={null}>
        <Box className={classes.header}>
          <div className={classes.title}>
            <Breadcrumbs className={classes.breadcrumb} separator={<NavigateNextIcon fontSize="large" />} aria-label="breadcrumb">
              <Typography className={classes.titleFont} color="textPrimary">
                Ví cá nhân
            </Typography>
            </Breadcrumbs>
            <Typography className={classes.subTitleFont} color="textSecondary">Quản lý các khoản giao dịch tiền tệ cá nhân </Typography>
          </div>
          {/* <Box className={classes.actionBox}>
            <Link
              to={{
                pathname: `/Statistic`,
              }}
              style={{ textDecoration: 'none', marginRight: 10 }}
            >
              <Button className={classes.statisticButton} variant="outlined">
                <BarChartIcon className={classes.yellow} />
                &nbsp;Thống kê ví cá nhân
              </Button>
            </Link>
          </Box> */}
        </Box>
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
                  <Typography className={classes.smallBoxNumber}>{formatMoney(stat.total)}</Typography>
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
                  <Typography className={classes.smallBoxNumber}>{formatMoney(stat.receive)}</Typography>
                  <Typography className={classes.smallBoxText}>Tiền thu tháng {moment(new Date()).format("MM/YYYY")} </Typography>
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
                  <Typography className={classes.smallBoxNumber}>{formatMoney(stat.spend)}</Typography>
                  <Typography className={classes.smallBoxText}>Tiền chi tháng {moment(new Date()).format("MM/YYYY")} </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item lg={3} sm={12} >
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.smallBoxAdd}>
                <Button className={classes.button} style={{ textTransform: 'none' }} onClick={handleOpenAddDialog}>
                  <Avatar className={`${classes.avatar} ${classes.addBackGround}`}>
                    <AddCircleOutlineIcon className={`${classes.smallBoxIcon} ${classes.addColor}`} />
                  </Avatar>
                  <Box className={classes.wrap}>
                    <Typography className={classes.smallBoxNumber}>Thêm giao dịch </Typography>
                  </Box>
                </Button>
              </Box>
            </Grid>

          </Grid>
          <Grid container spacing={5} alignItems="stretch" className={classes.lowerGrid}>
            <Grid item lg={3} sm={12}>
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.longBox}>
                <SearchBar />
                <Divider className={classes.dividerBold} />
                <Box className={classes.longListBox}>
                  {(filterList || []).map((i, n) => {
                    return (
                      <React.Fragment key={i.id}>
                        <TransactionMini transactionData={i} />
                        <Divider className={classes.divider} />
                      </React.Fragment>
                    )
                  })}
                </Box>
              </Box>
            </Grid>

            <Grid item lg={6} sm={12}>
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                className={classes.transactionBox}>
                {filterList &&
                  <TransactionDetail />}
              </Box>
            </Grid>

            <Grid item lg={3} sm={12} >
              <div className={classes.buttonColumn}>
                <CategoryAccordion />
                <EventAccordion />
              </div>
            </Grid>

          </Grid>


        </div>

      </Container>
    </>
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
  lowerGrid: {
    marginBottom: '20px',
    minHeight: '630px',
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
  smallBoxAdd: {
    height: '100%',
    minHeight: '155px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  // 3 button
  buttonColumn: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    width: '100%',
    height: '100%',
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  longListBox: {
    width: '100%',
    minHeight: '530px',
    maxHeight: '530px',
    overflowY: 'auto'
  },

  // transaction detail
  transactionBox: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexShrink: 0,
    minHeight: '530px',
  },

  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },

  actionBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  statisticButton: {
    height: '40px',
    textTransform: 'none',
    borderColor: '#fda92c',
    padding: '5px 10px',
    backgroundColor: '#FFFFFF'
  },
  yellow: {
    color: '#fda92c'
  },
}));
