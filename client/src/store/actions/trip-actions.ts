import { map, isEmpty } from 'lodash';
import * as moment from 'moment';

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Trip } from '../../models/trip';
import { TripDay } from '../../models/trip-day';
import {
  FETCHING_TRIP_LIST,
  FETCHING_TRIP_LIST_SUCCESS,
  FETCHING_TRIP_LIST_FAILURE,
  FETCHING_TRIP_DETAIL,
  FETCHING_TRIP_DETAIL_FAILURE,
  FETCHING_TRIP_DETAIL_SUCCESS,
} from '../types';
import { alertError, clearAlert } from './alert-actions';
import { TripService } from '../../services/trip-service';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

const tripService = new TripService();
export const fetchingTripList = () => {
  return {
    type: FETCHING_TRIP_LIST,
  };
};

export const fetchingTripListFailure = () => {
  return {
    type: FETCHING_TRIP_LIST_FAILURE,
  };
};

export const fetchingTripListSuccess = (tripList: Trip[]) => {
  return {
    type: FETCHING_TRIP_LIST_SUCCESS,
    tripList,
  };
};

export const fetchTripList = (payload: any) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(fetchingTripList());
    tripService
      .getTripList(payload)
      .then((result: any) => {
        if (result.success) {
          map(result.result, (trip: Trip) => {
            trip.start_date = moment(trip.start_date).format(DATE_FORMAT);
            trip.end_date = moment(trip.end_date).format(DATE_FORMAT);
            return trip;
          });
          dispatch(fetchingTripListSuccess(result.result));
        } else {
          dispatch(fetchingTripListFailure());
          dispatch(alertError(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(fetchingTripListFailure());
        dispatch(alertError(error));
      });
  };
};

export const fetchingTripDetail = () => {
  return {
    type: FETCHING_TRIP_DETAIL,
  };
};

export const fetchingTripDetailFailure = () => {
  return {
    type: FETCHING_TRIP_DETAIL_FAILURE,
  };
};

export const fetchingTripDetailSuccess = (tripDetail: Trip) => {
  return {
    type: FETCHING_TRIP_DETAIL_SUCCESS,
    tripDetail,
  };
};

export const fetchTripDetail = (tripId: number) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(fetchingTripDetail());
    tripService
      .getTripDetailWithDays(tripId)
      .then((result: any) => {
        if (result.success) {
          let tripDetailResult: Trip = {
            archived: false,
            destination: '',
            end_date: '',
            id: 0,
            name: '',
            start_date: '',
            timezone_id: 0,
            trip_day: [],
            user_id: 0,
          };
          if (result.result) {
            tripDetailResult = result.result;
            if (!isEmpty(result.result.start_date)) {
              tripDetailResult.start_date = moment(result.result.start_date).format(DATE_FORMAT);
            }
            if (!isEmpty(result.result.end_date)) {
              tripDetailResult.end_date = moment(result.result.end_date).format(DATE_FORMAT);
            }
            if (!isEmpty(result.result.trip_day)) {
              tripDetailResult.trip_day = map(result.result.trip_day, (tripDay: TripDay) => {
                tripDay.trip_date = moment(tripDay.trip_date).format(DATE_FORMAT);
                return tripDay;
              });
            }
            tripDetailResult.archived = result.result.archived === 1;
          }
          dispatch(fetchingTripDetailSuccess(tripDetailResult));
        } else {
          dispatch(fetchingTripDetailFailure());
          dispatch(alertError(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(fetchingTripDetailFailure());
        dispatch(alertError(error));
      });
  };
};
