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
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../constants/types';
import { TripDay } from '../models/trip-day';
import { openTripDayForm, updateSelectedTripDayId } from '../store/actions/dashboard-actions';

const styles = {
  tripDayList: {
    backgroundColor: '#fff',
  },
};

class TripDayList extends React.Component<any, any> {
  render() {
    const { classes, dashboard, tripDayList } = this.props;

    return (
      <List className={classes.tripDayList}>
        <ListItem button key='New Day' onClick={() => this.props.openTripDayForm(true)}>
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText primary='New Day' />
        </ListItem>
        {!isEmpty && <Divider />}
        {tripDayList.map((tripDay: TripDay) => (
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

const mapStateToProps = (state: RootState) => {
  return {
    dashboard: state.dashboard,
    tripDayList: state.trip.tripDetail.trip_day,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
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
