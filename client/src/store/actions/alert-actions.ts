import { ALERT_ERROR, ALERT_SUCCESS } from '../types';

export const alertSuccess = (message: string) => {
  return {
    type: ALERT_SUCCESS,
    message,
  };
};

export const alertError = (message: string) => {
  return {
    type: ALERT_ERROR,
    message,
  };
};
