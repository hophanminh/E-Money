import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Breadcrumbs,
  Typography,
  IconButton,
  Box,
  Paper,
  Link as TextLink,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
  TableContainer,
  TableHead,
  TablePagination,
  makeStyles,
} from '@material-ui/core/';
import {
  MyContext,
  WalletContext,
  PopupContext,
  CategoryContext,
  EventContext
} from '../mycontext'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';
import POPUP from '../../constants/popup.json'

import { getSocket } from "../../utils/socket";
import { formatMoney } from '../../utils/currency'
import AddEvent from './CRUDEvent/AddEvent';
import DeleteEvent from './CRUDEvent/DeleteEvent';
import InfoEvent from './CRUDEvent/InfoEvent';


export default function Event() {
  const classes = useStyles();
  const { id } = useParams();
  const socket = getSocket();
  const { setOpen } = useContext(PopupContext);
  const { fullList, setAllList } = useContext(CategoryContext);
  const { selected, setSelected, eventList, setEventList, setTypeList } = useContext(EventContext);

  const [team, setTeam] = useState();
  // get initial data
  useEffect(() => {
    socket.emit("get_team", { walletID: id }, ({ team }) => {
      setTeam(team);
    });

    socket.emit("get_event", { walletID: id }, ({ eventList }) => {
      setEventList(eventList);
    });

    socket.emit("get_event_type", {}, ({ eventTypeList }) => {
      setTypeList(eventTypeList);
    });

    socket.emit("get_category", { walletID: id }, ({ defaultList, customList, fullList }) => {
      setAllList(defaultList, customList, fullList)
    });


    socket.on('wait_for_update_event', ({ eventList }) => {
      setEventList(eventList);
    });

    socket.on('wait_for_update_category', ({ defaultList, customList, fullList }) => {
      setAllList(defaultList, customList, fullList);
    });

    return () => {
      socket.off("wait_for_update_event");
      socket.off("wait_for_update_category");
      setOpen(null);
    }

  }, []);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // table 1: active event
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState();
  const [emptyRows, setEmptyRows] = useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const temp1 = eventList ? eventList.filter(i => i.Status === 1) : [];
    const temp2 = temp1 ? rowsPerPage - Math.min(rowsPerPage, temp1.length - page * rowsPerPage) : 0;
    setRows(temp1);
    setEmptyRows(temp2);
  }, [eventList, page]);

  // table 2: finished event
  const [page_2, setPage_2] = useState(0);
  const [rows_2, setRows_2] = useState();
  const [emptyRows_2, setEmptyRows_2] = useState();

  const handleChangePage_2 = (event, newPage) => {
    setPage_2(newPage);
  };

  useEffect(() => {
    const temp1 = eventList ? eventList.filter(i => i.Status === 0) : []; console.log(temp1);

    const temp2 = temp1 ? rowsPerPage - Math.min(rowsPerPage, temp1.length - page_2 * rowsPerPage) : 0;
    setRows_2(temp1);
    setEmptyRows_2(temp2);
  }, [eventList, page]);

  // info dialog
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const handleOpenInfoDialog = (e, data) => {
    setSelected(data);
    setOpen(POPUP.EVENT.INFO_EVENT);
  }

  // add dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleOpenAddDialog = () => {
    setOpen(POPUP.EVENT.ADD_EVENT);
  }

  // delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleOpenDeleteDialog = (e, data) => {
    setSelected(data);
    setOpen(POPUP.EVENT.DELETE_EVENT);
  }

  return (
    <React.Fragment>
      <InfoEvent
        data={selected} />
      <AddEvent />
      <DeleteEvent />

      <Container className={classes.root} maxWidth={null}>
        <div className={classes.title}>
          <Breadcrumbs className={classes.breadcrumb} separator={<NavigateNextIcon fontSize="large" />} aria-label="breadcrumb">
            {team ?
              <Link to={`/Wallet/${id}`} style={{ textDecoration: 'none' }}>
                <Typography className={classes.LinkFont}>
                  {"Ví " + team?.Name}
                </Typography>
              </Link>
              :
              <Link to="/Wallet" style={{ textDecoration: 'none' }}>
                <Typography className={classes.LinkFont}>
                  Ví cá nhân
                </Typography>
              </Link>
            }
            <Typography className={classes.titleFont} color="textPrimary">
              Quản lý sự kiện
            </Typography>
          </Breadcrumbs>
          <Typography className={classes.subTitleFont} color="textSecondary">Quản lý các khoản giao dịch tiền tệ cá nhân </Typography>
        </div>
        <div className={classes.body}>
          <Box className={classes.subHeader}>
            <Typography className={classes.subHeaderFont} color="textPrimary">
              Sự kiện đang chạy
              </Typography>
            <Box className={classes.actionBox}>
              <Button className={classes.addButton} variant="outlined" onClick={handleOpenAddDialog}>
                <AddIcon className={classes.green} />
                Thêm sự kiện
              </Button>
            </Box>

          </Box>
          <Box className={classes.eventBox}>
            <Paper className={classes.paper}>
              <TableContainer>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.tableHead}>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`}>Tên sự kiện</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="left">Khoản định kì</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="left">Loại</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="left">Giao dịch kế tiếp</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="left">Kết thúc</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="right">Tổng tiền</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rows || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return (
                        <TableRow
                          tabIndex={-1}
                          key={row.ID}
                          style={index % 2 ? { background: "rgba(0, 0, 0, 0.04)" } : { background: "white" }}>
                          <TableCell align="left">{row?.Name}</TableCell>
                          <TableCell align="left" className={row.ExpectingAmount > 0 ? classes.green : classes.red}>{formatMoney(Math.abs(row?.ExpectingAmount))}</TableCell>
                          <TableCell align="left">{row?.TypeName}</TableCell>
                          <TableCell align="left">{moment(row?.NextDate).format("DD/MM/YYYY hh:mm A")}</TableCell>
                          <TableCell align="left" >{row?.EndDate ? moment(row?.EndDate).format("DD/MM/YYYY hh:mm A") : '--'}</TableCell>
                          <TableCell align="right" className={row.ExpectingAmount >= 0 ? classes.green : classes.red}>{formatMoney(Math.abs(row?.TotalAmount))}</TableCell>
                          <TableCell align="right">
                            <Button
                              className={classes.infoButton}
                              onClick={(e) => handleOpenInfoDialog(e, row)}
                              id={row.ID}
                              variant="outlined"
                            >
                              Thông tin
                              </Button>
                            <Button
                              className={classes.endButton}
                              onClick={(e) => handleOpenDeleteDialog(e, row)}
                              id={row.ID}
                              variant="outlined"
                              color="secondary"
                            >
                              Kết thúc
                              </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 67 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5]}
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                component='div'
                onChangePage={handleChangePage}
              />
            </Paper>
          </Box>
          <Box className={classes.subHeader}>
            <Typography className={classes.subHeaderFont} color="textPrimary">
              Sự kiện đã kết thúc
              </Typography>
          </Box>
          <Box className={classes.eventBox}>
            <Paper className={classes.paper}>
              <TableContainer>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.tableHead}>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`}>Tên sự kiện</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="left">Số tiền</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="left">Loại</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="left">Bắt đầu </TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="left">Kết thúc</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="right">Tổng tiền</TableCell>
                      <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rows_2 || []).slice(page_2 * rowsPerPage, page_2 * rowsPerPage + rowsPerPage).map((row, index) => {
                      return (
                        <TableRow
                          tabIndex={-1}
                          key={row.ID}
                          style={index % 2 ? { background: "rgba(0, 0, 0, 0.04)" } : { background: "white" }}>
                          <TableCell align="left">{row.Name}</TableCell>
                          <TableCell align="left" className={row.ExpectingAmount > 0 ? classes.green : classes.red}>{formatMoney(Math.abs(row.ExpectingAmount))}</TableCell>
                          <TableCell align="left">{row.TypeName}</TableCell>
                          <TableCell align="left" >{row.StartDate ? moment(row.StartDate).format("DD/MM/YYYY - hh:mm A") : ''}</TableCell>
                          <TableCell align="left" >{row.EndDate ? moment(row.EndDate).format("DD/MM/YYYY - hh:mm A") : ''}</TableCell>
                          <TableCell align="right" className={row.ExpectingAmount >= 0 ? classes.green : classes.red}>{formatMoney(Math.abs(row?.TotalAmount))}</TableCell>
                          <TableCell align="right">
                            <Button
                              className={classes.infoButton}
                              onClick={(e) => handleOpenInfoDialog(e, row)}
                              id={row.ID}
                              variant="outlined"
                            >
                              Thông tin
                              </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows_2 > 0 && (
                      <TableRow style={{ height: 67 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5]}
                count={rows_2 ? rows_2.length : 0}
                rowsPerPage={rowsPerPage}
                page={page_2}
                component='div'
                onChangePage={handleChangePage_2}
              />
            </Paper>
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
  },
  eventBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: "wrap",
    marginBottom: '35px',
    marginTop: '10px'
  },
  addButton: {
    height: '40px',
    textTransform: 'none',
    borderColor: '#1DAF1A',
    padding: '5px 10px',
    backgroundColor: '#FFFFFF'
  },
  searchField: {
    backgroundColor: '#FFFFFF'
  },

  // table
  paper: {
    width: '100%',
    minHeight: '530px'
  },
  tableHead: {
    backgroundColor: '#000000',
  },
  tableHeadFont: {
    fontWeight: 'bold',
    color: "#FFFFFF"
  },

  infoButton: {
    color: '#1DAF1A',
    borderColor: '#1DAF1A',
    fontWeight: 'bold'
  },
  endButton: {
    marginLeft: '10px',
    fontWeight: 'bold'
  },
}));
