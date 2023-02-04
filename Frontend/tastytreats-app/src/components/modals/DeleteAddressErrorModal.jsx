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


const DeleteAddressErrorModal = ({openDeleteModal, setOpenDeleteModal}) => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;

  const handleClose = () => {
    setOpenDeleteModal(false);
  }

  return (
    <AddressModal open={openDeleteModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Delete Address Error' close={handleClose} />
      <ModalBody>

        <FlexBox direction='column' sx={{ width:'100%', height:'130px', mt:'2rem', alignItems:'center'}} >
          <Typography variant='subtitle2' sx={{ fontSize:'1.4rem', mb:'0.6rem' }}  >
            Primary address cannot be deleted.
          </Typography>
          <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', mb:'0.6rem' }}  >
            To delete this address, first make another address a primary address and try deleting again.
          </Typography>

        </FlexBox>

    
      </ModalBody>
    </AddressModal>
  )
}

export default DeleteAddressErrorModal