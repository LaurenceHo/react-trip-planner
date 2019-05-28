import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/icon';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { isEmpty } from 'lodash';
import * as React from 'react';

import store, { history } from '../store';
import { UserService } from '../services/user-service';
import { SnackbarComponent } from '../components/snackbar';
import { push } from 'connected-react-router';

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

export const Register = () => {
  const [open, setOpen] = React.useState(false);

  const [status, setStatus] = React.useState({
    success: null,
    message: '',
  });

  const [values, setValues] = React.useState({
    username: '',
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
    if (isEmpty(values.username) || isEmpty(values.email) || isEmpty(values.password)) {
      return;
    }

    const user = {
      username: values.username,
      email: values.email,
      password: values.password,
    };

    userService
      .register(user)
      .then((result: any) => {
        if (result.success) {
          setOpen(true);
          setStatus({
            success: true,
            message: 'You are all set! Will redirect to login page in 5 secs...',
          });
          // TODO - redirect to login page
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

  const goToLoginPage = () => {
    history.push('/login');
    store.dispatch(push('/login'));
  };

  return (
    <div className='container'>
      <Grid container direction='row' justify='center' alignItems='center'>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' className={classes.button} onClick={goToLoginPage}>
            Login
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
          <h3 className='user-form-title '>Register</h3>
        </div>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
            <TextField
              className={classes.textField}
              label='Username'
              name='username'
              margin='normal'
              variant='outlined'
              value={values.username}
              onChange={handleChange('username')}
              required
              fullWidth
            />
          </Grid>
        </Grid>
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
              Register
              <Icon className={classes.rightIcon}>send</Icon>
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
