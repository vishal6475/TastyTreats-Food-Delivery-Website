import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { StandardModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography, Grid, CardMedia } from '@mui/material';
import { IconButton } from '@mui/material';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';



const AddItemModal = () => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  const [openAddModal, setOpenAddModal] = context.addItemModal;
  const [itemToAdd, setItemToAdd] = context.itemToAdd
  const [cartItems, setCartItems] = context.cartItems;
  const [itemOrgQuantity, setItemOrgQuantity] = context.itemOrgQuantity;
  const [itemToAddQuantity, setItemToAddQuantity] = context.itemToAddQuantity;
  const [storeID, setStoreID] = context.storeID;


  const handleClose = () => {
    setOpenAddModal(false);
  }

  const addToCart = () => {
    let found = 0
    const item = {
      id: itemToAdd.id,
      name: itemToAdd.name,
      quantity: itemToAddQuantity,
      price: itemToAdd.price
    }
    const storeAdd = {
      storeID: storeID,
      items: [item]
    }

    if (cartItems !== null) 
    {
      for (const i in cartItems.items) {
        if (itemToAdd.id === cartItems.items[i].id) {
          found = 1
          console.log('Here', i)
          cartItems.items[i].quantity = itemToAddQuantity
        }
      }

      if (found === 0) cartItems.items.push(item)
    } else
      setCartItems(storeAdd)
    
    setOpenAddModal(false);
    console.log(item)
  }

  const DecreaseQuantity = () => {
    setItemToAddQuantity(itemToAddQuantity-1)
  }

  const IncreaseQuantity = () => {
    setItemToAddQuantity(itemToAddQuantity+1)
  }

  return (
    <StandardModal open={openAddModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title={itemToAdd?.name} close={handleClose} />
      <ModalBody justifyContent='center'>

        {itemToAdd?.photo &&
        <CardMedia
        component="img"
        sx={{width:'100%', height:'100%'}}
        image={itemToAdd.photo}
        />}

        <FlexBox sx={{ mb:'10px', mt:'1rem'}} justifyContent='center'>
          <b>${itemToAdd?.price}</b>
        </FlexBox>

        <FlexBox sx={{ m:'0 auto 2rem auto', width:'80%'}} justifyContent='center'>
          {itemToAdd?.description}
        </FlexBox>

        <FlexBox sx={{ m:'0 auto 2rem auto', width:'80%', alignItems:'center'}} justifyContent='center'>
          <IconButton disabled={itemToAddQuantity === 1} sx={{color:'black'}} onClick={DecreaseQuantity} >
            <RemoveSharpIcon sx={{cursor:'pointer'}} />
          </IconButton>

          <Typography gutterBottom variant="h4" color="text.primary" sx={{m:'0 10px 0 10px', p:'0' }}>                 
            {itemToAddQuantity}
          </Typography>
          <IconButton sx={{color:'black'}} onClick={IncreaseQuantity} >
            <AddSharpIcon sx={{cursor:'pointer'}} />
          </IconButton>
        </FlexBox>

        <FlexBox sx={{ m:'0 auto 2rem auto'}} justifyContent='center'>
          <Button variant="contained" onClick={addToCart} >Add to Cart</Button>
        </FlexBox>

      </ModalBody>
    </StandardModal>
  )
}

export default AddItemModal