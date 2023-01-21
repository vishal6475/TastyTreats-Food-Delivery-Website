import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'
import { FlexBox, Container } from '../components/styles/layouts';
import StoresAPI from "../utils/StoresAPIHelper";
import StoreCard from '../components/store/StoreCard'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const storeAPI = new StoresAPI();


const HomePage = () => {
  const context = useContext(StoreContext);
  const [customer] = context.customer;
  const [storesList, setStoresList] = context.storesList; // to show details of only SELECTED stores
  const [allStoresList, setAllStoresList] = context.allStoresList; // to store details of ALL stores
  const [isSearched, setIsSearched]  = context.isSearched;
  const [searchedItems, setSearchedItems] = context.searchedItems;
  let [showNoRestaurant, setShowNoRestaurant] = useState(false);
  
  const categories = ['Pizza', 'Burgers', 'Italian', 'Fast Food', 'Indian', 'Chicken', 'Mexican', 
    'Sandwiches', 'Kebab', 'Turkish', 'South Indian' ]
  const [tabValue, setTabValue] = useState(0);

  const changeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {    
    // removing previous stored restaurants
    setStoresList([])
    setAllStoresList([])
    setIsSearched(false)

    // fetching current stores
    fetchAllStores()
  }, [])

  const fetchAllStores = async (event) => { 
    const allStoresRes = await storeAPI.getAllStores()
    console.log(allStoresRes.data)
    setStoresList(allStoresRes.data)
    setAllStoresList(allStoresRes.data)
    setShowNoRestaurant(true)
  }

  const removeSearch = () => {    
    setIsSearched(false)
    setStoresList(allStoresList)
  }


  return (
      <div style={{ margin:'20px auto 20px auto', width:'75vw', minHeight:'88vh' }}>
        <Box sx={{  bgcolor: 'background.paper', mb:'1rem' }}>
          <Tabs
            value={tabValue}
            onChange={changeTab}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable tabs for restaurant types"
          >
            {categories.map((category) => {
              return <Tab label={category}>hi</Tab>
            })

            }
          </Tabs>
        </Box>

        {isSearched &&
        <FlexBox sx={{ alignItems:'flex-end', mb:'1rem' }}>
          <Typography variant="h6" >
            Search results for '{searchedItems}'
          </Typography>
          <FlexBox onClick={removeSearch}
          sx={{ ml:'10px', mb:'2.5px', cursor:'pointer', textDecoration: 'underline' }}>
            <Typography >
              <b>Remove filter</b>
            </Typography>
          </FlexBox>
        </FlexBox>

        }
        {(storesList.length === 0 && showNoRestaurant) &&
        <FlexBox direction='column' sx={{ alignItems:'center' }} >
          <Typography variant='h4'>
            No restaurants found
          </Typography>
          {isSearched &&          
          <Typography variant='subtitle2' color="text.secondary" sx={{fontSize:'1rem'}} >
            <b>Try changing or removing search filters.</b>
          </Typography>
          }
        </FlexBox>
        }
        <Grid container spacing={3}>
          {storesList.map((store, idx) => 
            <StoreCard 
              key={idx} store={store} 
            />
          )}
        </Grid>
      </div>
  )

}

export default HomePage