import { useContext, useEffect, useState, useRef } from 'react';
import { fileToDataUrl } from '../../utils/helpers';
import { StoreContext } from '../../utils/context';
import AccountUpdatedModal from './modals/AccountUpdatedModal'
import { PageContainer, FlexBox } from '../styles/layouts'
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


import CustomersAPI from "../../utils/CustomersAPIHelper";
const custAPI = new CustomersAPI();


const ImageHolder = styled(Button)`
  border: 1px solid black;
  cursor: pointer;
  height:100%;
  width:100%;
  min-height: 35vh;
  max-height: 35vh;
  max-width: 350px;
  background-color: ${({ theme }) => theme.palette.tastytreats.dull};
`

const Image = styled('img')`
  max-height: 35vh;
  max-width: 100%;
`

const ToggleGrid = styled(Grid)`
  display: ${({ show }) => show ? 'initial' : 'none'};
`

const AccountDetailsPage = ({ change, setChange }) => {
  const context = useContext(StoreContext);
  const ref = useRef(null);
  
  const [customer, setcustomer] = context.customer;
  const [OpenModal, setOpenModal] = useState(false);
  const [imgUpload, setImageUpload] = useState(false);
  const [changeProfilePic, setChangeProfilePic] = useState(false);
  const [changeBasics, setChangeBasics] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    error: false,
    firstName: null,
    lastName: null,
    mobile: null,
    email: null,
    password: null
  })

  const handleImage = async (event) => {
    try {
      setChangeProfilePic(true)
      const imageFile = event.target.files[0]
      const imageBlob = await fileToDataUrl(imageFile)
      setImageUpload(imageBlob)
    }
    catch (error) {
      console.log(error)
    }
  }

  const scrollTo = () => {
    ref?.current?.scrollIntoView()
  }

  const cancelUpdatePic = () => {
    setChangeProfilePic(false)
    setImageUpload(false)
  }

  const updateProfilePic = async () => {
    try {
      setChangeProfilePic(false)
      const body = {
        profile_pic: imgUpload
      }
      const response = await custAPI.updateCustomer(customer.id, body)
      console.log(response.data)
      setcustomer((prev) => {return {...prev, profile_pic: imgUpload }})

    } catch (error) {
      console.log(error)
    }    
  }

  const cancelUpdateEmail = () => {
    setChangeEmail(false)
    setFormErrors(prevState => { return { ...prevState, email: false, error: false } })
  }

  const updateEmail = async () => {

    const email = document.getElementById('email').value
    console.log(email)

    formErrors.error = false;
    
    if (changeEmail && !/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(email)) {
      setFormErrors(prevState => { return { ...prevState, email: true } })
      formErrors.error = true
    } else {
      try {
        const body = {
          email: email
        }
        const response = await custAPI.updateCustomer(customer.id, body)
        console.log(response.data)
        setcustomer((prev) => {return {...prev, email: email }})  
        setChangeEmail(false)   
      }
      catch (error) {
        if (error.response?.status === 400) {
          setEmailExistsError(true)
        }
        console.log(error)
      }
    }          
  }  

  const cancelUpdateDetails = () => {
    setChangeBasics(false)
    setFormErrors(prevState => { return { ...prevState, firstName: false, lastName: false, mobile: false,
      password: false, error: false } })
  }

  const updateDetails = async () => {
    
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const mobile = document.getElementById('mobile').value
    const password = document.getElementById('password').value

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
    if (password.length > 0 && password.length < 8) {
      setFormErrors(prevState => { return { ...prevState, password: true } })
      formErrors.error = true
     }
    
    if (!formErrors.error) {
      try {
        let body = {
          firstName: firstName,
          lastName: lastName,
          mobile_no: mobile
        }
        if (password.length > 0) {
          body.password = password
        }
        console.log(body)
        const response = await custAPI.updateCustomer(customer.id, body)
        console.log(response)
        setcustomer((prev) => {return {...prev, first_name: firstName, last_name: lastName, mobile_no: mobile,password: password }}) 
        setChangeBasics(false)
      }
      catch (error) {
        console.log(error)
      }
    }
  };

  useEffect(() => {
       setChange(false)
    console.log(customer)
  }, [])

  return (
    <FlexBox direction='column' >
        <FlexBox sx={{justifyContent:'center'}} >      
          {/* Account image upload */}
          <ImageHolder component='label'>
            <input
              hidden type="file" name="profilePicture"
              id="profilePicture" label="profilePicture" onChange={handleImage}
            />
            {(() => {
              if (customer.profile_pic && !imgUpload) {
                return (
                  <Image
                    src={customer.profile_pic}
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
        </FlexBox>
        
        <FlexBox sx={{ height:'5vh', justifyContent:'center' }}>
        {changeProfilePic && 
        <FlexBox>
          <Button variant="contained" onClick={cancelUpdatePic}
            sx={{ width:'14vw', minWidth:'140px', height:'5vh', m:'1rem 10px 1rem auto', fontSize:'1.1rem', 
            color: 'white', backgroundColor: 'tastytreats.dull', 
            '&:hover':{color:'white', backgroundColor: 'tastytreats.mediumGrey'} }} >
            Cancel
          </Button>
          <Button variant="contained" onClick={updateProfilePic} 
            sx={{ width:'14vw', minWidth:'140px', height:'5vh', m:'1rem auto 1rem 10px', fontSize:'1.1rem', 
            backgroundColor: 'tastytreats.lightBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
            Save image
          </Button>
        </FlexBox>
        }
        </FlexBox>
        
      <InfoHeader title='Account basics:' sx={{ mt:'2rem' }} />
      <Grid component="form" container spacing={2} sx={{ mt: 0 }}>

        <Grid item xs={5} sm={5} md={4} sx={{ height:'58px'}} >
          <Typography sx={{ fontWeight:'bold' }} >
            First Name:
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={4}>

          {!changeBasics &&          
          <Typography color="text.secondary" sx={{ fontWeight:'bold' }} >
            {customer.first_name}
          </Typography>
          }
          
          {changeBasics &&
          <TextField
            size="small"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="Change first name"
            inputProps={{ maxLength: 50 }}
            defaultValue={customer.first_name}
            onChange={() => {
              formErrors.firstName && setFormErrors(prevState => { return { ...prevState, firstName: false } })
            }}
            error={formErrors.firstName}
            helperText={formErrors.firstName ? 'Must be a valid firstname.' : ''}
          />
          }


        </Grid>

        <Grid item xs={1} sm={1} md={4}>
        </Grid>
        
        <Grid item xs={5} sm={5} md={4} sx={{ height:'58px'}} >
          <Typography sx={{ fontWeight:'bold' }}>
            Last Name:
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={4}>         

          {!changeBasics &&          
          <Typography color="text.secondary" sx={{ fontWeight:'bold' }}>
            {customer.last_name}
          </Typography>
          }
          {changeBasics &&      
          <TextField
            size="small"
            name="lastName"
            required
            fullWidth
            id="lastName"
            label="Change last name"
            inputProps={{ maxLength: 50 }}
            defaultValue={customer.last_name}
            onChange={() => {
              formErrors.lastName && setFormErrors(prevState => { return { ...prevState, lastName: false } })
            }}
            error={formErrors.lastName}
            helperText={formErrors.lastName ? 'Must be a valid lastName.' : ''}
          />
          }
        </Grid>

        <Grid item xs={1} sm={1} md={4}>
        </Grid>        
        
        <Grid item xs={5} sm={5} md={4} sx={{ height:'58px'}} >
          <Typography sx={{ fontWeight:'bold' }}>
            Mobile:
          </Typography>
        </Grid>
        
        <Grid item xs={6} sm={6} md={4}>

          {!changeBasics &&          
          <Typography color="text.secondary" sx={{ fontWeight:'bold' }}>
            {customer.mobile_no}
          </Typography>
          }
          {changeBasics &&      
          <TextField
            size="small"
            name="mobile"
            fullWidth
            type="tel"
            id="mobile"
            label="Change mobile"
            inputProps={{ maxLength: 17 }}
            defaultValue={customer.mobile_no}
            onChange={() => {
              formErrors.mobile && setFormErrors(prevState => { return { ...prevState, mobile: false } })
            }}
            error={formErrors.mobile}
            helperText={formErrors.mobile ? 'Must be a valid mobile.' : ''}
          />
          }
        </Grid>

        <Grid item xs={1} sm={1} md={4}>
        </Grid>        
        
        <Grid item xs={5} sm={5} md={4} sx={{ height:'58px'}} >
          <Typography sx={{ fontWeight:'bold' }}>
            Password:
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={4}>          

          {!changeBasics &&          
          <Typography color="text.secondary" sx={{ fontWeight:'bold' }}>
            ******
          </Typography>
          }

          {changeBasics &&      
          <TextField
            size="small"
            name="password"
            fullWidth
            type="password"
            id="password"
            label="Change password"
            inputProps={{ maxLength: 50 }}
            onChange={() => {
              formErrors.password && setFormErrors(prevState => { return { ...prevState, password: false } })
            }}
            error={formErrors.password}
            helperText={formErrors.password ? 'Must contain at least 8 characters.' : ''}
          />
          } 
        </Grid>

        <Grid item xs={1} sm={1} md={4}>
        </Grid>
      </Grid>

      {!changeBasics && 
      <Button variant="contained" onClick={() => {setChangeBasics(true)}} 
        sx={{ width:'14vw', minWidth:'140px', height:'5vh', m:'1rem auto 1rem auto', fontSize:'1.1rem', 
        color: 'white', backgroundColor: 'tastytreats.dull', 
        '&:hover':{color:'white', backgroundColor: 'tastytreats.grey'} }} >
        Edit details
      </Button>
      }

      {changeBasics && 
      <FlexBox>
        <Button variant="contained" onClick={cancelUpdateDetails}
          sx={{ width:'14vw', minWidth:'140px', height:'5vh', m:'1rem 10px 1rem auto', fontSize:'1.1rem', 
          color: 'white', backgroundColor: 'tastytreats.dull', 
          '&:hover':{color:'white', backgroundColor: 'tastytreats.mediumGrey'} }} >
          Cancel
        </Button>
        <Button variant="contained" onClick={updateDetails}
          sx={{ width:'14vw', minWidth:'140px', height:'5vh', m:'1rem auto 1rem 10px', fontSize:'1.1rem', 
          backgroundColor: 'tastytreats.lightBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
          Save changes
        </Button>
      </FlexBox>
      }

      <InfoHeader title='Account email:' />
      <Grid container spacing={2} sx={{ mt: 0 }}>

        <Grid item xs={5} sm={5} md={4} sx={{ height:'58px'}} >
          <Typography sx={{ fontWeight:'bold' }}>
            Email:
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={4}>          

          {!changeEmail &&          
          <Typography color="text.secondary" sx={{ fontWeight:'bold' }}>
            {customer.email}
          </Typography>
          }

          {changeEmail &&      
          <TextField
            size="small"
            name="email"
            fullWidth
            type="email"
            id="email"
            label='Change email'            
            defaultValue={customer.email}
            inputProps={{ maxLength: 50}}
            onChange={() => {
              formErrors.email && setFormErrors(prevState => { return { ...prevState, email: false } })
            }}
            error={formErrors.email}
            helperText={formErrors.email ? 'Must be a valid email.' : ''}
          />
          }
        </Grid>

        <Grid item xs={1} sm={1} md={4}>
        </Grid>
      </Grid>

      <FlexBox variant="subtitle2" sx={{ minHeight:'23px', justifyContent:'center', color: 'error.main', mt:'0.3rem' }}>
        {emailExistsError && 'This email ID is already registered.'}
      </FlexBox>

      {!changeEmail && 
      <Button variant="contained" onClick={() => {setChangeEmail(true)}} 
        sx={{ width:'14vw', minWidth:'140px', height:'5vh', m:'0.6rem auto 1rem auto', fontSize:'1.1rem', 
        color: 'white', backgroundColor: 'tastytreats.dull', 
        '&:hover':{color:'white', backgroundColor: 'tastytreats.grey'} }} >
        Edit email
      </Button>
      }

      {changeEmail && 
      <FlexBox>
        <Button variant="contained" onClick={cancelUpdateEmail}
          sx={{ width:'14vw', minWidth:'140px', height:'5vh', m:'0.6rem 10px 1rem auto', fontSize:'1.1rem', 
          color: 'white', backgroundColor: 'tastytreats.dull', 
          '&:hover':{color:'white', backgroundColor: 'tastytreats.mediumGrey'} }} >
          Cancel
        </Button>
        <Button variant="contained" onClick={updateEmail} 
          sx={{ width:'14vw', minWidth:'140px', height:'5vh', m:'0.6rem auto 1rem 10px', fontSize:'1.1rem', 
          backgroundColor: 'tastytreats.lightBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
          Save changes
        </Button>
      </FlexBox>
      }

      <FlexBox sx={{ width:'100%', height:'20px' }} >        
      </FlexBox>

      <AccountUpdatedModal open={OpenModal} setOpen={setOpenModal} />
    </FlexBox>
  )
}

export default AccountDetailsPage