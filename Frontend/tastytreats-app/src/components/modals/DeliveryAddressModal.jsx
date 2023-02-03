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
import EditIcon from '@mui/icons-material/Edit';

import CustomersAPI from "../../utils/CustomersAPIHelper";
const custAPI = new CustomersAPI();


const DeliveryAddressModal = ({openAddressModal, setOpenAddressModal, sectionType, setSectionType, 
  leaveAtDoor, setLeaveAtDoor, addressToUpdate, setAddressToUpdate}) => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  const [customer, setcustomer] = context.customer;
  const [address, setAddress] = context.address;  
  const [currentAddress, setCurrentAddress] = useState(''); 
  const [curLeaveAtDoor, setCurLeaveAtDoor] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);

  const handleClose = () => {
    setOpenAddressModal(false);
  }

   const fetchExistingAddresses = async () => {
    try {
    const addrResponse = await custAPI.getAddresses(customer.id)
    setAllAddresses(addrResponse.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchExistingAddresses()
  }, [])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_MgNdagqfz1e-bpG0Vnxfey8WEOSnzvo',
    libraries: ['places'],
  })

  if (!isLoaded) {
    return <div></div>;
  } 

  const changeAddr1Field = (e) => {
    setAddressToUpdate((prev) => {return {...prev, addr1: e.target.value }})
  }  

  const changeUnitField = (e) => {
    setAddressToUpdate((prev) => {return {...prev, unitNo: e.target.value }})
  }  

  const changeInsField = (e) => {
    setAddressToUpdate((prev) => {return {...prev, ins: e.target.value }})
  }  

  const setFromSavedAddress = (savedAddress) => {
    setAddress((prev) => {return { ...prev, unitNo: savedAddress.unit_no, addr1: savedAddress.addr_1, isSavedAddress: true}})
    handleClose()
  }

  const gotDeliveryAddress = () => {
    setAddressToUpdate(prev => {return {...prev, unitNo:'', ins:''}})
    setCurLeaveAtDoor(false)
    setSectionType(1)
  }

  const editAddress = () => {
    document.getElementById('order-delivery-address').value = address.addr1
    setSectionType(2)
  }

  const updateAddress = () => {      
    const delivery_addr = document.getElementById('order-delivery-address').value

    setAddress((prev) => {return { ...prev, unitNo: addressToUpdate.unitNo, addr1: delivery_addr, 
      leaveAtDoor: curLeaveAtDoor, ins: addressToUpdate.ins, isSavedAddress: false}})
    setLeaveAtDoor(curLeaveAtDoor)
    handleClose()
  }

  return (
    <AddressModal open={openAddressModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Update Address' close={handleClose} />
      <ModalBody justifyContent='center'>

        <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', mb:'0.6rem' }}  >
          <b>Add new address:</b>
        </Typography>

        <Autocomplete onPlaceChanged={gotDeliveryAddress} >
          <TextField 
            id='order-delivery-address' 
            name="order-delivery-address"
            placeholder='Add new delivery address' 
            required
            sx={{backgroundColor:'white', minWidth: '100%', border: 'none', borderRadius:'0'}}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LocationOnIcon/></InputAdornment>,
            }}
          />
        </Autocomplete>

        {sectionType === 0 &&
        <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', m:'1rem 0 0.6rem 0' }}  >
          <b>Edit address:</b>
        </Typography>
        }
        {sectionType === 0 &&
        <FlexBox direction='column' >
          <FlexBox direction='row' onClick={editAddress}
            sx={{border:'solid', borderColor:'tastytreats.dull', borderWidth:'1px', borderRadius:'5px',
            justifyContent:'space-between', alignItems:'center',m:'0 1rem 1rem 1rem', p:'0.5rem 1rem 0.5rem 1rem',
            cursor:'pointer', '&:hover':{backgroundColor: 'tastytreats.lightGrey'}  }} >
            <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
            {(address.unitNo? address.unitNo + ', ' : '') + address.addr1}
            </Typography>
            <EditIcon></EditIcon> 
          </FlexBox>
          
          {allAddresses.length > 0 &&
          <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', mb:'0.6rem' }}  >
            <b>Saved addresses:</b>
          </Typography>
          }

          {allAddresses.map((savedAddress, idx) => {
            return <FlexBox key={idx} direction='row' onClick={() => {setFromSavedAddress(savedAddress)}}
                      sx={{border:'solid', borderColor:'tastytreats.dull', borderWidth:'1px', borderRadius:'5px',
                      justifyContent:'space-between', alignItems:'center',m:'0 1rem 1rem 1rem', p:'0.5rem 1rem 0.5rem 1rem',
                      cursor:'pointer', '&:hover':{backgroundColor: 'tastytreats.lightGrey'}  }} >
                      <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                      {(savedAddress.unit_no? savedAddress.unit_no + ', ' : '') + savedAddress.addr_1}
                      </Typography>
                      <Radio
                        checked={savedAddress.addr_1 === address.addr1 && 
                          (address.unitNo.length === 0 || address.unitNo === savedAddress.unit_no)}
                        value="a"
                        name="saved-addresses-radio-buttons"
                        color="default" 
                        sx={{ m:'0', p:'0' }}
                        inputProps={{ 'aria-label': 'Saved addresses radio buttons' }}
                      />   
                </FlexBox>
          })}

        </FlexBox>
        }

        {(sectionType === 1 || sectionType === 2) &&

        <FlexBox direction='column'>
        
          <TextField 
            id='order-delivery-unit' 
            name="order-delivery-unit"
            placeholder='Apartment or unit or floor number' 
            value={addressToUpdate.unitNo}
            onChange={changeUnitField}
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
            value={addressToUpdate.ins}
            onChange={changeInsField}
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