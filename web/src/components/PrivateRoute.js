import React, { useState, useEffect, useContext } from 'react';
import { Route, Redirect } from "react-router-dom";
import MyContext from './mycontext/MyContext';
import CircularProgress from '@material-ui/core/CircularProgress';

function PrivateRoute({ children, ...rest }) {
  const { isLoggedIn, isLoading } = useContext(MyContext);

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
            <div style={{ height: '100%', marginTop: '100px',display: "flex", justifyContent: 'center', alignItems: 'center'}}>
              <CircularProgress />
            </div>
          )
      }
    />
  );
}

export default PrivateRoute;