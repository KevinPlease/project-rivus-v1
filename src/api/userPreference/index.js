import BaseAPI from "../BaseAPI.js";

class UserPreferenceApi extends BaseAPI {
  static MODEL_NAME = "userPreference";
  static MODEL_NAME_PLURAL = "userPreferences";

  constructor() {
    super(UserPreferenceApi.MODEL_NAME, UserPreferenceApi.MODEL_NAME_PLURAL);
  }
}

const userPreferenceApi = new UserPreferenceApi();
export default userPreferenceApi;
