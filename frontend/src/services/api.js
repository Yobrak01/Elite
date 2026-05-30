import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  // If we are using relative URLs in development (via proxy), we don't want to prepend the base URL in development.
  // But if REACT_APP_API_URL is set, we use it.
  // However, when using proxy in development, we want to keep relative URLs.
  // We'll handle this by not using the baseURL in development if proxy is set.
  // Instead, we'll conditionally set the baseURL only in production.
  // But for simplicity, we'll set baseURL to empty string in development and rely on proxy.
  // In production, we'll set it to the actual API URL.
});

// We'll create a helper to set the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;