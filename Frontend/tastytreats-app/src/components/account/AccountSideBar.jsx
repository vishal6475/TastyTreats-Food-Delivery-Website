import { useContext } from 'react';
import { StoreContext } from '../../utils/context';
import { SideBar, SideBarTitle, SideBarItem } from '../styles/sidebar';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import PlaceIcon from '@mui/icons-material/Place';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Divider, List} from '@mui/material';

const AccountSideBar = ({ accountPage, setAccountPage }) => {
  const context = useContext(StoreContext);

  const handleChangePage = (change) => {
    setAccountPage(change);
  }

  return (
    <SideBar sx={{ backgroundColor:'white', position:'sticky', top:'0', height:'100vh'}}>
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
          title='Orders' 
          selected={accountPage === 'orders' ? true : false}
          onClick={() => handleChangePage('orders')}
        >
          <LocalActivityIcon />
        </SideBarItem>
        
        <SideBarItem 
          title='Address' 
          selected={accountPage === 'address' ? true : false}
          onClick={() => handleChangePage('address')}
        >
          <PlaceIcon />
        </SideBarItem>
        
        <SideBarItem 
          title='Payment' 
          selected={accountPage === 'payment' ? true : false}
          onClick={() => handleChangePage('payment')}
        >
          <PaymentsIcon />
        </SideBarItem>        
      </List>
    </SideBar>
  )
}

export default AccountSideBar