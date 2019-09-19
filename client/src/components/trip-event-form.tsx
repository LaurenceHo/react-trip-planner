import MomentUtils from '@date-io/moment';
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Grid,
  Icon,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { withStyles } from '@material-ui/styles';
import { Formik, FormikActions, FormikProps } from 'formik';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { currency } from '../assets/currency';
import { timezone } from '../assets/timezone';
import { DATE_TIME_FORMAT } from '../constants/general';
import { RootState } from '../constants/types';
import { eventFormValidationSchema } from '../constants/validation';
import { Event as TripEvent } from '../models/event';
import { openTripEventForm } from '../store/actions/dashboard-actions';
import { createTripEvent } from '../store/actions/trip-actions';
import myTheme from './theme';

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
  categoryGroup: {
    margin: '0.5rem',
    'flex-direction': 'row',
  },
  categoryLabel: {
    width: '15rem',
  },
  chip: {
    margin: '0.25rem',
  },
};

class TripEventForm extends React.Component<any, any> {
  handleDialogClose = (): void => {
    this.props.openTripEventForm(false);
  };

  render() {
    const { classes, dashboard } = this.props;

    const categories = [
      { value: '1', key: 'Activity' },
      { value: '2', key: 'Transportation' },
      { value: '3', key: 'Info' },
      { value: '4', key: 'Accommodation' },
      { value: '5', key: 'Flight' },
      { value: '6', key: 'Cruise' },
    ];

    const InnerForm = (props: FormikProps<TripEvent>) => {
      const {
        values: {
          category_id,
          start_time_timezone_id,
          end_time_timezone_id,
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

      const change = (name: any, e: any): void => {
        e.persist();
        handleChange(e);
        setFieldTouched(name, true, false);
      };

      const handleDateChange = (name: string) => (date: Moment | null): void => {
        const dateString = date ? moment(date).format(DATE_TIME_FORMAT) : null;
        if (name === 'start_time' && date) {
          const startDateMoment = moment(date);
          const endDateMoment = end_time ? moment(end_time) : null;
          if (startDateMoment.diff(endDateMoment, 'm') > 0 || !end_time) {
            setFieldValue('end_time', dateString);
          }
        }
        setFieldValue(name, dateString);
      };

      const categoryLabel = (category: string) => {
        if (category === 'Activity') {
          return (
            <div>
              <Icon>directions_run</Icon>Activity
            </div>
          );
        } else if (category === 'Transportation') {
          return (
            <div>
              <Icon>directions_bus</Icon>Transportation
            </div>
          );
        } else if (category === 'Info') {
          return (
            <div>
              <Icon>info</Icon>Info
            </div>
          );
        } else if (category === 'Accommodation') {
          return (
            <div>
              <Icon>hotel</Icon>Accommodation
            </div>
          );
        } else if (category === 'Flight') {
          return (
            <div>
              <Icon>flight</Icon>Flight
            </div>
          );
        } else if (category === 'Cruise') {
          return (
            <div>
              <Icon>directions_boat</Icon>Cruise
            </div>
          );
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <div className={classes.categoryGroupRoot}>
            <FormLabel component='legend'>Category</FormLabel>
            <RadioGroup
              name='category_id'
              className={classes.categoryGroup}
              value={String(category_id)}
              onChange={change.bind(null, 'category_id')}>
              {categories.map((c: { key: string; value: string }) => (
                <FormControlLabel
                  key={c.value}
                  value={c.value}
                  control={<Radio />}
                  label={categoryLabel(c.key)}
                  labelPlacement='end'
                  className={classes.categoryLabel}
                />
              ))}
            </RadioGroup>
          </div>
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
                  clearable
                  fullWidth
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label='Timezone'
                name='start_time_timezone_id'
                margin='normal'
                value={start_time_timezone_id}
                onChange={change.bind(null, 'start_time_timezone_id')}
                required
                fullWidth
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}>
                <MenuItem value={0}>--</MenuItem>
                {timezone.map(tz => (
                  <MenuItem key={tz.id} value={tz.id}>
                    {tz.text}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  label='End time'
                  name='end_time'
                  margin='normal'
                  value={end_time}
                  onChange={handleDateChange('end_time')}
                  minDate={start_time ? start_time : moment().add(-10, 'years')}
                  format={DATE_TIME_FORMAT}
                  clearable
                  fullWidth
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label='Timezone'
                name='end_time_timezone_id'
                margin='normal'
                value={end_time_timezone_id}
                onChange={change.bind(null, 'end_time_timezone_id')}
                required
                fullWidth
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}>
                <MenuItem value={0}>--</MenuItem>
                {timezone.map(tz => (
                  <MenuItem key={tz.id} value={tz.id}>
                    {tz.text}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label='Start location'
                name='start_location'
                helperText={touched.start_location ? errors.start_location : ''}
                error={touched.start_location && Boolean(errors.start_location)}
                margin='normal'
                value={start_location}
                onChange={change.bind(null, 'start_location')}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label='End location'
                name='end_location'
                helperText={touched.end_location ? errors.end_location : ''}
                error={touched.end_location && Boolean(errors.end_location)}
                margin='normal'
                value={end_location}
                onChange={change.bind(null, 'end_location')}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label='Cost'
                name='cost'
                helperText={touched.cost ? errors.cost : ''}
                error={touched.cost && Boolean(errors.cost)}
                margin='normal'
                value={cost}
                onChange={change.bind(null, 'cost')}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label='Currency'
                name='currency_id'
                margin='normal'
                value={currency_id}
                onChange={change.bind(null, 'currency_id')}
                fullWidth
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}>
                <MenuItem value={0}>--</MenuItem>
                {currency.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.code}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <TextField
            label='Note'
            name='note'
            helperText={touched.note ? errors.note : ''}
            margin='normal'
            value={note}
            onChange={change.bind(null, 'note')}
            multiline
            fullWidth
          />
          <TextField
            label='Tag'
            name='tag'
            helperText='Use comma to separate tag'
            margin='normal'
            value={tag}
            onChange={change.bind(null, 'tag')}
            multiline
            fullWidth
          />
          {!isEmpty(tag) &&
            tag
              .split(',')
              .map((t, index) => (
                <Chip key={`${t}-${index}`} size='small' label={t} className={classes.chip} color='primary' />
              ))}
          <Grid container spacing={2} className={classes.buttonWrapper}>
            <Grid item>
              <Button onClick={this.handleDialogClose}>Cancel</Button>
              <Button className={classes.confirmButton} disabled={!isValid} color='primary' type='submit'>
                Confirm
              </Button>
            </Grid>
          </Grid>
        </form>
      );
    };

    return (
      <MuiThemeProvider theme={myTheme}>
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
                  start_time_timezone_id: 0,
                  end_time_timezone_id: 0,
                  currency_id: 0,
                  start_time: null,
                  end_time: null,
                  title: '',
                  start_location: '',
                  end_location: '',
                  note: '',
                  tag: 'tag1,tag2',
                  cost: 0,
                }}
                validationSchema={eventFormValidationSchema}
                onSubmit={(values: TripEvent, actions: FormikActions<TripEvent>) => {
                  actions.setSubmitting(false);
                  this.props.createTripEvent(values);
                  this.handleDialogClose();
                }}
                render={(props: FormikProps<TripEvent>) => <InnerForm {...props} />}
              />
            </DialogContent>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    dashboard: state.dashboard,
    tripDetail: state.trip.tripDetail,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
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
