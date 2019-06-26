import { isEmpty, isNumber, map } from 'lodash';
import * as moment from 'moment-timezone';

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { timezone } from '../../assets/timezone';
import { ErrorMessages } from '../../constants/errors';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../../constants/general';
import { Event } from '../../models/event';
import { Trip } from '../../models/trip';
import { TripDay } from '../../models/trip-day';
import { TripService } from '../../services/trip-service';
import {
  CREATING_TRIP,
  CREATING_TRIP_DAY,
  CREATING_TRIP_DAY_FAILURE,
  CREATING_TRIP_DAY_SUCCESS,
  CREATING_TRIP_EVENT,
  CREATING_TRIP_EVENT_FAILURE,
  CREATING_TRIP_EVENT_SUCCESS,
  CREATING_TRIP_FAILURE,
  CREATING_TRIP_SUCCESS,
  FETCHING_TRIP_DETAIL,
  FETCHING_TRIP_DETAIL_FAILURE,
  FETCHING_TRIP_DETAIL_SUCCESS,
  FETCHING_TRIP_LIST,
  FETCHING_TRIP_LIST_FAILURE,
  FETCHING_TRIP_LIST_SUCCESS,
} from '../../constants/actions';
import { clearAlert, createAlert } from './alert-actions';
import { updateSelectedTripDayId } from './dashboard-actions';

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

const _fetchTripListFailure = (message: string) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(fetchingTripListFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

const _generateGetTripListPayload = (currentMenu: string) => {
  let requestBody = null;
  if (currentMenu === 'archived') {
    requestBody = {
      archived: true,
    };
  } else if (currentMenu === 'current') {
    requestBody = {
      start_date: moment().format(DATE_FORMAT),
      end_date: moment().format(DATE_FORMAT),
      archived: false,
    };
  } else if (currentMenu === 'upcoming') {
    requestBody = {
      start_date: moment().format(DATE_FORMAT),
      archived: false,
    };
  } else if (currentMenu === 'past') {
    requestBody = {
      end_date: moment().format(DATE_FORMAT),
      archived: false,
    };
  } else {
    requestBody = {
      archived: false,
    };
  }
  return requestBody;
};

export const getTripList = () => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    dispatch(clearAlert());
    dispatch(fetchingTripList());
    const requestPayload = _generateGetTripListPayload(getState().dashboard.currentMenu);
    tripService
      .getTripList(requestPayload)
      .then((result: any) => {
        if (isEmpty(result)) {
          dispatch(_fetchTripListFailure(ErrorMessages.response.message));
        } else {
          if (result.success) {
            map(result.result, (trip: Trip) => {
              trip.start_date = moment(trip.start_date).format(DATE_FORMAT);
              trip.end_date = moment(trip.end_date).format(DATE_FORMAT);
              return trip;
            });
            dispatch(fetchingTripListSuccess(result.result));
          } else {
            dispatch(_fetchTripListFailure(result.error));
          }
        }
      })
      .catch((error: any) => {
        dispatch(_fetchTripListFailure(error.error));
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

const _fetchTripDetailFailure = (message: string) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(fetchingTripDetailFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const getTripDetail = (tripId: number) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    dispatch(clearAlert());
    dispatch(fetchingTripDetail());
    tripService
      .getTripDetail(tripId)
      .then((tripDetailResult: any) => {
        if (isEmpty(tripDetailResult)) {
          dispatch(_fetchTripDetailFailure(ErrorMessages.response.message));
        } else {
          if (tripDetailResult.success) {
            const timezoneObject = timezone.find(tz => tz.id === tripDetailResult.result.timezone_id);
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
                    tripEvent.start_time = moment
                      .utc(tripEvent.start_time)
                      .tz(timezoneObject.utc)
                      .format(DATE_TIME_FORMAT);
                  }
                  if (!isEmpty(tripEvent.end_time)) {
                    tripEvent.end_time = moment
                      .utc(tripEvent.end_time)
                      .tz(timezoneObject.utc)
                      .format(DATE_TIME_FORMAT);
                  }
                  return tripEvent;
                });
                return tripDay;
              });
              if (getState().dashboard.selectedTripDayId === 0) {
                dispatch(updateSelectedTripDayId(tripDetailResult.result.trip_day[0].id));
              }
            }
            tripDetailResult.result.archived = tripDetailResult.result.archived === 1;
            dispatch(fetchingTripDetailSuccess(tripDetailResult.result));
          } else {
            dispatch(_fetchTripDetailFailure(tripDetailResult.error));
          }
        }
      })
      .catch((error: any) => {
        dispatch(_fetchTripDetailFailure(error.error));
      });
  };
};

export const creatingTrip = () => {
  return {
    type: CREATING_TRIP,
  };
};

export const creatingTripFailure = () => {
  return {
    type: CREATING_TRIP_FAILURE,
  };
};

export const creatingTripSuccess = () => {
  return {
    type: CREATING_TRIP_SUCCESS,
  };
};

const _createTripFailure = (message: string) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(creatingTripFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTrip = (payload: Trip) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(creatingTrip());
    tripService
      .createTrip(payload)
      .then((result: any) => {
        if (result.success) {
          dispatch(creatingTripSuccess());
          dispatch(getTripList());
        } else {
          dispatch(_createTripFailure(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripFailure(error.error));
      });
  };
};

export const creatingTripDay = () => {
  return {
    type: CREATING_TRIP_DAY,
  };
};

export const creatingTripDayFailure = () => {
  return {
    type: CREATING_TRIP_DAY_FAILURE,
  };
};

export const creatingTripDaySuccess = () => {
  return {
    type: CREATING_TRIP_DAY_SUCCESS,
  };
};

const _createTripDayFailure = (message: string) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(creatingTripDayFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTripDay = (payload: TripDay) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(creatingTripDay());
    tripService
      .createTripDay(payload)
      .then((result: any) => {
        if (result.success) {
          dispatch(creatingTripDaySuccess());
          dispatch(getTripDetail(payload.trip_id));
        } else {
          dispatch(_createTripDayFailure(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripDayFailure(error.error));
      });
  };
};

export const creatingTripEvent = () => {
  return {
    type: CREATING_TRIP_EVENT,
  };
};

export const creatingTripEventFailure = () => {
  return {
    type: CREATING_TRIP_EVENT_FAILURE,
  };
};

export const creatingTripEventSuccess = () => {
  return {
    type: CREATING_TRIP_EVENT_SUCCESS,
  };
};

const _createTripEventFailure = (message: string) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(creatingTripEventFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTripEvent = (payload: Event) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    let newPayload: Event = {
      trip_day_id: 0,
      category_id: 0,
      timezone_id: 0,
      title: '',
    };
    Object.keys(payload).forEach(prop => {
      if ((isNumber(payload[prop]) && payload[prop] > 0) || !isEmpty(payload[prop])) {
        newPayload[prop] = payload[prop];
      }
    });
    dispatch(creatingTripEvent());
    tripService
      .createTripEvent(getState().trip.tripDetail.id, newPayload)
      .then((result: any) => {
        if (result.success) {
          dispatch(creatingTripEventSuccess());
          dispatch(getTripDetail(getState().trip.tripDetail.id));
        } else {
          dispatch(_createTripEventFailure(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripEventFailure(error.error));
      });
  };
};
