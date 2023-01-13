import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { StandardModal, ModalBody, ModalTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography, Grid, CardMedia } from '@mui/material';

const AddItemModal = () => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  const [openAddModal, setOpenAddModal] = context.addItemModal;
  const [itemToAdd, setItemToAdd] = context.itemToAdd

  const handleClose = () => {
    setOpenAddModal(false);
  }

  return (
    <StandardModal open={openAddModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalTitle title={itemToAdd?.name} close={handleClose} />
      <ModalBody justifyContent='center'>

      {itemToAdd?.photo &&
                <CardMedia
                  component="img"
                  sx={{width:'100%', height:'100%'}}
                  image={itemToAdd.photo}
                />}

        <FlexBox sx={{ mb:'10px'}} justifyContent='center'>
          ${itemToAdd?.price}
        </FlexBox>

        

        <FlexBox sx={{ m:'0 auto 2rem auto', width:'80%'}} justifyContent='center'>
          {itemToAdd?.description}
        </FlexBox>

        <FlexBox sx={{ minHeight:'50vh' }} justify={'center'}>
                  
        </FlexBox>        
      </ModalBody>
    </StandardModal>
  )
}

export default AddItemModal