import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import store, { history } from '../store';
import { TripDashboard } from './trip-dashboard';
import { Login } from './login';
import { Register } from './register';
import { User } from '../models/user';

export class App extends React.Component<any, any> {
  render() {
    const user: User = JSON.parse(localStorage.getItem('user'));

    const PrivateRoute = ({ component: Component, ...rest }: any) => {
      return (
        <Route
          {...rest}
          render={props =>
            user ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
            )
          }
        />
      );
    };

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router>
            <Switch>
              <PrivateRoute exact path='/' component={TripDashboard as any} />
              <Route path='/login' component={Login as any} />
              <Route path='/register' component={Register as any} />
            </Switch>
          </Router>
        </ConnectedRouter>
      </Provider>
    );
  }
}
