import { AddressModal, ModalBody, ModalItemTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Typography } from '@mui/material';

const DeleteAddressErrorModal = ({openDeleteModal, setOpenDeleteModal}) => {

  const handleClose = () => {
    setOpenDeleteModal(false);
  }

  return (
    <AddressModal open={openDeleteModal} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalItemTitle title='Delete Address Error' close={handleClose} />
      <ModalBody>

        <FlexBox direction='column' sx={{ width:'100%', height:'130px', mt:'2rem', alignItems:'center'}} >
          <Typography variant='subtitle2' sx={{ fontSize:'1.4rem', mb:'0.6rem' }}  >
            Primary address cannot be deleted.
          </Typography>
          <Typography variant='subtitle2' sx={{ fontSize:'0.9rem', mb:'0.6rem' }}  >
            To delete this address, first make another address a primary address and try deleting again.
          </Typography>
        </FlexBox>
    
      </ModalBody>
    </AddressModal>
  )
}

export default DeleteAddressErrorModal