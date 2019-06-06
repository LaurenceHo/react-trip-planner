import Grid from '@material-ui/core/Grid';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import EventList from '../components/event-list';
import myTheme from '../components/theme';
import TripDayList from '../components/trip-day-list';
import TripDetailBanner from '../components/trip-detail-banner';
import { clearAlert } from '../store/actions/alert-actions';
import { getTripDetailWithDays, getTripList } from '../store/actions/trip-actions';

const styles = {
  progressWrapper: {
    'text-align': 'center',
    paddingTop: '1rem',
  },
  progress: {
    margin: '1rem',
  },
  snackbar: {
    paddingTop: '3rem',
  },
  tripDetailBannerWrapper: {
    paddingBottom: '2rem',
  },
};

class TripDetailDashboard extends React.Component<any, any> {
  componentDidMount(): void {
    if (isEmpty(this.props.tripList)) {
      // TODO - should use user's filter to fetch trip list
      this.props.getTripList({
        archived: false,
      });
    }
    this.props.getTripDetailWithDays(this.props.match.params.id);
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={myTheme}>
        <div>
          <div className={classes.tripDetailBannerWrapper}>
            <TripDetailBanner />
          </div>
          <Grid container spacing={2}>
            <Grid item>
              <TripDayList />
            </Grid>
            <Grid item>
              <EventList />
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    alert: state.alert,
    dashboard: state.dashboard,
    isLoading: state.trip.isLoading,
    tripList: state.trip.tripList,
    tripDetail: state.trip.tripDetail,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      clearAlert,
      getTripList,
      getTripDetailWithDays,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDetailDashboard));
