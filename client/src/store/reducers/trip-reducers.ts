import { Trip } from '../../models/trip';
import {
  FETCHING_TRIP_DETAIL,
  FETCHING_TRIP_DETAIL_FAILURE,
  FETCHING_TRIP_DETAIL_SUCCESS,
  FETCHING_TRIP_LIST,
  FETCHING_TRIP_LIST_FAILURE,
  FETCHING_TRIP_LIST_SUCCESS,
} from '../../constants/actions';

export interface TripState {
  isLoadingTripList: boolean;
  isLoadingTripDetail: boolean;
  tripList: Trip[];
  tripDetail: Trip;
}

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

const initialState: TripState = {
  isLoadingTripList: false,
  isLoadingTripDetail: false,
  tripList,
  tripDetail,
};

export const tripReducers = (state: TripState = initialState, action: any) => {
  switch (action.type) {
    case FETCHING_TRIP_LIST:
      return {
        ...state,
        isLoadingTripList: true,
      };

    case FETCHING_TRIP_LIST_FAILURE:
      return {
        ...state,
        isLoadingTripList: false,
      };

    case FETCHING_TRIP_LIST_SUCCESS:
      return {
        ...state,
        isLoadingTripList: false,
        tripList: action.tripList,
      };

    case FETCHING_TRIP_DETAIL:
      return {
        ...state,
        isLoadingTripDetail: true,
      };

    case FETCHING_TRIP_DETAIL_FAILURE:
      return {
        ...state,
        isLoadingTripDetail: false,
      };

    case FETCHING_TRIP_DETAIL_SUCCESS:
      return {
        ...state,
        isLoadingTripDetail: false,
        tripDetail: action.tripDetail,
      };

    default:
      return state;
  }
};
