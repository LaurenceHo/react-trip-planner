import { User } from '../../models/user';
import { USER_LOGIN_FAILURE, USER_LOGIN_SUCCESS } from '../types';

const user: User = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { status: { loggedIn: true }, user } : { status: { loggedIn: false }, user };

export const userReducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return {
        status: { loggedIn: true },
        user: action.userAccount,
      };

    case USER_LOGIN_FAILURE:
      return {
        status: { loggedIn: false },
        user: null,
      };

    default:
      return state;
  }
};
