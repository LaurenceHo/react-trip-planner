import { map, isEmpty } from 'lodash';
import * as moment from 'moment';

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Event } from '../../models/event';
import { Trip } from '../../models/trip';
import { TripDay } from '../../models/trip-day';
import {
  FETCHING_TRIP_LIST,
  FETCHING_TRIP_LIST_SUCCESS,
  FETCHING_TRIP_LIST_FAILURE,
  FETCHING_TRIP_DETAIL,
  FETCHING_TRIP_DETAIL_FAILURE,
  FETCHING_TRIP_DETAIL_SUCCESS,
  FETCHING_TRIP_DAY_DETAIL_FAILURE,
  FETCHING_TRIP_DAY_DETAIL_SUCCESS,
  FETCHING_TRIP_DAY_DETAIL,
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

export const fetchingTriDayDetail = () => {
  return {
    type: FETCHING_TRIP_DAY_DETAIL,
  };
};

export const fetchingTripDayDetailFailure = () => {
  return {
    type: FETCHING_TRIP_DAY_DETAIL_FAILURE,
  };
};

export const fetchingTripDayDetailSuccess = (tripDayDetail: TripDay) => {
  return {
    type: FETCHING_TRIP_DAY_DETAIL_SUCCESS,
    tripDayDetail,
  };
};

export const getTripDayWithEvents = (payload: { trip_id: number; trip_day_id: number }) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(fetchingTriDayDetail());
    tripService
      .getTripDayWithEvents(payload.trip_id, payload.trip_day_id)
      .then((result: any) => {
        if (result.success) {
          result.result.trip_date = moment(result.result.trip_date).format(DATE_FORMAT);
          if (!isEmpty(result.result.events)) {
            map(result.result.events, (tripEvent: Event) => {
              if (!isEmpty(tripEvent.start_time)) {
                tripEvent.start_time = moment(tripEvent.start_time).format(DATE_TIME_FORMAT);
              }
              if (!isEmpty(tripEvent.end_time)) {
                tripEvent.end_time = moment(tripEvent.end_time).format(DATE_TIME_FORMAT);
              }
              return tripEvent;
            });
          }
          dispatch(fetchingTripDayDetailSuccess(result.result));
        } else {
          dispatch(fetchingTripDayDetailFailure());
          dispatch(alertError(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(fetchingTripDayDetailFailure());
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

export const getTripDetailWithDays = (tripId: number) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(fetchingTripDetail());
    tripService
      .getTripDetailWithDays(tripId)
      .then((result: any) => {
        if (result.success) {
          if (!isEmpty(result.result.start_date)) {
            result.result.start_date = moment(result.result.start_date).format(DATE_FORMAT);
          }
          if (!isEmpty(result.result.end_date)) {
            result.result.end_date = moment(result.result.end_date).format(DATE_FORMAT);
          }
          if (!isEmpty(result.result.trip_day)) {
            dispatch(getTripDayWithEvents({ trip_id: tripId, trip_day_id: result.result.trip_day[0].id }));

            map(result.result.trip_day, (tripDay: TripDay) => {
              tripDay.trip_date = moment(tripDay.trip_date).format(DATE_FORMAT);
              return tripDay;
            });
          }
          result.result.archived = result.result.archived === 1;
          dispatch(fetchingTripDetailSuccess(result.result));
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
