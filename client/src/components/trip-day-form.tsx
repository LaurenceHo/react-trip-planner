import MomentUtils from '@date-io/moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { withStyles } from '@material-ui/styles';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { openTripDayForm } from '../store/actions/dashboard-actions';
import { createTripDay } from '../store/actions/trip-actions';

const styles = {
  menu: {
    width: '12.5rem',
  },
  buttonWrapper: {
    padding: '1rem 0',
  },
  confirmButton: {
    marginLeft: '0.5rem',
  },
};

interface TripDayFormState {
  trip_id: number;
  name: string;
  trip_date: string;
}

class TripDayForm extends React.Component<any, TripDayFormState> {
  state = {
    trip_id: 0,
    trip_date: '',
    name: '',
  };

  getSnapshotBeforeUpdate(prevProps: Readonly<any>): any | null {
    if (this.props.tripDetail.id !== prevProps.tripDetail.id) {
      return { trip_id: this.props.tripDetail.id, trip_date: this.props.tripDetail.start_date };
    }
    return null;
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<TripDayFormState>,
    snapshot?: { trip_id: number; trip_date: string }
  ): void {
    if (snapshot !== null) {
      this.setState({ ...this.state, trip_id: snapshot.trip_id, trip_date: snapshot.trip_date });
    }
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.props.createTripDay(this.state);
    this.handleDialogClose();
  };

  handleChange = (name: string) => (event: any) => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  handleDateChange = (name: string) => (date: Moment | null) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    this.setState({ ...this.state, [name]: dateString });
  };

  handleDialogClose = () => {
    this.props.openTripDayForm(false);
    this.setState({ trip_id: this.props.tripDetail.id, trip_date: this.props.tripDetail.start_date, name: '' });
  };

  render() {
    const { classes, dashboard, tripDetail } = this.props;

    return (
      <div>
        <Dialog
          open={dashboard.openTripDayForm}
          onClose={this.handleDialogClose}
          aria-labelledby='form-dialog-title'
          maxWidth='sm'
          fullWidth>
          <DialogTitle id='form-dialog-title'>Create trip day</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                label='Name'
                name='name'
                margin='normal'
                value={this.state.name}
                onChange={this.handleChange('name')}
                fullWidth
              />
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                  label='Trip date'
                  name='start_date'
                  margin='normal'
                  value={this.state.trip_date}
                  onChange={this.handleDateChange('trip_date')}
                  minDate={tripDetail.start_date}
                  maxDate={tripDetail.end_date}
                  format='YYYY-MM-DD'
                  required
                  fullWidth
                />
              </MuiPickersUtilsProvider>
              <Grid container spacing={2} className={classes.buttonWrapper}>
                <Grid item>
                  <Button variant='contained' onClick={this.handleDialogClose}>
                    Cancel
                  </Button>
                  <Button className={classes.confirmButton} variant='contained' color='primary' type='submit'>
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </div>
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
      createTripDay,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDayForm));
