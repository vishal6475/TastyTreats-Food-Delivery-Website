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

import OrdersAPI from "../utils/OrdersAPIHelper";

const orderAPI = new OrdersAPI();


const StoreMenuPage = () => {
  const { o_id } = useParams();
  const context = useContext(StoreContext);
  const navigate = useNavigate()

  const [customer] = context.customer;
  const [store, setStore] = useState([]);
  const [storeTags, setStoreTags] = useState('');
  const [cartItems, setCartItems] = context.cartItems;
  const [loggedIn, setLoggedIn] = context.login;
  const [open, setOpen] = context.logInModal;
  const [loginOrSignup, setLoginOrSignup] = context.loginOrSignup;
  const [fromCheckout, setFromCheckout] = context.fromCheckout;
  const [storeDetails, setStoreDetails] = context.storeDetails;
  const [completedOrder, setCompletedOrder] = context.completedOrder;

  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (completedOrder == null)
      fetchCompletedOrder()
  }, [])
  
  const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

  function formatDate(datetime) {
    let d = new Date(datetime);
    return d.toLocaleDateString("en-US", dateFormat)
  }

  const fetchCompletedOrder = async (event) => { 
    const orderRes = await orderAPI.getOrderByID(o_id)
    setCompletedOrder(orderRes.data)
    console.log(orderRes.data)
  } 


  return (
    <FlexBox sx={{ minHeight:'95vh', backgroundColor: 'tastytreats.backgroundGrey' }} >
      Completed order
      {!completedOrder &&
      'Order not found!'
      }
      {completedOrder &&
      <FlexBox>
        Id: {completedOrder.id}
        Date: {formatDate(completedOrder.date)}
      </FlexBox>
      }
    </FlexBox>
  )

}

export default StoreMenuPage