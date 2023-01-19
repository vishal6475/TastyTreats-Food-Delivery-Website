import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../utils/context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FlexBox, Container } from '../styles/layouts';
import AppBar from '@mui/material/AppBar';
import { Typography, styled } from '@mui/material';
import CustomerMenu from '../customer/CustomerMenu';


const AppTitle = styled(Typography)`
  font-family: monospace;
  font-size: 2.2rem;
  font-weight: 600;
  padding-right: 1rem;
  padding-left: 1rem;

  ${({theme}) => theme.breakpoints.down("sm")} {
    padding-right: 0.25rem;
    padding-left: 0.25rem;
  }
`

const TastyTreatsAppBar = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const context = useContext(StoreContext);  
  const [address, setAddress] = context.address;
  const [customer, setCustomer] = context.customer;
  const [loggedIn, setLoggedIn] = context.login;
  const [open, setOpen] = context.logInModal;
  const [loginOrSignup, setLoginOrSignup] = context.loginOrSignup;
  const [fromCheckout, setFromCheckout] = context.fromCheckout;

  const openLoginModal = () => {
    setLoginOrSignup(false);
    setOpen(true);
    setFromCheckout(false)
  }

  const toFirstPage = () => {    
    navigate('/'); 
  }

  const toHomePage = () => {    
    address.length > 0 ? navigate('/home') : navigate('/');
  }

  return (
    <AppBar id='appbar' position="static" sx={{ backgroundColor: 'tastytreats.mediumBlue', minHeight: '7vh', pl:0 }}>

      <FlexBox justify='space-between' sx={{ mt:'auto', mb:'auto'}}>
        <FlexBox>
          <AppTitle variant="h4"  sx={{ mt:'auto', mb:'auto', ml:'20px', p:'0', cursor: 'pointer'}}
          onClick={toHomePage}
          >
            TastyTreats
          </AppTitle>
          {address &&
          <FlexBox sx={{ m:'auto 1rem auto 1rem', p:'0.4rem 1.5rem 0.4rem 1.5rem',
            backgroundColor: '#C8C8C8', color: 'black', maxWidth:'30vw',
            borderRadius: '30px', cursor: 'pointer', '&:hover': {backgroundColor: '#888888'} }}
            id='userAddress' onClick={toFirstPage} >       
            {address.addr1.split(',')[0]}
          </FlexBox>
          }
        </FlexBox>
        
        <FlexBox>
          {!loggedIn &&
          <FlexBox sx={{ mt:'auto', mb:'auto', ml:'1rem', mr:'1rem', pl:'1rem', pr:'1rem',
            borderRadius: '30px', cursor: 'pointer', '&:hover': {backgroundColor: '#2486DB'} }}
            onClick={openLoginModal} >
            <Typography variant='h6'>
              Login
            </Typography>
          </FlexBox>
          }
          {loggedIn &&
          <FlexBox>
            <Typography variant='h6' sx={{ mt:'auto', mb:'auto', mr:'1rem' }}>
             { customer.first_name? customer.first_name : '' }
            </Typography>
          </FlexBox>          
          }
          {loggedIn && <CustomerMenu/> }
        </FlexBox>          
      </FlexBox>
    </AppBar>
  );
};

export default TastyTreatsAppBar;