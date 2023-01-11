import * as axios from "axios";

export default class StoresAPI {
  constructor() {
    this.api_token = null;
    this.client = null;
    this.api_url = 'http://127.0.0.1:8081/v1';
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

  getAllStores = () => {
    return this.init().get("/stores");
  };

  getStoreById = (store_id) => {
    return this.init().get(`/stores/${store_id}`);
  };


}