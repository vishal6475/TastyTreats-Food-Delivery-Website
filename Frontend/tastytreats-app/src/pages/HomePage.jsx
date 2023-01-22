import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'
import { FlexBox, Container } from '../components/styles/layouts';
import StoresAPI from "../utils/StoresAPIHelper";
import StoreCard from '../components/store/StoreCard'
import { IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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

const ChipBox = styled(FlexBox)`
  backgroundColor: #F0F0F0;

`

const storeAPI = new StoresAPI();

const HomePage = () => {
  const context = useContext(StoreContext);
  const [customer] = context.customer;
  const [storesList, setStoresList] = context.storesList; // to show details of only SELECTED stores
  const [allStoresList, setAllStoresList] = context.allStoresList; // to store details of ALL stores
  const [orgChippedStores, setOrgChippedStores] = context.orgChippedStores // to store initial list of stores or after search
                                                               // use for adding or removing chipped selections
  const [isSearched, setIsSearched]  = context.isSearched;
  const [searchedItems, setSearchedItems] = context.searchedItems;
  const [isChipSearched, setIsChipSearched]  = context.isChipSearched;
  const [chippedItems, setChippedItems] = context.chippedItems;

  let [showNoRestaurant, setShowNoRestaurant] = useState(false);
  
  const categories = ['Pizza', 'Burgers', 'Italian', 'Fast Food', 'Indian', 'Chicken', 'Mexican', 
    'Sandwiches', 'Kebab', 'Turkish', 'South Indian', 'Pizza', 'Burgers', 'Italian', 'Fast Food', 'Indian', 'Chicken', 'Mexican', 
    'Sandwiches', 'Kebab', 'Turkish', 'South Indian' ]
  

  useEffect(() => {    
    // removing previous stored restaurants
    setStoresList([])
    setAllStoresList([])
    setIsSearched(0)

    // fetching current stores
    fetchAllStores()
  }, [])

  const fetchAllStores = async (event) => { 
    const allStoresRes = await storeAPI.getAllStores() 
    //console.log(allStoresRes.data)
    setStoresList(allStoresRes.data)
    setOrgChippedStores(allStoresRes.data)
    setAllStoresList(allStoresRes.data)
    setShowNoRestaurant(true)
    setChippedItems([])
    unselectAllChips()    
  }

  const removeSearch = () => {    
    setIsSearched(0)
    setIsChipSearched(0)
    setChippedItems([])
    setStoresList(allStoresList)
    setOrgChippedStores(allStoresList)
    unselectAllChips()    
  }

  const unselectAllChips = () => {
    for (let i=0; i < categories.length; i++) {
      let element = document.getElementById(`category-chip-${i}`)
      element.style.color = 'black'
      element.style.backgroundColor = '#F0F0F0'
    }
  }

  const leftScroll = () => {
    const left = document.getElementById('category-scroll-box');
    left.scrollBy(300, 0);
  }

  const rightScroll = () => {
    const right = document.getElementById('category-scroll-box');
    right.scrollBy(-300, 0);
  }

  const checkForTypes = (store) => {
    for (let i=0; i<store.types.length; i++)
      for (let j=0; j<chippedItems.length; j++)
        if (store.types[i] === chippedItems[j]) {
          return true
        }      
    return false
  }

  const handleChipSelections = () => {
    let currentStores = orgChippedStores
    currentStores = currentStores.filter(checkForTypes)
    setStoresList(currentStores)
  }

  const selectTypeChip = (idx) => {
    const element = document.getElementById(`category-chip-${idx}`)

    if (element.style.color === 'black') { // when a new category chip is selected
      setIsChipSearched(isChipSearched + 1)
      chippedItems.push(categories[idx])
      element.style.color = 'white'
      element.style.backgroundColor = 'grey'
      handleChipSelections()
    } else {      // when a category chip is DE-selected
      if (isChipSearched === 1) {
        setStoresList(orgChippedStores)
        //setOrgChippedStores(orgChippedStores)
      } 
      setIsChipSearched(isChipSearched - 1)
      let removeIndex = chippedItems.indexOf(categories[idx])
      chippedItems.splice(removeIndex, 1)
      element.style.color = 'black'
      element.style.backgroundColor = '#F0F0F0'
      if (chippedItems.length > 0) handleChipSelections()
    }
    //console.log(chippedItems)
  }


  return (
      <div style={{ margin:'20px auto 20px auto', width:'75vw', minHeight:'88vh' }}>

        <FlexBox sx={{ alignItems:'center', mb:'1rem'}}>
            <IconButton onClick={rightScroll} >
              <NavigateBeforeIcon sx={{ color:'black' }} />
            </IconButton>

          <CategoryBox id='category-scroll-box' >
            {categories.map((category, idx) => {
              return <ChipBox key={idx} id={`category-chip-${idx}`} value={idx}
              
                style={{ margin:'0 8px 0 8px', padding:'2px 6px 2px 6px', cursor:'pointer', 
                backgroundColor:'#F0F0F0', color:'black', '&:hover': {backgroundColor: '#D8D8D8'}, borderRadius:'20px' }}
                onClick={() => {selectTypeChip(idx)}}
                >
                  <Typography variant='subtitle2'>
                    {category} 
                  </Typography>
                
                </ChipBox>
            })
            }
          </CategoryBox>
          
          <IconButton onClick={leftScroll} >
              <NavigateNextIcon sx={{ color:'black' }}/>
            </IconButton>
        </FlexBox>

        {(isSearched + isChipSearched) >= 1 &&
        <FlexBox sx={{ alignItems:'flex-end', mb:'1rem' }}>
          {(isSearched === 1 && isChipSearched === 0) &&
          <Typography variant="h6" >
            Search results for '{searchedItems}'
          </Typography>
          }
          {isChipSearched >= 1 &&
          <Typography variant="h6" >
            Search results for your filters
          </Typography>
          }
          <FlexBox onClick={removeSearch}
          sx={{ ml:'10px', mb:'2.5px', cursor:'pointer', textDecoration: 'underline' }}>
            { (isSearched + isChipSearched) === 1 &&
            <Typography >
              <b>Remove filter</b>
            </Typography>
            }
            { (isSearched + isChipSearched) >= 2 &&
            <Typography >
              <b>Clear all filters</b>
            </Typography>
            }
          </FlexBox>
        </FlexBox>
        }

        {(storesList.length === 0 && showNoRestaurant) &&
        <FlexBox direction='column' sx={{ alignItems:'center' }} >
          <Typography variant='h4'>
            No restaurants found
          </Typography>
          {isSearched === 1 &&          
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