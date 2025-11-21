import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import EmailSlice from "./EmailSlice";

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    email: EmailSlice.reducer,
  },
});

export default store;
