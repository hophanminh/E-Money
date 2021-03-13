import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker } from '@devexpress/dx-react-chart';
import { makeStyles } from '@material-ui/core/styles';

const data = [
  { title: '', spent: 0 },
  { title: 'Chi', spent: 1900000 },
  { title: 'Thu', earned: 3000000 },
  { title: ' ', earned: 0 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  },
  paper: {
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: '20px'
  }
}));

export default function BarChart({ date }) {
  const classes = useStyles();

  const [targetItem, setTargetItem] = useState(null);

  const changeTargetItem = (target) => {
    setTargetItem(target);
  }

  return (
    <div className={classes.container}>
      <div>
        <Paper className={classes.paper} style={{ width: '50%', margin: 'auto' }}>
          <Chart data={data}>
            <ArgumentAxis />
            <ValueAxis />
            <BarSeries
              barWidth={0.6}
              valueField="spent"
              argumentField="title"
              color="#ff2626"
            />
            <BarSeries
              barWidth={0.6}
              valueField="earned"
              argumentField="title"
              color="#1daf1a"
            />
            <Title text={"Thu nhập trong tháng " + (date.getMonth() + 1) + "/" + date.getFullYear()} />
            <EventTracker />
            <Tooltip targetItem={targetItem} onTargetItemChange={(target) => changeTargetItem(target)} />
            <Animation />
          </Chart>
        </Paper>
      </div>
    </div>
  );
}