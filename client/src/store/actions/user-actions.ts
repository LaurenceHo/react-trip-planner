import { push } from 'connected-react-router';
import { Action, ActionCreator, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { USER_LOGIN_FAILURE, USER_LOGIN_SUCCESS } from '../types';
import { alertError, alertSuccess, clearAlert } from './alert-actions';

const userService = new UserService();

export const userLoginSuccess: ActionCreator<Action> = (userAccount: User) => {
  return {
    type: USER_LOGIN_SUCCESS,
    userAccount,
  };
};

export const userLoginFailure: ActionCreator<Action> = () => {
  return {
    type: USER_LOGIN_FAILURE,
  };
};

export const userLogin = (userLoginPayload: { email: string; password: string }) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    userService
      .login(userLoginPayload)
      .then((result: any) => {
        if (result.success) {
          localStorage.setItem('user', JSON.stringify(result.user));
          dispatch(userLoginSuccess(result.user));
          dispatch(push('/dashboard'));
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

export const userRegister = (userLoginPayload: { username: string; email: string; password: string }) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    userService
      .register(userLoginPayload)
      .then((result: any) => {
        if (result.success) {
          dispatch(alertSuccess('You are all set! Will redirect to login page in 3 secs...'));
          setTimeout(() => {
            dispatch(push('/login'));
            dispatch(clearAlert());
          }, 3000);
        } else {
          dispatch(alertError(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(alertError(error));
      });
  };
};
