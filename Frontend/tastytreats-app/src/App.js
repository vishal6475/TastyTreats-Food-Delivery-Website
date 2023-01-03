import React from 'react';
import ContextProvider from './utils/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TastyTreatsAppBar from './components/layout/AppBar';
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
      title: 'lightsalmon',
      layout: 'lavenderblush',
      purple: 'rgb(156, 39, 176)',
      dark_purple: 'rgb(114 30 129)',
      dull: '#b5b5b5',
      grey: '#757575'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ContextProvider>
        <Router>
          <TastyTreatsAppBar />
            <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route exact path='/unauthorized' element={<UnauthorizedPage/>}/>
            </Routes>
          <Footer />
          <LogInModal/>
        </Router>
      </ContextProvider>
    </ThemeProvider>
  );
}

export default App;
