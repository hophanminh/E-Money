import React, { useState, useEffect, useContext } from 'react';
import { Route, Redirect } from "react-router-dom";
import MyContext from './mycontext/MyContext';
import CircularProgress from '@material-ui/core/CircularProgress';

function PrivateRoute({ children, ...rest }) {
  const { isLoggedIn, isLoading } = useContext(MyContext);

  console.log(isLoading);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isLoading
          ? (
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
          )
          : (
            <CircularProgress />
          )
      }
    />
  );
}

export default PrivateRoute;