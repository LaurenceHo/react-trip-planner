import {
  OPEN_TRIP_EVENT_FORM,
  OPEN_TRIP_DAY_FORM,
  OPEN_TRIP_FORM,
  UPDATE_SELECTED_TRIP_DAY_ID,
  SET_SIDE_MENU,
} from '../../constants/actions';

export interface DashboardState {
  edit: {
    isEditMode: boolean;
    idInEdit: number;
    component: 'trip' | 'tripDay' | 'tripEvent';
  };
  openTripForm: boolean;
  openTripDayForm: boolean;
  openTripEventForm: boolean;
  currentMenu: 'upcoming' | 'current' | 'past' | 'archived';
  selectedTripDayId: number;
}

const initialState: DashboardState = {
  edit: {
    isEditMode: false,
    idInEdit: 0,
    component: null,
  },
  openTripForm: false,
  openTripDayForm: false,
  openTripEventForm: false,
  currentMenu: 'current',
  selectedTripDayId: 0,
};

export const dashboardReducers = (state: DashboardState = initialState, action: any) => {
  switch (action.type) {
    case SET_SIDE_MENU:
      return {
        ...state,
        currentMenu: action.menu,
      };

    case UPDATE_SELECTED_TRIP_DAY_ID:
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

    case OPEN_TRIP_EVENT_FORM:
      return {
        ...state,
        openTripEventForm: action.payload,
      };

    default:
      return state;
  }
};
