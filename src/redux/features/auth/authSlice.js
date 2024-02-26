import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  verifyEmail: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setVerifyEmail: (state, action) => {
      state.verifyEmail = action.payload;
    },
  },
});

export const { setUser, logout, setVerifyEmail } = authSlice.actions;

export default authSlice.reducer;
