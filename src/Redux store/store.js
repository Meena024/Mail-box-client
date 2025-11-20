import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import MiscSlice from "./MiscSlice";

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    misc: MiscSlice.reducer,
  },
});

export default store;
