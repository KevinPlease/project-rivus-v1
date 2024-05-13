import BaseAPI from "../BaseAPI.js";

class ClientAPI extends BaseAPI {

  static MODEL_NAME = "client";
  static MODEL_NAME_PLURAL = "clients";

  constructor() {
    super(ClientAPI.MODEL_NAME, ClientAPI.MODEL_NAME_PLURAL);
  }

}

const clientAPI = new ClientAPI();
export default clientAPI;
