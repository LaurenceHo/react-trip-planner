import { Action, ActionCreator } from 'redux';
import {
  OPEN_EVENT_FORM,
  OPEN_TRIP_DAY_FORM,
  OPEN_TRIP_FORM,
  SET_SIDE_MENU,
  UPDATE_SELECTED_TRIP_DAY_ID,
} from '../types';

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

export const openEventForm: ActionCreator<Action> = (payload: boolean) => {
  return {
    type: OPEN_EVENT_FORM,
    payload,
  };
};
