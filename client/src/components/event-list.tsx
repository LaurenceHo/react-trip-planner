import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import * as React from 'react';
import { connect } from 'react-redux';

import { isEmpty } from 'lodash';
import { Event } from '../models/event';
import myTheme from './theme';

const styles = {
  root: {
    padding: '1.5rem 1rem',
  },
  eventWrapper: {
    paddingBottom: '1rem',
  },
};

class EventList extends React.Component<any, any> {
  componentDidMount(): void {}

  render() {
    const { classes, tripDayId, tripDetail } = this.props;
    let tripEventList: Event[] = [];
    if (!isEmpty(tripDetail.trip_day)) {
      tripEventList = tripDetail.trip_day.find(tripDay => tripDay.id === tripDayId).events;
    }

    return (
      <MuiThemeProvider theme={myTheme}>
        {tripEventList.map(tripEvent => (
          <div className={classes.eventWrapper} key={tripEvent.id}>
            <Paper className={classes.root}>
              <Grid xs={12} sm container>
                <Grid item xs container direction='column' spacing={2}>
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
