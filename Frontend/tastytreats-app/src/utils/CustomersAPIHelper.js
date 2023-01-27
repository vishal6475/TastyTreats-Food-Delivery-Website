import * as axios from "axios";

export default class CustomersAPI {
  constructor() {
    this.api_token = null;
    this.client = null;
    this.api_url = 'http://127.0.0.1:8080/v1';
  }

  init = () => {

    let headers = {
      Accept: "application/json",
    };

    this.client = axios.create({
      baseURL: this.api_url,
      timeout: 31000,
      headers: headers,
    });

    return this.client;
  };

  login = (params) => {
    return this.init().get("/customers/login", {params: params});
  };

  registerCustomer = (body) => {
    return this.init().post("/customers", body);
  }; 

  updateCustomer = (customer_id, body) => {
    return this.init().put(`/customers/${customer_id}`, body);
  }; 

  getAddresses = (customer_id) => {
    return this.init().get(`/customers/${customer_id}/addresses`);
  }; 

  addAddress = (customer_id, body) => {
    return this.init().put(`/customers/${customer_id}/addresses`, body);
  }; 

  updateAddress = (customer_id, params, body) => {
    return this.init().put(`/customers/${customer_id}/addresses`, {params:params, body:body});
  };   

  getCards = (customer_id) => {
    return this.init().get(`/customers/${customer_id}/cards`);
  };   

  addCard = (customer_id, body) => {
    return this.init().put(`/customers/${customer_id}/cards`, body);
  }; 


}