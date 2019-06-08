import { SELECTED_TRIP_DAY_ID, SET_SIDE_MENU } from '../types';

const initialState = {
  menu: 'current',
  tripDayId: 0,
};

export const dashboardReducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_SIDE_MENU:
      return {
        ...state,
        menu: action.menu,
      };

    case SELECTED_TRIP_DAY_ID:
      return {
        ...state,
        tripDayId: action.tripDayId,
      };

    default:
      return state;
  }
};
