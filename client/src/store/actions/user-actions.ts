import { push } from 'connected-react-router';

import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { USER_LOGIN_FAILURE, USER_LOGIN_SUCCESS } from '../types';
import { alertError } from './alert-actions';

const userService = new UserService();

export const userLoginSuccess = (userAccount: User) => {
  return {
    type: USER_LOGIN_SUCCESS,
    userAccount,
  };
};

export const userLoginFailure = () => {
  return {
    type: USER_LOGIN_FAILURE,
  };
};

export const userLogin = (userLoginPayload: { email: string; password: string }) => {
  return (dispatch: any) => {
    return userService
      .login(userLoginPayload)
      .then((result: any) => {
        if (result.success) {
          localStorage.setItem('user', JSON.stringify(result.user));
          dispatch(push('/'));
          dispatch(userLoginSuccess(result.user));
        } else {
          dispatch(userLoginFailure());
          dispatch(alertError(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(userLoginFailure());
        dispatch(alertError(error));
      });
  };
};
