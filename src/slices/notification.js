import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    formDetails: {}
};

const reducers = {
    addNotification(state, action) {
        state.notifications.push(action.payload);
    },
    addNotifications(state, action) {
        const newNotifications = [...state.notifications];

        for (const data of action.payload.models) {
            const existingNotificationIndx = state.notifications.findIndex(notif => notif._id === data._id);
            if (existingNotificationIndx !== -1) {
                newNotifications.splice(existingNotificationIndx, 1, data);
            } else {
                newNotifications.unshift(data);
            }
        }

        state.formDetails = action.payload.formDetails;
        state.notifications = newNotifications;
    },
    setNotifications(state, action) {
        state.formDetails = action.payload.formDetails;
        state.notifications = action.payload.models;
    },
    markAs(isRead, state, action) {
        const newNotifications = [...state.notifications];
        const notificationId = action.payload._id;
        const notification = newNotifications.find(notif => notif._id === notificationId);
        if (notification) {
            notification.isRead = isRead;
        }
        state.notifications = newNotifications;
    },
    markAsRead(state, action) {
        reducers.markAs(true, state, action);
    },
    markAsUnread(state, action) {
        reducers.markAs(false, state, action);
    }
};

export const slice = createSlice({
    name: "notification",
    initialState,
    reducers
});

export const { reducer } = slice;
export const { addNotification, addNotifications, setNotifications, markAsRead, markAsUnread } = slice.actions;
