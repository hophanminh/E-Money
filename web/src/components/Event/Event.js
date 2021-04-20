import React, { useState, useEffect, useRef } from 'react';
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
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';

import { getSocket } from "../../utils/socket";
import { formatMoney } from '../../utils/currency'
import AddEvent from './CRUDEvent/AddEvent';
import DeleteEvent from './CRUDEvent/DeleteEvent';
import InfoEvent from './CRUDEvent/InfoEvent';

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
    marginBottom: '25px',
    marginTop: '25px'
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
  },
  tableHead: {
    backgroundColor: '#000000',
  },
  tableHeadFont: {
    fontWeight: 'bold',
    color: "#FFFFFF"
  },

  iconButton: {
    width: '32px',
    height: '32px',
  },
}));

export default function Event() {
  const classes = useStyles();
  const { id } = useParams();
  const socket = getSocket();

  const [walletID, setWalletID] = useState(id);
  const [eventList, setEventList] = useState();
  const [categoryList, setCategoryList] = useState();
  const [eventTypeList, setEventTypeList] = useState();

  // get initial data
  useEffect(() => {
    socket.emit("get_category", { walletID }, ({ defaultList, customList }) => {
      setCategoryList(defaultList.concat(customList));
    });

    socket.emit("get_event", { walletID }, ({ eventList }) => {
      setEventList(eventList);
    });

    socket.emit("get_event_type", {}, ({ eventTypeList }) => {
      setEventTypeList(eventTypeList);
    });

    socket.on('wait_for_update_event', ({ eventList }) => {
      setEventList(eventList);
    });

    return () => {
      socket.off("wait_for_update_event");
    }

  }, []);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState();

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
  }, [eventList]);

  // table 2: finished event
  const [page_2, setPage_2] = useState(0);
  const [rows_2, setRows_2] = useState();
  const [emptyRows_2, setEmptyRows_2] = useState();

  const handleChangePage_2 = (event, newPage) => {
    setPage_2(newPage);
  };

  useEffect(() => {
    const temp1 = eventList ? eventList.filter(i => i.Status === 0) : [];
    const temp2 = temp1 ? rowsPerPage - Math.min(rowsPerPage, temp1.length - page_2 * rowsPerPage) : 0;
    setRows_2(temp1);
    setEmptyRows_2(temp2);
  }, [eventList]);

  // info dialog
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const handleOpenInfoDialog = (e, data) => {
    e.preventDefault();
    setSelected(data);
    setOpenInfoDialog(true);
  }


  // add dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleOpenAddDialog = (e, data) => {
    setOpenAddDialog(true);
  }
  const addList = (newEvent) => {
    socket.emit("add_event", { walletID, newEvent });
  }

  // delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleOpenDeleteDialog = (e, data) => {
    setSelected(data);
    setOpenDeleteDialog(true);
  }
  const deleteList = (id) => {
    console.log(id)
    socket.emit("end_event", { walletID, id });
  }

  return (
    <React.Fragment>
      <InfoEvent
        data={selected}
        open={openInfoDialog}
        setOpen={(open) => setOpenInfoDialog(open)} />
      <AddEvent
        categoryList={categoryList}
        eventTypeList={eventTypeList}
        open={openAddDialog}
        setOpen={(open) => setOpenAddDialog(open)}
        addList={(data) => addList(data)} />
      <DeleteEvent
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
                          <TableCell align="left">
                            {moment(row?.NextDate).format("DD/MM/YYYY")} <TextLink href="#" onClick={(e) => handleOpenInfoDialog(e, row)}>(?)</TextLink>
                          </TableCell>
                          <TableCell align="left" >{row?.EndDate ? moment(row?.EndDate).format("DD/MM/YYYY") : ''}</TableCell>
                          <TableCell align="right">{formatMoney(row?.TotalAmount)}</TableCell>
                          <TableCell align="right">
                            <Button
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
                      <TableRow style={{ height: 53 * emptyRows }}>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rows_2 || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return (
                        <TableRow
                          tabIndex={-1}
                          key={row.ID}
                          style={index % 2 ? { background: "rgba(0, 0, 0, 0.04)" } : { background: "white" }}>
                          <TableCell align="left">{row.Name}</TableCell>
                          <TableCell align="left" className={row.ExpectingAmount > 0 ? classes.green : classes.red}>{formatMoney(Math.abs(row.ExpectingAmount))}</TableCell>
                          <TableCell align="left">{row.TypeName}</TableCell>
                          <TableCell align="left" >{row.StartDate ? moment(row.StartDate).format("DD/MM/YYYY") : ''}</TableCell>
                          <TableCell align="left" >{row.EndDate ? moment(row.EndDate).format("DD/MM/YYYY") : ''}</TableCell>
                          <TableCell align="right">{formatMoney(row.TotalAmount)}</TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows_2 > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
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