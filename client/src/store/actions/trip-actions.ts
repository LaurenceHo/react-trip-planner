import { cloneDeep, isEmpty, map } from 'lodash';
import * as moment from 'moment-timezone';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { timezone } from '../../assets/timezone';
import { Actions } from '../../constants/actions';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../../constants/general';
import { Messages } from '../../constants/messages';
import { RootState } from '../../constants/types';
import { Event } from '../../models/event';
import { Trip } from '../../models/trip';
import { TripDay } from '../../models/trip-day';
import { EventService } from '../../services/event-service';
import { TripService } from '../../services/trip-service';
import { parseToLocalTime } from '../helpers';
import { clearAlert, createAlert } from './alert-actions';
import { updateSelectedTripDayId } from './dashboard-actions';

const eventService = new EventService();
const tripService = new TripService();

const _generateGetTripListPayload = (currentMenu: 'archived' | 'current' | 'upcoming' | 'past') => {
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

const _createEventRequestPayload = (payload: Event, state: RootState) => {
  const newPayload = cloneDeep(payload);
  Object.keys(newPayload).forEach(prop => {
    // Convert to UTC date time string before sending request to server
    if (prop === 'start_time') {
      if (newPayload.start_time) {
        newPayload.start_time_timezone_id = payload.start_time_timezone_id
          ? payload.start_time_timezone_id
          : state.trip.tripDetail.timezone_id;
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
          : state.trip.tripDetail.timezone_id;
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

const fetchingTripList = () => {
  return {
    type: Actions.FETCHING_TRIP_LIST,
  };
};

const fetchingTripListFailure = () => {
  return {
    type: Actions.FETCHING_TRIP_LIST_FAILURE,
  };
};

const fetchingTripListSuccess = (tripList: Trip[]) => {
  return {
    type: Actions.FETCHING_TRIP_LIST_SUCCESS,
    tripList,
  };
};

const _fetchTripListFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(fetchingTripListFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const getTripList = () => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>, getState: any) => {
    dispatch(clearAlert());
    dispatch(fetchingTripList());
    const requestPayload = _generateGetTripListPayload(getState().dashboard.currentMenu);
    tripService
      .getTripList(requestPayload)
      .then((result: { success: boolean; result: Trip[] }) => {
        if (result.success) {
          map(result.result, (trip: Trip) => {
            trip.start_date = moment(trip.start_date).format(DATE_FORMAT);
            trip.end_date = moment(trip.end_date).format(DATE_FORMAT);
            return trip;
          });
          dispatch(fetchingTripListSuccess(result.result));
        } else {
          dispatch(_fetchTripListFailure(Messages.response.message));
        }
      })
      .catch((error: any) => dispatch(_fetchTripListFailure(error.error)));
  };
};

const fetchingTripDetail = () => {
  return {
    type: Actions.FETCHING_TRIP_DETAIL,
  };
};

const fetchingTripDetailFailure = () => {
  return {
    type: Actions.FETCHING_TRIP_DETAIL_FAILURE,
  };
};

const fetchingTripDetailSuccess = (tripDetail: Trip) => {
  return {
    type: Actions.FETCHING_TRIP_DETAIL_SUCCESS,
    tripDetail,
  };
};

const _fetchTripDetailFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(fetchingTripDetailFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const getTripDetail = (tripId: number) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(fetchingTripDetail());
    tripService
      .getTripDetail(tripId)
      .then((tripDetailResult: { success: boolean; result: Trip }) => {
        if (tripDetailResult.success) {
          tripDetailResult.result.start_date = moment(tripDetailResult.result.start_date).format(DATE_FORMAT);
          tripDetailResult.result.end_date = moment(tripDetailResult.result.end_date).format(DATE_FORMAT);
          if (!isEmpty(tripDetailResult.result.trip_day)) {
            map(tripDetailResult.result.trip_day, (tripDay: TripDay) => {
              tripDay.trip_date = moment(tripDay.trip_date).format(DATE_FORMAT);
              map(tripDay.events, (tripEvent: Event) => {
                return parseToLocalTime(tripEvent, tripDetailResult.result.timezone_id);
              });
              return tripDay;
            });
            dispatch(updateSelectedTripDayId(tripDetailResult.result.trip_day[0].id));
          }
          tripDetailResult.result.archived = tripDetailResult.result.archived === 1;
          dispatch(fetchingTripDetailSuccess(tripDetailResult.result));
        } else {
          dispatch(_fetchTripDetailFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_fetchTripDetailFailure(error.error));
      });
  };
};

const creatingTrip = () => {
  return {
    type: Actions.CREATING_TRIP,
  };
};

const creatingTripFailure = () => {
  return {
    type: Actions.CREATING_TRIP_FAILURE,
  };
};

const creatingTripSuccess = (trip: Trip) => {
  return {
    type: Actions.CREATING_TRIP_SUCCESS,
    trip,
  };
};

const _createTripFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(creatingTripFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTrip = (payload: Trip) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(creatingTrip());
    tripService
      .createTrip(payload)
      .then((result: any) => {
        if (result.success) {
          payload.id = result.result.trip_id;
          dispatch(creatingTripSuccess(payload));
        } else {
          dispatch(_createTripFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripFailure(error.error));
      });
  };
};

const creatingTripDay = () => {
  return {
    type: Actions.CREATING_TRIP_DAY,
  };
};

const creatingTripDayFailure = () => {
  return {
    type: Actions.CREATING_TRIP_DAY_FAILURE,
  };
};

const creatingTripDaySuccess = (tripDay: TripDay) => {
  return {
    type: Actions.CREATING_TRIP_DAY_SUCCESS,
    tripDay,
  };
};

const _createTripDayFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(creatingTripDayFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTripDay = (payload: TripDay) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(creatingTripDay());
    tripService
      .createTripDay(payload)
      .then((result: any) => {
        if (result.success) {
          payload.id = result.result.trip_day_id;
          dispatch(updateSelectedTripDayId(result.result.trip_day_id));
          dispatch(creatingTripDaySuccess(payload));
        } else {
          dispatch(_createTripDayFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripDayFailure(error.error));
      });
  };
};

const creatingTripEvent = () => {
  return {
    type: Actions.CREATING_TRIP_EVENT,
  };
};

const creatingTripEventFailure = () => {
  return {
    type: Actions.CREATING_TRIP_EVENT_FAILURE,
  };
};

const creatingTripEventSuccess = (tripEvent: Event) => {
  return {
    type: Actions.CREATING_TRIP_EVENT_SUCCESS,
    tripEvent,
  };
};

const _createTripEventFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(creatingTripEventFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTripEvent = (payload: Event) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>, getState: any) => {
    const newPayload = _createEventRequestPayload(payload, getState());

    dispatch(creatingTripEvent());
    eventService
      .createTripEvent(newPayload)
      .then((result: any) => {
        if (result.success) {
          newPayload.id = result.result.event_id;
          dispatch(creatingTripEventSuccess(newPayload));
        } else {
          dispatch(_createTripEventFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripEventFailure(error.error));
      });
  };
};

const deletingTripEvent = () => {
  return {
    type: Actions.DELETING_TRIP_EVENT,
  };
};

const deletingTripEventFailure = () => {
  return {
    type: Actions.DELETING_TRIP_EVENT_FAILURE,
  };
};

const deletingTripEventSuccess = (tripEvent: Event) => {
  return {
    type: Actions.DELETING_TRIP_EVENT_SUCCESS,
    tripEvent,
  };
};

const _deleteTripEventFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(deletingTripEventFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const deleteTripEvent = (payload: Event) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(deletingTripEvent());
    eventService
      .deleteTripEvent(payload.id)
      .then((result: any) => {
        if (result.success) {
          dispatch(deletingTripEventSuccess(payload));
        } else {
          dispatch(_deleteTripEventFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_deleteTripEventFailure(error.error));
      });
  };
};
