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


}