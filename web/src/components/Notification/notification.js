import React from 'react';
import { Container, Popover } from '@material-ui/core';

export default function Notification() {
  return (
    <>
      <Container component="main" maxWidth="xl">
        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          The content of the Popover.
        </Popover>
      </Container>
    </>
  );
}