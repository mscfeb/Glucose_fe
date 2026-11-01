import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user ?? state.user;
      state.isInitialized = true;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isInitialized = true;
    },

    setAuthInitialized: (state) => {
      state.isInitialized = true;
    },

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isInitialized = true;
    },
  },
});

export const {
  setCredentials,
  setUser,
  clearCredentials,
  setAuthInitialized,
  logout,
} = authSlice.actions;

export default authSlice.reducer;