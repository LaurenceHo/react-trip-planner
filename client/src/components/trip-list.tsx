import Paper from '@material-ui/core/Paper';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { clearAlert } from '../store/actions/alert-actions';
import { fetchTripList } from '../store/actions/trip-actions';
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
};

class TripList extends React.Component<any, any> {
  componentDidMount() {
    const defaultRequestBody = {
      archived: false,
    };

    this.props.fetchTripList(defaultRequestBody);
  }

  componentDidUpdate() {}

  render() {
    const { classes, tripList } = this.props;

    return (
      <MuiThemeProvider theme={myTheme}>
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
                  <TableCell align='center'>Detail</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    alert: state.alert,
    tripList: state.trip.tripList,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      clearAlert,
      fetchTripList,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripList));
