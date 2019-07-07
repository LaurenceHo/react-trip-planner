import { cloneDeep, isEmpty, map } from 'lodash';
import * as moment from 'moment-timezone';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { timezone } from '../../assets/timezone';
import { Actions } from '../../constants/actions';
import { DATE_FORMAT, DATE_TIME_FORMAT, DATE_TIME_TZ_FORMAT } from '../../constants/general';
import { Messages } from '../../constants/messages';
import { Event } from '../../models/event';
import { Trip } from '../../models/trip';
import { TripDay } from '../../models/trip-day';
import { EventService } from '../../services/event-service';
import { TripService } from '../../services/trip-service';
import { clearAlert, createAlert } from './alert-actions';
import { updateSelectedTripDayId } from './dashboard-actions';

const eventService = new EventService();
const tripService = new TripService();
export const fetchingTripList = () => {
  return {
    type: Actions.FETCHING_TRIP_LIST,
  };
};

export const fetchingTripListFailure = () => {
  return {
    type: Actions.FETCHING_TRIP_LIST_FAILURE,
  };
};

export const fetchingTripListSuccess = (tripList: Trip[]) => {
  return {
    type: Actions.FETCHING_TRIP_LIST_SUCCESS,
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
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any) => {
    dispatch(clearAlert());
    dispatch(fetchingTripList());
    const requestPayload = _generateGetTripListPayload(getState().dashboard.currentMenu);
    tripService
      .getTripList(requestPayload)
      .then((result: any) => {
        if (isEmpty(result)) {
          dispatch(_fetchTripListFailure(Messages.response.message));
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
    type: Actions.FETCHING_TRIP_DETAIL,
  };
};

export const fetchingTripDetailFailure = () => {
  return {
    type: Actions.FETCHING_TRIP_DETAIL_FAILURE,
  };
};

export const fetchingTripDetailSuccess = (tripDetail: Trip) => {
  return {
    type: Actions.FETCHING_TRIP_DETAIL_SUCCESS,
    tripDetail,
  };
};

const _fetchTripDetailFailure = (message: string) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(fetchingTripDetailFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const getTripDetail = (tripId: number, isCreateOrUpdate: boolean) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(fetchingTripDetail());
    tripService
      .getTripDetail(tripId)
      .then((tripDetailResult: any) => {
        if (isEmpty(tripDetailResult)) {
          dispatch(_fetchTripDetailFailure(Messages.response.message));
        } else {
          if (tripDetailResult.success) {
            tripDetailResult.result.start_date = moment(tripDetailResult.result.start_date).format(DATE_FORMAT);
            tripDetailResult.result.end_date = moment(tripDetailResult.result.end_date).format(DATE_FORMAT);
            if (!isEmpty(tripDetailResult.result.trip_day)) {
              map(tripDetailResult.result.trip_day, (tripDay: TripDay) => {
                tripDay.trip_date = moment(tripDay.trip_date).format(DATE_FORMAT);
                map(tripDay.events, (tripEvent: Event) => {
                  if (!isEmpty(tripEvent.start_time)) {
                    const startTimeTimezoneId = tripEvent.start_time_timezone_id || tripDetailResult.timezone_id;
                    const startTimeTimezone = timezone.find(tz => tz.id === startTimeTimezoneId);
                    tripEvent.start_time = moment
                      .utc(tripEvent.start_time)
                      .tz(startTimeTimezone.utc)
                      .format(DATE_TIME_TZ_FORMAT);
                  }
                  if (!isEmpty(tripEvent.end_time)) {
                    const endTimeTimezoneId = tripEvent.end_time_timezone_id || tripDetailResult.timezone_id;
                    const endTimeTimezone = timezone.find(tz => tz.id === endTimeTimezoneId);
                    tripEvent.end_time = moment
                      .utc(tripEvent.end_time)
                      .tz(endTimeTimezone.utc)
                      .format(DATE_TIME_TZ_FORMAT);
                  }
                  return tripEvent;
                });
                return tripDay;
              });
              if (!isCreateOrUpdate) {
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
    type: Actions.CREATING_TRIP,
  };
};

export const creatingTripFailure = () => {
  return {
    type: Actions.CREATING_TRIP_FAILURE,
  };
};

export const creatingTripSuccess = () => {
  return {
    type: Actions.CREATING_TRIP_SUCCESS,
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
    type: Actions.CREATING_TRIP_DAY,
  };
};

export const creatingTripDayFailure = () => {
  return {
    type: Actions.CREATING_TRIP_DAY_FAILURE,
  };
};

export const creatingTripDaySuccess = () => {
  return {
    type: Actions.CREATING_TRIP_DAY_SUCCESS,
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
          dispatch(getTripDetail(payload.trip_id, true));
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
    type: Actions.CREATING_TRIP_EVENT,
  };
};

export const creatingTripEventFailure = () => {
  return {
    type: Actions.CREATING_TRIP_EVENT_FAILURE,
  };
};

export const creatingTripEventSuccess = () => {
  return {
    type: Actions.CREATING_TRIP_EVENT_SUCCESS,
  };
};

const _createTripEventFailure = (message: string) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(creatingTripEventFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

const _createEventRequestPayload = (payload: Event, state: any) => {
  let newPayload = cloneDeep(payload);

  Object.keys(payload).forEach(prop => {
    if (prop === 'start_time') {
      if (newPayload.start_time) {
        newPayload.start_time_timezone_id = payload.start_time_timezone_id
          ? payload.start_time_timezone_id
          : state.tripDetail.timezone_id;
        const startTimeTimezone = timezone.find(tz => tz.id === newPayload.start_time_timezone_id);
        newPayload.start_time = moment
          .tz(moment(payload.start_time).format(DATE_TIME_FORMAT), startTimeTimezone.utc)
          .utc()
          .format(DATE_TIME_FORMAT);
      } else {
        newPayload.start_time = null;
      }
    } else if (prop === 'end_time') {
      if (newPayload.end_time) {
        newPayload.end_time_timezone_id = payload.end_time_timezone_id
          ? payload.end_time_timezone_id
          : state.tripDetail.timezone_id;
        const endTimeTimezone = timezone.find(tz => tz.id === newPayload.end_time_timezone_id);
        newPayload.end_time = moment
          .tz(moment(payload.end_time).format(DATE_TIME_FORMAT), endTimeTimezone.utc)
          .utc()
          .format(DATE_TIME_FORMAT);
      } else {
        newPayload.end_time = null;
      }
    } else if (prop === 'currency_id' && newPayload.currency_id === 0) {
      newPayload.currency_id = null;
    } else if (prop === 'start_time_timezone_id' && newPayload.start_time_timezone_id === 0) {
      newPayload.start_time_timezone_id = null;
    } else if (prop === 'end_time_timezone_id' && newPayload.end_time_timezone_id === 0) {
      newPayload.end_time_timezone_id = null;
    } else if (prop === 'cost' && isEmpty(newPayload.cost)) {
      newPayload.cost = null;
    }
  });

  return newPayload;
};

export const createTripEvent = (payload: Event) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any) => {
    const newPayload = _createEventRequestPayload(payload, getState);

    dispatch(creatingTripEvent());
    eventService
      .createTripEvent(newPayload)
      .then((result: any) => {
        if (result.success) {
          dispatch(creatingTripEventSuccess());
          dispatch(getTripDetail(getState().trip.tripDetail.id, true));
        } else {
          dispatch(_createTripEventFailure(result.error));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripEventFailure(error.error));
      });
  };
};
