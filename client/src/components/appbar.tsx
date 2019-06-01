import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { push } from 'connected-react-router';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { UserService } from '../services/user-service';
import store from '../store';
import { closeDrawer, openDrawer } from '../store/actions/dashboard-actions';

const userService = new UserService();
const styles = {
  margin: {
    margin: '0.5rem',
  },
  leftIcon: {
    marginRight: '0.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: '1rem',
  },
  title: {
    display: 'block',
  },
  search: {
    borderRadius: '0.3rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    marginRight: '1rem',
    marginLeft: '1.5rem',
    width: 'auto',
  },
  searchIcon: {
    width: '3.5rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: '0.5rem 0.5rem 0.5rem 3.5rem',
    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    width: '12.5rem',
  },
  sectionDesktop: {
    display: 'flex',
  },
  sectionMobile: {
    display: 'none',
  },
};

interface AppbarState {
  anchorEl: Element;
  mobileMoreAnchorEl: Element;
}

class AppBarComponent extends React.Component<any, AppbarState> {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  handleMobileMenuClose = () => {
    this.setState({
      mobileMoreAnchorEl: null,
    });
  };

  handleMobileMenuOpen = (event: any) => {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget,
    });
  };

  handleProfileMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
    this.handleMobileMenuClose();
  };

  handleProfileMenuOpen = (event: any) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color='inherit'>
            <Icon>account_circle</Icon>
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    const MyMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleProfileMenuClose}>
        <MenuItem onClick={this.handleProfileMenuClose}>
          <Icon className={classes.leftIcon}>person</Icon>My Profile
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuClose}>
          <Icon className={classes.leftIcon}>settings</Icon>Settings
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            userService.logout();
            store.dispatch(push('/login'));
          }}>
          <Icon className={classes.leftIcon}>thumb_down</Icon>Logout
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.grow}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='Open drawer'>
              <Icon>menu</Icon>
            </IconButton>
            <Typography className={clsx('app-bar-title', classes.title)} variant='h6' noWrap>
              Trip Planner
            </Typography>
            <div className={clsx('app-bar-search-input', 'app-bar-search-input-mobile', classes.search)}>
              <div className={clsx('app-bar-search-input-icon', classes.searchIcon)}>
                <Icon>search</Icon>
              </div>
              <InputBase
                placeholder='Search…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <div className={classes.grow} />
            <div className={clsx('app-bar-menu-button-desktop', classes.sectionDesktop)}>
              <IconButton
                edge='end'
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup='true'
                onClick={this.handleProfileMenuOpen}
                color='inherit'>
                <Icon>account_circle</Icon>
              </IconButton>
            </div>
            <div className={clsx('app-bar-menu-button-mobile', classes.sectionMobile)}>
              <IconButton aria-haspopup='true' onClick={this.handleMobileMenuOpen} color='inherit'>
                <Icon>more_vert</Icon>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {MyMenu}
        {renderMobileMenu}
      </div>
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
      openDrawer,
      closeDrawer,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AppBarComponent));
