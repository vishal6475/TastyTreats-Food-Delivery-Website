import React from 'react';
import ContextProvider from './utils/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TastyTreatsAppBar from './components/layout/AppBar';
import FirstPage from './pages/FirstPage';
import HomePage from './pages/HomePage';
import LogInModal from './components/modals/LogInModal';
//import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
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
      darkBlack: '#181414',
      lightBlack: '#201c1c',
      lightBlue: '#08acf4',
      lightGrey: '#dedcdd',
      mediumBlue: '#339ECC',
      mediumBrown: '#CC6133',
      mediumGreen: '#4BB46F'
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
              <Route exact path='/unauthorized' element={<UnauthorizedPage/>}/>
            </Routes>
          </div>
          <LogInModal/>
        </Router>
      </ContextProvider>
    </ThemeProvider>
  );
}

export default App;
