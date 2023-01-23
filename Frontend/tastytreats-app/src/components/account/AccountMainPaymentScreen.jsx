import { useContext, useEffect, useState } from "react"
import { styled } from '@mui/material/styles';
import { StoreContext } from '../../utils/context';
import { FlexBox, ScrollContainer } from "../styles/layouts"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";


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
  

  
  useEffect(() => {
    
  }, [])

  
  return (
    <ScrollContainer hide="true" sx={{ p: 1, mt: 7 }}>
      Cards
    </ScrollContainer>
  )
}

export default AccountMainPaymentScreen
