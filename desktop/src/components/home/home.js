import React from 'react';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Introduction from './introduction.js';
import MainFeatures from './mainFeatures.js';
import GettingStarted from './gettingStarted.js';
import Statistic from './statistic.js';
import Calendar from './calendar.js';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  }
}));

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <Container component="main" maxWidth="xl">
        <Introduction />
        <MainFeatures />
        <GettingStarted />
        <Statistic />
        <Calendar />
      </Container>
    </>
  );
}
