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
import moment from 'moment';

const RollbackList = (props) => {
    const classes = useStyles();
    const { versionList, setVersion, setStep, handleRestore } = props;

    const [list, setList] = useState([]);
    // get initial data
    useEffect(() => {
        setList(versionList)
    }, [versionList]);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    // table 1: active event
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState();
    const [emptyRows, setEmptyRows] = useState();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const temp = list ? rowsPerPage - Math.min(rowsPerPage, list.length - page * rowsPerPage) : 0;
        setRows(list);
        setEmptyRows(temp);
    }, [list, page]);


    const handleOpenInfoDialog = (e, row) => {
        setVersion(row);
        setStep(2)
    }

    const handleOpenRestore = (e, row) => {
        handleRestore(row);
    }

    return (
        <Box className={classes.historyBox}>
            <Paper className={classes.table}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow className={classes.tableHead}>
                                <TableCell className={`${classes.bold} ${classes.tableHeadFont}`} align="center">Phiên bản</TableCell>
                                <TableCell className={`${classes.bold} ${classes.tableHeadFont}`}>Ngày tạo</TableCell>
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
                                        <TableCell align="center">{list?.length - list.findIndex(i => i.ID === row.ID)}</TableCell>
                                        <TableCell align="left">{moment(row?.DateModified).format("HH:mm - DD/MM/YYYY")}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                className={classes.infoButton}
                                                onClick={(e) => handleOpenInfoDialog(e, row)}
                                                id={row.ID}
                                                variant="outlined"
                                            >
                                                Thông tin
                                            </Button>

                                            {list.findIndex(i => i.ID === row.ID) !== 0
                                                &&
                                                <>
                                                    <Button
                                                        className={classes.endButton}
                                                        onClick={(e) => handleOpenRestore(e, row)}
                                                        id={row.ID}
                                                        variant="outlined"
                                                        color="secondary"
                                                    >
                                                        Phục hồi
                                                    </Button>
                                                </>
                                            }
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 62 * emptyRows }}>
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
    );
}

export default RollbackList

const useStyles = makeStyles((theme) => ({
    red: {
        color: '#FF2626'
    },
    green: {
        color: '#1DAF1A'
    },

    // lower section
    historyBox: {
        minWidth: '600px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: "wrap",
        marginTop: '10px'
    },

    // table
    table: {
        width: '100%',
        height: '100%'
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
        fontSize: '10px'
    },
    endButton: {
        marginLeft: '10px',
        fontSize: '10px'
    },
}));
