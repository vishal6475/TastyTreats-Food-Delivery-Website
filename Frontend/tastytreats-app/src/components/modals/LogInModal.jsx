import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { StandardModal, ModalBody, ModalTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography } from '@mui/material';


const LogInModal = () => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [nextPage, setRedirect] = context.redirect;
  const [, setLoggedIn] = context.login;
  const [open, setOpen] = context.logInModal;
  const [logInFail, setLogInFail] = useState(null);
  const [formErrors, setFormErrors] = useState({
    error: false,
    email: null,
    password: null,
  })

  const handleClose = () => {
    setOpen(false);
  }

  const userLogin = () => {
    setLoggedIn(true);
    navigate(nextPage)
    setRedirect(false)
    handleClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')
    const password = data.get('password')

    formErrors.error = false;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormErrors(prevState => { return { ...prevState, email: true } })
      formErrors.error = true
    }

    if (!formErrors.error) {
      let param = {
        'email': email
      }
      try {
        
      }
      catch(error) {
        console.error(error)
      }
    }
  }

  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalTitle title='Log into TastyTreats!' close={handleClose} />
      <ModalBody component="form" noValidate onSubmit={handleSubmit}>
        <TextField
          name="email"
          required
          label="customer email"
          sx={{ mb: 4, mr:2, width: '100%', maxWidth: '300px' }}
          autoFocus
          inputProps={{ maxLength: 50 }}
          onChange={() => {
            formErrors.email && setFormErrors(prevState => { return { ...prevState, email: false } })
            logInFail && setLogInFail(false)
          }}
          error={formErrors.email}
          helperText={formErrors.email ? 'Must be a valid email.' : ''}
        />
        <TextField
          name="password"
          required
          label="Password"
          type="password"
          sx={{ mb: 2, mr:2, width: '100%', maxWidth: '300px' }}
          inputProps={{ maxLength: 50 }}
          onChange={() => {
            formErrors.password && setFormErrors(prevState => { return { ...prevState, password: false } })
            logInFail && setLogInFail(false)
          }}
          error={formErrors.password}
          helperText={formErrors.password ? 'Cannot be empty.' : ''}
        />
        {logInFail
          ? <Typography variant='subtitle2' sx={{ color: 'error.main', mt: -2 }}>
            Incorrect password or email .. Please try again
          </Typography>
          : ''
        }
        <FlexBox justify='space-between' align='end'>
          <Button type='submit' variant="contained">
            Log in
          </Button>
          <FlexBox direction='column' sx={{ mr: 2 }}>
            <Typography variant='subtitle2' sx={{ color: 'success.main' }} >
              No account?
            </Typography>
            <Button
              component={Link} to={'/register'}
              variant="contained" color="success" onClick={handleClose}
            >
              Sign up
            </Button>
          </FlexBox>
        </FlexBox>
      </ModalBody>
    </StandardModal>
  )
}

export default LogInModal