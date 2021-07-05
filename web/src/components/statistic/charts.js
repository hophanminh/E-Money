import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BarChart from './barChart';
import PieChartSpent from './pieChartSpent';
import PieChartIncome from './pieChartIncome';
import { Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    minHeight: '100%',
    paddingBottom: '24px',
  },
  container: {
    margin: '50px 20px 20px 30px'
  }
}));

export default function Charts({ date, barChartData, pieChartSpentData, pieChartIncomeData }) {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <div className={classes.container}>
        <BarChart date={date} chartData={barChartData} />
        <div>
          {/* Chi */}
          {barChartData[0]?.money === 0
            ? <></>
            : <PieChartSpent date={date} chartData={pieChartSpentData} />
          }

          {/* Thu */}
          {barChartData[1]?.money === 0
            ? <></>
            : <PieChartIncome date={date} chartData={pieChartIncomeData} />
          }
        </div>
      </div>
    </Container>
  );
}
