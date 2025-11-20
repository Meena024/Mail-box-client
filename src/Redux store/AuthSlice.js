import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    isAuthenticated: false,
    idToken: "",
    userId: "",
    userEmail: "",
    userName: "",
    userProfilePicture: "",
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.idToken = action.payload.idToken;
      state.userId = action.payload.localId;
      state.userEmail = action.payload.email;
      state.userName = action.payload.displayName || null;
      state.userProfilePicture = action.payload.photoUrl || null;
    },

    reset(state) {
      state.isAuthenticated = false;
      state.idToken = null;
      state.userId = null;
      state.userEmail = null;
      state.userName = null;
      state.userProfilePicture = null;
    },
  },
});

export const AuthAction = AuthSlice.actions;
export default AuthSlice;
