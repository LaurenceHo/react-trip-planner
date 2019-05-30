import { ALERT_ERROR, ALERT_SUCCESS, CLEAR_ALERT } from '../types';

const initialState = {
  type: '',
  message: '',
};

export const alertReducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case CLEAR_ALERT:
      return {
        type: '',
        message: '',
      };

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
