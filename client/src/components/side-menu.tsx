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
import { setSideMenu } from '../store/actions/dashboard-actions';

interface SideMenuState {
  expendListOpen: boolean;
}

export class SideMenu extends React.Component<any, SideMenuState> {
  state = {
    expendListOpen: true,
  };

  handExpendListClick = (): void => {
    this.setState({ expendListOpen: !this.state.expendListOpen });
  };

  handleMenuOptionClick(key: string): void {
    this.props.setSideMenu(key);
  }

  render() {
    const { expendListOpen } = this.state;
    const { dashboard, router } = this.props;

    const sideMenuOption = [
      { key: 'upcoming', icon: 'event', label: 'Upcoming' },
      { key: 'current', icon: 'today', label: 'Current' },
      { key: 'past', icon: 'date_range', label: 'Past' },
    ];
    return (
      <div>
        <List>
          <ListItem button key='Create trip'>
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText primary='Create trip' />
          </ListItem>
          <ListItem button onClick={this.handExpendListClick}>
            <ListItemIcon>
              <Icon>filter_list</Icon>
            </ListItemIcon>
            <ListItemText primary='Filter by date' />
            {expendListOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={expendListOpen} timeout='auto' unmountOnExit>
            {sideMenuOption.map(option => (
              <ListItem
                button
                disabled={router.location.pathname !== '/dashboard'}
                key={option.key}
                selected={dashboard.menu === option.key}
                onClick={() => this.handleMenuOptionClick(option.key)}>
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
            selected={dashboard.menu === 'archived'}
            onClick={() => this.handleMenuOptionClick('archived')}>
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

const mapStateToProps = (state: any) => {
  return {
    router: state.router,
    dashboard: state.dashboard,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return bindActionCreators(
    {
      setSideMenu,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenu);
