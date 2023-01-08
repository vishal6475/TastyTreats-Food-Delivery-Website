import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  IconButton,
  Avatar,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

const CustomerMenu = () => {
  const context = useContext(StoreContext);
  const [, setRedirect] = context.redirect;
  const [loggedIn, setLoggedIn] = context.login;
  const [customer, setCustomer] = context.customer;
  const [address, setAddress] = context.address;
  const [open, setOpen] = context.logInModal;
  const [anchor, setAnchor] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  const toAccountPage = () => {
    handleCloseMenu();

  }

  const handleLogout = () => {
    setAddress('')
    handleCloseMenu();
    setLoggedIn(false);
  };

  return (
    <>
      <Tooltip title="Open menu" enterDelay={10}>
        <IconButton onClick={handleOpenMenu} sx={{ p: 0, mr: { xs: '0.25rem', md: '1rem' } }}>
          <Avatar
            src={customer.profile_pic}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '30px' }}
        id="appbar-menu"
        keepMounted
        anchorEl={anchor}
        paperwidth={13}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchor)}
        onClose={handleCloseMenu}
      >    
        <MenuItem onClick={toAccountPage}>
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to={'/'} onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default CustomerMenu