import { useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { StoreContext } from '../utils/context';
import { Grid, Typography, styled } from '@mui/material'
import StoresAPI from "../utils/StoresAPIHelper";
import StoreCard from '../components/store/StoreCard'

const storeAPI = new StoresAPI();


const StoreMenuPage = () => {
  const { s_id } = useParams();
  const context = useContext(StoreContext);
  const [customer] = context.customer;
  const [storeMenu, setStoreMenu] = useState([]);

  useEffect(() => {
    fetchStoreMenu()
  }, [])

  const fetchStoreMenu = async (event) => { 
    const storeMenuRes = await storeAPI.getStoreById(s_id)
    console.log(storeMenuRes.data)
    setStoreMenu(storeMenuRes.data)
  }


  return (
    <div>

      <div>
        {storeMenu.name}
      </div>

    </div>
  )

}

export default StoreMenuPage