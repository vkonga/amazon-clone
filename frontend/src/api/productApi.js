import { productClient } from './client';

export const productApi = {
  getProducts: (params) => productClient.get('/products', { params }),
  getProduct:  (id)     => productClient.get(`/products/${id}`),
  getCategories: ()     => productClient.get('/categories'),
  addReview:   (id, data) => productClient.post(`/products/${id}/reviews`, data),
  getReviews:  (id)     => productClient.get(`/products/${id}/reviews`),

  // Admin
  createProduct: (data) => productClient.post('/products', data),
  updateProduct: (id, data) => productClient.put(`/products/${id}`, data),
  deleteProduct: (id)   => productClient.delete(`/products/${id}`),
  createCategory: (data) => productClient.post('/categories', data),
};
