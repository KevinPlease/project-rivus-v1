import { combineReducers } from "@reduxjs/toolkit";

import { reducer as calendarReducer } from "src/slices/calendar";
import { reducer as chatReducer } from "src/slices/chat";
import { reducer as kanbanReducer } from "src/slices/kanban";
import { reducer as mailReducer } from "src/slices/mail";
import { reducer as notificationReducer } from "src/slices/notification";
import { reducer as toastReducer } from "src/slices/toast";
import { reducer as gridFilterReducer } from "src/slices/grid-filters";

export const rootReducer = combineReducers({
  calendar: calendarReducer,
  chat: chatReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
  notification: notificationReducer,
  gridFilters: gridFilterReducer,
  toast: toastReducer
});
