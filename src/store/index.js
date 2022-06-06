import {configureStore} from "@reduxjs/toolkit";
import uiSlice from "./ui-slice.js";
import sutraSlice from "./sutra-slice.js";

const store = configureStore({
  reducer: {ui: uiSlice.reducer, sutra: sutraSlice.reducer,}
});

export default store;