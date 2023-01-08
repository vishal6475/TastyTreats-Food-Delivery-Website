import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { StandardModal, ModalBody, ModalTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography, Grid } from '@mui/material';
import CustomerAPI from "../../utils/CustomerAPIHelper";

const custAPI = new CustomerAPI();

const LogInModal = () => {
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const [nextPage, setRedirect] = context.redirect;
  const [loggedIn, setLoggedIn] = context.login;
  const [open, setOpen] = context.logInModal;
  const [logInFail, setLogInFail] = useState(null);
  const [loginOrSignup, setLoginOrSignup] = context.loginOrSignup;
  const [customer, setCustomer] = context.customer;
  
  const [formErrors, setFormErrors] = useState({
    error: false,
    email: null,
    password: null,
  })

  const [signupErrors, setSignupErrors] = useState({
    error: false,
    firstName: null,
    lastName: null,
    email: null,
    mobileNo: null,
    password1: null,
    password2: null
  })

  const removeAllErrors = () => {
    let loginErrors = formErrors;
    for (const key of Object.keys(loginErrors)) {
      loginErrors[key] = false
    }

    let signupErr = signupErrors;
    for (const key of Object.keys(signupErrors)) {
      signupErrors[key] = false
    }
    setFormErrors(loginErrors)
    setSignupErrors(signupErr)
  }

  const handleClose = () => {
    setOpen(false);
  }

  const loadLogin = () => {
    setLoginOrSignup(false);
    removeAllErrors();
  }

  const loadSignup = () => {
    setLoginOrSignup(true);
    removeAllErrors();
  }

  const loginCustomer = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')
    const password = data.get('password')

    formErrors.error = false;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormErrors(prevState => { return { ...prevState, email: true } })
      formErrors.error = true
    }
    if (!/\S+/.test(password)) {
      setFormErrors(prevState => { return { ...prevState, password: true } })
      formErrors.error = true
    }

    if (!formErrors.error) {      
      try {
        let param = {
          'email': email,
          'password': password
        }


        const loginResults = await custAPI.login(param)
        //const loginResults = await CustomerAPI.pp()
        console.log(loginResults)
        console.log(loginResults.data)
        const customer = loginResults.data[0];
        setCustomer(loginResults.data)
        setLoggedIn(true)
        handleClose()
        


        
      }
      catch(error) {
        console.error(error)   
        if (error.response?.status === 400) {
          setLogInFail(true)
        }     
      }
    }
  }  

  const signupCustomer = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName')
    const lastName = data.get('lastName')
    const email = data.get('email')
    const mobileNo = data.get('mobileNo')
    const password1 = data.get('password1')
    const password2 = data.get('password2')

    signupErrors.error = false;

    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(firstName)) {
      setSignupErrors(prevState => { return { ...prevState, firstName: true } })
      signupErrors.error = true
    }
    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(lastName)) {
      setSignupErrors(prevState => { return { ...prevState, lastName: true } })
      signupErrors.error = true
    }
    if (!/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(email)) {
      setSignupErrors(prevState => { return { ...prevState, email: true } })
      signupErrors.error = true
    }
    if (!/\S+/.test(password1) || password1.length < 8) {
      setSignupErrors(prevState => { return { ...prevState, password1: true } })
      signupErrors.error = true
    }
    if (password1 !== password2) {
      setFormErrors(prevState => { return { ...prevState, password2: true } })
      formErrors.error = true
    }
    if (mobileNo && mobileNo[0] === '+') {
      if (/\D+/.test(mobileNo.slice(1)) || mobileNo.length < 9) {
        setSignupErrors(prevState => { return { ...prevState, mobileNo: true } })
        signupErrors.error = true
      }
    }
    else if (mobileNo) {
      if (/\D+/.test(mobileNo) || mobileNo.length < 9) {
        setSignupErrors(prevState => { return { ...prevState, mobileNo: true } })
        signupErrors.error = true
      }
    }
    else {
      setSignupErrors(prevState => { return { ...prevState, mobileNo: true } })
      signupErrors.error = true
    }

    if (!signupErrors.error) {
      const body = {
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "password1": password1,
        "password2": password2,
        "mobileNo": mobileNo
      }
      try {
        
      }
      catch(error) {
        console.error(error)
      }
    }
  };


  return (
    <StandardModal open={open} onClose={handleClose} aria-labelledby="login modal" maxWidth='lg'>
      <ModalTitle title='TastyTreats!' close={handleClose} />
      <ModalBody justifyContent='center'>

        <FlexBox sx={{ mb:'2rem'}} justifyContent='center'>
          <FlexBox onClick={loadLogin}
          sx={{ pl:'1rem', pr: '1rem', cursor:'pointer', 
            backgroundColor: loginOrSignup? 'tastytreats.lightGrey': 'tastytreats.mediumBlue', 
            color: loginOrSignup? 'black' : 'white'}}>
            Sign in
          </FlexBox>
          <FlexBox onClick={loadSignup}
          sx={{ pl:'1rem', pr: '1rem', cursor:'pointer', 
            backgroundColor: loginOrSignup? 'tastytreats.mediumBlue' : 'tastytreats.lightGrey', 
            color:loginOrSignup? 'white' : 'black'}}>
            Sign up
          </FlexBox>
        </FlexBox>

        <FlexBox sx={{ minHeight:'50vh' }} justify={'center'}>
          
          <form component="form" noValidate onSubmit={loginCustomer}>
          {!loginOrSignup &&
          <FlexBox direction={'column'} alignItems={'center'} >
            <TextField
              name="email"
              required
              label="Email"
              sx={{ mb: 4, width: '100%', minWidth: '20vw' }}
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
              sx={{ mb: 2, width: '100%', minWidth: '20vw' }}
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
            <FlexBox>
              <Button type='submit' variant="contained" sx={{ mt:'7rem' }}>
                Log in
              </Button>
            </FlexBox>

          </FlexBox>
          }
          </form>

          {loginOrSignup &&
          <FlexBox justify={'center'} >

            <form component="form" noValidate onSubmit={signupCustomer}>
              <Grid container spacing={2} sx={{height:'40vh'}}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    inputProps={{ maxLength: 50 }}
                    onChange={() => {
                      signupErrors.firstName && setSignupErrors(prevState => { return { ...prevState, firstName: false } })
                    }}
                    error={signupErrors.firstName}
                    helperText={signupErrors.firstName ? 'Must be a valid firstname.' : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    inputProps={{ maxLength: 50 }}
                    onChange={() => {
                      signupErrors.lastName && setSignupErrors(prevState => { return { ...prevState, lastName: false } })
                    }}
                    error={signupErrors.lastName}
                    helperText={signupErrors.lastName ? 'Must be a valid lastname.' : ''}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    inputProps={{ maxLength: 50 }}
                    onChange={() => {
                      signupErrors.email && setSignupErrors(prevState => { return { ...prevState, email: false } })
                    }}
                    error={signupErrors.email}
                    helperText={signupErrors.email ? 'Invalid email.' : ''}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="mobileNo"
                    required={true}
                    fullWidth
                    id="mobileNo"
                    label="Mobile number"
                    type="tel"
                    inputProps={{ maxLength: 20 }}
                    onChange={() => {
                      signupErrors.mobileNo && setSignupErrors(prevState => { return { ...prevState, mobileNo: false } })
                    }}
                    error={signupErrors.mobileNo}
                    helperText={signupErrors.mobileNo ? 'Must be a valid mobile number.' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="password1"
                    required
                    fullWidth
                    type="password"
                    id="password1"
                    label="Password"
                    inputProps={{ maxLength: 50 }}
                    onChange={() => {
                      signupErrors.password1 && setSignupErrors(prevState => { return { ...prevState, password1: false } })
                    }}
                    error={signupErrors.password1}
                    helperText={signupErrors.password1 ? 'Cannot be empty. Must contain at least 8 characters.' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="password2"
                    required
                    fullWidth
                    type="password"
                    id="password2"
                    label="Confirm password"
                    inputProps={{ maxLength: 50 }}
                    onChange={() => {
                      signupErrors.password2 && setSignupErrors(prevState => { return { ...prevState, password2: false } })
                    }}
                    error={signupErrors.password2}
                    helperText={signupErrors.password2 ? 'Passwords must match.' : ''}
                  />
                </Grid>
              </Grid> 

              <FlexBox direction='column' alignItems={'center'}>
                  <Button type='submit'
                    variant="contained" color="success"
                  >
                    Sign up
                  </Button>                
              </FlexBox>
            </form>         
              
          </FlexBox>
          }        
        </FlexBox>        
      </ModalBody>
    </StandardModal>
  )
}

export default LogInModal