import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled, TextField } from '@mui/material'
import {
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api'
import { geocodeByAddress } from 'react-places-autocomplete';
import { useRef } from 'react'
import { useNavigate } from 'react-router';

const ImageBanner = styled('div')`
  width: 100%;
  height: 93vh;
  margin: 0;
  padding: 0;
  background-image: url('../images/blueberry.png');
  background-size: cover;
`

const BoxDeliveryAdd = styled('div')`
  min-width: 30vw;
  padding-top: 35vh;
  padding-left: 35vw;
`


const FirstPage = () => {
  const context = useContext(StoreContext);
  const [customer] = context.customer;
  const [address, setAddress] = context.address;

  const addressRef = useRef();  
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_MgNdagqfz1e-bpG0Vnxfey8WEOSnzvo',
    libraries: ['places'],
  })

  if (!isLoaded) {
    return <div></div>;
  } 

  const gotDeliveryAddress = async () => {
    console.log(document.getElementById('delivery-address').value)
    setAddress(document.getElementById('delivery-address').value + ' Change')
    navigate('/home'); 

    const results = await geocodeByAddress(document.getElementById('delivery-address').value);
    console.log(results)
  }


  return (
    <div>
      <ImageBanner id='image-banner'>
      <BoxDeliveryAdd id='textDeliveryAdd'>
        <Autocomplete onPlaceChanged={gotDeliveryAddress}>
          <TextField 
            id='delivery-address' 
            name="delivery-address"
            ref={addressRef}
            placeholder='Enter delivery address' 
            required
            style={{backgroundColor:'white', minWidth: '30vw'}}
          />
        </Autocomplete>
      </BoxDeliveryAdd>
      </ImageBanner>
    </div>    

  )

}

export default FirstPage