import { ALERT_ERROR, ALERT_SUCCESS } from '../types';

const initialState = {
  type: '',
  message: '',
};

export const alertReducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case ALERT_SUCCESS:
      return {
        type: 'success',
        message: action.message,
      };

    case ALERT_ERROR:
      return {
        type: 'error',
        message: action.message,
      };

    default:
      return state;
  }
};
