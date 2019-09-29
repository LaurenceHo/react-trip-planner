import MomentUtils from '@date-io/moment';
import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../constants/types';
import { openTripDayForm } from '../store/actions/dashboard-actions';
import { createTripDay } from '../store/actions/trip-actions';

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

interface TripDayFormState {
  trip_id: number;
  name: string;
  trip_date: string;
}

export const TripDayForm: React.FC<any> = () => {
  const [tripDayFormState, setTripDayFormState] = React.useState<TripDayFormState>({
    trip_id: 0,
    trip_date: '',
    name: '',
  });
  const classes = useStyles({});
  const dispatch = useDispatch();
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const tripDetail = useSelector((state: RootState) => state.trip.tripDetail);

  const handleChange = (name: string) => (event: any) => {
    setTripDayFormState({ ...tripDayFormState, [name]: event.target.value });
  };

  const handleDateChange = (name: string) => (date: Moment | null) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    setTripDayFormState({ ...tripDayFormState, [name]: dateString });
  };

  const handleDialogClose = () => {
    dispatch(openTripDayForm(false));
    setTripDayFormState({ trip_id: tripDetail.id, trip_date: tripDetail.start_date, name: '' });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    dispatch(createTripDay(tripDayFormState));
    handleDialogClose();
  };

  useEffect(() => {
    if (tripDetail.id !== tripDayFormState.trip_id) {
      setTripDayFormState({ ...tripDayFormState, trip_id: tripDetail.id, trip_date: tripDetail.start_date });
    }
  });

  return (
    <div>
      <Dialog
        open={dashboard.openTripDayForm}
        onClose={handleDialogClose}
        aria-labelledby='form-dialog-title'
        maxWidth='sm'
        fullWidth>
        <DialogTitle id='form-dialog-title'>Create trip day</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label='Name'
              name='name'
              margin='normal'
              value={tripDayFormState.name}
              onChange={handleChange('name')}
              fullWidth
            />
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label='Trip date'
                name='start_date'
                margin='normal'
                value={tripDayFormState.trip_date}
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
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button className={classes.confirmButton} color='primary' type='submit'>
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
