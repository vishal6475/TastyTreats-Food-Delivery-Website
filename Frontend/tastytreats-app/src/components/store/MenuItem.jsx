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
`

export const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

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

const MenuItem = ({ menu }) => {
  const navigate = useNavigate()

  return (
    <div>      
      <Typography variant="h5" sx={{ mt: 3, mb:1}} >
        {menu.category}
      </Typography>
      <Grid container spacing={3}>
        {menu.items.map((item, idx) => 
          <Grid item xs={12} sm={6} >

            <StyledCard >
              <CardMedia
                component="img"
                height="100"
                image={item.photo}
              />
              <div style={{ display:'flex', justifyContent:'center' }}>
                <CardTitle>
                  {item.name}
                </CardTitle>

              </div>
              <StyledCardContent>
                <Typography gutterBottom variant="subtitle2" component="div" sx={{ mt: -1 }}>                 
                  {item.description}
                </Typography>

              </StyledCardContent>
            </StyledCard>



          </Grid>
        )}
        
      </Grid>
    </div>
  )
}

export default MenuItem