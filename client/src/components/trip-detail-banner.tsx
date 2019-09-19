import { Grid, Icon, IconButton, Paper, Typography } from '@material-ui/core';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RootState } from '../constants/types';
import myTheme from './theme';

const styles = {
  root: {
    padding: '1.5rem 1rem',
  },
};

class TripDetailBanner extends React.Component<any, any> {
  render() {
    const { classes, tripDetail } = this.props;
    const startDateMoment = moment(tripDetail.start_date);
    const endDateMoment = moment(tripDetail.end_date);
    const dateDiff = endDateMoment.diff(startDateMoment, 'days');

    const GoBackButton = withRouter(({ history }) => (
      <IconButton onClick={() => history.goBack()}>
        <Icon>chevron_left</Icon>
      </IconButton>
    ));

    return (
      <MuiThemeProvider theme={myTheme}>
        <Paper className={classes.root}>
          <Grid container alignItems='center' spacing={2}>
            <Grid item>
              <GoBackButton />
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item container direction='column' spacing={2}>
                <Typography variant='h5' component='h3'>
                  {tripDetail.destination}
                </Typography>
                <Typography variant='subtitle1'>
                  {tripDetail.start_date} ~ {tripDetail.end_date} ({dateDiff} days)
                </Typography>
                {!isEmpty(tripDetail.name) && <Typography variant='body2'>{tripDetail.name}</Typography>}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    tripDetail: state.trip.tripDetail,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(TripDetailBanner));
