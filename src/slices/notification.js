import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: []
};

const reducers = {
    addNotification(state, action) {
        state.notifications.push(action.payload);
    },
    addNotifications(state, action) {
        const newNotifications = [...state.notifications];

        for (const data of action.payload) {
            const existingNotificationIndx = state.notifications.findIndex(notif => notif.id === data.id);
            if (existingNotificationIndx !== -1) {
                newNotifications.splice(existingNotificationIndx, 1, data);
            } else {
                newNotifications.unshift(data);
            }
        }

        state.notifications = newNotifications;
        reducers.resetNotifications(state);
    },
    askQuickNotifications(state, action) {
    },
    resetNotifications(state, action) {
    },
    deleteAllNotifications(state, action) {
        state.notifications = [];
    },
};

export const slice = createSlice({
    name: "notification",
    initialState,
    reducers
});

export const { reducer } = slice;
export const { addNotification, deleteAllNotifications, addNotifications, askQuickNotifications, resetNotifications } = slice.actions;
