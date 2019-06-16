import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/icon';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import { Formik, FormikActions, FormikProps } from 'formik';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { SnackbarComponent } from '../components/snackbar';
import myTheme from '../components/theme';
import { userLoginValidationSchema } from '../constants/validation';
import { clearAlert, createAlert } from '../store/actions/alert-actions';
import { userLogin } from '../store/actions/user-actions';

const styles = {
  loginButton: {
    marginTop: '0.5rem',
  },
  sendIcon: {
    marginLeft: '0.5rem',
  },
  registerRedirectButton: {
    margin: '1rem 0 0 1rem',
  },
};

interface LoginFormTypes {
  email: string;
  password: string;
}

class Login extends React.Component<any, any> {
  render() {
    const { classes, alert, history } = this.props;

    const LoginButton = (isValid: boolean) => (
      <Button className={classes.loginButton} disabled={!isValid} variant='contained' color='primary' type='submit'>
        Login
        <Icon className={classes.sendIcon}>send</Icon>
      </Button>
    );

    const RegisterRedirectButton = (
      <Button
        className={classes.registerRedirectButton}
        variant='contained'
        color='primary'
        onClick={() => history.push('/register')}>
        Register
      </Button>
    );

    const LoginForm = (props: FormikProps<LoginFormTypes>) => {
      const {
        values: { email, password },
        errors,
        touched,
        handleChange,
        isValid,
        handleSubmit,
        setFieldTouched,
      } = props;

      const change = (name, e) => {
        e.persist();
        handleChange(e);
        setFieldTouched(name, true, false);
      };

      return (
        <form method='POST' onSubmit={handleSubmit}>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                label='Email'
                name='email'
                helperText={touched.email ? errors.email : ''}
                error={touched.email && Boolean(errors.email)}
                margin='normal'
                value={email}
                onChange={change.bind(null, 'email')}
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
                helperText={touched.password ? errors.password : ''}
                error={touched.password && Boolean(errors.password)}
                margin='normal'
                value={password}
                onChange={change.bind(null, 'password')}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              {LoginButton(isValid)}
            </Grid>
          </Grid>
        </form>
      );
    };

    return (
      <MuiThemeProvider theme={myTheme}>
        <div className='container'>
          <Grid container direction='row' justify='center' alignItems='center'>
            <Grid item xs={12}>
              {RegisterRedirectButton}
            </Grid>
          </Grid>
          {alert.type !== null && !isEmpty(alert.message) && (
            <SnackbarComponent
              open={alert.type !== null && !isEmpty(alert.message)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              message={alert.message}
              variant={alert.type}
              onClose={() => this.props.clearAlert()}
            />
          )}
          <div className='user-form'>
            <div className='user-form-title-container'>
              <h3 className='user-form-title '>Login</h3>
            </div>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={userLoginValidationSchema}
              onSubmit={(values: LoginFormTypes, actions: FormikActions<LoginFormTypes>) => {
                actions.setSubmitting(false);
                this.props.userLogin(values);
              }}
              render={(props: FormikProps<LoginFormTypes>) => <LoginForm {...props} />}
            />
          </div>
        </div>
      </MuiThemeProvider>
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
      createAlert,
      userLogin,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Login));
