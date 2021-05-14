import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/home/home';
import Hello from './components/test/Hello';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
