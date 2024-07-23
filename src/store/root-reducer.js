import { combineReducers } from "@reduxjs/toolkit";

import { reducer as notificationReducer } from "src/slices/notification";
import { reducer as toastReducer } from "src/slices/toast";
import { reducer as gridFilterReducer } from "src/slices/grid-filters";

export const rootReducer = combineReducers({
  notification: notificationReducer,
  gridFilters: gridFilterReducer,
  toast: toastReducer
});
