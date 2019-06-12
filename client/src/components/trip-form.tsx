import { isEmpty } from 'lodash';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
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
}

class TripForm extends React.Component<any, TripFormState> {
  state = {
    timezone_id: 99,
    start_date: '',
    end_date: '',
    name: '',
    destination: '',
  };

  handleChange = (name: string) => (event: any) => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  validateForm = () => {
    const { start_date, end_date, destination } = this.state;
    if (isEmpty(start_date) || isEmpty(end_date) || isEmpty(destination)) {
      return;
    }
    this.props.createTrip(this.state);
    this.props.openTripForm(false);
  };

  render() {
    const { timezone_id, start_date, end_date, name, destination } = this.state;
    const { classes, dashboard, openTripForm } = this.props;

    return (
      <div>
        <Dialog
          open={dashboard.openTripForm}
          onClose={() => openTripForm(false)}
          aria-labelledby='form-dialog-title'
          maxWidth='sm'
          fullWidth>
          <DialogTitle id='form-dialog-title'>Create trip</DialogTitle>
          <DialogContent>
            <TextField
              label='Name'
              name='name'
              margin='normal'
              variant='outlined'
              value={name}
              onChange={this.handleChange('name')}
              fullWidth
            />
            <TextField
              label='Destination'
              name='destination'
              margin='normal'
              variant='outlined'
              value={destination}
              onChange={this.handleChange('destination')}
              required
              fullWidth
            />
            <TextField
              select
              label='Timezone'
              name='timezone_id'
              margin='normal'
              variant='outlined'
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
            <Button onClick={() => openTripForm(false)} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.validateForm} color='primary'>
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
