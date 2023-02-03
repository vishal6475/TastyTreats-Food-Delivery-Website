import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../utils/context';
import { StandardModal, ModalBody, ModalTitle } from '../styles/modals';
import { FlexBox } from '../styles/layouts';
import { Button, TextField, Typography, Grid } from '@mui/material';
import CustomersAPI from "../../utils/CustomersAPIHelper";

const custAPI = new CustomersAPI();

const LogInModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(StoreContext);
  const [nextPage, setRedirect] = context.redirect;
  const [loggedIn, setLoggedIn] = context.login;
  const [open, setOpen] = context.logInModal;
  const [logInFail, setLogInFail] = useState(null);
  const [registerFail, setRegisterFail] = useState(null);
  const [loginOrSignup, setLoginOrSignup] = context.loginOrSignup;
  const [customer, setCustomer] = context.customer;
  const [fromCheckout, setFromCheckout] = context.fromCheckout;
  const [address, setAddress] = context.address;  
  
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
    setRegisterFail(false)
    removeAllErrors();
  }

  const loadSignup = () => {
    setLoginOrSignup(true);
    setLogInFail(false)
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
        setCustomer(loginResults.data)
        setLoggedIn(true)
        handleClose()
        if (fromCheckout) navigate('/checkout'); 
        
        if (location.pathname === '/' && address.addr1.length === 0) {
          for (let i=0; i < loginResults.data.addresses.length; i++) {
            if (loginResults.data.addresses[i].primary1 === 'Y') {
              setAddress(prev => {return {...prev, addr1: loginResults.data.addresses[i].addr_1, 
                                                   unitNo: loginResults.data.addresses[i].unit_no}})
              navigate('/home')
            }
          }
        }
        
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
    //const mobileNo = data.get('mobileNo')
    const password1 = data.get('password1')
    //const password2 = data.get('password2')

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
    /*
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
    }*/

    if (!signupErrors.error) {
      const body = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password1
      }
      try {
 
        const registerResults = await custAPI.registerCustomer(body)
        let newCustomer = registerResults.data
        newCustomer.first_name = registerResults.data.firstName
        newCustomer.last_name = registerResults.data.lastName
        setCustomer(newCustomer)
        setLoggedIn(true)
        handleClose()        
        if (fromCheckout) navigate('/checkout'); 
        
      }
      catch(error) {
        console.error(error)               
        if (error.response?.data?.code === 409) {
          setRegisterFail(true)
        }   
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
            borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px', border: 'transparent',
            color: loginOrSignup? 'black' : 'white'}}>
            Sign in
          </FlexBox>
          <FlexBox onClick={loadSignup}
          sx={{ pl:'1rem', pr: '1rem', cursor:'pointer', 
            backgroundColor: loginOrSignup? 'tastytreats.mediumBlue' : 'tastytreats.lightGrey', 
            borderTopRightRadius: '7px', borderBottomRightRadius: '7px', border: 'transparent',
            color:loginOrSignup? 'white' : 'black'}}>
            Sign up
          </FlexBox>
        </FlexBox>

        <FlexBox sx={{ minHeight:'40vh' }} justify={'center'}>
          
          <form component="form" noValidate onSubmit={loginCustomer}>
          {!loginOrSignup &&
          <FlexBox direction={'column'} alignItems={'center'} >
            <TextField
              name="email"
              required
              label="Email"
              sx={{ mb: 2, width: '100%', minWidth: '20vw' }}
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
            
            <Typography variant='subtitle2' sx={{ color: 'error.main', minHeight:'5vh', mt:'-0.7rem'}}>
              {logInFail && 'Incorrect password or email. Please try again.'}
            </Typography>
            
            <FlexBox>
              <Button type='submit' variant="contained" sx={{ mt:'0' }}>
                Log in
              </Button>
            </FlexBox>

          </FlexBox>
          }
          </form>

          {loginOrSignup &&
          <FlexBox justify={'center'} >

            <form component="form" noValidate onSubmit={signupCustomer}>
              <Grid container spacing={2} >
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
                      setRegisterFail(false)
                    }}
                    error={signupErrors.email}
                    helperText={signupErrors.email ? 'Invalid email.' : ''}
                  />
                </Grid>
                {/*
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
                  */}
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
                {/* 
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
                */}
              </Grid> 

              <Typography variant='subtitle2' sx={{ color: 'error.main', minHeight:'5vh', mt:'0.4rem'}}>
                {registerFail && 'This email is already registered. Please use another email address.'}
              </Typography>

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