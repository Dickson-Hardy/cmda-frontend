import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const { item, quantity } = action.payload;
      const existingItem = state.cartItems.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ ...item, quantity });
      }
      state.totalPrice += item.price * quantity;
    },
    adjustItemQuantity(state, action) {
      const { itemId, newQuantity } = action.payload;
      const itemToAdjust = state.cartItems.find((cartItem) => cartItem._id === itemId);
      if (itemToAdjust) {
        state.totalPrice -= itemToAdjust.price * itemToAdjust.quantity;
        // If new quantity is 0, remove the item from cart
        if (newQuantity === 0) {
          state.cartItems = state.cartItems.filter((cartItem) => cartItem._id !== itemId);
        } else {
          itemToAdjust.quantity = newQuantity;
          state.totalPrice += itemToAdjust.price * newQuantity;
        }
      }
    },
    removeItemFromCart(state, action) {
      const itemId = action.payload;
      const itemToRemove = state.cartItems.find((cartItem) => cartItem._id === itemId);
      if (itemToRemove) {
        state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
        state.cartItems = state.cartItems.filter((cartItem) => cartItem._id !== itemId);
      }
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalPrice = 0;
    },
  },
});

export const { addItemToCart, adjustItemQuantity, removeItemFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
