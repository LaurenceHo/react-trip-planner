import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { clearAlert } from '../store/actions/alert-actions';
import { getTripList } from '../store/actions/trip-actions';
import { SnackbarComponent } from './snackbar';
import myTheme from './theme';

const styles = {
  root: {
    width: '100%',
    marginTop: '1.5rem',
    'overflow-x': 'auto',
  },
  table: {
    minWidth: '40rem',
  },
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
};

class TripList extends React.Component<any, any> {
  componentDidMount(): void {
    const defaultRequestBody = {
      archived: false,
    };

    this.props.getTripList(defaultRequestBody);
  }

  componentDidUpdate(): void {}

  render() {
    const { alert, classes, tripList, history, isLoading } = this.props;
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
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Trip Name</TableCell>
                  <TableCell align='center'>Date</TableCell>
                  <TableCell align='center'>Destination</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {tripList.map(trip => (
                  <TableRow key={trip.id}>
                    <TableCell align='center'>{trip.name}</TableCell>
                    <TableCell align='center'>{`${trip.start_date} ~ ${trip.end_date}`}</TableCell>
                    <TableCell align='center'>{trip.destination}</TableCell>
                    <TableCell align='center'>
                      <Link
                        component='button'
                        variant='body2'
                        onClick={() => history.push(`/dashboard/trip/${trip.id}`)}>
                        Detail
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    alert: state.alert,
    isLoading: state.trip.isLoadingTripList,
    tripList: state.trip.tripList,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      clearAlert,
      getTripList,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripList));
