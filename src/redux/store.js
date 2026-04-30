import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import themeReducer from "./slices/themeSlice";
import authSlice from "./slices/authSlice";

export const store=configureStore({
  reducer:{
    events: eventsReducer,
    theme: themeReducer,
    auth:authSlice
  }
})