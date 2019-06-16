import { Action, ActionCreator } from 'redux';
import {
  OPEN_TRIP_DAY_FORM,
  OPEN_TRIP_EVENT_FORM,
  OPEN_TRIP_FORM,
  SET_SIDE_MENU,
  UPDATE_SELECTED_TRIP_DAY_ID,
} from '../../constants/actions';

export const setSideMenu: ActionCreator<Action> = (menu: string) => {
  return {
    type: SET_SIDE_MENU,
    menu,
  };
};

export const updateSelectedTripDayId: ActionCreator<Action> = (tripDayId: string) => {
  return {
    type: UPDATE_SELECTED_TRIP_DAY_ID,
    tripDayId,
  };
};

export const openTripForm: ActionCreator<Action> = (payload: boolean) => {
  return {
    type: OPEN_TRIP_FORM,
    payload,
  };
};

export const openTripDayForm: ActionCreator<Action> = (payload: boolean) => {
  return {
    type: OPEN_TRIP_DAY_FORM,
    payload,
  };
};

export const openTripEventForm: ActionCreator<Action> = (payload: boolean) => {
  return {
    type: OPEN_TRIP_EVENT_FORM,
    payload,
  };
};
