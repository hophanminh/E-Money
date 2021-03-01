import React from 'react';
import {
  Container,
  Breadcrumbs,
  Typography,
  Link,
  makeStyles,
} from '@material-ui/core/';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: (theme) => ({
    width: '90%',
    minHeight: '100%',
    borderRadius: '4px',
    paddingBottom: '24px',
    paddingTop: '24px',
  }),
  card: (theme) => ({
    backgroundColor: theme.body,
    border: theme.fieldBorder,
  }),

}));

export default function Dashboard() {
  const classes = useStyles();

  const handleClick = (event) => {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  return (
    <>
      <Container className={classes.root} maxWidth="xl">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link color="inherit" href="/" onClick={handleClick}>
            Material-UI
        </Link>
          <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
            Core
        </Link>
          <Typography color="textPrimary">Breadcrumb</Typography>
        </Breadcrumbs>
      </Container>
    </>
  );
}