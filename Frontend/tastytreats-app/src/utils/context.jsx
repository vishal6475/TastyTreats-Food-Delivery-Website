import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const StoreContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginOrSignup, setLoginOrSignup] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [address, setAddress] = useState({unitNo: '', addr1: '', 
                                          leaveAtDoor: false, ins: '', isSavedAddress: false });
  const [storesList, setStoresList] = useState([]);
  const [orgChippedStores, setOrgChippedStores] = useState([]);
  const [allStoresList, setAllStoresList] = useState([]);
  const [closedStoresList, setClosedStoresList] = useState([]);
  const [card, setCard] = useState([]);
  const [storeDetails, setStoreDetails] = useState(null);
  const [logInModal, setLogInModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [itemToAddQuantity, setItemToAddQuantity] = useState(1);
  const [itemOrgQuantity, setItemOrgQuantity] = useState(1);
  const [cartItems, setCartItems] = useState(null);
  const [hasItemsChanged, setHasItemsChanged] = useState(false);
  const [cardOrder, setCardOrder] = useState({name: '', number: '', expiry: '', cvv: ''});
  const [fromCheckout, setFromCheckout] = useState(false);
  const [isSearched, setIsSearched] = useState(0);
  const [searchedItems, setSearchedItems] = useState('');  
  const [isChipSearched, setIsChipSearched]  = useState(0);
  const [chippedItems, setChippedItems] = useState([]);
  const [completedOrder, setCompletedOrder] = useState(null);

  const states = {
    redirect: [redirect, setRedirect],
    login: [loggedIn, setLoggedIn],
    customer: [customer, setCustomer],
    card: [card, setCard],
    address: [address, setAddress],
    storesList: [storesList, setStoresList],
    orgChippedStores: [orgChippedStores, setOrgChippedStores],
    allStoresList: [allStoresList, setAllStoresList],
    closedStoresList: [closedStoresList, setClosedStoresList],
    logInModal: [logInModal, setLogInModal],
    loginOrSignup: [loginOrSignup, setLoginOrSignup],
    addItemModal: [openAddModal, setOpenAddModal],
    itemToAdd: [itemToAdd, setItemToAdd],
    itemToAddQuantity: [itemToAddQuantity, setItemToAddQuantity],
    itemOrgQuantity: [itemOrgQuantity, setItemOrgQuantity],
    cartItems: [cartItems, setCartItems],
    hasItemsChanged: [hasItemsChanged, setHasItemsChanged],
    storeDetails: [storeDetails, setStoreDetails],
    cardOrder: [cardOrder, setCardOrder],
    fromCheckout: [fromCheckout, setFromCheckout],
    isSearched: [isSearched, setIsSearched],
    searchedItems: [searchedItems, setSearchedItems],
    isChipSearched: [isChipSearched, setIsChipSearched],
    chippedItems: [chippedItems, setChippedItems],
    completedOrder: [completedOrder, setCompletedOrder]
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