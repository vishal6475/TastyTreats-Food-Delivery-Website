import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { CardModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography, Grid, CardMedia } from '@mui/material';
import Radio from '@mui/material/Radio';
import { IconButton } from '@mui/material';

import CustomersAPI from "../../utils/CustomersAPIHelper";
import SelectInput from '@mui/material/Select/SelectInput';
const custAPI = new CustomersAPI();

const PaymentCardModal = ({openCardModal, setOpenCardModal, setPaymentCardCVV}) => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  const [customer, setcustomer] = context.customer;  
  const [allCards, setAllCards] = useState([]);
  const [addCardModal, setAddCardModal] = useState(false);
  
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVV, setCardCVV] = useState('')
  const [cardOrder, setCardOrder] = context.cardOrder;

  const [formErrors, setFormErrors] = useState({
    cardName: false,
    cardNumber: false,
    cardExpiry: false,
    cardCVV: false
  })

  const fetchAddedCards = async () => {
    try {
    const cardsResponse = await custAPI.getCards(customer.id)
    setAllCards(cardsResponse.data)
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    fetchAddedCards()    
  }, [])

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

  const handleClose = async () => {
    setOpenCardModal(false);
    await sleep(300)
    setAddCardModal(false)
    setCardName('')
    setCardNumber('')
    setCardExpiry('')
    setCardCVV('')
    setFormErrors(prev => {return {...prev, cardName:false, cardNumber:false, cardExpiry:false, cardCVV:false}})
  }

  const handleAddCardSection = () => {
    setAddCardModal(true)
  }

  const isLetters = (str) => /^[A-Za-z]*$/.test(str);
  const isNumbers = (str) => /^[0-9]*$/.test(str);
  
  const changeCardName = (e) => {
    if (isLetters(e.target.value.slice(-1)) || e.target.value.slice(-1) === ' ') {
      setCardName(e.target.value);
      setFormErrors(prevState => { return { ...prevState, cardName: false } })
    }
  }  
  const changeCardNumber = (e) => {
    if (isNumbers(e.target.value)) {
      setCardNumber(e.target.value);
      setFormErrors(prevState => { return { ...prevState, cardNumber: false } })
    }
  }
  const changeCardExpiry = (e) => {
    if (isNumbers(e.target.value)) {
      setCardExpiry(e.target.value);
      setFormErrors(prevState => { return { ...prevState, cardExpiry: false } })
    }
  }
  const changeCardCVV = (e) => {
    if (isNumbers(e.target.value)) {
      setCardCVV(e.target.value);
      setFormErrors(prevState => { return { ...prevState, cardCVV: false } })
    }
  }
  
  const updateCard = () => {
    try {
      if (cardName.length === 0){
        setFormErrors(prevState => { return { ...prevState, cardName: true } })
      } else if (cardNumber.length !== 16){
        setFormErrors(prevState => { return { ...prevState, cardNumber: true } })
      } else if (cardExpiry.length !== 4){
        setFormErrors(prevState => { return { ...prevState, cardExpiry: true } })
      } else if (parseInt(cardExpiry.substring(2, 4)) < 23){
        setFormErrors(prevState => { return { ...prevState, cardExpiry: true } })
      } else if (parseInt(cardExpiry.substring(0, 2)) < 1 || parseInt(cardExpiry.substring(0, 2)) > 12){
        setFormErrors(prevState => { return { ...prevState, cardExpiry: true } })
      } else if (cardCVV.length !== 3){
        setFormErrors(prevState => { return { ...prevState, cardCVV: true } })
      } else {
        let cardDetails = {
          name: cardName,
          number: cardNumber,
          expiry: cardExpiry,
          cvv: cardCVV
        }
        setCardOrder(cardDetails)
        setPaymentCardCVV(cardCVV)
        handleClose()
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  const setFromSavedCard = (card) => {
    setCardOrder(prev => {return {...prev, name: card.customer_name, number: card.card_number, expiry: card.card_expiry, cvv:''}})
    setPaymentCardCVV('')
    handleClose()
  }


  return (
    <CardModal open={openCardModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Update Card' close={handleClose} />
      {!addCardModal &&
      <ModalBody justifyContent='center'>

        <FlexBox direction='column' >
          <Button variant="contained" onClick={handleAddCardSection}
            sx={{ mb:'1rem', width:'138px', p:'3px 0 3px 0', fontSize:'1rem',
            backgroundColor: 'tastytreats.mediumBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
              Add new card
          </Button>

          <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', mb:'1rem' }}  >
            <b>Saved cards:</b>
          </Typography>

          {allCards.map((card, idx) => {
          return  <FlexBox key={idx} direction='row' onClick={() => {setFromSavedCard(card)}}
                    sx={{border:'solid', borderColor:'tastytreats.dull', borderWidth:'1px', borderRadius:'15px',
                      m:'0 auto 1rem auto', p:'0.5rem 1rem 0.5rem 1rem', justifyContent:'space-between', alignItems:'center',
                      width:'50vw', maxWidth:'400px',
                      cursor:'pointer', '&:hover':{backgroundColor: 'tastytreats.lightGrey'} }} >
                    <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                        Card ending with ...{card.card_number.substr(-4, 4)}
                    </Typography>    
                    <Radio
                    checked={card.card_number === cardOrder.number}
                    value="a"
                    name="radio-buttons"
                    color="default" 
                    inputProps={{ 'aria-label': 'Payment card radio buttons' }}
                  />                
                  </FlexBox>
        })}

        </FlexBox>
      </ModalBody>
      }

      {addCardModal &&
      <ModalBody justifyContent='center'>

        <div style={{  marginBottom: '20px'}}>
          <b>Card Details:</b>
        </div>
        <div>
        <TextField
          name="cardName"
          required
          fullWidth
          inputProps={{ maxLength: 50 }}
          value={cardName}
          id="cardName"
          label="Card holder name"
          InputLabelProps={{ shrink: true }}
          onChange={changeCardName}
          error={formErrors.cardName}
          helperText={formErrors.cardName ? 'Must be a valid card holder name (at least 1 character long)' : ''}
        />
        <TextField style={{marginTop: '20px'}}
          name="cardNumber"
          required
          fullWidth
          inputProps={{ maxLength: 16 }}
          value={cardNumber}
          id="cardNumber"
          label="Card number"
          InputLabelProps={{ shrink: true }}
          onChange={changeCardNumber}
          error={formErrors.cardNumber}
          helperText={formErrors.cardNumber ? 'Must be a valid 16-digit card number' : ''}
        />
        <FlexBox sx={{marginTop: '20px'}}  >
          <TextField sx={{ mr:'1rem' }}
            name="cardExpiry"
            required
            fullWidth
            inputProps={{ maxLength: 4 }}
            value={cardExpiry}
            id="cardExpiry"
            label="Card expiry"
            InputLabelProps={{ shrink: true }}
            onChange={changeCardExpiry}
            error={formErrors.cardExpiry}
            helperText={formErrors.cardExpiry ? 'Must be a valid card expiry date of format MM/YY' : ''}
          />
          <TextField sx={{ ml:'1rem' }}
            name="cardCVV"
            required
            fullWidth
            type='password'
            inputProps={{ maxLength: 3 }}
            value={cardCVV}
            id="cardCVV"
            label="Card CVV"
            InputLabelProps={{ shrink: true }}
            onChange={changeCardCVV}
            error={formErrors.cardCVV}
            helperText={formErrors.cardCVV ? 'Must be valid CVV of 3 digits' : ''}
          />

        </FlexBox>
        
        </div>

        <FlexBox>

          <Button variant="contained" onClick={handleClose}
            sx={{ mb:'1rem', width:'14vw', height:'7vh', m:'1rem auto 1rem auto', 
            fontSize:'1.2rem',
            backgroundColor: 'grey', '&:hover':{backgroundColor: 'grey'} }} >
              Cancel
          </Button>

          <Button variant="contained" onClick={updateCard}
            sx={{ mb:'1rem', width:'14vw', height:'7vh', m:'1rem auto 1rem auto', 
            fontSize:'1.2rem',
            backgroundColor: 'tastytreats.mediumBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
              Save
          </Button>

        </FlexBox>
      </ModalBody>
      }
    </CardModal>
  )
}

export default PaymentCardModal