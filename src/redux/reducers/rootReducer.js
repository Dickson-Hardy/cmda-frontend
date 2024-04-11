import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import tokenSlice from "../features/auth/tokenSlice";
import api from "../api/api";
import cartSlice from "../features/cart/cartSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  token: tokenSlice,
  cart: cartSlice,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
