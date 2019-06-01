import { Action, ActionCreator } from 'redux';
import { CLOSE_DRAWER, OPEN_DRAWER } from '../types';

export const openDrawer: ActionCreator<Action> = () => {
  return {
    type: OPEN_DRAWER,
  };
};

export const closeDrawer: ActionCreator<Action> = () => {
  return {
    type: CLOSE_DRAWER,
  };
};
