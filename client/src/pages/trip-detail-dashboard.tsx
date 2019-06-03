import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import TripDayList from '../components/trip-day-list';
import { clearAlert } from '../store/actions/alert-actions';
import { fetchTripDetail, fetchTripList } from '../store/actions/trip-actions';

const styles = {};

class TripDetailDashboard extends React.Component<any, any> {
  componentDidMount(): void {
    if (isEmpty(this.props.tripList)) {
      // TODO - should use user's filter to fetch trip list
      this.props.fetchTripList();
    }
    this.props.fetchTripDetail(this.props.match.params.id);
  }

  render() {
    return (
      <div>
        <TripDayList />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    alert: state.alert,
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
