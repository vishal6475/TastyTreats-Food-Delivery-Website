import { useContext, useEffect, useState } from "react"
import { StoreContext } from '../../utils/context';
import { FlexBox } from "../styles/layouts"
import { Grid, Typography, styled, TextField } from '@mui/material'
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import InfoHeader from './styles/InfoHeader';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UpdateAddressModal from '../modals/UpdateAddressModal';
import {
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api'
import { geocodeByAddress } from 'react-places-autocomplete';

import CustomersAPI from "../../utils/CustomersAPIHelper";
const custAPI = new CustomersAPI();

const MainBox = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PastMainBox = styled('div')`
  display: flex;
  flex-direction: row;
`;

const SaveButtonBox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// code to format the Date Time
const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

function formatDate(datetime) {
  let d = new Date(datetime);
  return d.toLocaleDateString("en-US", dateFormat)
}

const AccountMainAddressScreen = ({  }) => {
  const context = useContext(StoreContext);
  const [customer, setcustomer] = context.customer;
  const [gotNew, setGotNew] = useState(false);
  const [unitNo, setUnitNo] = useState('');
  const [allAddresses, setAllAddresses] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);  
  const [addressToUpdate, setAddressToUpdate] = useState({});

  const [formErrors, setFormErrors] = useState({
    error: false,
    unitNo: false
  })

  const fetchExistingAddresses = async () => {
    try {
    const addrResponse = await custAPI.getAddresses(customer.id)
    setAllAddresses(addrResponse.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchExistingAddresses()
  }, [])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC_MgNdagqfz1e-bpG0Vnxfey8WEOSnzvo',
    libraries: ['places'],
  })

  if (!isLoaded) {
    return <div></div>;
  } 

  const isLetters = (str) => /^[A-Za-z]*$/.test(str);
  const isNumbers = (str) => /^[0-9]*$/.test(str);
  
  const changeUnitNo = (e) => {
    if (isLetters(e.target.value.slice(-1)) || isNumbers(e.target.value.slice(-1)) || e.target.value.slice(-1) === ' '
    || e.target.value.slice(-1) === '/' || e.target.value.slice(-1) === '-') {
      setUnitNo(e.target.value);
      setFormErrors(prevState => { return { ...prevState, unitNo: false } })
    }
  } 

  const gotNewAddress = () => {
    setGotNew(true)
  }

  const cancelAdd = () => {
    setGotNew(false)
    document.getElementById('new-address').value = ''
    setUnitNo('')
  }

  const addAddress = async () => {
    try {
      
      let body = {
        unit_no: unitNo,
        addr_1: document.getElementById('new-address').value  ,
        primary1: 'N'      
      }
      const response = await custAPI.addAddress(customer.id, body)
      console.log(response)
      
      setGotNew(false)
      document.getElementById('new-address').value = ''
      setUnitNo('')

      if (allAddresses.length === 0) body.primary1 = 'Y';
      allAddresses.push(body)
    }
    
    catch (err) {
      console.log(err)
    }
  }

  const handleUpdateAddress = (address, idx) => {
    setAddressToUpdate({id: address.id, idx: idx, unit_no: address.unit_no, addr_1: address.addr_1, primary1: address.primary1})
    setOpenUpdateModal(true)
  }

  
  return (
    <FlexBox direction='column' sx={{ justifyContent:'center' }} >

      <FlexBox sx={{ width:'30vw', m:'0 auto 1rem auto' }} >
        <Autocomplete onPlaceChanged={gotNewAddress} >
          <TextField 
            id='new-address' 
            name="new-address"
            placeholder='Add new address' 
            style={{backgroundColor:'white', minWidth: '30vw'}}
            />
        </Autocomplete>
      </FlexBox>
      {gotNew &&
      <FlexBox direction='column'>
        <FlexBox sx={{ width:'30vw', m:'0 auto 1rem auto', alignItems:'center' }}>
          <Typography sx={{ fontWeight:'bold', width:'8vw', minWidth:'60px' }} >
            Unit No:
          </Typography>

          <TextField
            size="small"
            fullWidth
            id="unitNo"
            placeholder="Enter unit or floor number"
            inputProps={{ maxLength: 50 }}
            onChange={changeUnitNo}
            error={formErrors.unitNo}
            helperText={formErrors.unitNo ? 'Valid unit number includes letters, numbers, space and only these two characters (/, -).' : ''}
          />        
        </FlexBox>   

        <FlexBox direction='row'>
          <Button variant="contained" onClick={cancelAdd}
            sx={{ width:'10vw', minWidth:'140px', height:'5vh', m:'0.6rem 10px 1rem auto', fontSize:'1.1rem', 
            color: 'white', backgroundColor: 'tastytreats.dull', 
            '&:hover':{color:'white', backgroundColor: 'tastytreats.mediumGrey'} }} >
            Cancel
          </Button>
          <Button variant="contained" onClick={addAddress} 
            sx={{ width:'10vw', minWidth:'140px', height:'5vh', m:'0.6rem auto 1rem 10px', fontSize:'1.1rem', 
            backgroundColor: 'tastytreats.lightBlue', '&:hover':{backgroundColor: 'tastytreats.mediumBlue'} }} >
            Add address
          </Button>
        </FlexBox>   
      </FlexBox>   
      }

      <InfoHeader title='Existing addresses:' sx={{ mt:'2rem' }} />

      {allAddresses.map((address, idx) => {
        return  <FlexBox key={idx} direction='column'
                  sx={{border:'solid', borderColor:'tastytreats.dull', borderWidth:'1px', borderRadius:'15px',
                    m:'0 1rem 1rem 1rem', p:'0.5rem 1rem 0.5rem 1rem' }} >
                    <Grid container spacing={2}>
                      <Grid item xs={2} >
                        <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                          Unit No:
                        </Typography>
                      </Grid>

                      <Grid item xs={9} >
                        <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                        {address.unit_no}
                        </Typography>
                      </Grid>

                      <Grid item xs={1} >
                        <IconButton onClick={() => {handleUpdateAddress(address, idx)}}
                          sx={{height:'20px', alignItems:'right', ml:'auto' }} >
                          <EditIcon/>
                        </IconButton>
                      </Grid>

                      <Grid item xs={2} >
                        <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                          Street address:
                        </Typography>
                      </Grid>

                      <Grid item xs={9} >
                        <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                          {address.addr_1}
                        </Typography>
                      </Grid>

                      <Grid item xs={1} >
                      </Grid>

                      <Grid item xs={2} >
                        <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                          Primary address:
                        </Typography>
                      </Grid>

                      <Grid item xs={8} >
                        <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                          {address.primary1 === 'Y'? 'Yes' : 'No'}
                        </Typography>
                      </Grid>

                      <Grid item xs={2} >
                      </Grid>

                    </Grid>
                  
                </FlexBox>
      })}
     
      <UpdateAddressModal 
        openUpdateModal={openUpdateModal} 
        setOpenUpdateModal={setOpenUpdateModal}
        addressToUpdate={addressToUpdate}      
        setAddressToUpdate={setAddressToUpdate}
      />
    </FlexBox>
  )
}

export default AccountMainAddressScreen
