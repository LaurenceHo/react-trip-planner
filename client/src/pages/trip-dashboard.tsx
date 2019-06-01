import { CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import AppBarComponent from '../components/appbar';
import { DrawerComponent } from '../components/drawer';
import { closeDrawer } from '../store/actions/dashboard-actions';

const styles = {};

class TripDashboard extends React.Component<any, any> {
  handleDrawerClose = () => {
    this.props.closeDrawer();
  };

  render() {
    const { dashboard } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarComponent />
        <DrawerComponent handleDrawerClose={this.handleDrawerClose} open={dashboard.isDrawerOpen} />
        React trip planner from trip dashboard
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    dashboard: state.dashboard,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      closeDrawer,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDashboard));
