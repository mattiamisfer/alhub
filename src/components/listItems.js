import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const _style = { textDecoration: 'none' ,color: '#000000' };


export const MainListItems = () => {
  return (
    <div>
      <Link to="/ads" style={_style}>
        <ListItem button>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Advertisement" />
        </ListItem>
      </Link>



      <Link to="/categories" style={_style}>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
      </Link>

      {/* defaults to store */}
      <Link to="/" style={_style}>
        <ListItem button>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Stores" />
        </ListItem>
      </Link>

    </div >
  );
}
