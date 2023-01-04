import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material'
import CopyrightIcon from '@mui/icons-material/Copyright';

export const StyledFooter = styled('div')`
  display: flex;
  background-color: ${( {theme} ) => theme.palette.tastytreats.mediumBlue};
  color: ${( {theme} ) => theme.palette.tastytreats.title};
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-top: auto;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <CopyrightIcon fontSize='small' sx={{marginRight:0.5}}/>
      <Typography variant='h7'>TastyTreats</Typography>
    </StyledFooter>
  )
}

export default Footer