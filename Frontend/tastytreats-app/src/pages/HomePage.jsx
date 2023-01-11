import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'
import StoresAPI from "../utils/StoresAPIHelper";
import StoreCard from '../components/store/StoreCard'

const storeAPI = new StoresAPI();


const HomePage = () => {
  const context = useContext(StoreContext);
  const [customer] = context.customer;
  const [storesList, setStoresList] = useState([]);

  useEffect(() => {
    fetchAllStores()
  }, [])

  const fetchAllStores = async (event) => { 
    const allStoresRes = await storeAPI.getAllStores()
    console.log(allStoresRes)
    console.log(allStoresRes.data)
    setStoresList(allStoresRes.data)
  }


  return (
    <div>

      <div style={{ margin:'20px auto 20px auto', width:'75vw' }}>
        <Grid container spacing={3}>
          {storesList.map((store, idx) => 
            <StoreCard 
              key={idx} store={store} 
            />
          )}
        </Grid>
      </div>

    </div>
  )

}

export default HomePage