import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        true
          ? (children)
          : (
            <Redirect
              to={{
                pathname: "/Home",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

export default PrivateRoute;