import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { clearAlert } from '../store/actions/alert-actions';
import { fetchTripDetail, fetchTripList } from '../store/actions/trip-actions';
import myTheme from './theme';

const styles = {
  root: {
    padding: '1.5rem 1rem',
  },
};

class TripDetailBanner extends React.Component<any, any> {
  componentDidMount(): void {}

  render() {
    const { classes, tripDetail, history } = this.props;
    return (
      <MuiThemeProvider theme={myTheme}>
        <div>
          <Paper className={classes.root}>
            <Grid container spacing={2}>
              <Grid item>
                <IconButton onClick={() => history.goBack()}>
                  <Icon>chevron_left</Icon>
                </IconButton>
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction='column' spacing={2}>
                  <Typography variant='h5' component='h3'>
                    {tripDetail.destination}
                  </Typography>
                  <Typography variant='subtitle1'>
                    {tripDetail.start_date} ~ {tripDetail.end_date}
                  </Typography>
                  {!isEmpty(tripDetail.name) && <Typography variant='body2'>{tripDetail.name}</Typography>}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    alert: state.alert,
    tripDetail: state.trip.tripDetail,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      clearAlert,
      fetchTripList,
      fetchTripDetail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripDetailBanner));
