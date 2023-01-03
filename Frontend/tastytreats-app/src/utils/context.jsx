import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const StoreContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [customer, setAccount] = useState(false);
  const [address, setAddress] = useState([]);
  const [card, setCard] = useState([]);
  const [LogInModal, setLogInModal] = useState(false);

  const states = {
    redirect: [redirect, setRedirect],
    login: [loggedIn, setLoggedIn],
    customer: [customer, setAccount],
    card: [card, setCard],
    address: [address, setAddress],
    logInModal: [LogInModal, setLogInModal]
  };

  return (
    <StoreContext.Provider value={states}>
      {children}
    </StoreContext.Provider>
  )
};

ContextProvider.propTypes = {
  children: PropTypes.node,
};

export default ContextProvider;