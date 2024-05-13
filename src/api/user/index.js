import { ExString } from "server/src/shared/String";
import BaseAPI from "../BaseAPI.js";

class UserAPI extends BaseAPI {

  static MODEL_NAME = "user";
  static MODEL_NAME_PLURAL = "user";
  
  static AUTH = "auth";

  constructor() {
    super(UserAPI.MODEL_NAME, UserAPI.MODEL_NAME_PLURAL);

    this.api[UserAPI.AUTH] = UserAPI.AUTH + "/" + UserAPI.MODEL_NAME;
  }

  async signIn(username, password) {
    const data = { username, password };
    const response =  await this.network.callPostAPI({}, this.api.auth, null, data);
    if (response.status === "failure") return;

    return response.data.token;
  }

  updateSelf(authInfo, data) {
    return this.network.callPutAPI(authInfo, this.api.auth, data);
  }

  async changePassword(authInfo, oldPassword, newPassword) {
    const data = { oldPassword, newPassword };
    const response =  await this.network.callPutAPI(authInfo, this.api.auth, data);
    if (response.status === "failure") return false;

    return true;
  }
  
  async getUser(token) {
    const tokenQuery = { token };
    const response = await this.network.callGetAPI({}, this.api.auth, tokenQuery);
    if (response.status === "failure") return;

    const user = response.data[this.api.single].model;
    user.domain = ExString.capitalize(ExString.sinceAfterLast(user.repository, "@"));
    user.branch = ExString.betweenFirstTwo(user.repository, "/", "@");
    return user;
  }

}

const userAPI = new UserAPI();
export default userAPI;
