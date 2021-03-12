import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Avatar,
    makeStyles,
} from '@material-ui/core/';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import moment from 'moment'

import DefaultIcon from '../../utils/DefaultIcon'

const useStyles = makeStyles((selected) => ({
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
    root: (selected) => ({
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: '15px 20px 0px 20px',
        backgroundColor: selected === true ? 'rgba(29,175,26,0.07)' : ''
    }),
    transaction: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '5px'
    },
    transactionInfo: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    transactionText: {
        fontSize: '16',
        fontWeight: 'bold'
    },
    transactionSubText: {
        fontSize: '14px',
    },
    transactionTime: {
        width: '24px',
        height: '24px',
    },

}));

export default function TransactionMini({ transactionData, selected, onClick }) {
    const classes = useStyles(selected);
    const [data, setData] = useState(transactionData);
    const [amount, setAmount] = useState(0);
    useEffect(() => {
        if (transactionData) {
            setData(transactionData);
            setAmount(transactionData.price);
        }
    }, [transactionData])
    return (
        <div className={classes.root} onClick={onClick}>
            <div className={classes.transaction}>
                <DefaultIcon
                    avatar={data.avatar}
                    backgroundSize={50}
                    iconSize={24} />
                <Box className={classes.wrap}>
                    <Box className={classes.transactionInfo}>
                        <Typography
                            className={classes.transactionText}>
                            {data.categoryName}
                        </Typography>
                        {amount < 0
                            ?
                            <Typography className={`${classes.transactionText} ${classes.red}`}>{amount * -1}đ</Typography>
                            :
                            <Typography className={`${classes.transactionText} ${classes.green}`}>{amount}đ</Typography>
                        }

                    </Box>
                    <Typography
                        noWrap={true}
                        className={classes.transactionSubText}>
                        {data.description}
                    </Typography>
                </Box>
            </div>
            <Typography className={classes.transactionSubText}>{moment(data.time).format("hh:mm - D/M/YYYY")}</Typography>
        </div>
    );
}
