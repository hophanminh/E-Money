import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom'
import {
  Typography,
  Box,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  Badge,
  makeStyles,
} from '@material-ui/core/';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import MyContext from '../mycontext/MyContext';
import config from '../../constants/config.json';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { NavigateBeforeSharp } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';


const API_URL = config.API_LOCAL;



const MembersOfTeam = (props) => {
  const classes = useStyles();

  const { members, isAdmin, teamID, getTeamMembers } = props;
  const token = localStorage.getItem('jwtToken');
  const userID = localStorage.getItem('userID');

  const handleRemoveMember = async (userID) => {
    const data = {
      teamID: teamID
    }
    const res = await fetch(`${API_URL}/teams/remove/${userID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    }).then(getTeamMembers);
    handleClose();
  }

  const [target, setTarget] = React.useState({});
  const [open, setOpenDeleteDialog] = React.useState(false);

  const handleClickOpen = (target) => {
    setTarget(target);
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.accordionHead} >
          <FormatListBulletedIcon className={classes.accordionHeadIcon} />
          <Typography className={classes.accordionHeadText}>Danh sách thành viên ({members.length})</Typography>
        </AccordionSummary>
        <Divider className={classes.divider} />
        {(members || []).map(cat => {
          return (
            <React.Fragment key={cat?.ID}>
              <AccordionDetails className={classes.accordionDetail}>
                <Box>
                  <Avatar className={classes.avatar}>
                  </Avatar>
                </Box>
                <Box className={classes.categoryInfo}>
                  <Typography
                    noWrap={false}
                    className={classes.categoryText}>
                    {cat?.Name} ({(cat?.Role === 1) ? `Admin` : `Member`})
                  </Typography>
                </Box>
                <Box>
                  {(isAdmin && cat?.ID !== userID) ?
                    <div>
                      <Button onClick={(e) => handleClickOpen(cat)}>
                        <HighlightOffIcon></HighlightOffIcon>
                      </Button>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle >
                          <Typography className={classes.title}>
                            Bạn có thực sự muốn xóa thành viên {target.Name} ra khỏi nhóm
                         </Typography>
                        </DialogTitle>
                        <DialogActions>
                          <Button style={{ color: "white", backgroundColor: "green", marginLeft: 10 }} variant="contained" color="primary" className={classes.margin} onClick={handleClose}>
                            Hủy
                       </Button>
                          <Button style={{ color: "white", backgroundColor: "red", marginLeft: 10 }} variant="contained" color="primary" className={classes.margin} onClick={(e) => handleRemoveMember(target.ID)}>
                            Xóa
                       </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                    : ""}

                </Box>
              </AccordionDetails>
              <Divider className={classes.divider} />
            </React.Fragment>
          )
        })}

      </Accordion>
    </div>
  );
}

export default MembersOfTeam

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
    marginBottom: '40px'
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
    backgroundColor: '#fd9b15',
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
  categoryInfo: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: '16px',
    marginLeft: '10px'
  },
  avatar: {
    width: "25px",
    height: '25px',
    backgroundColor: '#FF2626'
  },
  categoryNumber: {
    fontSize: '14px',
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
    backgroundColor: '#fd9b15',
    color: '#FFFFFF',
    fontWeight: 'bold',
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "#fd9b15"
    }

  },
}));