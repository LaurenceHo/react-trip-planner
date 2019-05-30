import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/icon';
import TextField from '@material-ui/core/TextField';
import { push } from 'connected-react-router';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { SnackbarComponent } from '../components/snackbar';

import store from '../store';
import { clearAlert } from '../store/actions/alert-actions';
import { userRegister } from '../store/actions/user-actions';

interface RegisterPageState {
  email: string;
  password: string;
}

class RegisterPage extends React.Component<any, RegisterPageState> {
  state = {
    username: '',
    email: '',
    password: '',
  };

  handleChange = (name: string) => (event: any) => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    this.props.clearAlert();
  };

  render() {
    const { username, email, password } = this.state;
    const { alert } = this.props;

    const RegisterButton = (
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          if (isEmpty(username) || isEmpty(email) || isEmpty(password)) {
            return;
          }
          const user = {
            username,
            email,
            password,
          };
          this.props.userRegister(user);
        }}>
        Register
        <Icon>send</Icon>
      </Button>
    );

    const LoginRedirectButton = withRouter(({ history }) => (
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          history.push('/login');
          store.dispatch(push('/login'));
        }}>
        Login
      </Button>
    ));

    return (
      <div className='container'>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12}>
            <LoginRedirectButton />
          </Grid>
        </Grid>
        {alert.type !== null && !isEmpty(alert.message) ? (
          <SnackbarComponent
            open={alert.type !== null && !isEmpty(alert.message)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            message={alert.message}
            variant={alert.type}
            onClose={this.handleClose}
          />
        ) : null}
        )
        <div className='user-form'>
          <div className='user-form-title-container'>
            <h3 className='user-form-title '>Register</h3>
          </div>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                label='Username'
                name='username'
                margin='normal'
                variant='outlined'
                value={username}
                onChange={this.handleChange('username')}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                label='Email'
                name='email'
                type='email'
                autoComplete='email'
                margin='normal'
                variant='outlined'
                value={email}
                onChange={this.handleChange('email')}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                label='Password'
                name='password'
                type='password'
                autoComplete='current-password'
                margin='normal'
                variant='outlined'
                value={password}
                onChange={this.handleChange('password')}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              {RegisterButton}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    alert: state.alert,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      clearAlert,
      userRegister,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPage);
