import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/icon';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { UserService } from '../services/user-service';

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
}));

export const Register = () => {
  const [values, setValues] = React.useState({
    username: '',
    email: '',
    password: '',
  });

  const classes = useStyles();

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
          // TODO - redirect to login page
        } else {
          // TODO - error message
        }
      })
      .catch((error: any) => {
        // TODO - error message
      });
  };

  return (
    <div className='container'>
      <div className='user-form'>
        <div className='user-form-title-container'>
          <h3 className='user-form-title '>Register</h3>
        </div>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
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
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
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
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
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
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
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
