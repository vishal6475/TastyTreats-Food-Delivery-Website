import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'
import { FlexBox } from '../components/styles/layouts';
import StoresAPI from "../utils/StoresAPIHelper";
import StoreCard from '../components/store/StoreCard'
import { IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';import {
  useJsApiLoader,
} from '@react-google-maps/api'
import CircularProgress from '@mui/material/CircularProgress';

const CategoryBox = styled('div')`
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  ::-webkit-scrollbar {
    display: none;
  } /* for chrome */
`

const ChipBox = styled(FlexBox)`
  backgroundColor: #E0E0E0;
`

const storeAPI = new StoresAPI();

const HomePage = () => {
  const navigate = useNavigate()
  const context = useContext(StoreContext);
  const [customer] = context.customer;
  const [address, setAddress] = context.address;
  const [storesList, setStoresList] = context.storesList; // to show details of only SELECTED stores
  const [allStoresList, setAllStoresList] = context.allStoresList; // to store details of ALL stores
  const [orgChippedStores, setOrgChippedStores] = context.orgChippedStores // to store initial list of stores or after search
                                                               // use for adding or removing chipped selections
  const [closedStoresList, setClosedStoresList] = context.closedStoresList;
  const [isSearched, setIsSearched]  = context.isSearched;
  const [searchedItems, setSearchedItems] = context.searchedItems;
  const [isChipSearched, setIsChipSearched]  = context.isChipSearched;
  const [chippedItems, setChippedItems] = context.chippedItems;
  const [fetchedStores, setFetchedStores] = useState(false)

  let [showNoRestaurant, setShowNoRestaurant] = useState(false);
  
  const categories = ['Pizza', 'Burgers', 'Italian', 'Fast Food', 'Indian', 'Chicken', 'Mexican', 
    'Sandwiches', 'Kebab', 'Turkish', 'South Indian', 'American', 'Australian', 'Asian', 'Bakery',
    'BBQ', 'Breakfast', 'Bubble Tea', 'Cafe', 'Cake', 'Chinese', 'Comfort Food', 'Dessert', 'Drinks',
    'European', 'Fish & Chips', 'Fusion', 'Greek', 'Halal', 'Healthy', 'Ice Cream/Gelato', 'Indonesian', 
    'Japanese', 'Juice', 'Korean', 'Lebanese', 'Malaysian', 'Middle Eastern', 'Nepalese', 'Pasta', 'Salad', 
    'Seafood', 'Smoothies', 'Snack', 'Steak', 'Sushi', 'Thai', 'Vegan', 'Vegetarian', 'Wings'
   ]
  
  const removeSearch = () => {    
    setIsSearched(0)
    setIsChipSearched(0)
    setChippedItems([])
    setStoresList(allStoresList)
    setOrgChippedStores(allStoresList)
    unselectAllChips()    
    let search = document.getElementById('SearchBar')
    search.value = ''
  }

  const fetchAllStores = async (event) => { 

    try {

      const allStoresRes = await storeAPI.getAllStores() 
      let storesData = allStoresRes.data

      try {
        const service = new window.google.maps.DistanceMatrixService()
        for (let i=0; i<storesData.length; i++) {
          await service.getDistanceMatrix(
            {
              origins: [address.addr1],
              destinations: [storesData[i].addr_1],
              travelMode: "DRIVING"
            },
            (response, status) => {
              if (status === "OK") {
                //console.log(response.rows[0].elements[0].distance.value, response.rows[0].elements[0].duration.value);
                storesData[i].distance = (response.rows[0].elements[0].distance.value / 1000).toFixed(1)
                storesData[i].time = parseInt((response.rows[0].elements[0].duration.value + 1200) / 60)
              }
            }
          )
        }        
        storesData = storesData.filter(store => {return parseInt(store.distance) < 7})
      }
      catch(error) {
        console.log(error)
      }
      
      const currentDate = new Date()
      const hours = parseInt(currentDate.getHours())
      const minutes = parseInt(currentDate.getMinutes())
      let openStores = []
      let closedStores = []

      for (let i=0; i < storesData.length; i++) {
        let openHours = parseInt(storesData[i].open.substr(0, 2))
        let openMinutes = parseInt(storesData[i].open.substr(3, 5))
        let closeHours = parseInt(storesData[i].close.substr(0, 2))
        let closeMinutes = parseInt(storesData[i].close.substr(3, 5))

        if (timeAfter(openHours, openMinutes, closeHours, closeMinutes)) { // when closing is on same day
          if (timeAfter(openHours, openMinutes, hours, minutes) && timeAfter(hours, minutes, closeHours, closeMinutes)) {
            //console.log('Open:', storesData[i].name, openHours, openMinutes, ':', closeHours, closeMinutes)
            openStores.push(storesData[i])
          } else {
            //console.log('CLOSED:', storesData[i].name, openHours, openMinutes, ':', closeHours, closeMinutes)
            closedStores.push(storesData[i])
          }
        } else { // when closing is on next day
          if (timeAfter(openHours, openMinutes, hours, minutes)) {
            //console.log('Open:', storesData[i].name, openHours, openMinutes, ':', closeHours, closeMinutes)
            openStores.push(storesData[i])
          } else if (timeAfter(hours, minutes, closeHours, closeMinutes)) {
            //console.log('Open:', storesData[i].name, openHours, openMinutes, ':', closeHours, closeMinutes)
            openStores.push(storesData[i])
          } else {
            //console.log('CLOSED:', storesData[i].name, openHours, openMinutes, ':', closeHours, closeMinutes)
            closedStores.push(storesData[i])
          }
        }
      }

      setFetchedStores(true)
      setStoresList(openStores)
      setOrgChippedStores(openStores)
      setAllStoresList(openStores)
      setClosedStoresList(closedStores)
      setShowNoRestaurant(true)
      setChippedItems([])
      unselectAllChips()    
    }
    catch(error) {
      console.error(error)   
    }
  }


  useEffect(() => {    
    if (address.addr1.length === 0) navigate('/');  

    setStoresList([])
    setOrgChippedStores([])
    setAllStoresList([])
    setClosedStoresList([])       
    setIsSearched(0)
    setIsChipSearched(0)
    unselectAllChips()

    // fetching current stores
    //if (allStoresList.length === 0)
    fetchAllStores()
    
  }, [])

  const timeAfter = (h1, m1, h2, m2) => { // returns true if (h2, m2) comes after (h1, m1) in a day
    if (h2 > h1) {
      return true
    } else if (h2 === h1) {
      if (m2 > m1) {
        return true
      } else return false
    } else return false
  }
  
  const unselectAllChips = () => {
    for (let i=0; i < categories.length; i++) {
      let element = document.getElementById(`category-chip-${i}`)
      if (element) {
        element.style.color = 'black'
        element.style.backgroundColor = '#E0E0E0'
      }
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
      element.style.backgroundColor = '#E0E0E0'
      if (chippedItems.length > 0) handleChipSelections()
    }
    //console.log(chippedItems)
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_MgNdagqfz1e-bpG0Vnxfey8WEOSnzvo',
    libraries: ['places'],
  })

  if (!isLoaded) {
    return <div></div>;
  } 

  return (
      <div style={{ margin:'0 auto 0 auto', padding:'20px 0 20px 0', width:'75vw', minHeight:'88vh' }}>

        <FlexBox sx={{ alignItems:'center', mb:'1rem'}}>
            <IconButton onClick={rightScroll} >
              <NavigateBeforeIcon sx={{ color:'black' }} />
            </IconButton>

          <CategoryBox id='category-scroll-box' >
            {categories.map((category, idx) => {
              return <ChipBox key={idx} id={`category-chip-${idx}`} value={idx}
              
                style={{ margin:'0 8px 0 8px', padding:'2px 6px 2px 6px', cursor:'pointer', 
                backgroundColor:'#E0E0E0', color:'black', borderRadius:'20px' }}
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

        {(fetchedStores === false && storesList.length === 0) &&
        <FlexBox direction='column' sx={{ alignItems:'center' }} >
          <Typography sx={{ fontSize:'2rem', m:'2rem 0 3rem 0' }} >
            Loading Stores
          </Typography>
          <CircularProgress color="inherit" size='80px' />
        </FlexBox>
        }

        {(storesList.length === 0 && showNoRestaurant) &&
        <FlexBox direction='column' sx={{ alignItems:'center', mb:'1rem' }} >
          <Typography variant='h4'>
            No open restaurants found
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
              key={idx} store={store} isDisabled={false}
            />
          )}
          {(isSearched + isChipSearched) === 0 && closedStoresList.map((store, idx) => 
            <StoreCard 
              key={idx} store={store} isDisabled={true}
            />
          )}
        </Grid>
      </div>
  )

}

export default HomePage