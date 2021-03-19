import React, { useEffect, useContext } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './components/home/home';
import Statistic from './components/statistic/statistic';
import PrivateRoute from './components/PrivateRoute';
import StickyFooter from './components/stickyFooter/StickyFooter';
import Dashboard from './components/Dashboard/Dashboard';
import Category from './components/Category/Category';
import Menu from "./components/SideBar/Menu";
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/SignUp';
import ActivateDestination from './components/activedestination/ActiveDestination';
import Profile from './components/profile/Profile';
import TeamProfile from './components/Team/TeamProfile';
import config from './constants/config.json';
import { MyProvider } from './components/mycontext/MyContext';
import Teams from "./components/Team/Teams";
import UpdateProfile from "./components/Team/UpdateProfile";
import ResetDestination from './components/signin/resetpassword/ResetDestination';
import { getListIcon } from './utils/DefaultIcon'

const API_URL = config.API_LOCAL;

const routes = [
  {
    path: "/",
    exact: true,
    private: false,
    main: () => <Home />
  },
  {
    path: "/Dashboard/Wallet",
    private: true,
    main: () => <Dashboard />
  },
  {
    path: "/category/:id",
    private: true,
    main: () => <Category />
  },
  {
    path: "/statistic",
    private: true,
    main: () => <Statistic />
  },
  {
    path: "/signin",
    private: false,
    main: () => <SignIn />
  },
  {
    path: '/signup',
    private: false,
    main: () => <SignUp />
  },
  {
    path: '/active/:id',
    private: false,
    main: () => <ActivateDestination />
  },
  {
    path: '/profile',
    private: false,
    main: () => <Profile />
  },
  {
    path: '/teams/create',
    private: true,
    main: () => <TeamProfile />
  },
  {
    path: '/teams/:TeamID/details',
    private: true,
    main: () => <UpdateProfile />
  },
  {
    path: '/teams',
    private: true,
    main: () => <Teams />
  },
  {
    path: '/reset',
    private: false,
    main: () => <ResetDestination />
  }
];

const useStyles = makeStyles((theme) => ({
  body: {
    display: 'flex',
    minHeight: "calc(100vh - 35vh)",
  },
  content: {
    margin: "auto",
    marginTop: '64px',
    width: '100%'
  },
}));

function App() {
  const classes = useStyles();
  getListIcon();

  return (
    <Router>
      <div>
        <CssBaseline />
        <div className={classes.body}>

          <MyProvider>
            <Menu />
            <div className={classes.content}>
              <Switch>
                {routes.map((route, index) => {
                  return (route.private ?
                    <PrivateRoute
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      children={<route.main />}
                    />
                    :
                    <Route
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      children={<route.main />}
                    />
                  )
                })}
                <Route path="/event">
                  <Home />
                </Route>
              </Switch>
            </div>
          </MyProvider>

        </div>
        <StickyFooter />
      </div>
    </Router>
  );
}

export default App;