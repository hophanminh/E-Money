import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  PieSeries,
  Title,
  Legend,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker, Palette } from '@devexpress/dx-react-chart';
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

const scheme = ["#9ec98d", "#4d774e", "#eae45a", "#fda92c", "#164a41", "#6df670", "#1b5804", "#1daf1a", "#a0cf1a", "#9fff01"];

const chartData = [
  { type: 'Học tập', value: 6250000 },
  { type: 'Ăn uống', value: 1250000 },
  { type: 'Di chuyển', value: 1250000 },
  { type: 'Mua sắm', value: 1250000 },
];

export default function PieChartSpent({ date }) {
  const classes = useStyles();

  const [targetItem, setTargetItem] = useState(null);

  const changeTargetItem = (target) => {
    setTargetItem(target);
  }

  return (
    <div className={classes.container}>
      <div>
        <Paper className={classes.paper} style={{ width: '45%', float: 'left' }}>
          <Chart data={chartData}>
            <Palette scheme={scheme} />
            <PieSeries valueField="value" argumentField="type" />
            <Title text={"Thống kê các khoản chi tháng " + (date.getMonth() + 1) + "/" + date.getFullYear()} />
            <Legend />
            <Animation />
            <EventTracker />
            <Tooltip targetItem={targetItem} onTargetItemChange={(target) => changeTargetItem(target)} />
          </Chart>
        </Paper>
      </div>
    </div>
  );
}