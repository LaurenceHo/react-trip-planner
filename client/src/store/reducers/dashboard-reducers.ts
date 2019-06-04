import { SET_SIDE_MENU } from '../types';

const initialState = {
  menu: 'current',
};

export const dashboardReducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_SIDE_MENU:
      return {
        ...state,
        menu: action.menu,
      };

    default:
      return state;
  }
};
