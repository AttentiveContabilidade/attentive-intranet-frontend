// src/services/base-api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
});

// Anexa o Bearer em toda request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('attentive_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRedirecting = false;
// Se o token vencer (401), limpa e volta pro /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem('attentive_token');
      localStorage.removeItem('attentive_user');
      if (!isRedirecting && window.location.pathname !== '/login') {
        isRedirecting = true;
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
