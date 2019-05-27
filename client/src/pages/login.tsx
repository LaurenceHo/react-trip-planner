import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/icon';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import * as React from 'react';

import { User } from '../models/user';
import { UserService } from '../services/user-service';

const user: User = JSON.parse(localStorage.getItem('user'));
const userService = new UserService();

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export const Login = () => {
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  const classes = useStyles();

  const handleChange = (name: string) => (event: any) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    const user = {
      email: values.email,
      password: values.password,
    };

    userService
      .login(user)
      .then((result: any) => {
        if (result.success) {
          localStorage.setItem('user', JSON.stringify(result.user));
        } else {
          // TODO
        }
      })
      .catch((error: any) => {
        // TODO
      });
  };

  return (
    <div className='container'>
      <div className='user-form'>
        <div className='user-form-title-container'>
          <h3 className='user-form-title '>Sign In</h3>
        </div>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={10}>
            <FormControl fullWidth className={classes.formControl} variant='outlined' required>
              <InputLabel htmlFor='user-email'>Email</InputLabel>
              <OutlinedInput
                id='user-email'
                name='email'
                value={values.email}
                onChange={handleChange('email')}
                labelWidth={50}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={10}>
            <FormControl fullWidth className={classes.formControl} variant='outlined' required>
              <InputLabel htmlFor='user-password'>Password</InputLabel>
              <OutlinedInput
                id='user-password'
                name='password'
                value={values.password}
                onChange={handleChange('password')}
                labelWidth={50}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={10}>
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
