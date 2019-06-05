import CircularProgress from '@material-ui/core/CircularProgress';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { SnackbarComponent } from '../components/snackbar';
import myTheme from '../components/theme';
import TripDayList from '../components/trip-day-list';
import TripDetailBanner from '../components/trip-detail-banner';
import { clearAlert } from '../store/actions/alert-actions';
import { fetchTripDetail, fetchTripList } from '../store/actions/trip-actions';

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
      this.props.fetchTripList({
        archived: false,
      });
    }
    this.props.fetchTripDetail(this.props.match.params.id);
  }

  render() {
    const { alert, classes, isLoading } = this.props;

    return (
      <MuiThemeProvider theme={myTheme}>
        {alert.type !== null && !isEmpty(alert.message) && (
          <SnackbarComponent
            outerClassName={classes.snackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={alert.type !== null && !isEmpty(alert.message)}
            variant={alert.type}
            message={alert.message}
            onClose={() => this.props.clearAlert()}
          />
        )}
        {isLoading ? (
          <div className={classes.progressWrapper}>
            <CircularProgress className={classes.progress} color='secondary' />
          </div>
        ) : (
          <div>
            <div className={classes.tripDetailBannerWrapper}>
              <TripDetailBanner />
            </div>
            <TripDayList />
          </div>
        )}
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
      fetchTripList,
      fetchTripDetail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDetailDashboard));
