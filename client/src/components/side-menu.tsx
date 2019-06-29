import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { openTripForm, setSideMenu } from '../store/actions/dashboard-actions';
import { getTripList } from '../store/actions/trip-actions';

interface SideMenuState {
  expendListOpen: boolean;
}

export class SideMenu extends React.Component<any, SideMenuState> {
  state = {
    expendListOpen: true,
  };

  getSnapshotBeforeUpdate(prevProps: Readonly<any>): any | null {
    if (this.props.isDrawerOpen !== prevProps.isDrawerOpen) {
      return this.props.isDrawerOpen;
    }
    return null;
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<SideMenuState>, snapshot?: any): void {
    if (snapshot !== null) {
      this.setState({ expendListOpen: snapshot });
    }
  }

  handExpendListClick = (): void => {
    this.setState({ expendListOpen: !this.state.expendListOpen });
  };

  handMenuChange = (menu: string): void => {
    this.props.setSideMenu(menu);
    this.props.getTripList();
  };

  render() {
    const { expendListOpen } = this.state;
    const { dashboard, router } = this.props;

    const sideMenuOption = [
      { key: 'upcoming', icon: 'event', label: 'Upcoming' },
      { key: 'current', icon: 'today', label: 'Currently Traveling' },
      { key: 'past', icon: 'date_range', label: 'Past' },
    ];
    return (
      <div>
        <List>
          <ListItem
            button
            key='New Trip'
            onClick={() => this.props.openTripForm(true)}
            disabled={router.location.pathname !== '/dashboard'}>
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText primary='New Trip' />
          </ListItem>
          <Divider />
          <ListItem button onClick={this.handExpendListClick}>
            <ListItemIcon>
              <Icon>filter_list</Icon>
            </ListItemIcon>
            <ListItemText primary='Filter by Date' />
            {expendListOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={expendListOpen} timeout='auto' unmountOnExit>
            {sideMenuOption.map(option => (
              <ListItem
                style={{ paddingLeft: '2rem' }}
                button
                disabled={router.location.pathname !== '/dashboard'}
                key={option.key}
                selected={dashboard.currentMenu === option.key}
                onClick={() => this.handMenuChange(option.key)}>
                <ListItemIcon>
                  <Icon>{option.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItem>
            ))}
          </Collapse>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            disabled={router.location.pathname !== '/dashboard'}
            key='archived'
            selected={dashboard.currentMenu === 'archived'}
            onClick={() => this.handMenuChange('archived')}>
            <ListItemIcon>
              <Icon>all_inbox</Icon>
            </ListItemIcon>
            <ListItemText primary='Archived' />
          </ListItem>
        </List>
      </div>
    );
  }
}

interface SideMenuProps {
  isDrawerOpen: boolean;
}

const mapStateToProps = (state: any, sideMenuProps: SideMenuProps) => {
  return {
    router: state.router,
    dashboard: state.dashboard,
    isDrawerOpen: sideMenuProps.isDrawerOpen,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      setSideMenu,
      openTripForm,
      getTripList,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
