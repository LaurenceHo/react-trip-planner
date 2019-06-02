import { map, isEmpty } from 'lodash';
import * as moment from 'moment';

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Trip } from '../../models/trip';
import { FETCHING_TRIP_LIST, FETCHING_TRIP_LIST_SUCCESS, FETCHING_TRIP_LIST_FAILURE } from '../types';
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
