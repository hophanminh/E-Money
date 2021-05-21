import React, { useState } from 'react';
import { Typography, Paper } from '@material-ui/core';
import {
  Chart,
  PieSeries,
  Title,
  Legend,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { Animation, EventTracker } from '@devexpress/dx-react-chart';
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

const chartData = [
  { type: 'Học tập', value: 6250000 },
  { type: 'Ăn uống', value: 1250000 },
  { type: 'Di chuyển', value: 1250000 },
  { type: 'Mua sắm', value: 1250000 },
];

export default function Statistic() {
  const classes = useStyles();

  const [targetItem, setTargetItem] = useState(null);

  const changeTargetItem = (target) => {
    setTargetItem(target);
  }

  return (
    <div className={classes.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '50%' }}>
          <Paper className={classes.paper}>
            <Chart data={chartData}>
              <PieSeries valueField="value" argumentField="type" outerRadius={0.75} />
              <Title text="Thống kê chi tiêu tháng" />
              <Legend />
              <Animation />
              <EventTracker />
              <Tooltip targetItem={targetItem} onTargetItemChange={(target) => changeTargetItem(target)} />
            </Chart>
          </Paper>
        </div>
        <div style={{ width: '50%', textAlign: 'justify', marginLeft: '50px' }}>
          <Typography style={{ color: '#172755', fontSize: '32px', fontWeight: 'bold' }}>
            Thống kê tài chính
          </Typography>
          <Typography style={{ color: '#8794ba', marginTop: '20px' }}>
            E-Money sẽ giúp người dùng tạo báo cáo hoạt động thu chi một cách trực quan, dễ phân tích. Người dùng sẽ dựa vào biểu đồ phân tích mà có phương án chi tiêu hiệu quả hơn trong tương lai.
          </Typography>
        </div>
      </div>
    </div>
  );
}