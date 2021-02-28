import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import NavBar from './components/navBar/navBar';
import Home from './components/home/home';
import PrivateRoute from './components/PrivateRoute';
import StickyFooter from './components/stickyFooter/StickyFooter';
import Dashboard from './components/dashboard/Dashboard';
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/SignUp';
import ActivateDestination from './components/activedestination/ActiveDestination';
const routes = [
  {
    path: "/",
    exact: true,
    private: false,
    main: () => <Home />
  },
  {
    path: "/dashboard",
    private: true,
    main: () => <Dashboard />
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
  }
];

function App() {
  return (
    <Router>
      <div className="App">
        {/* <NavBar /> */}
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
        {/* <StickyFooter /> */}
      </div>
    </Router>
  );
}

export default App;
