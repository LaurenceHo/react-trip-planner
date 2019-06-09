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
    fontSize: '1rem',
  },
};

class EventList extends React.Component<any, any> {
  componentDidMount(): void {}

  render() {
    const { classes, tripDayId, tripDetail } = this.props;
    let tripDay: TripDay = null;
    if (!isEmpty(tripDetail.trip_day)) {
      tripDay = tripDetail.trip_day.find(tripDay => tripDay.id === tripDayId);
    }

    return (
      <MuiThemeProvider theme={myTheme}>
        <div className={classes.eventWrapper}>
          <Paper className={classes.root}>
            <Grid container spacing={2}>
              <Grid item>
                <Button className={classes.button}>
                  <Icon>add</Icon> Create event
                </Button>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item container direction='column' spacing={2}>
                  <Typography variant='h5' component='h3'>
                    {tripDay.trip_date}
                  </Typography>
                  {!isEmpty(tripDay.name) && <Typography variant='subtitle1'>{tripDay.name}</Typography>}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
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
    tripDayId: state.dashboard.tripDayId,
    tripDetail: state.trip.tripDetail,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(EventList));
