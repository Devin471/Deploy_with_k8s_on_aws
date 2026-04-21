/* ─── API Client ───────────────────────────────────── */
import axios from 'axios';

// Determine base URL dynamically
const getBaseURL = () => {
  // Use environment variable if specified (for Vercel deployment)
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

/* Auto-attach token: admin > seller > customer */
api.interceptors.request.use(config => {
  const adminToken = localStorage.getItem('adminToken');
  const sellerToken = localStorage.getItem('sellerToken');
  const customerToken = localStorage.getItem('customerToken');
  const token = adminToken || sellerToken || customerToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Handle errors more gracefully */
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        console.warn('Token expired or invalid. Clearing tokens and redirecting to login.');
        // Clear all tokens
        localStorage.removeItem('adminToken');
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('customerToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('sellerUser');
        localStorage.removeItem('customerUser');
        // Clear cart and wishlist on logout
        localStorage.removeItem('guestCart');
        sessionStorage.clear();
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      // Server responded with error status
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      const networkError = new Error('Network error: Unable to connect to server. Please check if backend is running.');
      networkError.response = { data: { error: 'Network error' } };
      return Promise.reject(networkError);
    } else {
      // Error in request setup
      return Promise.reject(error);
    }
  }
);

export default api;
