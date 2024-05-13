import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    toast: null
};

const reducers = {
    showLoaderToast(state, action) {
        if (state.toast) toast.dismiss();

        const payload = action.payload;
        state.toast = toast.promise(payload.promise, payload.messages, payload.config);
    }
};

export const slice = createSlice({
    name: "toast",
    initialState,
    reducers
});

export const { reducer } = slice;
export const { showLoaderToast } = slice.actions;
