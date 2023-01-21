import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'
import { FlexBox, Container } from '../components/styles/layouts';
import StoresAPI from "../utils/StoresAPIHelper";
import StoreCard from '../components/store/StoreCard'
import { IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';


const CategoryBox = styled('div')`
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    display: none;
  } /* for chrome */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`



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
    'Sandwiches', 'Kebab', 'Turkish', 'South Indian', 'Pizza', 'Burgers', 'Italian', 'Fast Food', 'Indian', 'Chicken', 'Mexican', 
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

  const leftScroll = () => {
    const left = document.getElementById('category-scroll-box');
    left.scrollBy(300, 0);
  }

  const rightScroll = () => {
    const right = document.getElementById('category-scroll-box');
    right.scrollBy(-300, 0);
  }

  const selectTypeChip = (idx) => {
    console.log(idx, categories[idx])
    const element = document.getElementById(`category-chip-${idx}`)

    console.log(element.style.backgroundColor)
    console.log(element.style.color)

    if (element.style.backgroundColor === '#F0F0F0') {
      element.style.backgroundColor = 'blue'
    }
  }


  return (
      <div style={{ margin:'20px auto 20px auto', width:'75vw', minHeight:'88vh' }}>

        <FlexBox sx={{ alignItems:'center', mb:'1rem'}}>
            <IconButton onClick={rightScroll} >
              <NavigateBeforeIcon sx={{ color:'black' }} />
            </IconButton>

          <CategoryBox id='category-scroll-box' >
            {categories.map((category, idx) => {
              return <FlexBox key={idx} id={`category-chip-${idx}`} value={idx}
              style={{ backgroundColor:'#F0F0F0' }}
                sx={{ margin:'0 8px 0 8px', padding:'2px 6px 2px 6px', cursor:'pointer', 
                '&:hover': {backgroundColor: '#D8D8D8'}, borderRadius:'20px' }}
                onClick={() => {selectTypeChip(idx)}}
                >
                  <Typography variant='subtitle2'>
                    {category} 
                  </Typography>
                
                </FlexBox>
            })
            }
          </CategoryBox>
          
          <IconButton onClick={leftScroll} >
              <NavigateNextIcon sx={{ color:'black' }}/>
            </IconButton>
        </FlexBox>

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