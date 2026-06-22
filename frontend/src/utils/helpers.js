// Format price
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

// Format date
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Truncate text
export const truncate = (str, maxLen = 60) =>
  str && str.length > maxLen ? str.slice(0, maxLen) + '…' : str;

// Get order status badge class
export const getStatusBadge = (status) => {
  const map = {
    Pending:   'badge-warning',
    Confirmed: 'badge-info',
    Shipped:   'badge-primary',
    Delivered: 'badge-success',
    Cancelled: 'badge-error',
    Paid:      'badge-success',
    Failed:    'badge-error',
    Refunded:  'badge-secondary',
  };
  return map[status] || 'badge-secondary';
};

// Extract error message from Axios error
export const getErrorMessage = (err) =>
  err?.response?.data?.error?.message || err?.message || 'Something went wrong';

// Build query string
export const buildQuery = (params) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) q.set(k, v);
  });
  return q.toString();
};

// Star rating array helper
export const getStars = (rating) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
};
