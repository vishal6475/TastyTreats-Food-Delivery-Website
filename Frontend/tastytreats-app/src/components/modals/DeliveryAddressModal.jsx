import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { AddressModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography, Grid, CardMedia, styled } from '@mui/material';
import { IconButton } from '@mui/material';
import {
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api'
import { geocodeByAddress } from 'react-places-autocomplete';
import { useRef } from 'react'
import InputAdornment from '@mui/material/InputAdornment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import Radio from '@mui/material/Radio';


const DeliveryAddressModal = ({openAddressModal, setOpenAddressModal, showUnitBox, setShowUnitBox, leaveAtDoor, setLeaveAtDoor}) => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  const [address, setAddress] = context.address;  
  const [currentAddress, setCurrentAddress] = useState(''); 
  const [curLeaveAtDoor, setCurLeaveAtDoor] = useState(false);

  
  const addressRef = useRef();  

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_MgNdagqfz1e-bpG0Vnxfey8WEOSnzvo',
    libraries: ['places'],
  })

  if (!isLoaded) {
    return <div></div>;
  } 


  const handleClose = () => {
    setOpenAddressModal(false);
  }

  const gotDeliveryAddress = async () => {
    //const addr = document.getElementById('order-delivery-address').value
    //setAddress((prev) => {return { ...prev, addr1: addr }})
    //const results = await geocodeByAddress(addr);
    //console.log(results)
    setCurLeaveAtDoor(leaveAtDoor)
    setShowUnitBox(true)
  }

  const updateAddress = () => {      
    const delivery_unit = document.getElementById('order-delivery-unit').value
    const delivery_addr = document.getElementById('order-delivery-address').value
    setAddress((prev) => {return { unitNo: delivery_unit, addr1: delivery_addr }})
    setLeaveAtDoor(curLeaveAtDoor)
    handleClose()
    console.log(address)
  }



  return (
    <AddressModal open={openAddressModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Update Address' close={handleClose} />
      <ModalBody justifyContent='center'>

        <Autocomplete onPlaceChanged={gotDeliveryAddress} >
          <TextField 
            id='order-delivery-address' 
            name="order-delivery-address"
            ref={addressRef}
            placeholder='Enter delivery address' 
            required
            sx={{backgroundColor:'white', minWidth: '100%', border: 'none', borderRadius:'0'}}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LocationOnIcon/></InputAdornment>,
            }}
          />
        </Autocomplete>

        {showUnitBox &&

        <FlexBox direction='column'>
        
          <TextField 
            id='order-delivery-unit' 
            name="order-delivery-unit"
            placeholder='Apartment or unit or floor number' 
            sx={{backgroundColor:'white', minWidth: '100%', mt:'1rem'}}
            InputProps={{
              startAdornment: <InputAdornment position="start"><HomeIcon/></InputAdornment>,
            }}
          />

          <Typography sx={{ ml:'8px', mt:'1rem'}} >
            Delivery type
          </Typography>
          <FlexBox direction='row' sx={{alignItems:'center'}} >
            <Radio
              checked={!curLeaveAtDoor}
              onChange={() => {setCurLeaveAtDoor(false)}}
              value="Hand it to me"
              label="Hand it to me"
              name="Leave at door radio buttons"
              color="default"
              inputProps={{ 'aria-label': 'Hand it to me' }}
            />
              Hand it to me
            <Radio
              checked={curLeaveAtDoor}
              onChange={() => {setCurLeaveAtDoor(true)}}
              value="Leave at door"
              label="Leave at door"
              name="Leave at door radio buttons"
              color="default"
              inputProps={{ 'aria-label': 'Leave at door' }}
            />
            Leave at door
          </FlexBox>
          
        
          <TextField 
            id='order-delivery-ins' 
            name="order-delivery-ins"
            placeholder='Add delivery instructions' 
            multiline
            rows={2}
            sx={{backgroundColor:'white', minWidth: '100%', mt:'1rem'}}
          />

          <FlexBox>

            <Button variant="contained" onClick={handleClose}
              sx={{ mb:'1rem', width:'14vw', height:'7vh', m:'1rem auto 1rem auto', 
              fontSize:'1.2rem',
              backgroundColor: 'grey', '&:hover':{backgroundColor: 'grey'} }} >
                Cancel
            </Button>

            <Button variant="contained" onClick={updateAddress}
              sx={{ mb:'1rem', width:'14vw', height:'7vh', m:'1rem auto 1rem auto', 
              fontSize:'1.2rem',
              backgroundColor: 'tastytreats.mediumBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
                Save
            </Button>

          </FlexBox>

        </FlexBox>
        }

    
      </ModalBody>
    </AddressModal>
  )
}

export default DeliveryAddressModal