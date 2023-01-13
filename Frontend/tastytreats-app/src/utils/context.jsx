import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const StoreContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginOrSignup, setLoginOrSignup] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [address, setAddress] = useState("");
  const [card, setCard] = useState([]);
  const [logInModal, setLogInModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);

  const states = {
    redirect: [redirect, setRedirect],
    login: [loggedIn, setLoggedIn],
    customer: [customer, setCustomer],
    card: [card, setCard],
    address: [address, setAddress],
    logInModal: [logInModal, setLogInModal],
    loginOrSignup: [loginOrSignup, setLoginOrSignup],
    addItemModal: [openAddModal, setOpenAddModal],
    itemToAdd: [itemToAdd, setItemToAdd]
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