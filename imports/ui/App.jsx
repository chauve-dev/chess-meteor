
import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';

// route components

import NotFoundPage from './pages/NotFoundPage';
import AppContainer from './pages/AppContainer';
import GameContainer from './pages/GameContainer';

const browserHistory = createBrowserHistory();

export const App = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={AppContainer}/>
      <Route exact path="/games/:id" component={GameContainer}/>
      <Route component={NotFoundPage}/>
    </Switch>
  </Router>
);