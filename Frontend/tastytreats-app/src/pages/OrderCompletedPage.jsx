import { useContext, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../utils/context';
import { Button, Grid, Card, CardMedia, CardContent, Typography, styled } from '@mui/material'
import { FlexBox, Container } from '../components/styles/layouts';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import OrdersAPI from "../utils/OrdersAPIHelper";
const orderAPI = new OrdersAPI();

const StoreMenuPage = () => {
  const { o_id } = useParams();
  const context = useContext(StoreContext);
  const navigate = useNavigate()

  const [customer] = context.customer;
  const [store, setStore] = useState([]);
  const [orderFound, setOrderFound] = useState(true);
  const [cartItems, setCartItems] = context.cartItems;
  const [loggedIn, setLoggedIn] = context.login;
  const [loginOrSignup, setLoginOrSignup] = context.loginOrSignup;
  const [storeDetails, setStoreDetails] = context.storeDetails;
  const [completedOrder, setCompletedOrder] = context.completedOrder;

  const steps = ['Order submitted', 'Preparing', 'Packing', 'Delivering', 'Completed'];

  useEffect(() => {    
    if (!loggedIn) {
      navigate('/home') // if someone typed /order in url without login
    }

    //if (completedOrder == null)
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
      <FlexBox direction='column' sx={{ minWidth:'60vw', m:'0 auto 0 auto', backgroundColor:'white'}} >
        <Stepper activeStep={0} sx={{ m:'2rem 1rem 2rem 1rem' }} >
          {steps.map((label, idx) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={idx} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      

      {(!completedOrder && orderFound === false) &&
      'Order not found!'
      }
      {completedOrder &&
      <FlexBox direction='column'
      sx={{m:'0 auto 1rem auto', p:'0.5rem 1rem 0.5rem 1rem', width:'60vw', backgroundColor:'white' }} >
        <Grid container spacing={1} sx={{ m:'0 auto 1rem auto', width:'50vw', maxWidth:'600px' }} >
          <Grid item xs={12} >
            <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'1.1rem' }} >
            {completedOrder.store_name? completedOrder.store_name: ''}
            </Typography>
          </Grid>

          <Grid item xs={12} >
            <Card sx={{ cursor:'default', mb:'1rem' }} >
              <CardMedia
                component="img"
                height="140"
                image={completedOrder.photo}
              />
            </Card>
          </Grid>

          <Grid item xs={3} >
            <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
              Delivery address:
            </Typography>
          </Grid>

          <Grid item xs={9} >
            <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
              {completedOrder.unit_no.length > 0? completedOrder.unit_no.length + ', ' : '' + completedOrder.addr_1}
            </Typography>
          </Grid>            

          <Grid item xs={3} >
            <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
              Total Amount:
            </Typography>
          </Grid>

          <Grid item xs={9} >
            <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
              ${completedOrder.total_amount}
            </Typography>
          </Grid>            

          <Grid item xs={3} >
            <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
              Type:
            </Typography>
          </Grid>

          <Grid item xs={9} >
            <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
              {completedOrder.delivery_pickup === 'D'? 'Delivery': 'Pickup'}
            </Typography>
          </Grid>          

          <Grid item xs={3} >
            <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
              Items:
            </Typography>
          </Grid>         

          <Grid item xs={9} >
          {completedOrder.items.map((item, idx) => {
            return <FlexBox key={idx} direction='row' justify='space-between'
                    sx={{ width:'25vw', minWidth:'250px'}} >

                    <Typography gutterBottom variant="subtitle2" color="text.primary" 
                      sx={{ p:'0', m:'0', fontSize:'0.95rem' }}>
                      {item.quantity} x {item.name}
                    </Typography> 
      
      
                    <Typography variant="subtitle2" color="text.secondary" 
                      sx={{ p:'0', m:'0', fontSize:'0.9rem' }} >
                      <b>${(item.price * item.quantity).toFixed(2)}</b> 
                    </Typography>
      
                  </FlexBox>
          })}
          </Grid>
        </Grid>
      
    </FlexBox>
      }
      </FlexBox>
    </FlexBox>
  )

}

export default StoreMenuPage