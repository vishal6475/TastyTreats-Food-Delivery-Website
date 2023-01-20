import { FlexBox } from './layouts';
import CloseIcon from '@mui/icons-material/Close';
import { 
  Box,
  Dialog,
  Divider,
  IconButton,
  Typography,
  styled
} from '@mui/material';

export const StandardModal = styled(Dialog)`
  & .MuiDialog-paper {
    width: 80vw;
    max-width: 650px;
  }
`

export const ItemModal = styled(Dialog)`
  & .MuiDialog-paper {
    width: 80vw;
    max-width: 500px;
  }
`

export const AddressModal = styled(Dialog)`
  & .MuiDialog-container {
    align-items: flex-start;
    margin-top: 5vh;
  };
  & .MuiDialog-paper {
    width: 80vw;
    max-width: 650px;
  };
  z-index: 100;
`

export const StyledTitle = styled(FlexBox)`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
`

export const ModalBody = styled(Box)`
  ${({ theme }) => theme.typography.body1}
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
`

export const LargeModal = styled(Dialog)`
  & .MuiDialog-paper {
    width: 95vw;
    height: 85vh;
    max-width: 1400px;
    background-color: #f9f9f9;
  }
`

export const ModalBodyLarge = styled(Box)`
  ${({ theme }) => theme.typography.body1}
  width: 95%;
  height: 95%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  overflow: hidden; 
`

export const ItemTitleBox = styled(FlexBox)`
  width: 89%;
  align-items: center;
  justify-content: center;
`
export const CloseIconBox = styled(FlexBox)`
  min-width: 4%;
`


export const ModalItemTitle = ( {title, close} ) => {
  return (
    <>
    <FlexBox sx={{ pt:'0.5rem'}} >

      <CloseIconBox></CloseIconBox>

      <ItemTitleBox>
        <Typography variant='h5'>
          {title}
        </Typography>
      </ItemTitleBox>

      <CloseIconBox>
        <IconButton aria-label="close" onClick={close}>
          <CloseIcon />
        </IconButton>
      </CloseIconBox>

    </FlexBox>

    <Divider variant="middle" sx={{mb:2}} />
    </>
  )
}

export const ModalTitle = ( {title, close} ) => { 
  return (
    <>
    <StyledTitle justify='space-between'>
      <Typography variant='h5'>
        {title}
      </Typography>
      <IconButton aria-label="close" onClick={close}>
        <CloseIcon />
      </IconButton>
    </StyledTitle>
    <Divider variant="middle" sx={{mb:2}} />
    </>
  )
}
