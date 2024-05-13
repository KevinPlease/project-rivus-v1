import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current: "",
  filters: {},
  pageNr: 0,
  itemsPerPage: 10
};

const reducers = {
  setFilters(state, action) {
    const payload = action.payload;
    state.filters = payload.filters;
    state.current = payload.current;
  },
  setPageNr(state, action) {
    const payload = action.payload;
    state.pageNr = payload.pageNr;
    state.current = payload.current;
  },
  setItemsPerPage(state, action) {
    const payload = action.payload;
    state.itemsPerPage = payload.itemsPerPage;
    state.current = payload.current;
  },
  reset(state, action) {
    state.current = "";
    state.filters = {};
    state.pageNr = 0;
    state.itemsPerPage = 10;
  },
};

export const slice = createSlice({
  name: "grid_filters",
  initialState,
  reducers
});

export const { reducer } = slice;
export const { setFilters, setPageNr, setItemsPerPage, reset } = slice.actions;
