import { ListItemIcon } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { clearAlert } from '../store/actions/alert-actions';

const styles = {
  tripDayList: {
    width: '100%',
    maxWidth: '20rem',
    backgroundColor: '#fff',
  },
};

class TripDayList extends React.Component<any, any> {
  render() {
    const { classes, tripDetail } = this.props;

    return (
      <List className={classes.tripDayList}>
        <ListItem button key='Create new day'>
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText primary='Create new day' />
        </ListItem>
        {tripDetail.trip_day.map(tripDay => (
          <ListItem button key={tripDay.id}>
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
    alert: state.alert,
    tripDetail: state.trip.tripDetail,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      clearAlert,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDayList));
