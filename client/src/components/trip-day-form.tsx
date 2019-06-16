import MomentUtils from '@date-io/moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { withStyles } from '@material-ui/styles';
import { Formik, FormikActions, FormikProps } from 'formik';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { openTripDayForm } from '../store/actions/dashboard-actions';
import { createTripDay } from '../store/actions/trip-actions';
import { tripDayFormValidationSchema } from './validation';

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

interface TripDayFormTypes {
  trip_id: number;
  name: string;
  trip_date: string;
}

class TripDayForm extends React.Component<any, any> {
  handleDialogClose = () => {
    this.props.openTripDayForm(false);
  };

  render() {
    const { classes, dashboard, tripDetail } = this.props;

    const InnerForm = (props: FormikProps<TripDayFormTypes>) => {
      const {
        values: { name, trip_date },
        errors,
        touched,
        handleChange,
        isValid,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
      } = props;

      const change = (name, e) => {
        e.persist();
        handleChange(e);
        setFieldTouched(name, true, false);
      };

      const handleDateChange = (name: string) => (date: Moment | null) => {
        const dateString = moment(date).format('YYYY-MM-DD');
        setFieldValue(name, dateString);
      };

      return (
        <form onSubmit={handleSubmit}>
          <TextField
            label='Name'
            name='name'
            margin='normal'
            value={name}
            onChange={change.bind(null, 'name')}
            fullWidth
          />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              label='Trip date'
              name='start_date'
              helperText={touched.trip_date ? errors.trip_date : ''}
              error={touched.trip_date && Boolean(errors.trip_date)}
              margin='normal'
              value={trip_date}
              onChange={handleDateChange('trip_date')}
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
              <Button
                className={classes.confirmButton}
                disabled={!isValid}
                variant='contained'
                color='primary'
                type='submit'>
                Confirm
              </Button>
            </Grid>
          </Grid>
        </form>
      );
    };

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
            <Formik
              initialValues={{
                trip_id: tripDetail.id,
                trip_date: tripDetail.start_date,
                name: '',
              }}
              validationSchema={tripDayFormValidationSchema}
              onSubmit={(values: TripDayFormTypes, actions: FormikActions<TripDayFormTypes>) => {
                actions.setSubmitting(false);
                this.props.createTripDay(values);
                this.handleDialogClose();
              }}
              render={(props: FormikProps<TripDayFormTypes>) => <InnerForm {...props} />}
            />
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
