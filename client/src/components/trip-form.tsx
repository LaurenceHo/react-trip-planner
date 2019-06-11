import { withStyles } from '@material-ui/styles';
import * as React from 'react';
import { CSSProperties } from 'react';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { openTripForm } from '../store/actions/dashboard-actions';

const styles = {};

class TripForm extends React.Component<any, any> {
  rand = () => {
    return Math.round(Math.random() * 20) - 10;
  };

  getModalStyle = (): CSSProperties => {
    const top = 50 + this.rand();
    const left = 50 + this.rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      position: 'absolute',
      width: '400px',
      padding: '32px',
      outline: 'none',
      boxShadow:
        '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
      backgroundColor: '#fff',
    };
  };

  render() {
    const { classes, dashboard, openTripForm } = this.props;

    return (
      <Modal
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
        open={dashboard.openTripForm}
        onClose={() => openTripForm(false)}>
        <div style={this.getModalStyle()} className={classes.paper}>
          <Typography variant='h6' id='modal-title'>
            Text in a modal
          </Typography>
          <Typography variant='subtitle1' id='simple-modal-description'>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </div>
      </Modal>
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
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TripForm));
