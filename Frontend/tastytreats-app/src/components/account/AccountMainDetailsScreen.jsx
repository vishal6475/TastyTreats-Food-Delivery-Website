import { useContext, useEffect, useState, useRef } from 'react';
import { fileToDataUrl } from '../../utils/helpers';
import { StoreContext } from '../../utils/context';
import AccountUpdatedModal from './modals/AccountUpdatedModal'
import EmailExistsModal from './modals/EmailExistsModal';
import { ScrollContainer } from '../styles/layouts';
import InfoHeader from './styles/InfoHeader';
import {
  Box,
  Button,
  Grid,
  TextField,
  styled,
  Typography
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const ImageHolder = styled(Button)`
  border: 1px solid black;
  cursor: pointer;
  height:100%;
  width:100%;
  max-height: 350px;
  max-width: 350px;
  ${({ theme }) => theme.breakpoints.down("md")} {
    min-height: 350px;
    min-width: 350px;
  }
  background-color: ${({ theme }) => theme.palette.tastytreats.dull};
`

const Image = styled('img')`
  max-height: 100%;
  max-width: 100%;
`

const ToggleGrid = styled(Grid)`
  display: ${({ show }) => show ? 'initial' : 'none'};
`

const AccountDetailsPage = ({ change, setChange }) => {
  const context = useContext(StoreContext);
  const [account, setAccount] = context.customer;
  const [card, setCard] = context.card;
  const ref = useRef(null);
  const [OpenModal, setOpenModal] = useState(false);
  const [openEmailModal, setEmailModal] = useState(false);
  const [imgUpload, setImageUpload] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [emailErr, setEmailErr] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [changeCard, setChangeCard] = useState(false);
  const [formErrors, setFormErrors] = useState({
    error: false,
    firstName: null,
    lastName: null,
    mobile: null,
    email: null,
    password1: null,
    password2: null
  })

  const handleImage = async (event) => {
    const imageFile = event.target.files[0]
    const imageBlob = await fileToDataUrl(imageFile)
    setImageUpload(imageBlob)
  }

  const scrollTo = () => {
    ref?.current?.scrollIntoView()
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName')
    const lastName = data.get('lastName')
    const mobile = data.get('mobile')
    const email = data.get('email')
    const password1 = data.get('password1')
    const password2 = data.get('password2')

    formErrors.error = false;

    if (!firstName || !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(firstName)) {
      setFormErrors(prevState => { return { ...prevState, firstName: true } })
      formErrors.error = true
    }
    if (!lastName || !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(lastName)) {
      setFormErrors(prevState => { return { ...prevState, lastName: true } })
      formErrors.error = true
    }
    if (mobile && mobile[0] === '+') {
      // I had to do this becasue for some reason, the regex /^[\+]?\D+$/.test(mobile) fails to work properly..
      if (/\D+/.test(mobile.slice(1)) || mobile.length < 9) {
        setFormErrors(prevState => { return { ...prevState, mobile: true } })
        formErrors.error = true
      }
    }
    else if (mobile) {
      if (/\D+/.test(mobile) || mobile.length < 9) {
        setFormErrors(prevState => { return { ...prevState, mobile: true } })
        formErrors.error = true
      }
    }
    if (changeEmail && !/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(email)) {
      setFormErrors(prevState => { return { ...prevState, email: true } })
      formErrors.error = true
    }
    if (changePassword) {
      if (password1.length < 8) {
        setFormErrors(prevState => { return { ...prevState, password1: true } })
        formErrors.error = true
      }
      if (password1 !== password2) {
        setFormErrors(prevState => { return { ...prevState, password2: true } })
        formErrors.error = true
      }
    }
    if (!formErrors.error) {
      try {

        
      }
      catch (error) {
        if (error.response?.status === 400) {
        }
        console.error(error)
      }
    }
  };

  useEffect(() => {
    
    setChange(false)
  }, [])

  return (
    <ScrollContainer thin="true" pr='1vw'>
      
          {/* Account image upload */}
          <ImageHolder component='label'>
            <input
              hidden type="file" name="profilePicture"
              id="profilePicture" label="profilePicture" onChange={handleImage}
            />
            {(() => {
              if (account.profile_pic && !imgUpload) {
                return (
                  <Image
                    src={account.profile_pic}
                    alt="Account profile picture"
                  />
                )
              } else if (imgUpload) {
                return (
                  <Image
                    src={imgUpload}
                    alt="Account profile picture"
                  />
                )
              } else {
                return (
                  <AddAPhotoIcon fontSize='large' color='disabled' />
                )
              }
            })()}
          </ImageHolder>
      <Grid
        onChange={() => !change && setChange(true)}
        id='accountForm' component="form" noValidate onSubmit={handleSubmit}
        container spacing={2} sx={{ mt: 0 }}
      >

        


        {/* Account basic details */}

        <Grid item sm={12} md={6}>
          <InfoHeader title='Account basics:' />
          <TextField
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            inputProps={{ maxLength: 50 }}
            defaultValue={account.first_name}
            onChange={() => {
              formErrors.firstName && setFormErrors(prevState => { return { ...prevState, firstName: false } })
            }}
            error={formErrors.firstName}
            helperText={formErrors.firstName ? 'Must be a valid firstname.' : ''}
          />
        </Grid>

        <Grid item sm={12} md={6} sx={{ mt: { sm: 0, md: 5.6 } }} >
          <TextField
            name="lastName"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            inputProps={{ maxLength: 50 }}
            defaultValue={account.last_name}
            onChange={() => {
              formErrors.lastName && setFormErrors(prevState => { return { ...prevState, lastName: false } })
            }}
            error={formErrors.lastName}
            helperText={formErrors.lastName ? 'Must be a valid lastName.' : ''}
          />
        </Grid>
        
        <Grid item sm={12} md={6}>
          <TextField
            name="mobile"
            fullWidth
            type="tel"
            id="mobile"
            label="Mobile"
            inputProps={{ maxLength: 17 }}
            defaultValue={account.mobile}
            onChange={() => {
              formErrors.mobile && setFormErrors(prevState => { return { ...prevState, mobile: false } })
            }}
            error={formErrors.mobile}
            helperText={formErrors.mobile ? 'Must be a valid mobile.' : ''}
          />
        </Grid>

        {/* Account email */}

        <Grid item sm={12} md={6}>
          <InfoHeader title='Account email:' />
          {changeEmail
            ? <TextField
              name="email"
              required
              fullWidth
              id="email"
              label="Email"
              inputProps={{ maxLength: 50 }}
              InputLabelProps={{ shrink: true }}
              defaultValue={account.email}
              onChange={() => {
                formErrors.email && setFormErrors(prevState => { return { ...prevState, email: false } })
              }}
              error={formErrors.email}
              helperText={formErrors.email ? 'Must be a valid email.' : ''}
            />
            : <Typography variant='h6'>
              {account.email}
            </Typography>
          }

        </Grid>
        <Grid item sm={12} md={6}>
          <Button
            variant="contained"
            sx={{
              mt: { sm: 0, md: 7 }, width: '191px',
              backgroundColor: changeEmail ? 'evenTastic.dull' : 'info.main'
            }}
            onClick={() => setChangeEmail(!changeEmail)}
          >
            {changeEmail ? 'Undo change' : 'Change email?'}
          </Button>
        </Grid>

        {/* Account password */}

        <Grid item sm={12} md={6}>
          <InfoHeader title='Account password:' />
          <TextField
            name="password1"
            fullWidth
            type="password"
            id="password1"
            label="Change password"
            autoComplete="new-password"
            inputProps={{ maxLength: 50 }}
            disabled={!changePassword}
            onChange={() => {
              formErrors.password1 && setFormErrors(prevState => { return { ...prevState, password1: false } })
            }}
            error={formErrors.password1}
            helperText={formErrors.password1 ? 'Must contain at least 8 characters.' : ''}
          />
        </Grid>

        <Grid item sm={12} md={6}>
          <Button
            variant="contained"
            sx={{
              mt: { sm: 0, md: 7 }, width: '191px',
              backgroundColor: changePassword ? 'evenTastic.dull' : 'info.main'
            }}
            onClick={() => setChangePassword(!changePassword)}
          >
            {changePassword ? 'Undo change' : 'Change password?'}
          </Button>
        </Grid>
        {changePassword
          ? <Grid item sm={12} sx={{ width: { md: '100%', lg: '59%' } }}>
            <TextField
              name="password2"
              required
              fullWidth
              type="password"
              id="password2"
              label="Confirm password"
              autoComplete="new-password"
              inputProps={{ maxLength: 50 }}
              onChange={() => {
                formErrors.password2 && setFormErrors(prevState => { return { ...prevState, password2: false } })
              }}
              error={formErrors.password2}
              helperText={formErrors.password2 ? 'Passwords must match.' : ''}
              sx={{ width: { sm: '100%', md: '49%' } }}
            />
          </Grid>
          : ''
        }

      </Grid>
      <AccountUpdatedModal open={OpenModal} setOpen={setOpenModal} />
      <EmailExistsModal open={openEmailModal} setOpen={setEmailModal} email={emailErr} />
    </ScrollContainer>
  )
}

export default AccountDetailsPage