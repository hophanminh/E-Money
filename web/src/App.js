import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './components/home/home';
import PrivateRoute from './components/PrivateRoute';
import StickyFooter from './components/stickyFooter/StickyFooter';
import Dashboard from './components/Dashboard/Dashboard';
import Menu from "./components/SideBar/Menu";

const routes = [
  {
    path: "/",
    exact: true,
    private: false,
    main: () => <Home />
  },
  {
    path: "/Dashboard",
    private: true,
    main: () => <Dashboard />
  },

];

const useStyles = makeStyles((theme) => ({
  body: {
    display: 'flex',
    minHeight: "calc(100vh - 35vh)",
  },
  content: {
    margin: "auto",
    marginTop: '100px',
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div>
        <CssBaseline />
        <div className={classes.body}>
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
              <Route path="*">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
        <StickyFooter />
      </div>
    </Router>
  );
}

export default App;
