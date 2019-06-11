import { OPEN_EVENT_FORM, OPEN_TRIP_DAY_FORM, OPEN_TRIP_FORM, SELECTED_TRIP_DAY_ID, SET_SIDE_MENU } from '../types';

const initialState = {
  menu: 'current',
  selectedTripDayId: 0,
  openTripForm: false,
  openTripDayForm: false,
  openEventForm: false,
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
        selectedTripDayId: action.tripDayId,
      };

    case OPEN_TRIP_FORM:
      return {
        ...state,
        openTripForm: action.payload,
      };

    case OPEN_TRIP_DAY_FORM:
      return {
        ...state,
        openTripDayForm: action.payload,
      };

    case OPEN_EVENT_FORM:
      return {
        ...state,
        openEventForm: action.payload,
      };

    default:
      return state;
  }
};
