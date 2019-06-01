import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { Provider, ReactReduxContext } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { User } from '../models/user';
import store, { history } from '../store';
import LoginPage from './login';
import RegisterPage from './register';
import TripDashboard from './trip-dashboard';

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
      <Provider store={store} context={ReactReduxContext}>
        <ConnectedRouter history={history} context={ReactReduxContext}>
          <Router history={history}>
            <Switch>
              <PrivateRoute exact path='/' component={TripDashboard as any} />
              <Route path='/login' component={LoginPage as any} />
              <Route path='/register' component={RegisterPage as any} />
            </Switch>
          </Router>
        </ConnectedRouter>
      </Provider>
    );
  }
}
