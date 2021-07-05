import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Appointments,
  AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  },
  paper: {
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: '20px'
  }
}));

const appointments = [
  {
    title: 'Nghỉ Tết',
    startDate: new Date(2021, 1, 10),
    endDate: new Date(2021, 1, 16),
  }, {
    title: 'Coding',
    startDate: new Date(2021, 1, 24, 20, 30),
    endDate: new Date(2021, 1, 26, 1),
  }, {
    title: 'Deadline',
    startDate: new Date(2021, 2, 31, 20),
    endDate: new Date(2021, 2, 31, 21),
  }, {
    title: "April's Fool",
    startDate: new Date(2021, 3, 1, 0, 0, 1),
    endDate: new Date(2021, 3, 1, 23, 59, 59),
  }
];
const currentDate = Date.now();

export default function Calendar() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '40%', textAlign: 'justify', marginRight: '50px' }}>
          <Typography style={{ color: '#172755', fontSize: '32px', fontWeight: 'bold' }}>
            Nhắc nhở các sự kiện thu chi định kì
          </Typography>
          <Typography style={{ color: '#8794ba', marginTop: '20px' }}>
            Người dùng sẽ không phải quên những chi tiêu cần thiết của mỗi tuần hoặc mỗi tháng. E-Money sẽ lên lịch nhắc nhớ người dùng trước ngày diễn ra các hoạt động này.
          </Typography>
        </div>
        <div style={{ width: '60%', textAlign: 'center' }}>
          <Paper className={classes.paper}>
            <Scheduler data={appointments}>
              <ViewState currentDate={currentDate} />
              <MonthView />
              <Appointments />
              <AppointmentTooltip
                showCloseButton
                showOpenButton
              />
            </Scheduler>
          </Paper>
        </div>
      </div>
    </div>
  );
}
