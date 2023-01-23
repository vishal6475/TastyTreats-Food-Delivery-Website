import React from 'react';
import ContextProvider from './utils/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TastyTreatsAppBar from './components/layout/AppBar';
import FirstPage from './pages/FirstPage';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import StoreMenuPage from './pages/StoreMenuPage';
import LogInModal from './components/modals/LogInModal';
//import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderCompletedPage from './pages/OrderCompletedPage';
import Footer from './components/layout/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

const theme = createTheme({
  palette: {
    tastytreats: {
      title: '#ebebe0',
      layout: 'lavenderblush',
      purple: 'rgb(156, 39, 176)',
      dark_purple: 'rgb(114 30 129)',
      dull: '#b5b5b5',
      grey: '#757575',
      backgroundGrey: '#F0F0F0',
      darkBlack: '#181414',
      lightBlack: '#201c1c',
      lightBlue: '#08acf4',
      lightGrey: '#dedcdd',
      mediumBlue: '#339ECC',
      mediumBrown: '#CC6133',
      mediumGreen: '#4BB46F'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ContextProvider>
        <Router>
          <TastyTreatsAppBar />
          <div>            
            <Routes>
              <Route path='/' element={<FirstPage/>}/>
              <Route path='/home' element={<HomePage/>}/>
              <Route exact path='/myaccount' element={<AccountPage/>}/>
              <Route path='/store/:s_id' element={<StoreMenuPage/>}/>
              <Route exact path='/unauthorized' element={<UnauthorizedPage/>}/>
              <Route exact path='/checkout' element={<CheckoutPage/>}/>
              <Route path='/order/:o_id' element={<OrderCompletedPage/>}/>
            </Routes>
          </div>
          <LogInModal/>
        </Router>
      </ContextProvider>
    </ThemeProvider>
  );
}

export default App;
