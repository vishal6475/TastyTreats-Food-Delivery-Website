import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { StandardModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography, Grid, CardMedia } from '@mui/material';

const AddItemModal = () => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  const [openAddModal, setOpenAddModal] = context.addItemModal;
  const [itemToAdd, setItemToAdd] = context.itemToAdd
  const [cartItems, setCartItems] = context.cartItems;
  const [quantity, setQuantity] = useState(0);
  const [storeID, setStoreID] = context.storeID;

  const handleClose = () => {
    setOpenAddModal(false);
  }

  const addToCart = () => {
    const item = {
      name: itemToAdd.name,
      quantity: 2,
      price: itemToAdd.price
    }
    const storeAdd = {
      storeID: storeID,
      items: [item]
    }
    if (cartItems !== null) 
    {
      cartItems.items.push(item)
    } else
      setCartItems(storeAdd)

    console.log(cartItems)
    setOpenAddModal(false);
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

        <FlexBox sx={{ m:'0 auto 2rem auto'}} justifyContent='center'>
          <Button variant="contained" onClick={addToCart} >Add to Cart</Button>
        </FlexBox>

      </ModalBody>
    </StandardModal>
  )
}

export default AddItemModal