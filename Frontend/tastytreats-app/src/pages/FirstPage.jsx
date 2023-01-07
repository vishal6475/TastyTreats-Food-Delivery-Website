import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'
import {
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api'
import { useRef } from 'react'
import { useNavigate } from 'react-router';

const ImageBanner = styled('div')`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-image: url('../images/blueberry.png');
  background-size: cover;
`

const BoxDeliveryAdd = styled('div')`
  position: relative;
  width: 20vw;
  margin-left: 40vw;
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

  const gotDeliveryAddress = () => {
    console.log(addressRef.current.value)
    setAddress(addressRef.current.value)
    navigate('/home'); 
  }


  return (
    <div>
      <ImageBanner id='image-banner'/>
      <BoxDeliveryAdd id='textDeliveryAdd'>
        <Autocomplete onPlaceChanged={gotDeliveryAddress}>
          <input type='text' id='delivery-address' placeholder='Enter delivery address' ref={addressRef} />
        </Autocomplete>
      </BoxDeliveryAdd>
    </div>    

  )

}

export default FirstPage