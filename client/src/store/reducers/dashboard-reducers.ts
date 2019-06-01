import { CLOSE_DRAWER, OPEN_DRAWER } from '../types';

const initialState = {
  isDrawerOpen: true,
};
export const dashboardReducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case OPEN_DRAWER:
      return {
        ...state,
        isDrawerOpen: true,
      };

    case CLOSE_DRAWER:
      return {
        ...state,
        isDrawerOpen: false,
      };

    default:
      return state;
  }
};
