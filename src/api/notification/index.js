import BaseAPI from "../BaseAPI.js";

class NotificationApi extends BaseAPI {
  static MODEL_NAME = "notification";
  static MODEL_NAME_PLURAL = "notifications";

  constructor() {
    super(NotificationApi.MODEL_NAME, NotificationApi.MODEL_NAME_PLURAL);
  }
}

const notificationApi = new NotificationApi();
export default notificationApi;
