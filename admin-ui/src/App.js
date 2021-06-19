import React, { useContext } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PrivateRoute from './components/PrivateRoute';
import StickyFooter from './components/stickyFooter/StickyFooter';
import CategoryAdmin from './components/category/CategoryAdmin';
import Menu from './components/SideBar/Menu';
import MyContext from './components/mycontext/MyContext';
import CombinedProvider from './components/mycontext/combineProvider'
import { getListIcon } from './utils/DefaultIcon';
import SignIn from './components/signin/SignIn';
import TeamList from './components/Teams/TeamList.js'
import ResetDestination from './components/signin/resetpassword/ResetDestination';
import Profile from './components/profile/Profile';
import UserList from './components/user/UserList';
import IconList from './components/icon/Icon';

const routes = [
  {
    path: "/users",
    private: false,
    main: () => <UserList />
  },
  {
    path: "/icon",
    private: false,
    main: () => <IconList />
  },
  {
    path: "/Category",
    private: false,
    main: () => <CategoryAdmin />
  },
  // {
  //   path: "/Teams",
  //   private: false,
  //   main: () => <TeamList />
  // },
  {
    path: '/reset',
    private: false,
    main: () => <ResetDestination />
  },
  {
    path: "/signin",
    private: false,
    main: () => <SignIn />
  },
  {
    path: '/profile',
    private: true,
    main: () => <Profile />
  },
  {
    path: "/",
    exact: true,
    private: false,
    main: () => <UserList />
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
  const history = useHistory();
  
  const { isLoggedIn } = useContext(MyContext);
  if (isLoggedIn) {
    getListIcon();
  } else {
    history.push('/signin')
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
                  <UserList />
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