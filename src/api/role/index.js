import BaseAPI from "../BaseAPI.js";

class RoleApi extends BaseAPI {

  static MODEL_NAME = "role";
  static MODEL_NAME_PLURAL = "roles";

  constructor() {
    super(RoleApi.MODEL_NAME, RoleApi.MODEL_NAME_PLURAL);
  }

}

const roleApi = new RoleApi();
export default roleApi;
