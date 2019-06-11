import { isEmpty, map } from 'lodash';
import * as moment from 'moment';

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Event } from '../../models/event';
import { Trip } from '../../models/trip';
import { TripDay } from '../../models/trip-day';
import { TripService } from '../../services/trip-service';
import {
  FETCHING_TRIP_DETAIL,
  FETCHING_TRIP_DETAIL_FAILURE,
  FETCHING_TRIP_DETAIL_SUCCESS,
  FETCHING_TRIP_LIST,
  FETCHING_TRIP_LIST_FAILURE,
  FETCHING_TRIP_LIST_SUCCESS,
} from '../types';
import { alertError, clearAlert } from './alert-actions';
import { selectedTripDayId } from './dashboard-actions';

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

export const getTripList = (payload: any) => {
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

export const getTripDetail = (tripId: number) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    dispatch(clearAlert());
    dispatch(fetchingTripDetail());
    tripService
      .getTripDetail(tripId)
      .then((tripDetailResult: any) => {
        if (tripDetailResult.success) {
          if (isEmpty(tripDetailResult)) {
            dispatch(fetchingTripDetailFailure());
            dispatch(alertError('Ooooops, there is something wrong, please try again.'));
          } else {
            if (!isEmpty(tripDetailResult.result.start_date)) {
              tripDetailResult.result.start_date = moment(tripDetailResult.result.start_date).format(DATE_FORMAT);
            }
            if (!isEmpty(tripDetailResult.result.end_date)) {
              tripDetailResult.result.end_date = moment(tripDetailResult.result.end_date).format(DATE_FORMAT);
            }
            if (!isEmpty(tripDetailResult.result.trip_day)) {
              map(tripDetailResult.result.trip_day, (tripDay: TripDay) => {
                tripDay.trip_date = moment(tripDay.trip_date).format(DATE_FORMAT);
                map(tripDay.events, (tripEvent: Event) => {
                  if (!isEmpty(tripEvent.start_time)) {
                    tripEvent.start_time = moment(tripEvent.start_time).format(DATE_TIME_FORMAT);
                  }
                  if (!isEmpty(tripEvent.end_time)) {
                    tripEvent.end_time = moment(tripEvent.end_time).format(DATE_TIME_FORMAT);
                  }
                  return tripEvent;
                });
                return tripDay;
              });
              if (getState().dashboard.selectedTripDayId === 0) {
                dispatch(selectedTripDayId(tripDetailResult.result.trip_day[0].id));
              }
            }
            tripDetailResult.result.archived = tripDetailResult.result.archived === 1;
            dispatch(fetchingTripDetailSuccess(tripDetailResult.result));
          }
        } else {
          dispatch(fetchingTripDetailFailure());
          dispatch(alertError(tripDetailResult.error));
        }
      })
      .catch((error: any) => {
        dispatch(fetchingTripDetailFailure());
        dispatch(alertError(error));
      });
  };
};
