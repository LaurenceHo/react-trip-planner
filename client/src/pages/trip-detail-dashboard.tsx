import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
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
import TripEventList from '../components/trip-event-list';
import { Messages } from '../constants/messages';
import { clearAlert } from '../store/actions/alert-actions';
import { getTripDetail, getTripList } from '../store/actions/trip-actions';

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
      this.props.getTripList();
    }
    this.props.getTripDetail(this.props.match.params.id);
  }

  render() {
    const { alert, isLoading, tripDetail, classes } = this.props;
    return (
      <MuiThemeProvider theme={myTheme}>
        {isLoading ? (
          <div className={classes.progressWrapper}>
            <CircularProgress className={classes.progress} color='secondary' />
          </div>
        ) : alert.type !== null && !isEmpty(alert.message) ? (
          <SnackbarComponent
            outerClassName={classes.snackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={alert.type !== null && !isEmpty(alert.message)}
            variant={alert.type}
            message={alert.message}
            onClose={() => this.props.clearAlert()}
          />
        ) : (
          <div>
            <div className={classes.tripDetailBannerWrapper}>
              <TripDetailBanner />
            </div>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TripDayList />
              </Grid>
              <Grid item xs={10}>
                {isEmpty(tripDetail.trip_day) ? (
                  <SnackbarComponent
                    outerClassName={classes.snackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={isEmpty(tripDetail.trip_day)}
                    variant='info'
                    message={Messages.createTripDay.message}
                  />
                ) : (
                  <TripEventList />
                )}
              </Grid>
            </Grid>
          </div>
        )}
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    alert: state.alert,
    isLoading: state.trip.isLoadingTripDetail,
    tripList: state.trip.tripList,
    tripDetail: state.trip.tripDetail,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      clearAlert,
      getTripList,
      getTripDetail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDetailDashboard));
