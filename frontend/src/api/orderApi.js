import { orderClient } from './client';

export const cartApi = {
  getCart:       ()           => orderClient.get('/cart'),
  addItem:       (data)       => orderClient.post('/cart', data),
  updateItem:    (productId, qty) => orderClient.put(`/cart/items/${productId}`, { quantity: qty }),
  removeItem:    (productId)  => orderClient.delete(`/cart/items/${productId}`),
  clearCart:     ()           => orderClient.delete('/cart'),
};

export const orderApi = {
  createOrder:    (data)  => orderClient.post('/orders', data),
  getOrders:      ()      => orderClient.get('/orders'),
  getOrder:       (id)    => orderClient.get(`/orders/${id}`),
  updateStatus:   (id, status) => orderClient.put(`/orders/${id}/status`, { status }),
  getAllOrders:   (params) => orderClient.get('/orders/all', { params }),
};
