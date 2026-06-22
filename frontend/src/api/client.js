import axios from 'axios';

const BASE_URLS = {
  user:    import.meta.env.VITE_USER_SERVICE_URL    || 'http://localhost:3001/api',
  product: import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3002/api',
  order:   import.meta.env.VITE_ORDER_SERVICE_URL   || 'http://localhost:3003/api',
  payment: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3004/api',
};

const createClient = (baseURL) => {
  const client = axios.create({ baseURL, timeout: 10000 });

  // Attach JWT token
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Refresh token on 401
  client.interceptors.response.use(
    (res) => res,
    async (err) => {
      const original = err.config;
      if (err.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const { data } = await axios.post(`${BASE_URLS.user}/auth/refresh`, { refreshToken });
          const newToken = data.data.accessToken;
          localStorage.setItem('accessToken', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
      return Promise.reject(err);
    }
  );

  return client;
};

export const userClient    = createClient(BASE_URLS.user);
export const productClient = createClient(BASE_URLS.product);
export const orderClient   = createClient(BASE_URLS.order);
export const paymentClient = createClient(BASE_URLS.payment);
