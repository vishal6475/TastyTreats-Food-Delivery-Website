import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlexBox } from '../styles/layouts';
import AccountMainDetailsScreen from './AccountMainDetailsScreen';
import AccountMainOrdersScreen from './AccountMainOrdersScreen'
import AccountMainAddressScreen from './AccountMainAddressScreen'
import AccountMainPaymentScreen from './AccountMainPaymentScreen'

import { Button, Divider, Typography, styled } from '@mui/material';

export const AccountContainer = styled('div')`
  flex-grow: 7;
  margin-bottom: 1rem;
  padding: 1rem;
  overflow: hidden;
`;

const PageTitles = {
  'account': 'My Account Details',
  'orders': 'My orders',
  'address': 'Addresses',
  'payment': 'Cards'
}

const AccountMain = ({ accountPage, changePage }) => {
  const navigate = useNavigate();
  const [accountChange, setAccountChange] = useState(false);

 
  return (
    <AccountContainer sx={{ backgroundColor:'white'}}>
      <FlexBox justify='space-between'>
        <Typography variant='h6'>
          {PageTitles[accountPage]}
        </Typography>

        {(() => {
          if (accountPage === 'account') {
            return (
              <Button form='accountForm' type='submit' disabled={!accountChange} color='success'
                variant="contained" sx={{ bottom: '5px', backgroundColor: 'success.main' }}>
                Save changes
              </Button>
            )
          }
          else if (accountPage === 'orders') {
            return (
              <FlexBox sx={{ ml: 'auto', mr: 'auto' }}>                
                
              </FlexBox>
            )
          }
        })()}
      </FlexBox>



      <Divider variant="middle" sx={{ mb: 2 }} />

      {(() => {
        if (accountPage === 'account') {
          return (
            <AccountMainDetailsScreen change={accountChange} setChange={setAccountChange} />
          )
        } else if (accountPage === 'orders') {
          return (
            <AccountMainOrdersScreen  />
          )
        } else if (accountPage === 'address') {
          return (
            <AccountMainAddressScreen  />
          )
        } else if (accountPage === 'payment') {
          return (
            <AccountMainPaymentScreen  />
          )
        } 

      })()}
    </AccountContainer>

  )
}

export default AccountMain