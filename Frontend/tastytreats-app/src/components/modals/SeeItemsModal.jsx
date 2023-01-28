import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { ItemModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox, ScrollContainer } from '../styles/layouts';
import { Button, TextField, Typography, Grid, CardMedia, experimentalStyled } from '@mui/material';



const SeeItemsModal = ({items, openSeeItems, setOpenSeeItems}) => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [loggedIn, setLoggedIn] = context.login;


  const handleClose = () => {
    setOpenSeeItems(false);
  }
  return (
    <ItemModal open={openSeeItems} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Items' close={handleClose} />
      <ModalBody justifyContent='center' sx={{ overflowY: 'auto'}} >

        {items.map((item, idx) => {
          return <FlexBox key={idx} direction='row' justify='space-between' >

                  <Typography gutterBottom variant="subtitle2" color="text.primary" 
                    sx={{ p:'0', m:'0', fontSize:'1rem' }}>
                    {item.quantity} x {item.name}
                  </Typography> 
    
    
                  <Typography variant="subtitle2" color="text.secondary" 
                    sx={{ p:'0', m:'0', fontSize:'0.9rem' }} >
                    <b>${(item.price * item.quantity).toFixed(2)}</b> 
                  </Typography>
    
                </FlexBox>
        })}

      </ModalBody>
    </ItemModal>
  )
}

export default SeeItemsModal