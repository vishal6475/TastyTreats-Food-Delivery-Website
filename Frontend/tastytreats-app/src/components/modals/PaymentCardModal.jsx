import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { StandardModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography, Grid, CardMedia } from '@mui/material';
import { IconButton } from '@mui/material';



const DeliveryAddressModal = ({openCardModal, setOpenCardModal}) => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  
  const [storeID, setStoreID] = context.storeID;


  const handleClose = () => {
    setOpenCardModal(false);
  }

  const updateCard = () => {
  
    
  }



  return (
    <StandardModal open={openCardModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Update Card' close={handleClose} />
      <ModalBody justifyContent='center'>

        Card

    
      </ModalBody>
    </StandardModal>
  )
}

export default DeliveryAddressModal