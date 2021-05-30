import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  SeriesTemplate,
  CommonSeriesSettings,
  Title,
  Legend,
  Tooltip
} from 'devextreme-react/chart';
import { makeStyles } from '@material-ui/core/styles';
import { customizeTextForTooltip } from '../../utils/helper';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  },
  paper: {
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: '20px',
  },
  chart: {
    padding: 20
  }
}));

export default function BarChart({ date, chartData }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div style={{ margin: 'auto' }}>
        <Paper className={classes.paper}>
          <Chart
            id="chart"
            className={classes.chart}
            palette={['#ff2626', '#1daf1a']}
            dataSource={chartData}
          >
            <Title text={"Thu nhập trong tháng " + (date.getMonth() + 1) + "/" + date.getFullYear()} />
            <CommonSeriesSettings
              argumentField="title"
              valueField="money"
              type="bar"
              barWidth={100}
              ignoreEmptyPoints={true}
            />
            <Legend
              orientation="horizontal"
              itemTextPosition="right"
              horizontalAlignment="center"
              verticalAlignment="bottom"
              columnCount={2}
            />
            <SeriesTemplate nameField="title" />
            <Tooltip enabled={true} customizeTooltip={customizeTextForTooltip} />
          </Chart>
        </Paper>
      </div>
    </div>
  );
}