import { Button, Grid, Icon, Typography } from '@material-ui/core';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../constants/types';
import { Event as TripEvent } from '../models/event';
import { TripDay } from '../models/trip-day';
import { openTripEventForm } from '../store/actions/dashboard-actions';
import { EventComponent } from './event';
import myTheme from './theme';

const styles = {
  eventWrapper: {
    paddingBottom: '1rem',
  },
  button: {
    margin: '0.5rem',
    'text-transform': 'none',
    fontSize: '0.9rem',
  },
  buttonIcon: {
    marginRight: '0.5rem',
  },
};

class TripEventList extends React.Component<any, any> {
  render() {
    const { classes, tripDay, tripEventList } = this.props;

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
                    onClick={() => this.props.openTripEventForm(true)}>
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
  }
}

const mapStateToProps = (state: RootState) => {
  const tripDay: TripDay = state.trip.tripDetail.trip_day.find(
    (tripDay: TripDay) => tripDay.id === state.dashboard.selectedTripDayId
  );
  let tripEventList: TripEvent[] = [];
  if (!isEmpty(tripDay)) {
    tripEventList = tripDay.events;
  }
  return {
    selectedTripDayId: state.dashboard.selectedTripDayId,
    tripDay,
    tripEventList,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
  return bindActionCreators(
    {
      openTripEventForm,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripEventList));
