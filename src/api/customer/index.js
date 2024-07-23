import BaseAPI from "../BaseAPI.js";

class CustomerApi extends BaseAPI {

  static MODEL_NAME = "customer";
  static MODEL_NAME_PLURAL = "customers";

  constructor() {
    super(CustomerApi.MODEL_NAME, CustomerApi.MODEL_NAME_PLURAL);
  }

}

const customerApi = new CustomerApi();
export default customerApi;
