import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { TripDay } from '../models/trip-day';
import { openTripEventForm } from '../store/actions/dashboard-actions';
import { RootState } from '../store/types';
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
    const { classes, selectedTripDayId, tripDayList } = this.props;
    let tripDay: TripDay = null;
    if (!isEmpty(tripDayList)) {
      tripDay = tripDayList.find((tripDay: TripDay) => tripDay.id === selectedTripDayId);
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
            {tripDay.events.map(tripEvent => (
              <EventComponent key={tripEvent.id} tripEvent={tripEvent} />
            ))}
          </>
        )}
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    selectedTripDayId: state.dashboard.selectedTripDayId,
    tripDayList: state.trip.tripDetail.trip_day,
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
