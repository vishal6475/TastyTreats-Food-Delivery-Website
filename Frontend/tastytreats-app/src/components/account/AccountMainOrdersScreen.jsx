import { useContext, useEffect, useState } from "react"
import { StoreContext } from '../../utils/context';
import { FlexBox } from "../styles/layouts"
import { Grid, Typography, styled, TextField } from '@mui/material'
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import SeeItemsModal from '../modals/SeeItemsModal';

import OrdersAPI from "../../utils/OrdersAPIHelper";
import StoresAPI from "../../utils/StoresAPIHelper";

const orderAPI = new OrdersAPI();
const storeAPI = new StoresAPI();

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

const AccountMainOrdersScreen = ({  }) => {
  const context = useContext(StoreContext);
  const [customer, setcustomer] = context.customer;
  const [allOrders, setAllOrders] = useState([]);
  const [openSeeItems, setOpenSeeItems] = useState(false);
  const [items, setItems] = useState([]);
  

  const fetchOrders = async () => {
    let params = {
      customer_id: customer.id
    }
    const orderResponse = await orderAPI.getOrders(params)

    setAllOrders(orderResponse.data)

    orderResponse.data.map(async (order, idx) => {
      let storeRes = await storeAPI.getStoreById(order.store_id)
      //console.log(storeRes.data)
      orderResponse.data[idx]['store_name'] = storeRes.data.name
      setAllOrders(orderResponse.data)
    })
  }
  
  useEffect(() => {
    fetchOrders()
  }, [])

  const openItemsModal = (items) => {
    setItems(items)
    setOpenSeeItems(true)
  }

  
  return (
    <FlexBox direction='column' >
      {allOrders.map((order, idx) => {
        return <FlexBox key={idx} direction='column'
        sx={{border:'solid', borderColor:'tastytreats.dull', borderWidth:'1px', borderRadius:'15px',
          m:'0 1rem 1rem 1rem', p:'0.5rem 1rem 0.5rem 1rem' }} >
          <Grid container spacing={1}>
            <Grid item xs={12} >
              <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'1.1rem' }} >
              {order.store_name? order.store_name: ''}
              </Typography>
            </Grid>
            

            <Grid item xs={3} >
              <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                Date:
              </Typography>
            </Grid>

            <Grid item xs={9} >
              <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                {formatDate(order.date)}
              </Typography>
            </Grid>

            <Grid item xs={3} >
              <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                Delivery address:
              </Typography>
            </Grid>

            <Grid item xs={9} >
              <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                {order.unit_no.length > 0? order.unit_no.length + ', ' : '' + order.addr_1}
              </Typography>
            </Grid>            

            <Grid item xs={3} >
              <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                Total Amount:
              </Typography>
            </Grid>

            <Grid item xs={2} >
              <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                ${order.total_amount}
              </Typography>
            </Grid>            

            <Grid item xs={2} >
              <Typography sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                Type:
              </Typography>
            </Grid>

            <Grid item xs={5} >
              <Typography color="text.secondary" sx={{ fontWeight:'bold', fontSize:'0.95rem' }} >
                {order.delivery_pickup === 'D'? 'Delivery': 'Pickup'}
              </Typography>
            </Grid>

            <Grid item xs={12} >
              <FlexBox>
                <Button onClick={() => {openItemsModal(order.items)}}
                  sx={{m:'0 auto 0 auto', width:'100px'}} >
                  See items
                </Button>
              </FlexBox>
            </Grid>

          </Grid>
        
      </FlexBox>
      })}
      <SeeItemsModal 
        items={items}
        openSeeItems={openSeeItems} 
        setOpenSeeItems={setOpenSeeItems} />
    </FlexBox>
  )
}

export default AccountMainOrdersScreen
