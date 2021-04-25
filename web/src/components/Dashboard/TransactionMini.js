import React, { useState, useEffect, useContext } from 'react';
import {
    Typography,
    Box,
    Avatar,
    makeStyles,
} from '@material-ui/core/';
import {
    WalletContext
} from '../mycontext'
import moment from 'moment'

import DefaultIcon from '../../utils/DefaultIcon'
import { formatMoney } from '../../utils/currency'

export default function TransactionMini({ transactionData }) {
    const classes = useStyles();
    const { selected, setSelected } = useContext(WalletContext);

    const [data, setData] = useState(transactionData);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (transactionData) {
            setData(transactionData);
            setAmount(transactionData.price);
        }
    }, [transactionData])

    // select 1 transaction
    const handleSelect = () => {
        setSelected(data);
    }


    return (
        <div className={classes.root} onClick={handleSelect} style={{ backgroundColor: selected?.id === data?.id ? 'rgba(29,175,26,0.07)' : '' }}>
            <div className={classes.transaction}>
                <DefaultIcon
                    IconID={data.IconID}
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
                            <Typography className={`${classes.transactionText} ${classes.red}`}>{formatMoney(amount * -1)}</Typography>
                            :
                            <Typography className={`${classes.transactionText} ${classes.green}`}>{formatMoney(amount)}</Typography>
                        }

                    </Box>
                    <Typography
                        noWrap={true}
                        className={classes.transactionSubText}>
                        {data.description}
                    </Typography>
                </Box>
            </div>
            <Typography className={classes.transactionSubText}>{moment(data.time).format("hh:mm - DD/MM/YYYY")}</Typography>
        </div>
    );
}

const useStyles = makeStyles(() => ({
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