import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'
import StoresAPI from "../utils/StoresAPIHelper";

const storeAPI = new StoresAPI();


const HomePage = () => {
  const context = useContext(StoreContext);
  const [customer] = context.customer;

  useEffect(() => {
    fetchAllStores()
  }, [])

  const fetchAllStores = async (event) => { 
    const allStoresRes = await storeAPI.getAllStores()
    console.log(allStoresRes)
    console.log(allStoresRes.data)
  }


  return (
    <div>
      HomePage
    </div>
  )

}

export default HomePage