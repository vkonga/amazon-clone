import { userClient } from './client';

export const authApi = {
  register: (data) => userClient.post('/auth/register', data),
  login:    (data) => userClient.post('/auth/login', data),
  refresh:  (token) => userClient.post('/auth/refresh', { refreshToken: token }),
  forgotPassword: (email) => userClient.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => userClient.post('/auth/reset-password', data),
};

export const userApi = {
  getProfile:    ()       => userClient.get('/users/profile'),
  updateProfile: (data)   => userClient.put('/users/profile', data),
  getAddresses:  ()       => userClient.get('/users/addresses'),
  addAddress:    (data)   => userClient.post('/users/addresses', data),
  updateAddress: (id, data) => userClient.put(`/users/addresses/${id}`, data),
  deleteAddress: (id)     => userClient.delete(`/users/addresses/${id}`),
};
