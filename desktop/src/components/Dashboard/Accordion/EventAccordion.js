import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  makeStyles,
} from '@material-ui/core/';
import {
  EventContext,
  WalletContext
} from '../../mycontext';
import moment from 'moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EventIcon from '@material-ui/icons/Event';
import DefaultIcon from '../../../utils/DefaultIcon';
import { getSocket } from "../../../utils/socket";


const EventAccordion = (props) => {
  const classes = useStyles();
  const socket = getSocket();
  const { eventList } = useContext(EventContext);
  const { walletID, expanded, setExpanded } = useContext(WalletContext);

  const notFinishList = eventList.filter(i => i.Status === 1)
  const list = notFinishList.slice().sort((a, b) => {
    const time1 = moment(a?.NextDate);
    const time2 = moment(b?.NextDate)
    return time1.isBefore(time2);
  }).slice(0, 5);
  const extra = new Array(5 - list?.length).fill(null)

  const handleChangeExpand = () => {
    const name = 'event';
    setExpanded(name !== expanded ? name : 'category');
  }

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordion} expanded={expanded === 'event'} onChange={() => handleChangeExpand()}>
        <AccordionSummary className={classes.accordionHead} expandIcon={<ExpandMoreIcon className={classes.accordionExpandIcon} />} >
          <EventIcon className={classes.accordionHeadIcon} />
          <Typography className={classes.accordionHeadText}>Sự kiện sắp tới</Typography>
        </AccordionSummary>
        <Divider className={classes.divider} />
        {(list || []).map(cat => {
          return (
            <React.Fragment key={cat?.ID}>
              <AccordionDetails className={classes.accordionDetail}>
                <Box className={classes.eventInfo}>
                  <DefaultIcon
                    IconID={cat?.IconID}
                    backgroundSize={40}
                    iconSize={20} />
                  <Typography
                    noWrap={true}
                    className={classes.eventText}>
                    {cat?.Name}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    noWrap={true}
                    className={classes.eventNumber}>
                    {moment(cat?.NextDate).format("DD/MM/YYYY")}
                  </Typography>
                </Box>
              </AccordionDetails>
              <Divider className={classes.divider} />
            </React.Fragment>
          )
        })}
        {(extra || []).map((cat, n) => {
          return (
            <React.Fragment key={n}>
              <AccordionDetails className={classes.accordionDetail} style={{ visibility: 'hidden' }}>
                <Box className={classes.eventInfo}>
                  <DefaultIcon
                    IconID={null}
                    backgroundSize={40}
                    iconSize={20} />
                  <Typography
                    noWrap={true}
                    className={classes.eventText}>
                    {''}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    noWrap={true}
                    className={classes.eventNumber}>
                    {''}
                  </Typography>
                </Box>
              </AccordionDetails>
              <Divider className={classes.divider} />
            </React.Fragment>
          )
        })}

        <Box className={classes.buttonBox}>
          <Link className={classes.buttonBoxLink} to={`/Wallet/${walletID}/event`} style={{ textDecoration: 'none' }} >
            <Button className={classes.button} color='primary' variant="contained">
              Xem thêm
            </Button>
          </Link>
        </Box>
      </Accordion>
    </div>
  );
}

export default EventAccordion;

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
  root: () => ({
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  }),
  accordion: {
    width: '100%',
    "& .MuiAccordionSummary-root.Mui-expanded": {
      minHeight: '58px',
      height: '58px',
    }
  },
  accordionHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6F52ED',
    minHeight: '58px',
    height: '58px',
  },
  accordionHeadIcon: {
    color: "#FFFFFF",
    marginRight: '10px'
  },
  accordionExpandIcon: {
    color: "#FFFFFF",
  },
  accordionHeadText: {
    fontWeight: 'bold',
    color: "#FFFFFF"
  },
  accordionDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px'
  },
  eventInfo: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  eventText: {
    fontSize: '16px',
    marginLeft: '10px'
  },
  eventNumber: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonBoxLink: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: '100%',
    height: '100%',
    padding: '10px',
    backgroundColor: '#6F52ED',
    color: '#FFFFFF',
    fontWeight: 'bold',
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "#6F52ED"
    }
  },
}));
