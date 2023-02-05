import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../utils/context';
import { Typography, TextField, Button } from '@mui/material'
import { FlexBox } from '../components/styles/layouts';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeliveryAddressModal from '../components/modals/DeliveryAddressModal';
import PaymentCardModal from '../components/modals/PaymentCardModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {
  useJsApiLoader,
} from '@react-google-maps/api'

import OrdersAPI from "../utils/OrdersAPIHelper";
const orderAPI = new OrdersAPI();

const CheckoutPage = () => {
  const context = useContext(StoreContext);
  const [customer, _] = context.customer;  
  const [loggedIn] = context.login;
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = context.cartItems;  
  const [address, setAddress] = context.address; 
  const [addressToUpdate, setAddressToUpdate] = useState({});
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [sectionType, setSectionType] = useState(0); // 0 for intial modal, 1 for new address modal, 2 for edit address modal
  const [openCardModal, setOpenCardModal] = useState(false);
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const [cardOrder, setCardOrder] = context.cardOrder;
  const [storeDetails, setStoreDetails] = context.storeDetails;
  const [completedOrder, setCompletedOrder] = context.completedOrder;
  const [noAddressError, setNoAddressError] = useState(false);
  const [noCardError, setNoCardError] = useState(false);
  const [noCVVError, setNoCVVError] = useState(false);  
  const [longDistanceError, setLongDistanceError] = useState(false);  
  const [paymentCardCVV, setPaymentCardCVV] = useState('')
  const [expanded, setExpanded] = useState(true);

  let populateAddr1Interval = null
  
  const navigate = useNavigate()

  const getTotalAmount = () => {
    try {
      let sum = 0
      cartItems?.items.forEach(item => {
        sum += (item.price * item.quantity)
      });
      setTotal(sum)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!loggedIn) {
      navigate('/home') // if someone typed /checkout in url without login
    }

    getTotalAmount()
  }, [])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_MgNdagqfz1e-bpG0Vnxfey8WEOSnzvo',
    libraries: ['places'],
  })

  if (!isLoaded) {
    return <div></div>;
  } 

  const backToStore = () => {
    navigate(`/store/${storeDetails.id}`)
  }

  const populateAddr1Field = () => {
    try {
      if (document.getElementById('order-delivery-address')) {
        document.getElementById('order-delivery-address').value = address.addr1
        clearInterval(populateAddr1Interval);
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddressModal = () => {
    try {
      setLongDistanceError(false)
      setNoAddressError(false)
      setAddressToUpdate(address)
      setSectionType(0)
      setOpenAddressModal(true)
      //populateAddr1Interval = setInterval(populateAddr1Field, 100);
    } catch (error) {
      console.error(error)
    }
  }

  const handleLeaveHandModal = () => {
    try {
      setLongDistanceError(false)
      setNoAddressError(false)
      setAddressToUpdate(address)
      setSectionType(2)
      setOpenAddressModal(true)
      populateAddr1Interval = setInterval(populateAddr1Field, 100);
    } catch (error) {
      console.error(error)
    }
  }

  const handleCardModal = () => {
    setNoCardError(false)
    setNoCVVError(false)
    setOpenCardModal(true)
  }

  const isNumbers = (str) => /^[0-9]*$/.test(str);

  const changePaymentCardCVV = (e) => {
    try {
      if (isNumbers(e.target.value)) {
        setPaymentCardCVV(e.target.value);
        setNoCVVError(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

  function formatDate(datetime) {
    let d = new Date(datetime);
    return d.toLocaleDateString("en-US", dateFormat)
  }

  const placeOrder = async () => {
    if (address.addr1.length === 0){
      setNoAddressError(true)
      setNoCardError(false)
    } else if (cardOrder.number.length !== 16) {
      setNoCardError(true)
    } else if (document.getElementById('paymentCardCVV').value.length !== 3) {
      setNoCVVError(true)
    } else {

      try{
        const service = new window.google.maps.DistanceMatrixService()
        let distance = 0
        await service.getDistanceMatrix(
          {
            origins: [address.addr1],
            destinations: [storeDetails.addr_1],
            travelMode: "DRIVING"
          },
          (response, status) => {
            if (status === "OK") {
              distance = response.rows[0].elements[0].distance.value
            }
          }
        )

        if (distance > 7000) {
          setLongDistanceError(true)
        } else {
          let currentDate = new Date()

          const body = {
            customer_id: customer.id,
            store_id: cartItems.storeID,
            unit_no: address.unitNo,
            addr_1: address.addr1,
            customer_name: cardOrder.name,
            card_number: cardOrder.number,
            card_expiry: cardOrder.expiry,
            payment_type: 'Card',
            delivery_pickup: 'D',
            total_amount: parseInt((1.06 * total + cartItems.delivery_fee).toFixed(2)),
            items: cartItems.items,
            date: currentDate
          }

          const response = await orderAPI.createOrder(body)
          setCompletedOrder(response.data)
          navigate(`/order/${response.data.id}`)
        }

      }
      catch (error) {
        console.error(error)
      }
    }
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
          <Accordion expanded={expanded} sx={{ width:'100%'}} >
            <AccordionSummary onClick={() => {setExpanded(!expanded)}}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="delivery-content"
              id="delivery-header"
              sx={{ backgroundColor:'#C8C8C8' }}
            >
              <Typography>Delivery Details</Typography>
            </AccordionSummary>
            <AccordionDetails>

              <FlexBox direction='row' sx={{ mt:'1rem', mb:'0.5rem', cursor:'pointer', justifyContent:'space-between' }} 
                onClick={handleAddressModal} >
                <FlexBox>
                  <LocationOnIcon/>
                  <Typography sx={{ ml:'0.6rem' }}>
                    {address.unitNo? address.unitNo + ' ' : ''} {address.addr1.split(',')[0]}
                  </Typography>
                </FlexBox>
                <FlexBox sx={{ border:'solid', borderRadius:'7px', borderWidth:'1px', padding:'1px 5px 1px 5px' }} >
                  <Typography variant='subtitle2'>
                    Edit
                  </Typography>
                </FlexBox>
              </FlexBox>
              <Divider sx={{ mb:'1rem' }} />              

              <FlexBox direction='row' sx={{ mt:'2rem', mb:'0.5rem', cursor:'pointer', justifyContent:'space-between' }} 
                onClick={handleLeaveHandModal} >
                <FlexBox>
                  <MeetingRoomIcon/>
                  <Typography sx={{ ml:'0.6rem' }}>
                    {!leaveAtDoor && 'Hand it to me'}
                    {leaveAtDoor && 'Leave at door'}
                  </Typography>
                </FlexBox>
                <FlexBox sx={{ border:'solid', borderRadius:'7px', borderWidth:'1px', padding:'1px 5px 1px 5px' }} >
                  <Typography variant='subtitle2'>
                    Edit
                  </Typography>
                </FlexBox>
              </FlexBox>
              <Divider sx={{ mb:'1.8rem' }} />
              
            </AccordionDetails>
          </Accordion>
        </FlexBox>  

        <FlexBox sx={{ minWidth:'50vw', m:'1rem auto 1rem auto' }}>
          <Accordion expanded={!expanded} sx={{ width:'100%'}} >
            <AccordionSummary onClick={() => {setExpanded(!expanded)}}
              expandIcon={<ExpandMoreIcon />}              
              aria-controls="payment-content"
              id="payment-header"
              sx={{ backgroundColor:'#C8C8C8' }}
            >
            <Typography>Payment Details</Typography>
            </AccordionSummary>
            <AccordionDetails>

              <FlexBox direction='row' sx={{ mt:'1.5rem', mb:'0.5rem', justifyContent:'space-between',
                alignItems:'center' }} 
                >
                <FlexBox sx={{ alignItems:'center' }}>
                  <CreditCardIcon/>
                  <Typography sx={{ ml:'0.6rem' }}>
                  { cardOrder.number.length === 16 && 'Card ...' + cardOrder.number.substr(-4, 4) }
                  { cardOrder.number.length !== 16 && 'Select Credit/Debit Card' }
                  </Typography>
                  { cardOrder.number.length === 16 &&
                  <TextField
                    size="small"
                    id="paymentCardCVV"
                    type='password'
                    placeholder="CVV"
                    value={paymentCardCVV}
                    onChange={changePaymentCardCVV}
                    inputProps={{ maxLength: 3}}         
                    sx={{ ml:'10px', width:'60px' }}           
                  />  
                  }
                </FlexBox>
                <FlexBox onClick={handleCardModal}
                  sx={{ border:'solid', borderRadius:'7px', borderWidth:'1px', padding:'1px 5px 1px 5px', cursor:'pointer' }} >
                  <Typography variant='subtitle2'>
                    Edit
                  </Typography>
                </FlexBox>
              </FlexBox>
              <Divider sx={{ mb:'1.6rem' }} />

            </AccordionDetails>
          </Accordion>
        </FlexBox>  

        <Typography variant='subtitle2' 
          sx={{ color: 'error.main', minHeight:'5vh', m:'0.4rem auto 0 auto', fontSize:'1rem'}}>
          {noAddressError && 'Please enter your delivery address.'}
          {noCardError && 'Please enter your card details.'}
          {noCVVError && 'Please enter 3-digit CVV of your card.'}
          {longDistanceError && 'Cannot place order as delivery address is more than 7kms away from the store.'}          
        </Typography>

        <Button variant="contained" onClick={placeOrder} 
        sx={{ mb:'1rem', width:'20vw', minWidth:'160px', height:'7vh', m:'0.6rem auto 1rem auto', fontSize:'1.2rem', 
        backgroundColor: 'tastytreats.mediumBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
          Place Order
        </Button>

      </FlexBox>

      <Divider orientation="vertical" flexItem />

      <FlexBox direction='column'>  

        <FlexBox direction='column' sx={{position:'sticky', top:'0' }}>
          <FlexBox direction='column' 
            sx={{ width:'24vw', alignItems:'left', overflowY:'auto', height:'90vh', p:'20px 30px 0 20px'}}>
            
            {cartItems &&
            <FlexBox sx={{ mb:'1rem' }} >
              <img style={{ marginRight: '10px', borderRadius: '8px' }}
                src={cartItems.photo}
                width="20%"
                alt="Store-thumbnail"
                id = 'store-checkout-image'
              />
              {//<Avatar src={storeDetails.photo} />
              }
              <FlexBox direction='column' >
                <Typography>
                  Your cart from 
                </Typography>
                <Typography>
                  <b>{cartItems.name}</b>
                </Typography>
              </FlexBox>
            </FlexBox>
            }

            {cartItems?.items?.map((item, idx) => 
            <FlexBox key={idx} direction='row' justify='space-between' >

              <Typography gutterBottom variant="subtitle2" color="text.primary" 
                sx={{ p:'0', m:'0', fontSize:'1rem' }}>
                {item.quantity} x {item.name}
              </Typography> 


              <Typography variant="subtitle2" color="text.secondary" 
                sx={{ p:'0', m:'0', fontSize:'0.9rem' }} >
                <b>${(item.price * item.quantity).toFixed(2)}</b> 
              </Typography>

            </FlexBox>
            )}       

            {cartItems &&
            <FlexBox direction='column'>
              <FlexBox  direction='row' justify='space-between' sx={{mt:'2rem'}} >
                <Typography gutterBottom variant="subtitle2" color="text.primary" 
                  sx={{ p:'0', m:'0', fontSize:'1rem' }}>
                  Delivery fee
                </Typography> 
                <Typography variant="subtitle2" color="text.secondary" 
                  sx={{ p:'0', m:'0', fontSize:'0.9rem' }} >
                  <b>${cartItems? (cartItems.delivery_fee).toFixed(2): '0.00'}</b> 
                </Typography>          
              </FlexBox>    

              <FlexBox direction='row' justify='space-between'>
                <Typography gutterBottom variant="subtitle2" color="text.primary" 
                  sx={{ p:'0', m:'0', fontSize:'1rem' }}>
                  Service fee
                </Typography> 
                <Typography variant="subtitle2" color="text.secondary" 
                  sx={{ p:'0', m:'0', fontSize:'0.9rem' }} >
                  <b>${(0.06 * total).toFixed(2)}</b> 
                </Typography>          
              </FlexBox>    

              <FlexBox direction='row' justify='space-between' sx={{mt:'2rem'}} >
                <Typography gutterBottom variant="subtitle2" color="text.primary" 
                  sx={{ p:'0', m:'0', fontSize:'1rem' }}>
                  Total Amount
                </Typography> 
                <Typography variant="subtitle2" color="text.secondary" 
                  sx={{ p:'0', m:'0', fontSize:'0.9rem' }} >
                  <b>${cartItems? (1.06 * total + cartItems.delivery_fee).toFixed(2): '0.00'}</b> 
                </Typography>          
              </FlexBox>  
            </FlexBox>  
            } 

          </FlexBox>      
        </FlexBox>      

      </FlexBox>      

      <DeliveryAddressModal 
        openAddressModal={openAddressModal} 
        setOpenAddressModal={setOpenAddressModal}
        sectionType={sectionType}
        setSectionType={setSectionType}
        leaveAtDoor={leaveAtDoor}
        setLeaveAtDoor={setLeaveAtDoor}  
        addressToUpdate={addressToUpdate}      
        setAddressToUpdate={setAddressToUpdate}
        />

      <PaymentCardModal 
        openCardModal={openCardModal} 
        setOpenCardModal={setOpenCardModal}
        setPaymentCardCVV={setPaymentCardCVV} />

    </FlexBox>
  )

}

export default CheckoutPage