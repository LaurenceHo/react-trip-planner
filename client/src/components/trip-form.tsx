import MomentUtils from '@date-io/moment';
import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Formik, FormikActions, FormikProps } from 'formik';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timezone } from '../assets/timezone';
import { DATE_FORMAT } from '../constants/general';
import { RootState } from '../constants/types';
import { tripFormValidationSchema } from '../constants/validation';
import { openTripForm } from '../store/actions/dashboard-actions';
import { createTrip } from '../store/actions/trip-actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      width: '12.5rem',
    },
    buttonWrapper: {
      padding: theme.spacing(2, 0),
    },
    confirmButton: {
      marginLeft: theme.spacing(1),
    },
  })
);

interface TripFormTypes {
  timezone_id: number;
  start_date: string;
  end_date: string;
  name: string;
  destination: string;
  archived: boolean;
}

export const TripForm: React.FC<any> = () => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const dashboard = useSelector((state: RootState) => state.dashboard);

  const handleDialogClose = (): void => {
    dispatch(openTripForm(false));
  };

  const InnerForm = (props: FormikProps<TripFormTypes>) => {
    const {
      values: { timezone_id, start_date, end_date, name, destination },
      errors,
      touched,
      handleChange,
      isValid,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
    } = props;

    const change = (name: any, e: any): void => {
      e.persist();
      handleChange(e);
      setFieldTouched(name, true, false);
    };

    const handleDateChange = (name: string) => (date: Moment | null): void => {
      const dateString = moment(date).format(DATE_FORMAT);
      const startDateMoment = moment(start_date);
      const endDateMoment = moment(end_date);
      if (name === 'start_date' && startDateMoment.diff(endDateMoment, 'days') > 0) {
        setFieldValue('end_date', dateString);
      }
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
        <TextField
          label='Destination'
          name='destination'
          helperText={touched.destination ? errors.destination : ''}
          error={touched.destination && Boolean(errors.destination)}
          margin='normal'
          value={destination}
          onChange={change.bind(null, 'destination')}
          required
          fullWidth
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label='Start date'
                name='start_date'
                margin='normal'
                value={start_date}
                onChange={handleDateChange('start_date')}
                format='YYYY-MM-DD'
                required
                fullWidth
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label='End date'
                name='end_date'
                margin='normal'
                value={end_date}
                onChange={handleDateChange('end_date')}
                minDate={start_date}
                format='YYYY-MM-DD'
                required
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
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button className={classes.confirmButton} disabled={!isValid} color='primary' type='submit'>
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
        open={dashboard.openTripForm}
        onClose={handleDialogClose}
        aria-labelledby='form-dialog-title'
        maxWidth='sm'
        fullWidth>
        <DialogTitle id='form-dialog-title'>Create trip</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              timezone_id: 99,
              start_date: moment().format(DATE_FORMAT),
              end_date: moment().format(DATE_FORMAT),
              name: '',
              destination: '',
              archived: false,
            }}
            validationSchema={tripFormValidationSchema}
            onSubmit={(values: TripFormTypes, actions: FormikActions<TripFormTypes>) => {
              actions.setSubmitting(false);
              dispatch(createTrip(values));
              handleDialogClose();
            }}
            render={(props: FormikProps<TripFormTypes>) => <InnerForm {...props} />}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
