import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollContainer } from '../styles/layouts';
import { Grid, Card, CardMedia, CardContent, Typography, styled } from '@mui/material'

export const StyledCard = styled(Card)`
  height: 255px;
  border: none;
`;

const CardTitle = styled('h3')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
  margin-bottom: -10px;
  margin-left: 1rem;
`

export const CardSummary = styled(Typography)`
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TagContainer = styled(ScrollContainer)`
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
  padding-bottom: 5px;
  overflow-x: auto;
`

const StoreCard = ({ store, isDisabled }) => {
  const navigate = useNavigate()
  const [closingSoon, setClosingSoon] = useState(false)

  useEffect(() => {    
    isClosingSoon(store.close)    
  }, [])

  const isClosingSoon = (close) => {
    try {
      const currentDate = new Date()
      const hours = parseInt(currentDate.getHours())
      const minutes = parseInt(currentDate.getMinutes())
      let closeHours = parseInt(close.substr(0, 2))
      let closeMinutes = parseInt(close.substr(3, 5))

      if (closeHours === 0) {
        if (hours === 0) {
          if (minutes < closeMinutes) setClosingSoon(true)
        } else if (hours === 23) {
          if (minutes >= closeMinutes) setClosingSoon(true)      
        }
      } else if (hours === closeHours) {
        if (minutes < closeMinutes) setClosingSoon(true)
      } else if (hours === (closeHours - 1)) {
        if (minutes >= closeMinutes) setClosingSoon(true)      
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid disabled={isDisabled} item xs={12} sm={6} md={4}>
      <StyledCard disabled={isDisabled} onClick={() => {if (!isDisabled) navigate(`/store/${store.id}`)}}
      sx={{ '&:hover':{backgroundColor:isDisabled? '':'#dbdbdb'},
            cursor:isDisabled? 'default': 'pointer', opacity:isDisabled? 0.6: 1 }}      
      >
        <CardMedia
          component="img"
          height="140"
          image={store.photo}
        />
        <CardTitle>
          {store.name}
        </CardTitle>
        <CardContent>
          <Typography gutterBottom variant="subtitle2" component="div" sx={{ display:'flex', direction:'row', mt: -0.5 }}>
            {store.types.join(', ')} {isDisabled && '(Closed)'} 
            {(closingSoon === true && isDisabled === false) && 
            <Typography variant="subtitle2" sx={{ color:'tastytreats.mediumBlue', ml:'5px' }} >
              (*Closing at {store.close})
            </Typography>
            }
          </Typography>

          {store.distance && 
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -1, mt: -0.5  }}>
            {store.distance} km - {store.time} minutes
          </Typography>
          }

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -1, mt: 0.7  }}>
            Delivery Fee: ${store.delivery_fee} - 
            {store.min_order === 0 && ' No minimum order'}
            {store.min_order !== 0 && ' Min Order: $'+store.min_order}
          </Typography>
        </CardContent>
      </StyledCard>
    </Grid>
  )
}

export default StoreCard