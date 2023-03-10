import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { ItemModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, Typography, CardMedia } from '@mui/material';
import { IconButton } from '@mui/material';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';


const AddItemModal = () => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [openAddModal, setOpenAddModal] = context.addItemModal;
  const [itemToAdd, setItemToAdd] = context.itemToAdd
  const [cartItems, setCartItems] = context.cartItems;
  const [itemToAddQuantity, setItemToAddQuantity] = context.itemToAddQuantity;
  const [storeDetails, setStoreDetails] = context.storeDetails;
  const [hasItemsChanged, setHasItemsChanged] = context.hasItemsChanged;

  const handleClose = () => {
    setOpenAddModal(false);
  }

  const addToCart = () => {
    try {
      let found = 0
      const item = {
        id: itemToAdd.id,
        name: itemToAdd.name,
        quantity: itemToAddQuantity,
        price: itemToAdd.price
      }
      const storeAdd = {
        storeID: storeDetails.id,
        name: storeDetails.name,
        photo: storeDetails.photo,
        delivery_fee: storeDetails.delivery_fee,
        items: [item]
      }
      
      if (cartItems !== null) 
      {
        // checking if adding items from new store or old store
        if (cartItems.storeID !== storeDetails.id) { // new store
          setCartItems(storeAdd)
          setHasItemsChanged(prev => !prev)
        } else { // old store
          for (const i in cartItems.items) { // checking if item is already in cart
            if (itemToAdd.id === cartItems.items[i].id) {
              found = 1
              cartItems.items[i].quantity = itemToAddQuantity
              setHasItemsChanged(prev => !prev)
            }
          }
          if (found === 0) { // item not in cart, adding it now
            cartItems.items.push(item)
            setHasItemsChanged(prev => !prev)
          }
        }
      } else { //cart is experimentalStyled, adding all details
        setCartItems(storeAdd)
        setHasItemsChanged(prev => !prev)
      }          
      setOpenAddModal(false);
    } catch (error) {
      console.log(error)
    }
  }

  const DecreaseQuantity = () => {
    setItemToAddQuantity(itemToAddQuantity-1)
  }

  const IncreaseQuantity = () => {
    setItemToAddQuantity(itemToAddQuantity+1)
  }

  return (
    <ItemModal open={openAddModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title={itemToAdd?.name} close={handleClose} />
      <ModalBody justifyContent='center' sx={{ overflowY: 'auto'}} >

        {itemToAdd?.photo &&
        <CardMedia
        component="img"
        sx={{width:'100%', height:'100%'}}
        image={itemToAdd.photo}
        />}

        <FlexBox sx={{ mb:'10px', mt:'1rem'}} justifyContent='center'>
          <b>${itemToAdd?.price}</b>
        </FlexBox>

        <FlexBox sx={{ m:'0 auto 0.2rem auto', width:'80%'}} justifyContent='center'>
          {itemToAdd?.description}
        </FlexBox>

      </ModalBody>

      <FlexBox sx={{ m:'0.2rem auto 0.8rem auto', width:'80%', alignItems:'center'}} justifyContent='center'>
        <IconButton disabled={itemToAddQuantity <= 1} sx={{color:'black'}} onClick={DecreaseQuantity} >
          <RemoveSharpIcon sx={{cursor:'pointer'}} />
        </IconButton>

        <Typography gutterBottom variant="h4" color="text.primary" sx={{m:'0 10px 0 10px', p:'0' }}>                 
          {itemToAddQuantity === 0? 1 : itemToAddQuantity}
        </Typography>
        
        <IconButton sx={{color:'black'}} onClick={IncreaseQuantity} >
          <AddSharpIcon sx={{cursor:'pointer'}} />
        </IconButton>
      </FlexBox>

      <FlexBox sx={{ m:'0 auto 1.5rem auto'}} justifyContent='center'>
        <Button variant="contained" onClick={addToCart} 
          sx={{minWidth:'200px', maxWidth:'350px', width:'40vw', height:'50px', fontSize:'1.2rem'}}
        >Add to Cart</Button>
      </FlexBox>
    </ItemModal>
  )
}

export default AddItemModal