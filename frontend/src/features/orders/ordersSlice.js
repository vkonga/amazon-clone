import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:  [],
    order:   null,
    loading: false,
    error:   null,
  },
  reducers: {
    setOrders(state, { payload }) { state.orders = payload; },
    setOrder(state, { payload })  { state.order  = payload; },
    setLoading(state, { payload }) { state.loading = payload; },
    setError(state, { payload })   { state.error   = payload; },
  },
});

export const { setOrders, setOrder, setLoading, setError } = ordersSlice.actions;

export const selectOrders       = (s) => s.orders.orders;
export const selectOrder        = (s) => s.orders.order;
export const selectOrderLoading = (s) => s.orders.loading;

export default ordersSlice.reducer;
