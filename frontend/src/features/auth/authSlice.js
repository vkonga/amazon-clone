import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('accessToken');
const user  = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, loading: false, error: null },
  reducers: {
    setCredentials(state, { payload }) {
      state.user  = payload.user;
      state.token = payload.accessToken;
      localStorage.setItem('accessToken',  payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(payload.user));
    },
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.clear();
    },
    setLoading(state, { payload }) { state.loading = payload; },
    setError(state, { payload })   { state.error   = payload; },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;

export const selectCurrentUser  = (s) => s.auth.user;
export const selectIsAuth       = (s) => !!s.auth.token;
export const selectIsAdmin      = (s) => s.auth.user?.role === 'Admin';
export const selectAuthLoading  = (s) => s.auth.loading;
export const selectAuthError    = (s) => s.auth.error;

export default authSlice.reducer;
