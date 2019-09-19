import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { currency } from '../assets/currency';
import { Currency } from '../models/currency';
import { Event as TripEvent } from '../models/event';
import { deleteTripEvent } from '../store/actions/trip-actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperRoot: {
      padding: theme.spacing(2),
    },
    eventWrapper: {
      paddingBottom: theme.spacing(2),
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    icon: {
      fontSize: '3rem',
    },
    fab: {
      margin: theme.spacing(1),
    },
  })
);

const currencyList: Currency[] = currency;

interface EventComponentProps {
  tripEvent: TripEvent;
}

export const EventComponent: React.FunctionComponent<EventComponentProps> = (props: EventComponentProps) => {
  const dispatch = useDispatch();

  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const { tripEvent } = props;

  const classes = useStyles({});

  const currency = currencyList.find((currency: Currency) => currency.id === tripEvent.currency_id);

  const eventIcon = () => {
    if (tripEvent.category_id === 1) {
      return <Icon className={classes.icon}>directions_run</Icon>;
    } else if (tripEvent.category_id === 2) {
      return <Icon className={classes.icon}>directions_bus</Icon>;
    } else if (tripEvent.category_id === 3) {
      return <Icon className={classes.icon}>info</Icon>;
    } else if (tripEvent.category_id === 4) {
      return <Icon className={classes.icon}>hotel</Icon>;
    } else if (tripEvent.category_id === 5) {
      return <Icon className={classes.icon}>flight</Icon>;
    } else if (tripEvent.category_id === 6) {
      return <Icon className={classes.icon}>directions_boat</Icon>;
    }
  };

  const handleDeleteEvent = () => {
    setDialogOpen(false);
    dispatch(deleteTripEvent(tripEvent));
  };

  return (
    <div className={classes.eventWrapper} key={tripEvent.id}>
      <Paper className={classes.paperRoot}>
        <Grid container direction='row' spacing={2}>
          <Grid item xs={1} style={{ borderRight: '2px dodgerblue solid' }}>
            {eventIcon()}
          </Grid>
          <Grid item xs={9}>
            <Grid container direction='column'>
              <Typography variant='h5' component='h3'>
                {tripEvent.title}
              </Typography>
              {!isEmpty(tripEvent.start_time) && (
                <Typography variant='subtitle1'>Start at: {tripEvent.start_time}</Typography>
              )}
              {!isEmpty(tripEvent.end_time) && (
                <Typography variant='subtitle1'>End at: {tripEvent.end_time}</Typography>
              )}
              {!isEmpty(tripEvent.start_location) && (
                <Typography variant='subtitle1'>From: {tripEvent.start_location}</Typography>
              )}
              {!isEmpty(tripEvent.end_location) && (
                <Typography variant='subtitle1'>To: {tripEvent.end_location}</Typography>
              )}
              {tripEvent.cost && tripEvent.cost > 0 && (
                <Typography variant='subtitle1'>
                  Price: ${tripEvent.cost} {currency ? `(${currency.code})` : ''}
                </Typography>
              )}
            </Grid>
            {!isEmpty(tripEvent.tag) && (
              <Grid container direction='row' alignItems='center'>
                <Icon>label</Icon>
                {tripEvent.tag.split(',').map((t, index) => (
                  <Chip key={`${t}-${index}`} size='small' label={t} className={classes.chip} color='primary' />
                ))}
              </Grid>
            )}
          </Grid>
          <Grid item xs={2} container direction='row' justify='flex-end' alignItems='center'>
            <Fab color='primary' size='small' aria-label='edit' className={classes.fab}>
              <Icon>edit</Icon>
            </Fab>
            <Fab
              color='secondary'
              size='small'
              aria-label='delete'
              className={classes.fab}
              onClick={() => setDialogOpen(true)}>
              <Icon>delete</Icon>
            </Fab>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Delete Event?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            This will permanently delete the event <strong>{tripEvent.title}</strong>. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteEvent} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
