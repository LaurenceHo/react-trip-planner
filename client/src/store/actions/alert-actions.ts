import { Action, ActionCreator } from 'redux';
import { CLEAR_ALERT, CREATE_ALERT } from '../../constants/actions';

export const clearAlert: ActionCreator<Action> = () => {
  return {
    type: CLEAR_ALERT,
  };
};

export const createAlert: ActionCreator<Action> = (alert: { type: string; message: string }) => {
  return {
    type: CREATE_ALERT,
    alert,
  };
};
