import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { StandardModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField } from '@mui/material';

import CustomersAPI from "../../utils/CustomersAPIHelper";
const custAPI = new CustomersAPI();


const AddCardModal = ({allCards, setAllCards, openCardModal, setOpenCardModal}) => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;
  const [customer, setcustomer] = context.customer;  
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVV, setCardCVV] = useState('')

  const [formErrors, setFormErrors] = useState({
    cardName: false,
    cardNumber: false,
    cardExpiry: false,
    cardCVV: false
  })

  const handleClose = () => {
    setOpenCardModal(false);
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
  
  const addCard = async () => {
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
        let body = {
          id: 0,
          customer_name: cardName,
          card_number: cardNumber,
          card_expiry: cardExpiry, 
          customer_id: customer.id,
          primary1: ''
        }
        const cardsResponse = await custAPI.addCard(customer.id, body)
        allCards.push(cardsResponse.data)    

        setCardName('')
        setCardNumber('')
        setCardExpiry('')
        setCardCVV('')
        
        handleClose()
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  return (
    <StandardModal open={openCardModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Add Card' close={handleClose} />
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

          <Button variant="contained" onClick={addCard}
            sx={{ mb:'1rem', width:'14vw', height:'7vh', m:'1rem auto 1rem auto', 
            fontSize:'1.2rem',
            backgroundColor: 'tastytreats.mediumBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
              Add
          </Button>

        </FlexBox>
      </ModalBody>
    </StandardModal>
  )
}

export default AddCardModal