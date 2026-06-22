import { createSlice } from '@reduxjs/toolkit';

// Persist cart in localStorage
const savedCart = localStorage.getItem('cart');
const initialItems = savedCart ? JSON.parse(savedCart) : [];

const calcTotal = (items) =>
  parseFloat(items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2));

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialItems,
    totalAmount: calcTotal(initialItems),
    totalItems:  initialItems.reduce((s, i) => s + i.quantity, 0),
  },
  reducers: {
    addToCart(state, { payload }) {
      const existing = state.items.find((i) => i.productId === payload.productId);
      if (existing) {
        existing.quantity += payload.quantity || 1;
      } else {
        state.items.push({ ...payload, quantity: payload.quantity || 1 });
      }
      state.totalAmount = calcTotal(state.items);
      state.totalItems  = state.items.reduce((s, i) => s + i.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart(state, { payload: productId }) {
      state.items = state.items.filter((i) => i.productId !== productId);
      state.totalAmount = calcTotal(state.items);
      state.totalItems  = state.items.reduce((s, i) => s + i.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity(state, { payload: { productId, quantity } }) {
      const item = state.items.find((i) => i.productId === productId);
      if (item) item.quantity = quantity;
      state.totalAmount = calcTotal(state.items);
      state.totalItems  = state.items.reduce((s, i) => s + i.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems  = 0;
      localStorage.removeItem('cart');
    },
    syncCart(state, { payload }) {
      state.items = payload.items || [];
      state.totalAmount = payload.totalAmount || calcTotal(state.items);
      state.totalItems  = state.items.reduce((s, i) => s + i.quantity, 0);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, syncCart } = cartSlice.actions;

export const selectCartItems   = (s) => s.cart.items;
export const selectTotalAmount = (s) => s.cart.totalAmount;
export const selectTotalItems  = (s) => s.cart.totalItems;

export default cartSlice.reducer;
