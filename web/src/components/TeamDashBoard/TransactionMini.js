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
    const { selected, setSelected, isSimple } = useContext(WalletContext);

    const [data, setData] = useState(transactionData);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (transactionData) {
            setData(transactionData);
            setAmount(transactionData?.price);
        }
    }, [transactionData])

    // select 1 transaction
    const handleSelect = () => {
        setSelected(data);
    }

    return (
        <div className={classes.root} onClick={handleSelect}
            style={{ backgroundColor: selected?.id === data?.id ? 'rgba(29,175,26,0.07)' : '', cursor: 'pointer' }}
        >
            <div className={classes.transaction}>
                <DefaultIcon
                    IconID={data?.IconID}
                    backgroundSize={50}
                    iconSize={24} />
                <Box className={classes.wrap}>
                    <Box className={classes.transactionInfo}>
                        <Typography className={classes.transactionText}>
                            {data?.categoryName}
                        </Typography>
                        {amount < 0
                            ?
                            <Typography className={`${classes.transactionText} ${classes.red}`}>{formatMoney(amount * -1)}</Typography>
                            :
                            <Typography className={`${classes.transactionText} ${classes.green}`}>{formatMoney(amount)}</Typography>
                        }

                    </Box>
                    {!isSimple &&
                        <Typography
                            noWrap={true}
                            className={classes.transactionSubText}>
                            {data?.description}
                        </Typography>
                    }
                </Box>
            </div>
            {!isSimple &&
                <Box className={classes.transactionInfo2}>
                    <Typography className={classes.transactionAuthor}>{data?.userName ? data?.userName : "Hệ thống"}</Typography>
                    <Typography className={classes.transactionSubText}>{moment(data?.time).format("HH:mm - DD/MM/YYYY")}</Typography>
                </Box>
            }
        </div>
    );
}

const useStyles = makeStyles((isSimple) => ({
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
    root: (isSimple) => ({
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: isSimple ? '12px 20px 10px 20px' : '15px 20px 0px 20px',
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
    transactionInfo2: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'baseline'
    },
    transactionSubText: {
        fontSize: '14px',
    },
    transactionAuthor: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '10px'
    },
    transactionTime: {
        width: '24px',
        height: '24px',
    },

}));