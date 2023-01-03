import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../utils/context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FlexBox, Container } from '../styles/layouts';
import AppBar from '@mui/material/AppBar';
import { Typography, styled } from '@mui/material';

const AppTitle = styled(Typography)`
  font-family: monospace;
  font-weight: 700;
  letter-spacing: .3rem;
  color: ${({ theme }) => theme.palette.tastytreats.title};

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
  const [customer] = context.customer;

 
  useEffect(() => {
    if (
      location.pathname === '/register') {
    }
  }, [location])

  return (
    <AppBar id='appbar' position="sticky" sx={{ backgroundColor: 'tastytreats.dark_purple', mb:2, pl:0 }}>

        <FlexBox justify='space-between'>
          <FlexBox>
            <AppTitle variant="h4" 
            >
              TastyTreats
            </AppTitle>
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

    </AppBar>
  );
};

export default TastyTreatsAppBar;