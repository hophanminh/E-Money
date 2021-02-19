import React from 'react';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

}));

export default function Home() {
  const classes = useStyles();
  return (
    <>
      <Container maxWidth="xl">
        Home
      </Container>
    </>
  );
}