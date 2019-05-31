import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/icon';
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/styles';
import { push } from 'connected-react-router';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { SnackbarComponent } from '../components/snackbar';
import store from '../store';
import { alertError, clearAlert } from '../store/actions/alert-actions';
import { userLogin } from '../store/actions/user-actions';

interface LoginPageState {
  email: string;
  password: string;
}

class LoginPage extends React.Component<any, LoginPageState> {
  state = {
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
    const { email, password } = this.state;
    const { alert } = this.props;

    const formSubmit = () => {
      if (isEmpty(email) || isEmpty(password)) {
        this.props.alertError('Email or password cannot be empty');
      } else {
        const user = {
          email,
          password,
        };
        this.props.userLogin(user);
      }
    };

    const MyLoginButton = styled(Button)({
      marginTop: '0.8rem',
    });

    const MySendIcon = styled(Icon)({
      paddingLeft: '0.5rem',
    });

    const LoginButton = (
      <MyLoginButton variant='contained' color='primary' type='submit' onClick={formSubmit}>
        Login
        <MySendIcon>send</MySendIcon>
      </MyLoginButton>
    );

    const MyRegisterButton = styled(Button)({
      margin: '1rem 0 0 1rem',
    });

    const RegisterRedirectButton = (
      <MyRegisterButton
        variant='contained'
        color='primary'
        onClick={() => {
          store.dispatch(push('/register'));
        }}>
        Register
      </MyRegisterButton>
    );

    return (
      <div className='container'>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12}>
            {RegisterRedirectButton}
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
        <div className='user-form'>
          <div className='user-form-title-container'>
            <h3 className='user-form-title '>Login</h3>
          </div>
          <form onSubmit={formSubmit}>
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
                {LoginButton}
              </Grid>
            </Grid>
          </form>
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
      alertError,
      userLogin,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
