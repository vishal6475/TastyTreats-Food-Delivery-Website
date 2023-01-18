import { useContext, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../utils/context';
import { Button, Grid, Card, CardMedia, CardContent, Typography, styled } from '@mui/material'
import StoresAPI from "../utils/StoresAPIHelper";
import MenuItem from '../components/store/MenuItem'
import Box from '@mui/material/Box';
import { FlexBox, Container } from '../components/styles/layouts';
import Divider from '@mui/material/Divider';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { IconButton } from '@mui/material';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';

const storeAPI = new StoresAPI();

export const StyledCard = styled(Card)`
  width: 60vw;
  margin: 20px auto 0 auto;
  border: none;
`

export const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CardTitle = styled('h1')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
  margin-bottom: -10px;
  margin-left: 1rem;
`

export const CardSummary = styled(Typography)`
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  `

export const MenuBox = styled(Box)`
width: 60vw;
margin: 20px auto 20px auto;
border: none;
`;


const StoreMenuPage = () => {
  const { s_id } = useParams();
  const context = useContext(StoreContext);
  const navigate = useNavigate()

  const [customer] = context.customer;
  const [store, setStore] = useState([]);
  const [storeTags, setStoreTags] = useState('');
  const [cartItems, setCartItems] = context.cartItems;
  const [storeID, setStoreID] = context.storeID;
  const [loggedIn, setLoggedIn] = context.login;
  const [open, setOpen] = context.logInModal;
  const [loginOrSignup, setLoginOrSignup] = context.loginOrSignup;
  const [fromCheckout, setFromCheckout] = context.fromCheckout;

  useEffect(() => {
    fetchStoreMenu()
  }, [])

  const fetchStoreMenu = async (event) => { 
    const storeMenuRes = await storeAPI.getStoreById(s_id)
    console.log(storeMenuRes.data)
    setStoreID(s_id)
    setStore(storeMenuRes.data)
    setStoreTags(storeMenuRes.data.types.join(' - '))
  } 

  const DecreaseQuantity = (idx) => {
    let newCart = cartItems
    newCart.items[idx].quantity -= 1
    setCartItems(JSON.parse(JSON.stringify(newCart)))  
  } 

  const IncreaseQuantity = (idx) => { 
    let newCart = cartItems
    let newQuantity = newCart.items[idx].quantity + 1
    newCart.items[idx].quantity += 1
    setCartItems(JSON.parse(JSON.stringify(newCart)))   
    //setCartItems(prevState => { return { ...prevState, items: {...prevState.items, [idx]:{...prevState.items[idx], quantity: newQuantity } } } })
  }

  const GoToCheckout = () => {
    if (!loggedIn) {
      setOpen(true)
      setFromCheckout(true)
    } else {
      navigate('/checkout'); 
    }
  }


  return (
    <FlexBox sx={{ minHeight:'95vh' }} >

      <FlexBox direction='column' style={{ width:'76vw', ml:'auto', mr:'auto' }}>
        <StyledCard >
          <CardMedia
            component="img"
            height="250"
            image={store.photo}
          />
          <div style={{ display:'flex', justifyContent:'center' }}>
            <CardTitle>
              {store.name}
            </CardTitle>

          </div> 
          <StyledCardContent>
            <Typography gutterBottom variant="h6" component="div" sx={{ mt: -1 }}>
              <b>{storeTags}</b>
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -1, mt: -0.5  }}>
              {store.addr_1}
            </Typography>

            <Typography variant="subtitle2" color="text.primary" sx={{ mb: -1, mt: 4  }}>
              Opening hours: <b>{store.open} - {store.close}</b>
            </Typography>

            <Typography variant="subtitle2" color="text.primary" sx={{ mb: -1, mt: 1  }}>
              Delivery Fee: <b>${store.delivery_fee}</b> - 
              {store.min_order === 0 && ' No minimum order'}
              {store.min_order !== 0 && ' Min Order: '}<b>{'$'+store.min_order}</b>
            </Typography>
          </StyledCardContent>
        </StyledCard>

        <MenuBox>
          {store.categories?.map((category, idx) => 
              <MenuItem 
                key={idx} menu={category} 
              />
            )}
        </MenuBox>
      </FlexBox>

      <Divider orientation="vertical" flexItem />

      {cartItems === null &&
      <FlexBox direction='column' sx={{ width:'24vw', alignItems:'center' }}>    
        <ShoppingCartOutlinedIcon sx={{width:'200px', height:'200px', mt: 5}} />
        <Typography variant="h5" sx={{ mt: 5}} >
          Your cart is empty. 
        </Typography>
        <Typography variant="h5" sx={{ mt: 1}} >
          Add some items.
        </Typography>
      </FlexBox>
      }

      {cartItems !== null &&
      <FlexBox direction='column' sx={{ width:'24vw', alignItems:'left', p:'20px 30px 20px 20px', 
        position:'sticky', position: '-webkit-sticky', top:'0' }}>    
        <Button variant="contained" onClick={GoToCheckout} sx={{ mb:'1rem' }} >Checkout</Button>
        {cartItems.items?.map((item, idx) => 
        <FlexBox key={idx} direction='column' >

          <FlexBox justify='space-between' >
            <Typography gutterBottom variant="h6" color="text.primary" sx={{ p:'0', m:'0' }}>
              {item.name}
            </Typography> 

            
            <FlexBox direction='row' sx={{}}>
              <IconButton id={`remove-btn-${idx}`} disabled={cartItems.items[idx].quantity === 1} 
              sx={{color:'black', p:'0'}} onClick={() => {DecreaseQuantity(idx)}} >
                <RemoveSharpIcon sx={{cursor:'pointer'}} />
              </IconButton> 

              <Typography id={`cart-item-quantity-${idx}`} variant="h6" color="text.secondary" component='div' 
                sx={{m:'0 10px 0 10px', p:'0' }}>
                {cartItems.items[idx].quantity}    
              </Typography>

              <IconButton sx={{color:'black', p:'0'}} onClick={() => {IncreaseQuantity(idx)}} >
                <AddSharpIcon sx={{cursor:'pointer'}} />
              </IconButton>
            </FlexBox>

          </FlexBox>

          
          <Typography id={`cart-item-price-${idx}`} variant="h7" color="text.secondary" 
            sx={{ mb:'0.8rem', fontWeight:'bold' }} >
            ${(item.price * cartItems.items[idx].quantity).toFixed(2)}
          </Typography>

        </FlexBox>
        )}          
      </FlexBox>
      }

    </FlexBox>
  )

}

export default StoreMenuPage