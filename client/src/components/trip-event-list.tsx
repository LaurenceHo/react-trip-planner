import { Button, createStyles, Grid, Icon, makeStyles, Theme, Typography } from '@material-ui/core';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../constants/types';
import { Event as TripEvent } from '../models/event';
import { TripDay } from '../models/trip-day';
import { openTripEventForm } from '../store/actions/dashboard-actions';
import { EventComponent } from './event';
import myTheme from './theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventWrapper: {
      paddingBottom: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(1),
      textTransform: 'none',
      fontSize: '0.9rem',
    },
    buttonIcon: {
      marginRight: theme.spacing(1),
    },
  })
);
export const TripEventList: React.FC<any> = () => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const selectedTripDayId = useSelector((state: RootState) => state.dashboard.selectedTripDayId);
  const tripDay: TripDay = useSelector((state: RootState) => state.trip.tripDetail.trip_day).find(
    (tripDay: TripDay) => tripDay.id === selectedTripDayId
  );
  let tripEventList: TripEvent[] = [];
  if (!isEmpty(tripDay)) {
    tripEventList = tripDay.events;
  }

  return (
    <MuiThemeProvider theme={myTheme}>
      {!isEmpty(tripDay) && (
        <>
          <div className={classes.eventWrapper}>
            <Grid container direction='row' justify='flex-start' alignItems='center' spacing={2}>
              <Grid item>
                <Button
                  className={classes.button}
                  variant='contained'
                  color='primary'
                  size='medium'
                  onClick={() => dispatch(openTripEventForm(true))}>
                  <Icon className={classes.buttonIcon}>add</Icon> New Event
                </Button>
              </Grid>
              <Grid item>
                <Typography variant='h5' component='h3'>
                  {tripDay.trip_date}
                </Typography>
              </Grid>
              {!isEmpty(tripDay.name) && (
                <Grid item>
                  <Typography variant='subtitle1'>{tripDay.name}</Typography>
                </Grid>
              )}
            </Grid>
          </div>
          {tripEventList.map((tripEvent: TripEvent) => (
            <EventComponent key={tripEvent.id} tripEvent={tripEvent} />
          ))}
        </>
      )}
    </MuiThemeProvider>
  );
};
