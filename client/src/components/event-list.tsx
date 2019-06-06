import CircularProgress from '@material-ui/core/CircularProgress';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { clearAlert } from '../store/actions/alert-actions';
import { SnackbarComponent } from './snackbar';
import myTheme from './theme';

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
  root: {
    minWidth: '100%',
  },
};

class EventList extends React.Component<any, any> {
  componentDidMount(): void {}

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
          <div className={classes.root}>HHHHHHHLLLLOOOLL</div>
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
    tripDayDetail: state.trip.tripDayDetail,
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
)(withStyles(styles)(EventList));
