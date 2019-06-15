import MomentUtils from '@date-io/moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { timezone } from '../assets/timezone';
import { openTripForm } from '../store/actions/dashboard-actions';
import { createTrip } from '../store/actions/trip-actions';

const styles = {
  menu: {
    width: '12.5rem',
  },
};

interface TripFormState {
  timezone_id: number;
  start_date: string;
  end_date: string;
  name: string;
  destination: string;
  archived: boolean;
}

class TripForm extends React.Component<any, TripFormState> {
  state = {
    timezone_id: 99,
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    name: '',
    destination: '',
    archived: false,
  };

  handleChange = (name: string) => (event: any) => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  handleDateChange = (name: string) => (date: Moment | null) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    this.setState({ ...this.state, [name]: dateString });
  };

  handleDialogClose = () => {
    this.cleanupForm();
  };

  validateForm = () => {
    const { start_date, end_date, destination } = this.state;
    if (isEmpty(start_date) || isEmpty(end_date) || isEmpty(destination)) {
      return;
    }
    this.props.createTrip(this.state);
    this.cleanupForm();
  };

  cleanupForm = () => {
    this.setState({
      timezone_id: 99,
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      name: '',
      destination: '',
      archived: false,
    });
    this.props.openTripForm(false);
  };

  render() {
    const { timezone_id, start_date, end_date, name, destination } = this.state;
    const { classes, dashboard } = this.props;

    return (
      <div>
        <Dialog
          open={dashboard.openTripForm}
          onClose={this.handleDialogClose}
          aria-labelledby='form-dialog-title'
          maxWidth='sm'
          fullWidth>
          <DialogTitle id='form-dialog-title'>Create trip</DialogTitle>
          <DialogContent>
            <TextField
              label='Name'
              name='name'
              margin='normal'
              value={name}
              onChange={this.handleChange('name')}
              fullWidth
            />
            <TextField
              label='Destination'
              name='destination'
              margin='normal'
              value={destination}
              onChange={this.handleChange('destination')}
              required
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    required
                    fullWidth
                    margin='normal'
                    id='mui-pickers-date'
                    label='Start date'
                    value={start_date}
                    onChange={this.handleDateChange('start_date')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    format='YYYY-MM-DD'
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    required
                    fullWidth
                    margin='normal'
                    id='mui-pickers-date'
                    label='End date'
                    value={end_date}
                    onChange={this.handleDateChange('end_date')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    format='YYYY-MM-DD'
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <TextField
              select
              label='Timezone'
              name='timezone_id'
              margin='normal'
              value={timezone_id}
              onChange={this.handleChange('timezone_id')}
              required
              fullWidth
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}>
              {timezone.map(tz => (
                <MenuItem key={tz.id} value={tz.id}>
                  {tz.text}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={this.handleDialogClose}>
              Cancel
            </Button>
            <Button variant='outlined' onClick={this.validateForm} color='primary'>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
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
      openTripForm,
      createTrip,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripForm));
