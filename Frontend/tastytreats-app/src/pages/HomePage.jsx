import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'


const HomePage = () => {
  const context = useContext(StoreContext);
  const [customer] = context.customer;

  return (
    <div>
      HomePage
    </div>
  )

}

export default HomePage