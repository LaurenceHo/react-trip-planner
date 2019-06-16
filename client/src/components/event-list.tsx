import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { TripDay } from '../models/trip-day';
import myTheme from './theme';

const styles = {
  root: {
    padding: '1.5rem 1rem',
  },
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

class EventList extends React.Component<any, any> {
  componentDidMount(): void {}

  render() {
    const { classes, selectedTripDayId, tripDetail } = this.props;
    let tripDay: TripDay = null;
    if (!isEmpty(tripDetail.trip_day)) {
      tripDay = tripDetail.trip_day.find(tripDay => tripDay.id === selectedTripDayId);
    }

    return (
      <MuiThemeProvider theme={myTheme}>
        <div className={classes.eventWrapper}>
          <Grid container direction='row' justify='flex-start' alignItems='center' spacing={2}>
            <Grid item>
              <Button className={classes.button} variant='contained' color='primary' size='medium'>
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
          <div className={classes.eventWrapper} key={tripEvent.id}>
            <Paper className={classes.root}>
              <Grid container direction='column' spacing={2}>
                <Typography variant='h5' component='h3'>
                  {tripEvent.title}
                </Typography>
                {!isEmpty(tripEvent.start_time) && (
                  <Typography variant='subtitle1'>Start time: {tripEvent.start_time}</Typography>
                )}
                {!isEmpty(tripEvent.end_time) && (
                  <Typography variant='subtitle1'>End time: {tripEvent.end_time}</Typography>
                )}
                {!isEmpty(tripEvent.start_location) && (
                  <Typography variant='subtitle1'>Start location: {tripEvent.start_location}</Typography>
                )}
                {!isEmpty(tripEvent.end_location) && (
                  <Typography variant='subtitle1'>End location: {tripEvent.end_location}</Typography>
                )}
              </Grid>
            </Paper>
          </div>
        ))}
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    selectedTripDayId: state.dashboard.selectedTripDayId,
    tripDetail: state.trip.tripDetail,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(EventList));
