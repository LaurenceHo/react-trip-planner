import { Trip } from '../../models/trip';
import { TripDay } from '../../models/trip-day';
import {
  FETCHING_TRIP_LIST,
  FETCHING_TRIP_LIST_SUCCESS,
  FETCHING_TRIP_LIST_FAILURE,
  FETCHING_TRIP_DETAIL,
  FETCHING_TRIP_DETAIL_FAILURE,
  FETCHING_TRIP_DETAIL_SUCCESS,
  FETCHING_TRIP_DAY_DETAIL,
  FETCHING_TRIP_DAY_DETAIL_FAILURE,
  FETCHING_TRIP_DAY_DETAIL_SUCCESS,
} from '../types';

const tripList: Trip[] = [];
const tripDetail: Trip = {
  id: 0,
  user_id: 0,
  timezone_id: 0,
  start_date: '',
  end_date: '',
  name: '',
  destination: '',
  archived: false,
  trip_day: [],
};
const tripDayDetail: TripDay = {
  id: 0,
  name: '',
  trip_id: 0,
  user_id: 0,
  trip_date: '',
  events: [],
};
const initialState = {
  isLoading: false,
  tripList,
  tripDetail,
  tripDayDetail,
};

export const tripReducers = (state: any = initialState, action: any) => {
  switch (action.type) {
    case FETCHING_TRIP_LIST:
      return {
        ...state,
        isLoading: true,
      };

    case FETCHING_TRIP_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case FETCHING_TRIP_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tripList: action.tripList,
      };

    case FETCHING_TRIP_DETAIL:
      return {
        ...state,
        isLoading: true,
      };

    case FETCHING_TRIP_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case FETCHING_TRIP_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tripDetail: action.tripDetail,
      };

    case FETCHING_TRIP_DAY_DETAIL:
      return {
        ...state,
        isLoading: true,
      };

    case FETCHING_TRIP_DAY_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case FETCHING_TRIP_DAY_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tripDayDetail: action.tripDayDetail,
      };

    default:
      return state;
  }
};
