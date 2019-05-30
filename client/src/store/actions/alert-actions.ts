import { Action, ActionCreator } from 'redux';
import { ALERT_ERROR, ALERT_SUCCESS, CLEAR_ALERT } from '../types';

export const clearAlert: ActionCreator<Action> = () => {
  return {
    type: CLEAR_ALERT,
  };
};

export const alertSuccess: ActionCreator<Action> = (message: string) => {
  return {
    type: ALERT_SUCCESS,
    message,
  };
};

export const alertError: ActionCreator<Action> = (message: string) => {
  return {
    type: ALERT_ERROR,
    message,
  };
};
