import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import BarChart from './barChart';
import PieChartSpent from './pieChartSpent';
import PieChartIncome from './pieChartIncome';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  }
}));

export default function Charts({ date }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <BarChart date={date} />

      {/* Chi */}
      <PieChartSpent date={date} />

      {/* Tiêu */}
      <PieChartIncome date={date} />
    </div>
  );
}