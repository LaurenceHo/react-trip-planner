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

export const SideMenu = () => {
  const [expendListOpen, setExpendListOpen] = React.useState(true);

  const handExpendListClick = (): void => {
    setExpendListOpen(!expendListOpen);
  };

  return (
    <div>
      <List>
        <ListItem button key='Create trip'>
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText primary='Create trip' />
        </ListItem>
        <ListItem button onClick={handExpendListClick}>
          <ListItemIcon>
            <Icon>filter_list</Icon>
          </ListItemIcon>
          <ListItemText primary='Filter by date' />
          {expendListOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={expendListOpen} timeout='auto' unmountOnExit>
          <ListItem button key='Upcoming'>
            <ListItemIcon>
              <Icon>event</Icon>
            </ListItemIcon>
            <ListItemText primary='Upcoming' />
          </ListItem>
          <ListItem button key='Current'>
            <ListItemIcon>
              <Icon>today</Icon>
            </ListItemIcon>
            <ListItemText primary='Current' />
          </ListItem>
          <ListItem button key='Past'>
            <ListItemIcon>
              <Icon>date_range</Icon>
            </ListItemIcon>
            <ListItemText primary='Past' />
          </ListItem>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem button key='Archived'>
          <ListItemIcon>
            <Icon>all_inbox</Icon>
          </ListItemIcon>
          <ListItemText primary='Archived' />
        </ListItem>
      </List>
    </div>
  );
};
