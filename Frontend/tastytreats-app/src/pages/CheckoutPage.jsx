import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import DeliveryAddressModal from '../components/modals/DeliveryAddressModal';
import PaymentCardModal from '../components/modals/PaymentCardModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const storeAPI = new StoresAPI();


const CheckoutPage = () => {
  const context = useContext(StoreContext);
  const [customer] = context.customer;
  const [storesList, setStoresList] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = context.cartItems;  
  const [address, setAddress] = context.address;
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [showUnitBox, setShowUnitBox] = useState(false);
  const [openCardModal, setOpenCardModal] = useState(false);
  const [cardOrder, setCardOrder] = context.cardOrder;
  const [storeID, setStoreID] = context.storeID;
  
  const navigate = useNavigate()

  useEffect(() => {
    getTotalAmount()
  }, [])

  const backToStore = () => {
    navigate(`/store/${storeID}`)
  }

  const getTotalAmount = () => {
    let sum = 0
    cartItems.items.forEach(item => {
      sum += (item.price * item.quantity)
    });
    setTotal(sum)
  }

  const handleAddressModal = () => {
    setShowUnitBox(false)
    setOpenAddressModal(true)
  }

  const handleCardModal = () => {
    setOpenCardModal(true)
  }

  const processPayment = () => {

  }


  return (
    <FlexBox sx={{ minHeight:'94vh' }} >

      <FlexBox direction='column' sx={{ width:'76vw', ml:'auto', mr:'auto' }}>

        <FlexBox sx={{mt:'1rem', ml:'1rem', cursor:'pointer', '&:hover':{textDecoration: 'underline'} }}
          onClick={backToStore} >
          <ArrowBackIcon/>
          <Typography sx={{ml:'0.4rem' }} >Back to store</Typography>
        </FlexBox>
        

        <FlexBox sx={{ minWidth:'50vw', m:'1rem auto 1rem auto' }}>
          <Accordion sx={{ width:'100%'}} >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="delivery-content"
              id="delivery-header"
              sx={{ backgroundColor:'#C8C8C8' }}
            >
              <Typography>Delivery Details</Typography>
            </AccordionSummary>
            <AccordionDetails>

              <FlexBox sx={{ mt:'1rem', mb:'0.5rem', cursor:'pointer' }}
                onClick={handleAddressModal} >
                {address.unitNo? address.unitNo + ' ' : ''} {address.addr1.split(',')[0]}
              </FlexBox>

              <Divider sx={{ mb:'1rem' }} />
              
            </AccordionDetails>
          </Accordion>
        </FlexBox>  

        <FlexBox sx={{ minWidth:'50vw', m:'1rem auto 1rem auto' }}>
          <Accordion sx={{ width:'100%'}} >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}              
              aria-controls="payment-content"
              id="payment-header"
              sx={{ backgroundColor:'#C8C8C8' }}
            >
            <Typography>Payment Details</Typography>
            </AccordionSummary>
            <AccordionDetails>

              <FlexBox sx={{ mt:'1rem', mb:'0.5rem', cursor:'pointer' }}
                onClick={handleCardModal} >
                {cardOrder &&
                'Card999'
                }
                {!cardOrder &&
                'Select Credit/Debit Card'
                }
              </FlexBox>

              <Divider sx={{ mb:'1rem' }} />
            </AccordionDetails>
          </Accordion>
        </FlexBox>  

        <Button variant="contained" onClick={processPayment} 
        sx={{ mb:'1rem', width:'20vw', height:'7vh', m:'1rem auto 1rem auto', 
        backgroundColor: 'tastytreats.mediumBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
          Place Order
        </Button>

      </FlexBox>

      <Divider orientation="vertical" flexItem />

      <FlexBox direction='column' sx={{ width:'24vw', alignItems:'left', p:'20px 30px 20px 20px' }}>   
        {cartItems?.items?.map((item, idx) => 
        <FlexBox key={idx} direction='row' justify='space-between' >

          <Typography gutterBottom variant="subtitle2" color="text.primary" 
            sx={{ p:'0', m:'0', fontSize:'1.1rem' }}>
            {item.quantity} x {item.name}
          </Typography> 


          <Typography variant="subtitle2" color="text.secondary" 
            sx={{ p:'0', m:'0', fontSize:'1rem' }} >
            <b>${(item.price * item.quantity).toFixed(2)}</b> 
          </Typography>

        </FlexBox>
        )}       

        <FlexBox  direction='row' justify='space-between' sx={{mt:'2rem'}} >
          <Typography gutterBottom variant="subtitle2" color="text.primary" 
            sx={{ p:'0', m:'0', fontSize:'1.1rem' }}>
            Delivery fee
          </Typography> 
          <Typography variant="subtitle2" color="text.secondary" 
            sx={{ p:'0', m:'0', fontSize:'1rem' }} >
            <b>${(0.06 * total).toFixed(2)}</b> 
          </Typography>          
        </FlexBox>    

        <FlexBox  direction='row' justify='space-between'>
          <Typography gutterBottom variant="subtitle2" color="text.primary" 
            sx={{ p:'0', m:'0', fontSize:'1.1rem' }}>
            Service fee
          </Typography> 
          <Typography variant="subtitle2" color="text.secondary" 
            sx={{ p:'0', m:'0', fontSize:'1rem' }} >
            <b>${(0.06 * total).toFixed(2)}</b> 
          </Typography>          
        </FlexBox>    

        <FlexBox  direction='row' justify='space-between' sx={{mt:'2rem'}} >
          <Typography gutterBottom variant="subtitle2" color="text.primary" 
            sx={{ p:'0', m:'0', fontSize:'1.1rem' }}>
            Total Amount
          </Typography> 
          <Typography variant="subtitle2" color="text.secondary" 
            sx={{ p:'0', m:'0', fontSize:'1rem' }} >
            <b>${(1.06 * total).toFixed(2)}</b> 
          </Typography>          
        </FlexBox>   

      </FlexBox>
      

      <DeliveryAddressModal 
        openAddressModal={openAddressModal} 
        setOpenAddressModal={setOpenAddressModal}
        showUnitBox={showUnitBox}
        setShowUnitBox={setShowUnitBox} />

      <PaymentCardModal 
        openCardModal={openCardModal} 
        setOpenCardModal={setOpenCardModal} />

    </FlexBox>
  )

}

export default CheckoutPage