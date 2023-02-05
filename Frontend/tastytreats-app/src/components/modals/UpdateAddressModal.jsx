import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { AddressModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography} from '@mui/material';
import {
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api'
import InputAdornment from '@mui/material/InputAdornment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Radio from '@mui/material/Radio';

import CustomersAPI from "../../utils/CustomersAPIHelper";
const custAPI = new CustomersAPI();


const UpdateAddressModal = ({openUpdateModal, setOpenUpdateModal, addressToUpdate, setAddressToUpdate, setFetchAddresses}) => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [customer, setcustomer] = context.customer;

  const handleClose = () => {
    setOpenUpdateModal(false);
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_MgNdagqfz1e-bpG0Vnxfey8WEOSnzvo',
    libraries: ['places'],
  })

  if (!isLoaded) {
    return <div></div>;
  } 

  const changeUnitField = (e) => {
    setAddressToUpdate((prev) => {return {...prev, unit_no: e.target.value }})
  }  

  const gotDeliveryAddress = () => {
    setAddressToUpdate(prev => {return {...prev, addr_1: document.getElementById('update-address-street' ).value}})
  }

  const updateAddress = async () => {      
    try {
      const params = {
        address_id: addressToUpdate.id
      }

      const body = {
        unit_no: addressToUpdate.unit_no,
        addr_1: addressToUpdate.addr_1,
        primary1: addressToUpdate.primary1
      }

      const updateResponse = await custAPI.updateAddress(customer.id, params, body)
      setFetchAddresses(prev => !prev)    
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AddressModal open={openUpdateModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Update Address' close={handleClose} />
      <ModalBody justifyContent='center'>

        <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', mb:'0.2rem' }} >
          <b>Unit no:</b>
        </Typography>
        
        <TextField 
          size='small'
          id='update-address-unit-no' 
          name='update-address-unit-no' 
          placeholder='Apartment or unit or floor number' 
          value={addressToUpdate.unit_no}
          onChange={changeUnitField}
          sx={{backgroundColor:'white', minWidth: '100%'}}
          />

        <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', mt:'0.8rem', mb:'0.2rem' }} >
          <b>Street address:</b>
        </Typography>

        <Autocomplete onPlaceChanged={gotDeliveryAddress} >
          <TextField 
            size='small'
            id='update-address-street' 
            name='update-address-street' 
            placeholder='Street address' 
            required
            sx={{backgroundColor:'white', minWidth: '100%', border: 'none', borderRadius:'0'}}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LocationOnIcon/></InputAdornment>,
            }}
          />
        </Autocomplete>

        <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', mt:'0.8rem', mb:'0.2rem' }} >
          <b>Primary address:</b>
        </Typography>

        <FlexBox direction='row' sx={{alignItems:'center', mt:'-0.4rem'}} >
          <Radio
            checked={addressToUpdate.primary1 === 'Y'}
            onChange={() => {setAddressToUpdate(prev => {return {...prev, primary1:'Y'}})}}
            value="Y"
            label="Update address primary1 yes"
            name="Update address primary1 radio buttons"
            color="default"
            inputProps={{ 'aria-label': 'Address Primary1 Yes' }}
          />
            Yes
          <Radio
            checked={addressToUpdate.primary1 === 'N'}
            onChange={() => {setAddressToUpdate(prev => {return {...prev, primary1:'N'}})}}
            value="N"
            label="Update address primary1 no"
            name="Update address primary1 radio buttons"
            color="default"
            inputProps={{ 'aria-label': 'Address Primary1 No' }}
          />
          No
        </FlexBox>

        <FlexBox sx={{ mt:'0.5rem' }} >
          <Button variant="contained" onClick={handleClose}
            sx={{ width:'14vw', height:'7vh', m:'1rem auto 1rem auto', fontSize:'1.2rem',
            backgroundColor: 'grey', '&:hover':{backgroundColor: 'grey'} }} >
            Cancel
          </Button>

          <Button variant="contained" onClick={updateAddress}
            sx={{ width:'14vw', height:'7vh', m:'1rem auto 1rem auto', fontSize:'1.2rem',
            backgroundColor: 'tastytreats.mediumBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
            Save
          </Button>
        </FlexBox>

      </ModalBody>
    </AddressModal>
  )
}

export default UpdateAddressModal