import React, { useState, useEffect, useContext } from 'react';
import { Route, Redirect } from "react-router-dom";
import MyContext from './mycontext/MyContext';
import CircularProgress from '@material-ui/core/CircularProgress';

function PrivateRoute({ children, ...rest }) {
  const { isLoggedIn } = useContext(MyContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
      isLoggedIn
      ? (children)
      : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: location }
          }}
        />
        )
      }
    />
  );
}

export default PrivateRoute;


