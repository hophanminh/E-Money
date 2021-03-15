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
    IconButton,
    makeStyles,
} from '@material-ui/core/';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import moment from 'moment'
import DefaultIcon from '../../utils/DefaultIcon'
import EditTransaction from './CRUDTransaction/EditTransaction';
import DeleteTransaction from './CRUDTransaction/DeleteTransaction';

const useStyles = makeStyles((theme) => ({
    red: {
        color: '#FF2626'
    },
    green: {
        color: '#1DAF1A'
    },
    wrap: {
        width: "100%",
        wordWrap: 'break-word',
        overflow: 'hidden',
        marginLeft: '15px'
    },
    dividerBold: {
        width: '100%',
        backgroundColor: '#000000'
    },
    divider: {
        width: '100%',
    },

    root: {
        height: '100%',
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        overflowY: 'hidden',
    },

    // header
    title: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 0px 5px 20px'
    },
    titleText: {
        fontSize: '28px',
        fontWeight: 'bold'
    },
    iconButton: {
        width: '32px',
        height: '32px',
        marginRight: '5px'
    },

    // body
    transaction: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '15px 15px 15px 20px',
    },
    transactionIconBox: {
        width: '75px',
        height: '75px',
        marginRight: '15px',
    },
    transactionIcon: {
        width: '40px',
        height: '40px',
    },
    transactionText: {
        fontSize: '16px',
        fontWeight: 'bold'
    },
    transactionSubText: {
        fontSize: '14px',
    },
    time: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    descriptionBox: {
        height: '100%',
        overflowY: 'auto'
    },
    description: {
        padding: '15px 15px 15px 20px',
        wordBreak: 'break-all',
        whiteSpace: 'pre-line',
        textAlign: 'justify',
        fontSize: '28px',
    }
}));

export default function TransactionDetail({ categoryList, transactionData, updateList, deleteList }) {
    const classes = useStyles();
    const [data, setData] = useState(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (transactionData) {
            setData(transactionData);
            setAmount(transactionData.price);
        }
    }, [transactionData])

    // edit transaction dialog
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    }
    // delete transaction dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }


    return (
        <div className={classes.root}>
            {data &&
                <React.Fragment>
                    <div className={classes.title}>
                        <Typography
                            className={classes.titleText}>
                            {moment(data.time).format("D/M/YYYY - hh:mm")}

                        </Typography>
                        <div>
                            <EditTransaction
                                categoryList={categoryList}
                                data={data}
                                updateList={(data) => updateList(data)}
                                open={openEditDialog}
                                setOpen={(open) => setOpenEditDialog(open)} />
                            <DeleteTransaction
                                data={data}
                                deleteList={(data) => deleteList(data)}
                                open={openDeleteDialog}
                                setOpen={(open) => setOpenDeleteDialog(open)}
                            />
                            <IconButton className={`${classes.iconButton} ${classes.green}`} aria-label="edit" onClick={handleOpenEditDialog}>
                                <EditIcon />
                            </IconButton>
                            <IconButton className={`${classes.iconButton} ${classes.red}`} aria-label="delete" onClick={handleOpenDeleteDialog}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>

                    <Divider className={classes.dividerBold} />

                    <div className={classes.transaction}>
                        <DefaultIcon
                            IconName={data.avatar}
                            backgroundSize={75}
                            iconSize={40} />
                        <Box className={classes.wrap} >
                            <Typography
                                className={classes.transactionText}>
                                {data.categoryName}
                            </Typography>
                            {amount < 0
                                ?
                                <Typography className={`${classes.transactionSubText} ${classes.red}`}>
                                    {amount * -1}đ
                                </Typography>
                                :
                                <Typography className={`${classes.transactionSubText} ${classes.green}`}>
                                    {amount}đ
                                </Typography>
                            }

                            <Typography
                                className={`${classes.transactionSubText}`}>
                                Sự kiện: <Link href="#">{data.eventName}</Link>
                            </Typography>
                        </Box>
                    </div>

                    <Divider className={classes.divider} />
                    <div className={classes.descriptionBox}>
                        <Typography className={classes.description}>
                            {data.description}
                        </Typography>
                    </div>
                </React.Fragment>
            }
        </div>
    );
}
