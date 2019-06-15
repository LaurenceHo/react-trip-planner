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
import { userRegisterValidationSchema } from '../components/validation';
import { clearAlert, createAlert } from '../store/actions/alert-actions';
import { userRegister } from '../store/actions/user-actions';

const styles = {
  registerButton: {
    marginTop: '0.5rem',
  },
  sendIcon: {
    paddingLeft: '0.5rem',
  },
  login1RedirectButton: {
    margin: '1rem 0 0 1rem',
  },
};

interface RegisterFormTypes {
  username: string;
  email: string;
  password: string;
}

class Register extends React.Component<any, any> {
  render() {
    const { classes, alert, history } = this.props;

    const RegisterButton = (isValid: boolean) => (
      <Button className={classes.registerButton} disabled={!isValid} variant='contained' color='primary' type='submit'>
        Register
        <Icon className={classes.sendIcon}>send</Icon>
      </Button>
    );

    const LoginRedirectButton = (
      <Button
        className={classes.login1RedirectButton}
        variant='contained'
        color='primary'
        onClick={() => history.push('/login')}>
        Login
      </Button>
    );

    const RegisterForm = (props: FormikProps<RegisterFormTypes>) => {
      const {
        values: { username, email, password },
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
            <Grid container direction='row' justify='center' alignItems='center'>
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  label='Username'
                  name='username'
                  helperText={touched.username ? errors.username : ''}
                  error={touched.username && Boolean(errors.username)}
                  margin='normal'
                  value={username}
                  onChange={change.bind(null, 'username')}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
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
              {RegisterButton(isValid)}
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
              {LoginRedirectButton}
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
              <h3 className='user-form-title '>Register</h3>
            </div>
            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
              }}
              validationSchema={userRegisterValidationSchema}
              onSubmit={(values: RegisterFormTypes, actions: FormikActions<RegisterFormTypes>) => {
                actions.setSubmitting(false);
                this.props.userRegister(values);
              }}
              render={(props: FormikProps<RegisterFormTypes>) => <RegisterForm {...props} />}
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
      userRegister,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Register));
