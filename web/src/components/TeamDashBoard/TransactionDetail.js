import React, { useState, useEffect, useContext } from 'react';
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
import {
  WalletContext,
  PopupContext,
} from '../mycontext'
import POPUP from '../../constants/popup.json'

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import DefaultIcon from '../../utils/DefaultIcon'
import EditTransaction from './CRUDTransaction/EditTransaction';
import DeleteTransaction from './CRUDTransaction/DeleteTransaction';
import TransactionImages from './TransactionImages';
import { getSocket } from "../../utils/socket";
import { formatMoney } from '../../utils/currency'


export default function TransactionDetail(props) {
  const classes = useStyles();
  const socket = getSocket();
  const { selected } = useContext(WalletContext)
  const { setOpen } = useContext(PopupContext)

  const data = selected;

  ///////////////////////////////////////////////////// imageList[0].URL to access
  const [imageList, setImageList] = useState([]);

  const handleSetImageList = (imageList) => {
    const sortedList = imageList.sort((img1, img2) => moment(img1.DateAdded).isBefore(moment(img2.DateAdded)) ? 1 : -1);
    setImageList(sortedList);
  }
  // update data from parent and get list of images
  useEffect(() => {
    if (selected) {
      socket.emit("get_transaction_image", { TransactionID: selected?.id }, ({ imageList }) => {
        handleSetImageList(imageList);
      });
    }
  }, [selected]);

  useEffect(() => {
    socket.on(`wait_for_add_transaction_image_${data?.id}`, ({ urls }) => {
      // if (selected.id === transactionID) {
      const concatenatedList = JSON.parse(JSON.stringify(imageList)).concat(urls);
      handleSetImageList(concatenatedList);
      // }
    });
    socket.on(`wait_for_remove_transaction_image_${data?.id}`, ({ imageID }) => {
      // if (selected.id === transactionID) {
      const filteredList = JSON.parse(JSON.stringify(imageList)).filter(image => image.ID !== imageID);
      handleSetImageList(filteredList);
      // }
    });
  }, [imageList]);


  // edit transaction dialog
  const handleOpenEditDialog = () => {
    setOpen(POPUP.TRANSACTION.EDIT_TRANSACTION);
  }

  // delete transaction dialog
  const handleOpenDeleteDialog = () => {
    setOpen(POPUP.TRANSACTION.DELETE_TRANSACTION);
  }

  return (
    <React.Fragment>
      <EditTransaction />
      <DeleteTransaction />

      <div className={classes.root}>
        {data &&
          <React.Fragment>
            <div className={classes.title}>
              <Typography
                className={classes.titleText}>
                {moment(data?.time).format("DD/MM/YYYY - hh:mm")}

              </Typography>
              <div>
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
                IconID={data?.IconID}
                backgroundSize={75}
                iconSize={40} />
              <Box className={classes.wrap} >
                <Typography
                  className={classes.transactionText}>
                  {data?.categoryName}
                </Typography>
                {data?.price < 0
                  ?
                  <Typography className={`${classes.transactionSubText} ${classes.red}`}>
                    {formatMoney(data?.price * -1)}
                  </Typography>
                  :
                  <Typography className={`${classes.transactionSubText} ${classes.green}`}>
                    {formatMoney(data?.price)}
                  </Typography>
                }

                <Typography
                  className={`${classes.transactionSubText}`}>
                  Sự kiện:&nbsp;
                  {data?.eventName ? <Link to="/">{data?.eventName}</Link> : "không có"}
                </Typography>

                <Typography
                  className={`${classes.transactionSubText}`}>
                  Đăng bởi: <b>{data?.userName}</b>
                </Typography>

              </Box>
              <TransactionImages transactionID={data?.id} images={imageList} setImages={handleSetImageList} />
            </div>

            <Divider className={classes.divider} />
            <div className={classes.descriptionBox}>
              <Typography className={classes.description}>
                {data?.description}
              </Typography>
            </div>
          </React.Fragment>
        }
      </div>

    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  red: {
    color: '#FF2626'
  },
  green: {
    color: '#1DAF1A'
  },
  wrap: {
    // width: "100%",
    width: 'auto',
    wordWrap: 'break-word',
    overflow: 'hidden',
    marginLeft: '15px',
    flexGrow: 1
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
    padding: '3px 0px 3px 20px',
    margin: '5px 0px',
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
