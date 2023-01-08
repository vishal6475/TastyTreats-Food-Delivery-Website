import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../utils/context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FlexBox, Container } from '../styles/layouts';
import AppBar from '@mui/material/AppBar';
import { Typography, styled } from '@mui/material';

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
  const [customer] = context.customer;
  const [open, setOpen] = context.logInModal;
  const [loginOrSignup, setLoginOrSignup] = context.loginOrSignup;

  const openLoginModal = () => {
    setLoginOrSignup(false);
    setOpen(true);
  }

  const toFirstPage = () => {    
    navigate('/'); 
  }

  if (address!== null && address.length>0) {
    document.getElementById('userAddress').innerHTML = address.split(',')[0];
  }

  return (
    <AppBar id='appbar' position="sticky" sx={{ backgroundColor: 'tastytreats.mediumBlue', minHeight: '7vh', pl:0 }}>

      <FlexBox justify='space-between' sx={{ mt:'auto', mb:'auto'}}>
        <FlexBox>
          <AppTitle variant="h4"  sx={{ mt:'auto', mb:'auto'}}
          >
            TastyTreats
          </AppTitle>
          <FlexBox sx={{ mt:'auto', mb:'auto', ml:'1rem', mr:'1rem', 
            pl:'1.5rem', pr:'1.5rem', pt:'0.4rem', pb:'0.4rem',
            backgroundColor: '#C8C8C8', color: 'black', maxWidth:'30vw',
            borderRadius: '30px', cursor: 'pointer', '&:hover': {backgroundColor: '#888888'} }}
            id='userAddress' onClick={toFirstPage}>            
          </FlexBox>
        </FlexBox>
        
        <FlexBox>
          <FlexBox sx={{ mt:'auto', mb:'auto', ml:'1rem', mr:'1rem', pl:'1rem', pr:'1rem',
            borderRadius: '30px', cursor: 'pointer', '&:hover': {backgroundColor: '#2486DB'} }}
            onClick={openLoginModal} >
            <Typography variant='h6' sx={{  }}>
              Login
            </Typography>
          </FlexBox>
          <FlexBox>
            {customer
            ? <Typography variant='h6' sx={{ mt:'auto', mb:'auto', mr:'1rem', color:'#bb1717' }}>
            { customer.first_name? customer.first_name : '' }
            </Typography>
            : ''
            }
          </FlexBox>
        </FlexBox>          
      </FlexBox>
    </AppBar>
  );
};

export default TastyTreatsAppBar;