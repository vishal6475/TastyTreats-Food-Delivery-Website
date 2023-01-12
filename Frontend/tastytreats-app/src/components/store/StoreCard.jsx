import { useNavigate } from 'react-router-dom';
import { ScrollContainer } from '../styles/layouts';
import { Grid, Card, CardMedia, CardContent, Typography, styled } from '@mui/material'

export const StyledCard = styled(Card)`
  height: 237px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #dbdbdb;
  }
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

const StoreCard = ({ store }) => {
  const navigate = useNavigate()

  return (
    <Grid item xs={12} sm={6} md={4}>
      <StyledCard onClick={() => navigate(`/store/${store.id}`)}>
        <CardMedia
          component="img"
          height="140"
          image={store.photo}
        />
        <CardTitle>
          {store.name}
        </CardTitle>
        <CardContent>
          <Typography gutterBottom variant="subtitle2" component="div" sx={{ mt: -0.5 }}>
            {store.types.join(', ')}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -1, mt: -0.5  }}>
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