import { useContext, useEffect, useState } from "react"
import { styled } from '@mui/material/styles';
import { StoreContext } from '../../utils/context';
import { FlexBox } from "../styles/layouts"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import InfoHeader from './styles/InfoHeader';
import AddCardModal from '../modals/AddCardModal';

import CustomersAPI from "../../utils/CustomersAPIHelper";
const custAPI = new CustomersAPI();

const MainBox = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PastMainBox = styled('div')`
  display: flex;
  flex-direction: row;
`;

const SaveButtonBox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// code to format the Date Time
const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

function formatDate(datetime) {
  let d = new Date(datetime);
  return d.toLocaleDateString("en-US", dateFormat)
}

const AccountMainPaymentScreen = ({  }) => {
  const context = useContext(StoreContext);  
  const [customer, setcustomer] = context.customer;  
  const [openCardModal, setOpenCardModal] = useState(false);
  const [allCards, setAllCards] = useState([]);
  
  const fetchAddedCards = async () => {
    try {
    const cardsResponse = await custAPI.getCards(customer.id)
    setAllCards(cardsResponse.data)
    console.log(cardsResponse.data)
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(() => {
    fetchAddedCards()    
  }, [])

  
  return (
    <FlexBox direction='column'>
      <Button onClick={() => {setOpenCardModal(true)}}
        sx={{ width:'100px', border:'solid', borderWidth:'1px', borderColor:'tastytreats.mediumBlue' }} >
        Add Card
      </Button>
      <InfoHeader title='Added cards:' sx={{ mt:'2rem' }} />

      {allCards.map((card, idx) => {
        return  <FlexBox key={idx} direction='column'
                  sx={{border:'solid', borderColor:'tastytreats.dull', borderWidth:'1px', borderRadius:'15px',
                    m:'0 1rem 1rem 1rem', p:'0.5rem 1rem 0.5rem 1rem', width:'200px' }} >
                  <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                      Card ending with ...{card.card_number.substr(-4, 4)}
                  </Typography>                    
                </FlexBox>
      })}

      <AddCardModal 
        allCards={allCards}
        setAllCards={setAllCards}
        openCardModal={openCardModal} 
        setOpenCardModal={setOpenCardModal} />
    </FlexBox>
  )
}

export default AccountMainPaymentScreen
