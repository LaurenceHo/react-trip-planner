import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import store, { history } from '../store';
import { TripDashboard } from './trip-dashboard';
import { Login } from './login';
import { Register } from './register';

export class App extends React.Component<any, any> {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router>
            <Switch>
              <Route exact={true} path='/' component={TripDashboard as any} />
              <Route path='/login' component={Login as any} />
              <Route path='/register' component={Register as any} />
            </Switch>
          </Router>
        </ConnectedRouter>
      </Provider>
    );
  }
}
