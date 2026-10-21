import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://swipewire-backend.onrender.com/api',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.userMessage = 'Cannot reach the server. Check your connection and try again.';
    } else {
      error.userMessage = error.response.data?.error?.message || 'Request failed. Please try again.';
      if (error.response.status === 401 && !String(error.config?.url || '').includes('/auth/login')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authUser');
        window.dispatchEvent(new Event('auth:expired'));
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  const details = error?.response?.data?.error?.details;
  if (Array.isArray(details) && details.length) {
    return `${error.userMessage || 'Please check your input'} ${details.map((d) => d.message).join(' ')}`;
  }
  return error?.userMessage || error?.response?.data?.error?.message || error?.message || 'Something went wrong.';
};

export default api;
