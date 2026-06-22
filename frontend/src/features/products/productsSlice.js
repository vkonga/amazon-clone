import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:      [],
    product:    null,
    categories: [],
    pagination: null,
    loading:    false,
    error:      null,
    filters: {
      keyword:  '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating:   '',
      sort:     'newest',
      page:     1,
      limit:    20,
    },
  },
  reducers: {
    setProducts(state, { payload }) {
      state.items      = payload.data;
      state.pagination = payload.pagination;
    },
    setProduct(state, { payload }) { state.product = payload; },
    setCategories(state, { payload }) { state.categories = payload; },
    setFilters(state, { payload }) {
      state.filters = { ...state.filters, ...payload, page: payload.page || 1 };
    },
    resetFilters(state) {
      state.filters = {
        keyword: '', category: '', minPrice: '', maxPrice: '',
        rating: '', sort: 'newest', page: 1, limit: 20,
      };
    },
    setLoading(state, { payload }) { state.loading = payload; },
    setError(state, { payload })   { state.error   = payload; },
  },
});

export const {
  setProducts, setProduct, setCategories,
  setFilters, resetFilters, setLoading, setError
} = productsSlice.actions;

export const selectProducts   = (s) => s.products.items;
export const selectProduct    = (s) => s.products.product;
export const selectCategories = (s) => s.products.categories;
export const selectPagination = (s) => s.products.pagination;
export const selectFilters    = (s) => s.products.filters;
export const selectLoading    = (s) => s.products.loading;

export default productsSlice.reducer;
