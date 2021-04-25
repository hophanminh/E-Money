import React, { useEffect, useState } from 'react';
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
  { title: '', spent: 0, earned: 0 },
  { title: 'Chi', spent: 1900000, earned: 0 },
  { title: 'Thu', spent: 0, earned: 3000000 },
  { title: ' ', spent: 0, earned: 0 },
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

export default function BarChart({ date, chartData }) {
  const classes = useStyles();

  const [targetItem, setTargetItem] = useState(null);

  const changeTargetItem = (target) => {
    setTargetItem(target);
  }

  return (
    <div className={classes.container}>
      <div style={{ margin: 'auto' }}>
        <Paper className={classes.paper}>
          {chartData.length === 2 ?
            <div style={{ textAlign: 'center' }}>Không có dữ liệu</div> :
            <Chart data={chartData}>
              <ArgumentAxis />
              <ValueAxis />
              <BarSeries
                valueField="spent"
                argumentField="title"
                color="#ff2626"
                barWidth={0.6}
              />
              <BarSeries
                valueField="earned"
                argumentField="title"
                color="#1daf1a"
                barWidth={0.6}
              />
              <Title text={"Thu nhập trong tháng " + (date.getMonth() + 1) + "/" + date.getFullYear()} />
              <EventTracker />
              <Tooltip targetItem={targetItem} onTargetItemChange={(target) => changeTargetItem(target)} />
              <Animation />
            </Chart>
          }
        </Paper>
      </div>
    </div>
  );
}