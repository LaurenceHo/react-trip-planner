import { CLEAR_ALERT, CREATE_ALERT } from '../types';

export interface AlertState {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

const initialState: AlertState = {
  type: null,
  message: null,
};

export const alertReducers = (state: AlertState = initialState, action: any) => {
  switch (action.type) {
    case CLEAR_ALERT:
      return {
        type: null,
        message: null,
      };

    case CREATE_ALERT:
      return {
        type: action.alert.type,
        message: action.alert.message,
      };

    default:
      return state;
  }
};
