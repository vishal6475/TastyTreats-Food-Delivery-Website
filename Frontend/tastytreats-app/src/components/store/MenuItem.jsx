import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollContainer } from '../styles/layouts';
import { Grid, Card, CardMedia, CardContent, Typography, styled } from '@mui/material'
import AddItemModal from '../../components/modals/AddItemModal';
import { StoreContext } from '../../utils/context';

const StyledCard = styled(Card)`
  height: 180px;
  border: none;
  cursor: pointer;
`

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: left;
`

const CardTitle = styled('h3')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
  margin-bottom: -10px;
  margin-left: 1rem;
`

const CardSummary = styled(Typography)`
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MenuItem = ({ menu, idx }) => {
  const navigate = useNavigate();  
  const context = useContext(StoreContext);

  const [openAddModal, setOpenAddModal] = context.addItemModal;
  const [itemToAdd, setItemToAdd] = context.itemToAdd;
  const [cartItems, setCartItems] = context.cartItems;
  const [itemOrgQuantity, setItemOrgQuantity] = context.itemOrgQuantity;
  const [itemToAddQuantity, setItemToAddQuantity] = context.itemToAddQuantity;

  const openAddModalBox = (item) => {
    setOpenAddModal(true)
    setItemToAdd(item)

    let found = 0
    if (cartItems !== null) 
      cartItems.items.forEach((cartItem) =>{
        if (item.id === cartItem.id) {
          console.log('This->', cartItem)
          found = 1
          setItemOrgQuantity(cartItem.quantity)
          setItemToAddQuantity(cartItem.quantity)
        }
      })
    if (found === 0) {
      setItemOrgQuantity(1)
      setItemToAddQuantity(1)
    }
  }

  return (
    <div>      
      <Typography id={`menu-${idx}`} className={`menu-${idx}`} variant="h5" sx={{ mt: 4, mb:1}} >
        <b>{menu.category}</b>
      </Typography>
      <Grid container spacing={3}>
        {menu.items.map((item, idx) => 
          <Grid key={idx} item xs={12} sm={6} >

            <StyledCard sx={{display:'flex', flexDirection:'row'}} onClick={() => {openAddModalBox(item)}} >
              
              <div>
                
                <CardTitle>
                  {item.name}
                </CardTitle>

                <StyledCardContent>
                  <Typography gutterBottom variant="subtitle2" color="text.secondary" 
                  sx={{ maxHeight:'110px', overflow: 'hidden', textOverflow:'ellipsis'}}
                  >                 
                    {item.description}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2" color="text.primary" component="div" sx={{ }}>                 
                    ${item.price}
                  </Typography>

                </StyledCardContent>

              </div>
              <div>
                {item.photo &&
                <CardMedia
                  component="img"
                  sx={{width:'120px', height:'100%'}}
                  image={item.photo}
                />}
              </div>
            </StyledCard>
          </Grid>
        )}
        
      </Grid>
      <AddItemModal />
    </div>
  )
}

export default MenuItem