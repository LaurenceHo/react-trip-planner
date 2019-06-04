import { Action, ActionCreator } from 'redux';
import { SET_SIDE_MENU } from '../types';

export const setSideMenu: ActionCreator<Action> = (menu: string) => {
  return {
    type: SET_SIDE_MENU,
    menu,
  };
};
