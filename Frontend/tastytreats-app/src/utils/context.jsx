import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const StoreContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginOrSignup, setLoginOrSignup] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [address, setAddress] = useState({unitNo: null, addr1: '84 Albert Road, Strathfield NSW, Australia'});
  const [card, setCard] = useState([]);
  const [storeID, setStoreID] = useState(0);
  const [logInModal, setLogInModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [itemToAddQuantity, setItemToAddQuantity] = useState(1);
  const [itemOrgQuantity, setItemOrgQuantity] = useState(1);
  const [cartItems, setCartItems] = useState(null);
  const [cardOrder, setCardOrder] = useState(null);
  const [fromCheckout, setFromCheckout] = useState(false);

  const states = {
    redirect: [redirect, setRedirect],
    login: [loggedIn, setLoggedIn],
    customer: [customer, setCustomer],
    card: [card, setCard],
    address: [address, setAddress],
    logInModal: [logInModal, setLogInModal],
    loginOrSignup: [loginOrSignup, setLoginOrSignup],
    addItemModal: [openAddModal, setOpenAddModal],
    itemToAdd: [itemToAdd, setItemToAdd],
    itemToAddQuantity: [itemToAddQuantity, setItemToAddQuantity],
    itemOrgQuantity: [itemOrgQuantity, setItemOrgQuantity],
    cartItems: [cartItems, setCartItems],
    storeID: [storeID, setStoreID],
    cardOrder: [cardOrder, setCardOrder],
    fromCheckout: [fromCheckout, setFromCheckout]
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