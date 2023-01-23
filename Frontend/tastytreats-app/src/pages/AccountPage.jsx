import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../utils/context';
import { useNavigate, useLocation } from 'react-router';
import { PageContainer, FlexBox } from '../components/styles/layouts'
import AccountSideBar from '../components/account/AccountSideBar'
import AccountMainScreen from '../components/account/AccountMainScreen'

const AccountScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(StoreContext);
  const [loggedIn] = context.login;
  const [accountPage, setAccountPage] = useState('account');

  useEffect(() => {
    if (!loggedIn) {
      navigate('/') // if someone typed /account in url without login
    }
  }, [])

  return (
    <PageContainer direction='row' 
    sx={{ minWidth:'100%', minHeight:'93vh', backgroundColor: 'tastytreats.backgroundGrey', justifyContent:'center' }} >
      <FlexBox sx={{width:'80vw'}} >
        <AccountSideBar accountPage={accountPage} setAccountPage={setAccountPage}/>
        <AccountMainScreen accountPage={accountPage} changePage={setAccountPage}/>
      </FlexBox>
    </PageContainer>
  )
}

export default AccountScreen