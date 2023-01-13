import { useContext } from 'react';
import { StoreContext } from '../../utils/context';
import { FlexBox } from '../styles/layouts';
import { SideBar, SideBarTitle, SideBarItem } from '../styles/sidebar';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { Button, Divider, List} from '@mui/material';

const AccountSideBar = ({ accountPage, setAccountPage }) => {
  const context = useContext(StoreContext);

  const handleChangePage = (change) => {
    setAccountPage(change);
  }

  return (
    <SideBar>
      <SideBarTitle variant='h6'>
        Account menu
      </SideBarTitle>
      <Divider variant="middle" sx={{ mb: 2 }} />
      <List component='nav'>
        <SideBarItem
          title='Account details'
          selected={accountPage === 'account' ? true : false}
          onClick={() => handleChangePage('account')}
        >
          <AccountBoxIcon />
        </SideBarItem>
        
        <SideBarItem 
          title='My orders' 
          selected={accountPage === 'orders' ? true : false}
          onClick={() => handleChangePage('orders')}
        >
          <LocalActivityIcon />
        </SideBarItem>

        
      </List>
      
      
    </SideBar>
  )
}

export default AccountSideBar