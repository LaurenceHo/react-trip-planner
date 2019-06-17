import MomentUtils from '@date-io/moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { withStyles } from '@material-ui/styles';
import { Formik, FormikActions, FormikProps } from 'formik';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { timezone } from '../assets/timezone';
import { DATE_TIME_FORMAT } from '../constants/general';
import { eventFormValidationSchema } from '../constants/validation';
import { openTripEventForm } from '../store/actions/dashboard-actions';
import { createTripEvent } from '../store/actions/trip-actions';

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

interface TripEventFormTypes {
  trip_day_id: number;
  category_id: number;
  timezone_id: number;
  currency_id: number;
  start_time: string;
  end_time: string;
  title: string;
  start_location: string;
  end_location: string;
  note: string;
  tag: string;
  cost: number;
}

class TripEventForm extends React.Component<any, any> {
  handleDialogClose = (): void => {
    this.props.openTripEventForm(false);
  };

  render() {
    const { classes, dashboard } = this.props;

    const InnerForm = (props: FormikProps<TripEventFormTypes>) => {
      const {
        values: {
          category_id,
          timezone_id,
          currency_id,
          start_time,
          end_time,
          title,
          start_location,
          end_location,
          note,
          tag,
          cost,
        },
        errors,
        touched,
        handleChange,
        isValid,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
      } = props;

      const change = (name, e): void => {
        e.persist();
        handleChange(e);
        setFieldTouched(name, true, false);
      };

      const handleDateChange = (name: string) => (date: Moment | null): void => {
        const dateString = moment(date).format(DATE_TIME_FORMAT);
        setFieldValue(name, dateString);
      };

      return (
        <form onSubmit={handleSubmit}>
          <TextField
            label='Title'
            name='title'
            helperText={touched.title ? errors.title : ''}
            error={touched.title && Boolean(errors.title)}
            margin='normal'
            value={title}
            onChange={change.bind(null, 'title')}
            required
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  label='Start time'
                  name='start_time'
                  margin='normal'
                  value={start_time}
                  onChange={handleDateChange('start_time')}
                  format={DATE_TIME_FORMAT}
                  fullWidth
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={6}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  label='End time'
                  name='end_time'
                  margin='normal'
                  value={end_time}
                  onChange={handleDateChange('end_time')}
                  minDate={end_time}
                  format={DATE_TIME_FORMAT}
                  fullWidth
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
            onChange={change.bind(null, 'timezone_id')}
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
          open={dashboard.openTripEventForm}
          onClose={this.handleDialogClose}
          aria-labelledby='form-dialog-title'
          maxWidth='sm'
          fullWidth>
          <DialogTitle id='form-dialog-title'>Create event</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={{
                trip_day_id: this.props.dashboard.selectedTripDayId,
                category_id: 1,
                timezone_id: this.props.tripDetail.timezone_id,
                currency_id: 0,
                start_time: moment().format(DATE_TIME_FORMAT),
                end_time: moment().format(DATE_TIME_FORMAT),
                title: '',
                start_location: '',
                end_location: '',
                note: '',
                tag: '',
                cost: 0,
              }}
              validationSchema={eventFormValidationSchema}
              onSubmit={(values: TripEventFormTypes, actions: FormikActions<TripEventFormTypes>) => {
                actions.setSubmitting(false);
                this.props.createTripEvent(values);
                this.handleDialogClose();
              }}
              render={(props: FormikProps<TripEventFormTypes>) => <InnerForm {...props} />}
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
      openTripEventForm,
      createTripEvent,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripEventForm));
