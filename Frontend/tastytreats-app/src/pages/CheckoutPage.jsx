import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled, Button } from '@mui/material'
import StoresAPI from "../utils/StoresAPIHelper";
import StoreCard from '../components/store/StoreCard'
import { FlexBox, Container } from '../components/styles/layouts';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const storeAPI = new StoresAPI();


const CheckoutPage = () => {
  const context = useContext(StoreContext);
  const [customer] = context.customer;
  const [storesList, setStoresList] = useState([]);
  const [cartItems, setCartItems] = context.cartItems;

  useEffect(() => {
    
  }, [])

  const processPayment = () => {

  }


  return (
    <FlexBox sx={{ minHeight:'94vh' }} >

      <FlexBox direction='column' sx={{ width:'76vw', ml:'auto', mr:'auto' }}>

        <FlexBox sx={{ minWidth:'66vw', m:'1rem auto 1rem auto' }}>
          <Accordion sx={{ width:'100%'}} >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="delivery-content"
              id="delivery-header"
              sx={{ backgroundColor:'grey' }}
            >
              <Typography>Delivery Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Unit No.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </FlexBox>  

        <FlexBox sx={{ minWidth:'66vw', m:'1rem auto 1rem auto' }}>
          <Accordion sx={{ width:'100%'}} >
            <AccordionSummary
              
              aria-controls="payment-content"
              id="payment-header"
              sx={{ backgroundColor:'grey' }}
            >
            <Typography>Payment Details</Typography>
              <div>hi</div>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Card No.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </FlexBox>  

        <Button variant="contained" onClick={processPayment} 
        sx={{ mb:'1rem', width:'26vw', m:'1rem auto 1rem auto' }} >
          Place Order
        </Button>

      </FlexBox>

      <Divider orientation="vertical" flexItem />

      <FlexBox direction='column' sx={{ width:'24vw', alignItems:'left', p:'20px 30px 20px 20px' }}>   
        {cartItems?.items?.map((item, idx) => 
        <FlexBox key={idx} direction='column' >

          <FlexBox justify='space-between' >
            <Typography gutterBottom variant="h6" color="text.primary" sx={{ p:'0', m:'0' }}>
              {item.name}
            </Typography> 

            
            <FlexBox direction='row' sx={{}}>

              <Typography variant="h6" color="text.secondary" component='div' sx={{m:'0 10px 0 10px', p:'0' }}>
                {item.quantity}  
              </Typography>

            </FlexBox>

          </FlexBox>

          
          <Typography variant="h7" color="text.secondary" sx={{ mb:'0.8rem' }} >
            <b>${(item.price * item.quantity).toFixed(2)}</b> 
          </Typography>

        </FlexBox>
        )}          
      </FlexBox>
      


    </FlexBox>
  )

}

export default CheckoutPage