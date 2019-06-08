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
import { selectedTripDayId } from '../store/actions/dashboard-actions';

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
        <ListItem button key='Create new day'>
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText primary='Create new day' />
        </ListItem>
        {!isEmpty && <Divider />}
        {tripDetail.trip_day.map(tripDay => (
          <ListItem
            button
            key={tripDay.id}
            selected={dashboard.tripDayId === tripDay.id}
            onClick={() => this.props.selectedTripDayId(tripDay.id)}>
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
      selectedTripDayId,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDayList));
