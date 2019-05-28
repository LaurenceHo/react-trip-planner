import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/icon';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { push } from 'connected-react-router';

import store, { history } from '../store';
import { UserService } from '../services/user-service';
import { SnackbarComponent } from '../components/snackbar';

const userService = new UserService();

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export const Login = () => {
  const [open, setOpen] = React.useState(false);

  const [status, setStatus] = React.useState({
    success: null,
    message: '',
  });

  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  const classes = useStyles();

  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleChange = (name: string) => (event: any) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    if (isEmpty(values.email) || isEmpty(values.password)) {
      return;
    }

    const user = {
      email: values.email,
      password: values.password,
    };

    userService
      .login(user)
      .then((result: any) => {
        if (result.success) {
          localStorage.setItem('user', JSON.stringify(result.user));
          // TODO - redirect to dashboard
          store.dispatch(push('/'));
        } else {
          setOpen(true);
          setStatus({
            success: false,
            message: result.error,
          });
        }
      })
      .catch((error: any) => {
        setOpen(true);
        setStatus({
          success: false,
          message: error,
        });
      });
  };

  const goToRegisterPage = () => {
    history.push('/register');
    store.dispatch(push('/register'));
  };

  return (
    <div className='container'>
      <Grid container direction='row' justify='center' alignItems='center'>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' className={classes.button} onClick={goToRegisterPage}>
            Register
          </Button>
        </Grid>
      </Grid>
      {status.success !== null && !isEmpty(status.message) ? (
        <SnackbarComponent
          open={open}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          message={status.message}
          variant={status.success === true ? 'success' : 'error'}
          className={classes.margin}
          onClose={handleClose}
        />
      ) : null}
      <div className='user-form'>
        <div className='user-form-title-container'>
          <h3 className='user-form-title '>Login</h3>
        </div>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            <TextField
              className={classes.textField}
              label='Email'
              name='email'
              type='email'
              autoComplete='email'
              margin='normal'
              variant='outlined'
              value={values.email}
              onChange={handleChange('email')}
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            <TextField
              className={classes.textField}
              label='Password'
              name='password'
              type='password'
              autoComplete='current-password'
              margin='normal'
              variant='outlined'
              value={values.password}
              onChange={handleChange('password')}
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            <Button variant='contained' color='primary' className={classes.button} onClick={handleSubmit}>
              Login
              <Icon className={classes.rightIcon}>send</Icon>
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
