import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { Event as TripEvent } from '../models/event';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperRoot: {
      padding: theme.spacing(2),
    },
    eventWrapper: {
      paddingBottom: theme.spacing(2),
    },
  })
);

interface EventComponentProps {
  tripEvent: TripEvent;
}
export const EventComponent = (props: EventComponentProps) => {
  const { tripEvent } = props;
  const classes = useStyles({});

  return (
    <div className={classes.eventWrapper} key={tripEvent.id}>
      <Paper className={classes.paperRoot}>
        <Grid container direction='column' spacing={2}>
          <Typography variant='h5' component='h3'>
            {tripEvent.title}
          </Typography>
          {!isEmpty(tripEvent.start_time) && (
            <Typography variant='subtitle1'>Start time: {tripEvent.start_time}</Typography>
          )}
          {!isEmpty(tripEvent.end_time) && <Typography variant='subtitle1'>End time: {tripEvent.end_time}</Typography>}
          {!isEmpty(tripEvent.start_location) && (
            <Typography variant='subtitle1'>Start location: {tripEvent.start_location}</Typography>
          )}
          {!isEmpty(tripEvent.end_location) && (
            <Typography variant='subtitle1'>End location: {tripEvent.end_location}</Typography>
          )}
        </Grid>
      </Paper>
    </div>
  );
};
