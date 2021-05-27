import React, { useContext } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './components/home/home';
import Statistic from './components/statistic/statistic';
import PrivateRoute from './components/PrivateRoute';
import StickyFooter from './components/stickyFooter/StickyFooter';
import Dashboard from './components/Dashboard/Dashboard';
import TeamDashBoard from './components/TeamDashBoard/TeamDashBoard';
import Category from './components/Category/Category';
import Event from './components/Event/Event';
import Menu from './components/SideBar/Menu';
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/SignUp';
import ActivateDestination from './components/activedestination/ActiveDestination';
import Profile from './components/profile/Profile';
import TeamProfile from './components/Team/TeamProfile';
import TeamStatistic from './components/Team/TeamStatistic';
import MyContext from './components/mycontext/MyContext';
import CombinedProvider from './components/mycontext/combineProvider'
import Teams from './components/Team/Teams';
import UpdateProfile from './components/Team/UpdateProfile';
import ResetDestination from './components/signin/resetpassword/ResetDestination';
import Admin from './components/admin/admin';
import { getListIcon } from './utils/DefaultIcon';

const routes = [
  {
    path: "/Wallet/:id/category",
    private: true,
    main: () => <Category />
  },
  {
    path: "/Wallet/:id/event",
    private: true,
    main: () => <Event />
  },
  {
    path: "/Wallet/:id",
    private: true,
    main: () => <TeamDashBoard />
  },
  {
    path: "/Wallet",
    private: true,
    main: () => <Dashboard />
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
    private: true,
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
    path: '/teams/:TeamID/statistic',
    private: true,
    main: () => <TeamStatistic />
  },
  {
    path: '/teams',
    private: true,
    main: () => <Teams />
  },
  {
    path: '/admin',
    private: true,
    main: () => <Admin />
  },
  {
    path: '/reset',
    private: false,
    main: () => <ResetDestination />
  },
  {
    path: "/",
    exact: true,
    private: false,
    main: () => <Home />
  },
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

  const { isLoggedIn } = useContext(MyContext);
  if (isLoggedIn) {
    getListIcon();
  }

  return (
    <Router>
      <div>
        <CssBaseline />
        <div className={classes.body}>

          <CombinedProvider>
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
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </CombinedProvider>

        </div>
        <StickyFooter />
      </div>
    </Router>
  );
}

export default App;