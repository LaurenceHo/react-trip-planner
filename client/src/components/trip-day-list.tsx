import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { TripDay } from '../models/trip-day';
import { openTripDayForm, updateSelectedTripDayId } from '../store/actions/dashboard-actions';

const styles = {
  tripDayList: {
    backgroundColor: '#fff',
  },
};

class TripDayList extends React.Component<any, any> {
  render() {
    const { classes, dashboard, tripDetail } = this.props;

    return (
      <List className={classes.tripDayList}>
        <ListItem button key='New Day' onClick={() => this.props.openTripDayForm(true)}>
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText primary='New Day' />
        </ListItem>
        {!isEmpty && <Divider />}
        {tripDetail.trip_day.map((tripDay: TripDay) => (
          <ListItem
            button
            key={tripDay.id}
            selected={dashboard.selectedTripDayId === tripDay.id}
            onClick={() => this.props.updateSelectedTripDayId(tripDay.id)}>
            <ListItemText primary={tripDay.trip_date} />
            <ListItemIcon>
              <Icon>chevron_right</Icon>
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    dashboard: state.dashboard,
    tripDetail: state.trip.tripDetail,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      openTripDayForm,
      updateSelectedTripDayId,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDayList));
