import { Action, ActionCreator } from 'redux';
import { SELECTED_TRIP_DAY_ID, SET_SIDE_MENU } from '../types';

export const setSideMenu: ActionCreator<Action> = (menu: string) => {
  return {
    type: SET_SIDE_MENU,
    menu,
  };
};

export const selectedTripDayId: ActionCreator<Action> = (tripDayId: string) => {
  return {
    type: SELECTED_TRIP_DAY_ID,
    tripDayId,
  };
};
