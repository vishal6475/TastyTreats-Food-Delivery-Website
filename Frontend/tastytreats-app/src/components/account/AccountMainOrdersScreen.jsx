import { useContext, useEffect, useState } from "react"
import { styled } from '@mui/material/styles';
import { StoreContext } from '../../utils/context';
import { FlexBox } from "../styles/layouts"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";


import OrdersAPI from "../../utils/OrdersAPIHelper";
const orderAPI = new OrdersAPI();

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
  

  const fetchOrders = async () => {
    let params = {
      customer_id: customer.id
    }
    const orderResponse = await orderAPI.getOrders(params)
    console.log(orderResponse.data)
  }
  
  useEffect(() => {
    fetchOrders()
  }, [])

  
  return (
    <FlexBox direction='column' >
      {allOrders.map((order, idx) => {
        <FlexBox key={idx}>
          
        </FlexBox>

      })

      }
    </FlexBox>
  )
}

export default AccountMainOrdersScreen
